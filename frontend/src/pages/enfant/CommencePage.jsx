import React from 'react';
import { ArrowLeft, User, Palette, Star, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 1 - COMMENCE : Création du profil Ninja
 * Version Enfant
 */
const CommencePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  
  // Avatars disponibles pour les enfants
  const avatars = [
    { id: 'dragon', emoji: '🐉', name: 'Dragon', color: 'from-red-500 to-orange-500' },
    { id: 'tigre', emoji: '🐯', name: 'Tigre', color: 'from-amber-500 to-yellow-500' },
    { id: 'aigle', emoji: '🦅', name: 'Aigle', color: 'from-sky-500 to-blue-500' },
    { id: 'panda', emoji: '🐼', name: 'Panda', color: 'from-slate-500 to-slate-700' },
    { id: 'renard', emoji: '🦊', name: 'Renard', color: 'from-orange-500 to-red-500' },
    { id: 'loup', emoji: '🐺', name: 'Loup', color: 'from-indigo-500 to-purple-500' },
  ];

  const [selectedAvatar, setSelectedAvatar] = React.useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 p-4 sm:p-6">
      {/* Header avec bouton retour */}
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Retour à l'accueil</span>
        </button>

        {/* Titre de la page */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
            <span className="text-4xl">🚀</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Commence ton aventure !
          </h1>
          <p className="text-slate-400 text-lg">
            Crée ton profil de Ninja 🥷
          </p>
        </div>

        {/* Contenu selon l'état de connexion */}
        {!isAuthenticated ? (
          /* Non connecté - Invitation à s'inscrire */
          <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-700">
            <div className="text-6xl mb-4">🔒</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Crée ton compte pour commencer !
            </h2>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Pour créer ton profil Ninja et choisir ton avatar, tu dois d'abord t'inscrire. C'est gratuit et rapide !
            </p>
            <Button
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              🚀 Créer mon compte Ninja
            </Button>
          </div>
        ) : (
          /* Connecté - Création du profil */
          <div className="space-y-8">
            {/* Section Avatar */}
            <div className="bg-slate-800/50 rounded-3xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-emerald-400" />
                <h2 className="text-xl font-bold text-white">Choisis ton animal gardien</h2>
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
                {avatars.map((avatar) => (
                  <button
                    key={avatar.id}
                    onClick={() => setSelectedAvatar(avatar.id)}
                    className={`
                      aspect-square rounded-2xl p-4 flex flex-col items-center justify-center
                      transition-all duration-300 hover:scale-105
                      ${selectedAvatar === avatar.id 
                        ? `bg-gradient-to-br ${avatar.color} ring-4 ring-white shadow-xl` 
                        : 'bg-slate-700/50 hover:bg-slate-700'}
                    `}
                  >
                    <span className="text-4xl sm:text-5xl mb-2">{avatar.emoji}</span>
                    <span className={`text-xs font-medium ${selectedAvatar === avatar.id ? 'text-white' : 'text-slate-400'}`}>
                      {avatar.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Pseudo */}
            <div className="bg-slate-800/50 rounded-3xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <User className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Ton pseudo de Ninja</h2>
              </div>
              
              <input
                type="text"
                placeholder="Ex: NinjaRapide, DragonFurtif..."
                className="w-full bg-slate-900/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                maxLength={20}
              />
              <p className="text-slate-500 text-sm mt-2">
                Ce nom sera visible par les autres ninjas 👀
              </p>
            </div>

            {/* Section Ceinture de départ */}
            <div className="bg-slate-800/50 rounded-3xl p-6 sm:p-8 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Ta ceinture actuelle</h2>
              </div>
              
              <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl">
                <div className="w-16 h-4 bg-white rounded-full shadow-lg"></div>
                <div>
                  <p className="text-white font-bold">Ceinture Blanche</p>
                  <p className="text-slate-400 text-sm">6e KYU - Niveau débutant</p>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 ml-auto" />
              </div>
              <p className="text-slate-500 text-sm mt-3">
                🥋 Tu commences avec la ceinture blanche. Entraîne-toi pour monter de grade !
              </p>
            </div>

            {/* Bouton de validation */}
            <div className="text-center">
              <Button
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-12 py-4 rounded-xl text-lg"
              >
                ✅ Enregistrer mon profil
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommencePage;
