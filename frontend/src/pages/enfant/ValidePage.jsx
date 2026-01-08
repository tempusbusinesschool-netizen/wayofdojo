import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Clock, Send, User, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 4 - VALIDE : Validation par les parents
 * Version Enfant
 */
const ValidePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  // Techniques en attente de validation
  const pendingValidations = [
    { id: 1, name: 'Tai Sabaki', submittedAt: 'Il y a 2 jours', status: 'pending' },
    { id: 2, name: 'Ukemi Mae', submittedAt: 'Il y a 5 jours', status: 'validated' },
  ];

  // Techniques à soumettre
  const techniquesToSubmit = [
    { id: 3, name: 'Seiza', desc: 'Position assise traditionnelle', icon: '🧘' },
    { id: 4, name: 'Rei', desc: 'Le salut respectueux', icon: '🙏' },
    { id: 5, name: 'Ukemi Ushiro', desc: 'Chute arrière', icon: '⬇️' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </button>

        {/* Titre */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 to-rose-600 mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Fais valider par tes parents !
          </h1>
          <p className="text-slate-400 text-lg">
            Montre ce que tu as appris 👨‍👩‍👧
          </p>
        </div>

        {!isAuthenticated ? (
          /* Non connecté */
          <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-700">
            <div className="text-6xl mb-4">👨‍👩‍👧</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Connecte-toi pour soumettre tes techniques !
            </h2>
            <Button
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              🚀 Me connecter
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Comment ça marche */}
            <div className="bg-pink-500/10 rounded-2xl p-4 border border-pink-500/30">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-pink-400 mt-0.5" />
                <div>
                  <p className="text-pink-400 font-medium mb-1">Comment ça marche ?</p>
                  <p className="text-slate-400 text-sm">
                    1. Choisis une technique que tu as apprise au dojo<br/>
                    2. Montre-la à tes parents à la maison<br/>
                    3. Ils valident si c'est bien fait !
                  </p>
                </div>
              </div>
            </div>

            {/* Validations en attente */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-white">En attente de validation</h2>
              </div>
              
              {pendingValidations.length > 0 ? (
                <div className="space-y-3">
                  {pendingValidations.map((item) => (
                    <div
                      key={item.id}
                      className={`
                        flex items-center justify-between p-4 rounded-xl
                        ${item.status === 'validated' 
                          ? 'bg-emerald-500/20 border border-emerald-500/30' 
                          : 'bg-amber-500/10 border border-amber-500/30'}
                      `}
                    >
                      <div className="flex items-center gap-3">
                        {item.status === 'validated' ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Clock className="w-6 h-6 text-amber-400 animate-pulse" />
                        )}
                        <div>
                          <p className="text-white font-medium">{item.name}</p>
                          <p className="text-slate-400 text-sm">{item.submittedAt}</p>
                        </div>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-sm font-medium
                        ${item.status === 'validated' 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-amber-500/20 text-amber-400'}
                      `}>
                        {item.status === 'validated' ? '✅ Validé !' : '⏳ En attente'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-4">Aucune technique en attente</p>
              )}
            </div>

            {/* Soumettre une technique */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Send className="w-6 h-6 text-pink-400" />
                <h2 className="text-xl font-bold text-white">Soumettre une technique</h2>
              </div>
              
              <div className="grid gap-3">
                {techniquesToSubmit.map((technique) => (
                  <button
                    key={technique.id}
                    onClick={() => setSelectedTechnique(technique.id)}
                    className={`
                      flex items-center gap-4 p-4 rounded-xl transition-all text-left
                      ${selectedTechnique === technique.id 
                        ? 'bg-pink-500/20 border-2 border-pink-500' 
                        : 'bg-slate-700/50 border-2 border-transparent hover:bg-slate-700'}
                    `}
                  >
                    <span className="text-3xl">{technique.icon}</span>
                    <div>
                      <p className="text-white font-medium">{technique.name}</p>
                      <p className="text-slate-400 text-sm">{technique.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {selectedTechnique && (
                <div className="mt-6 text-center">
                  <Button
                    className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-400 hover:to-rose-400 text-white font-bold px-8 py-4 rounded-xl text-lg"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Demander à mes parents de valider
                  </Button>
                </div>
              )}
            </div>

            {/* Info parent */}
            <div className="flex items-center gap-3 p-4 bg-slate-800/30 rounded-xl">
              <User className="w-5 h-5 text-slate-500" />
              <p className="text-slate-500 text-sm">
                Tes parents recevront une notification pour valider ta technique !
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ValidePage;
