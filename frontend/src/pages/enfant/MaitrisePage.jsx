import React, { useState } from 'react';
import { ArrowLeft, Trophy, Crown, Star, Lock, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

/**
 * Page 6 - MAÎTRISE : Badges et champion
 * Version Enfant
 */
const MaitrisePage = ({ onBack, isAuthenticated, onOpenAuth }) => {
  
  // Badges débloqués - Système complet Aïkido
  const badges = [
    // Badges de début
    { id: 1, name: 'Premier Pas', desc: 'Premier entraînement', icon: '👣', unlocked: true, rarity: 'common', category: 'debut' },
    
    // Badges de régularité
    { id: 2, name: 'Persévérant', desc: '3 jours d\'affilée', icon: '🔥', unlocked: true, rarity: 'common', category: 'streak' },
    { id: 3, name: 'Assidu', desc: '7 jours d\'affilée', icon: '💪', unlocked: true, rarity: 'rare', category: 'streak' },
    { id: 4, name: 'Marathonien', desc: '14 jours d\'affilée', icon: '🏃', unlocked: false, rarity: 'epic', category: 'streak' },
    { id: 5, name: 'Esprit du Budo', desc: '21 jours d\'affilée', icon: '🧘', unlocked: false, rarity: 'legendary', category: 'streak' },
    
    // Badges de durée de pratique (Long terme)
    { id: 6, name: 'Initié', desc: '1 mois de pratique', icon: '🌱', unlocked: true, rarity: 'common', category: 'duration' },
    { id: 7, name: 'Disciple', desc: '3 mois de pratique', icon: '🌿', unlocked: false, rarity: 'rare', category: 'duration' },
    { id: 8, name: 'Pratiquant Confirmé', desc: '6 mois de pratique', icon: '🌳', unlocked: false, rarity: 'epic', category: 'duration' },
    { id: 9, name: 'Fidèle du Dojo', desc: '1 an de pratique', icon: '🥋', unlocked: false, rarity: 'legendary', category: 'duration' },
    { id: 10, name: 'Pilier du Dojo', desc: '2 ans de pratique', icon: '🏯', unlocked: false, rarity: 'legendary', category: 'duration' },
    { id: 11, name: 'Vétéran', desc: '5 ans de pratique', icon: '⛩️', unlocked: false, rarity: 'mythic', category: 'duration' },
    
    // Badges de passage de grade (Kyu)
    { id: 12, name: 'Ceinture Blanche', desc: '6e Kyu - Début du chemin', icon: '⬜', unlocked: true, rarity: 'common', category: 'grade' },
    { id: 13, name: 'Ceinture Jaune', desc: '5e Kyu obtenu', icon: '🟡', unlocked: true, rarity: 'rare', category: 'grade' },
    { id: 14, name: 'Ceinture Orange', desc: '4e Kyu obtenu', icon: '🟠', unlocked: false, rarity: 'rare', category: 'grade' },
    { id: 15, name: 'Ceinture Verte', desc: '3e Kyu obtenu', icon: '🟢', unlocked: false, rarity: 'epic', category: 'grade' },
    { id: 16, name: 'Ceinture Bleue', desc: '2e Kyu obtenu', icon: '🔵', unlocked: false, rarity: 'epic', category: 'grade' },
    { id: 17, name: 'Ceinture Marron', desc: '1er Kyu obtenu', icon: '🟤', unlocked: false, rarity: 'legendary', category: 'grade' },
    
    // Badges de passage de grade (Dan)
    { id: 18, name: 'Ceinture Noire', desc: 'Shodan - 1er Dan', icon: '⬛', unlocked: false, rarity: 'legendary', category: 'grade' },
    { id: 19, name: 'Maître Confirmé', desc: 'Nidan - 2e Dan', icon: '🎌', unlocked: false, rarity: 'mythic', category: 'grade' },
    { id: 20, name: 'Enseignant', desc: 'Sandan - 3e Dan', icon: '📜', unlocked: false, rarity: 'mythic', category: 'grade' },
    { id: 21, name: 'Maître', desc: 'Yondan - 4e Dan', icon: '👘', unlocked: false, rarity: 'mythic', category: 'grade' },
    
    // Badges de techniques
    { id: 22, name: 'Technicien', desc: '5 techniques validées', icon: '🥋', unlocked: true, rarity: 'common', category: 'technique' },
    { id: 23, name: 'Pratiquant Technique', desc: '10 techniques validées', icon: '🎯', unlocked: false, rarity: 'rare', category: 'technique' },
    { id: 24, name: 'Artiste Martial', desc: '25 techniques validées', icon: '🎨', unlocked: false, rarity: 'epic', category: 'technique' },
    { id: 25, name: 'Maître Technique', desc: '50 techniques validées', icon: '🏅', unlocked: false, rarity: 'legendary', category: 'technique' },
    { id: 26, name: 'Encyclopédie Vivante', desc: '100 techniques validées', icon: '📚', unlocked: false, rarity: 'mythic', category: 'technique' },
    
    // Badges spéciaux Aïkido (Armes)
    { id: 27, name: 'Maître des Chutes', desc: 'Ukemis parfaits validés', icon: '🔄', unlocked: false, rarity: 'epic', category: 'special' },
    { id: 28, name: 'Initié aux Armes', desc: 'Buki waza découvert', icon: '⚔️', unlocked: false, rarity: 'rare', category: 'special' },
    { id: 29, name: 'Maître du Tanto', desc: 'Tanto-dori maîtrisé', icon: '🔪', unlocked: false, rarity: 'legendary', category: 'special' },
    { id: 30, name: 'Maître du Jo', desc: 'Jo-waza maîtrisé', icon: '🪵', unlocked: false, rarity: 'legendary', category: 'special' },
    { id: 31, name: 'Maître du Bokken', desc: 'Aïki-ken maîtrisé', icon: '⚔️', unlocked: false, rarity: 'legendary', category: 'special' },
  ];
  
  // Filtrer les badges par catégorie pour l'affichage
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const badgeCategories = [
    { id: 'all', name: 'Tous', icon: '🏆' },
    { id: 'grade', name: 'Grades', icon: '🥋' },
    { id: 'duration', name: 'Ancienneté', icon: '📅' },
    { id: 'technique', name: 'Techniques', icon: '🎯' },
    { id: 'streak', name: 'Régularité', icon: '🔥' },
    { id: 'special', name: 'Spéciaux', icon: '⭐' },
  ];
  
  const filteredBadges = selectedCategory === 'all' 
    ? badges 
    : badges.filter(b => b.category === selectedCategory);

  // Titres spéciaux
  const titles = [
    { id: 1, name: 'Petit Scarabée', unlocked: true, current: false },
    { id: 2, name: 'Apprenti Ninja', unlocked: true, current: true },
    { id: 3, name: 'Ninja Agile', unlocked: false },
    { id: 4, name: 'Maître des Chutes', unlocked: false },
    { id: 5, name: 'Dragon Suprême', unlocked: false },
  ];

  // Classement
  const leaderboard = [
    { rank: 1, name: 'NinjaFurtif', xp: 4520, avatar: '🐉' },
    { rank: 2, name: 'TigreBlanc', xp: 3890, avatar: '🐯' },
    { rank: 3, name: 'AigleRapide', xp: 3210, avatar: '🦅' },
    { rank: 4, name: 'Toi', xp: 1250, avatar: '🐼', isUser: true },
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'from-slate-500 to-slate-600';
      case 'rare': return 'from-blue-500 to-cyan-500';
      case 'epic': return 'from-purple-500 to-pink-500';
      case 'legendary': return 'from-amber-500 to-orange-500';
      default: return 'from-slate-500 to-slate-600';
    }
  };

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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-orange-600 mb-4">
            <span className="text-4xl">👑</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Deviens un Maître !
          </h1>
          <p className="text-slate-400 text-lg">
            Collectionne les badges et trophées 🏆
          </p>
        </div>

        {!isAuthenticated ? (
          /* Non connecté */
          <div className="bg-slate-800/50 rounded-3xl p-8 text-center border border-slate-700">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Connecte-toi pour voir tes trophées !
            </h2>
            <Button
              onClick={onOpenAuth}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-400 hover:to-orange-400 text-white font-bold px-8 py-4 rounded-xl text-lg"
            >
              🚀 Me connecter
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Stats résumé */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl p-4 text-center border border-amber-500/30">
                <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">4</p>
                <p className="text-amber-400 text-xs">Badges</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl p-4 text-center border border-purple-500/30">
                <Crown className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">2</p>
                <p className="text-purple-400 text-xs">Titres</p>
              </div>
              <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl p-4 text-center border border-cyan-500/30">
                <Star className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">#4</p>
                <p className="text-cyan-400 text-xs">Classement</p>
              </div>
            </div>

            {/* Collection de badges */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h2 className="text-xl font-bold text-white">Ma collection de badges</h2>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
                {badges.map((badge) => (
                  <div
                    key={badge.id}
                    className={`
                      relative aspect-square rounded-2xl p-3 flex flex-col items-center justify-center
                      transition-all hover:scale-105
                      ${badge.unlocked 
                        ? `bg-gradient-to-br ${getRarityColor(badge.rarity)} shadow-lg` 
                        : 'bg-slate-700/50 opacity-50'}
                    `}
                  >
                    {!badge.unlocked && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/50 rounded-2xl">
                        <Lock className="w-6 h-6 text-slate-500" />
                      </div>
                    )}
                    <span className="text-3xl mb-1">{badge.icon}</span>
                    <span className="text-white text-xs font-medium text-center leading-tight">
                      {badge.name}
                    </span>
                  </div>
                ))}
              </div>
              
              <p className="text-slate-500 text-sm text-center mt-4">
                {badges.filter(b => b.unlocked).length}/{badges.length} badges débloqués
              </p>
            </div>

            {/* Titres */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Crown className="w-6 h-6 text-purple-400" />
                <h2 className="text-xl font-bold text-white">Mes titres</h2>
              </div>
              
              <div className="space-y-3">
                {titles.map((title) => (
                  <div
                    key={title.id}
                    className={`
                      flex items-center justify-between p-4 rounded-xl
                      ${title.current 
                        ? 'bg-purple-500/20 border border-purple-500/50' 
                        : title.unlocked 
                          ? 'bg-slate-700/30' 
                          : 'bg-slate-800/30 opacity-50'}
                    `}
                  >
                    <div className="flex items-center gap-3">
                      {title.unlocked ? (
                        <Sparkles className="w-5 h-5 text-purple-400" />
                      ) : (
                        <Lock className="w-5 h-5 text-slate-500" />
                      )}
                      <span className={`font-medium ${title.current ? 'text-purple-400' : 'text-white'}`}>
                        {title.name}
                      </span>
                    </div>
                    {title.current && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                        Actuel
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Mini classement */}
            <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white">Classement du dojo</h2>
              </div>
              
              <div className="space-y-3">
                {leaderboard.map((player) => (
                  <div
                    key={player.rank}
                    className={`
                      flex items-center gap-4 p-3 rounded-xl
                      ${player.isUser 
                        ? 'bg-cyan-500/20 border border-cyan-500/50' 
                        : 'bg-slate-700/30'}
                    `}
                  >
                    <span className={`
                      w-8 h-8 rounded-full flex items-center justify-center font-bold
                      ${player.rank === 1 ? 'bg-amber-500 text-amber-900' : 
                        player.rank === 2 ? 'bg-slate-400 text-slate-900' :
                        player.rank === 3 ? 'bg-orange-600 text-orange-100' :
                        'bg-slate-700 text-white'}
                    `}>
                      {player.rank}
                    </span>
                    <span className="text-2xl">{player.avatar}</span>
                    <span className={`font-medium ${player.isUser ? 'text-cyan-400' : 'text-white'}`}>
                      {player.name}
                    </span>
                    <span className="text-slate-400 ml-auto">{player.xp} XP</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaitrisePage;
