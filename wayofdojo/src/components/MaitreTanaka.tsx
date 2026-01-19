'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Volume2, X, Loader2 } from 'lucide-react';
import { playTanakaPhrase } from '@/services/tanakaVoiceService';

// Maître Tanaka image
const TANAKA_IMAGE = "/images/tanaka/portrait.png";

interface Message {
  role: 'child' | 'master';
  text: string;
  audio?: string | null;
  preRecorded?: string;
}

interface ChildContext {
  first_name?: string;
  belt_level?: string;
  level?: number;
  level_name?: string;
  total_xp?: number;
}

interface MaitreTanakaProps {
  childContext?: ChildContext | null;
  isVisible?: boolean;
  apiUrl?: string;
  isJeuneNinja?: boolean;
  messages?: string[];
}

/**
 * MaitreTanaka - Floating voice agent for children
 * A wise old Aikido master that children can talk to
 */
export const MaitreTanaka: React.FC<MaitreTanakaProps> = ({ 
  childContext = null, 
  isVisible = true,
  apiUrl = '/api/voice-agent',
  isJeuneNinja = true,
  messages = []
}) => {
  // Use isJeuneNinja for styling decisions  
  const buttonLabel = isJeuneNinja ? "Parle-moi !" : "Assistance";
  // Store messages for potential random display
  const tipsMessages = messages.length > 0 ? messages : ["Bienvenue !"];
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll conversation
  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Initialize session with pre-recorded welcome
  useEffect(() => {
    if (isOpen && !sessionId) {
      setSessionId(`tanaka_${Date.now()}`);
      
      const welcomeText = "Bienvenue dans mon dojo virtuel, jeune ninja ! 🥋 Je suis Maître Tanaka. Appuie sur le microphone pour me parler.";
      setConversation([{
        role: 'master',
        text: welcomeText,
        preRecorded: 'welcome'
      }]);
      
      // Auto-play welcome audio
      setTimeout(() => {
        playPreRecordedPhrase('welcome');
      }, 500);
    }
  }, [isOpen, sessionId]);

  // Play a pre-recorded phrase
  const playPreRecordedPhrase = async (phraseKey: string) => {
    try {
      setIsPlaying(true);
      const result = await playTanakaPhrase(phraseKey);
      if (result.audio) {
        audioRef.current = result.audio;
        result.audio.onended = () => setIsPlaying(false);
      }
    } catch (error) {
      console.error('Error playing pre-recorded phrase:', error);
      setIsPlaying(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await sendAudioToAgent(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToAgent = async (audioBlob: Blob) => {
    setIsProcessing(true);
    
    try {
      const formData = new FormData();
      formData.append('audio_file', audioBlob, 'recording.webm');
      
      if (sessionId) {
        formData.append('session_id', sessionId);
      }
      
      if (childContext) {
        if (childContext.first_name) formData.append('child_first_name', childContext.first_name);
        if (childContext.belt_level) formData.append('child_belt_level', childContext.belt_level);
        if (childContext.level) formData.append('child_level', childContext.level.toString());
        if (childContext.level_name) formData.append('child_level_name', childContext.level_name);
        if (childContext.total_xp) formData.append('child_total_xp', childContext.total_xp.toString());
      }

      const response = await fetch(`${apiUrl}/conversation`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Erreur de communication avec Maître Tanaka');
      }

      const data = await response.json();
      
      if (data.session_id) {
        setSessionId(data.session_id);
      }

      setConversation(prev => [
        ...prev,
        { role: 'child', text: '🎤 (message vocal)', audio: null },
        { role: 'master', text: data.response_text, audio: data.audio_base64 }
      ]);

      playAudio(data.audio_base64);
      
    } catch (error) {
      console.error('Error sending audio:', error);
      setConversation(prev => [
        ...prev,
        { 
          role: 'master', 
          text: "Pardonne-moi, jeune ninja, mes vieilles oreilles fatiguent. Peux-tu répéter ?", 
          audio: null 
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const playAudio = (base64Audio: string) => {
    if (!base64Audio) return;
    
    try {
      setIsPlaying(true);
      const audio = new Audio(`data:audio/mpeg;base64,${base64Audio}`);
      audioRef.current = audio;
      
      audio.onended = () => setIsPlaying(false);
      audio.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback error');
      };
      
      audio.play();
    } catch (error) {
      console.error('Error playing audio:', error);
      setIsPlaying(false);
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const handleClose = () => {
    stopAudio();
    stopRecording();
    setIsOpen(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Button - Maître Tanaka dans cercle orange */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 group"
          data-testid="maitre-tanaka-button"
        >
          <div className="relative">
            {/* Pulse animation */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full animate-ping opacity-30"></div>
            
            {/* Cercle orange principal */}
            <div className="relative w-20 h-20 rounded-full shadow-2xl overflow-hidden bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 border-4 border-orange-300 transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-orange-500/50">
              <div className="absolute inset-2 rounded-full overflow-hidden bg-slate-900/20">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.classList.add('flex', 'items-center', 'justify-center');
                      target.parentElement.innerHTML = '<span class="text-3xl">🧘</span>';
                    }
                  }}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-full pointer-events-none"></div>
            </div>
            
            {/* Label */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-bold animate-bounce shadow-lg">
              Parle-moi !
            </div>
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-amber-500/30 overflow-hidden"
          data-testid="maitre-tanaka-dialog"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30 shadow-lg">
                <img 
                  src={TANAKA_IMAGE} 
                  alt="Maître Tanaka" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    if (target.parentElement) {
                      target.parentElement.innerHTML = '🥋';
                      target.parentElement.classList.add('flex', 'items-center', 'justify-center', 'text-2xl', 'bg-white/20');
                    }
                  }}
                />
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">Maître Tanaka</h3>
                <p className="text-amber-100 text-xs">Ton guide sur la Voie de l&apos;Aïkido</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Conversation */}
          <div className="h-72 overflow-y-auto p-4 space-y-4 bg-slate-800/50">
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'child' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 ${
                    msg.role === 'child'
                      ? 'bg-cyan-600 text-white rounded-br-none'
                      : 'bg-amber-600/20 border border-amber-500/30 text-amber-100 rounded-bl-none'
                  }`}
                >
                  {msg.role === 'master' && (
                    <div className="flex items-center gap-2 mb-1">
                      <img 
                        src={TANAKA_IMAGE} 
                        alt="" 
                        className="w-6 h-6 rounded-full object-cover"
                        onError={(e) => { 
                          const target = e.target as HTMLImageElement;
                          target.outerHTML = '<span class="text-lg">🥋</span>'; 
                        }}
                      />
                      <span className="text-xs text-amber-400 font-medium">Maître Tanaka</span>
                    </div>
                  )}
                  <p className="text-sm">{msg.text}</p>
                  
                  {msg.role === 'master' && (msg.audio || msg.preRecorded) && (
                    <button
                      onClick={() => msg.preRecorded ? playPreRecordedPhrase(msg.preRecorded) : playAudio(msg.audio!)}
                      className="mt-2 text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1"
                      disabled={isPlaying}
                    >
                      <Volume2 className="w-3 h-3" />
                      {isPlaying ? 'En cours...' : 'Réécouter'}
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {isProcessing && (
              <div className="flex justify-start">
                <div className="bg-amber-600/20 border border-amber-500/30 rounded-2xl rounded-bl-none p-3">
                  <div className="flex items-center gap-2 text-amber-100">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Maître Tanaka réfléchit...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={conversationEndRef} />
          </div>

          {/* Controls */}
          <div className="p-4 bg-slate-900 border-t border-slate-700">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
                  isRecording
                    ? 'bg-red-500 animate-pulse'
                    : isProcessing
                    ? 'bg-slate-600 cursor-not-allowed'
                    : 'bg-gradient-to-br from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500'
                }`}
                data-testid="maitre-tanaka-mic-button"
              >
                {isProcessing ? (
                  <Loader2 className="w-8 h-8 text-white animate-spin" />
                ) : isRecording ? (
                  <MicOff className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 text-white" />
                )}
              </button>
              
              {isPlaying && (
                <button
                  onClick={stopAudio}
                  className="w-12 h-12 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center transition-all"
                >
                  <Volume2 className="w-6 h-6 text-white" />
                </button>
              )}
            </div>
            
            <p className="text-center text-slate-400 text-xs mt-3">
              {isRecording 
                ? "🔴 J'écoute... Appuie pour envoyer" 
                : isProcessing 
                ? "⏳ Maître Tanaka te répond..." 
                : "🎤 Appuie pour parler au Maître"
              }
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default MaitreTanaka;
