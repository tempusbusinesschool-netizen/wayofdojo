/**
 * 🎬 SECTION VIDÉOS - Bibliothèque de vidéos pédagogiques
 * Gestion et affichage des vidéos d'Aïkido
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, Search, Filter, Plus, Play, Pause, Clock, Eye,
  Upload, Trash2, Edit, ExternalLink, Youtube, Film,
  FolderOpen, Calendar, User, Tag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Catégories de vidéos
const VIDEO_CATEGORIES = [
  { id: 'techniques', label: 'Techniques', icon: '🥋', color: 'bg-red-500' },
  { id: 'stages', label: 'Stages & Séminaires', icon: '🎓', color: 'bg-orange-500' },
  { id: 'cours', label: 'Cours en ligne', icon: '📚', color: 'bg-amber-500' },
  { id: 'demonstrations', label: 'Démonstrations', icon: '⭐', color: 'bg-emerald-500' }
];

// Vidéos de démonstration (à remplacer par des données API)
const DEMO_VIDEOS = [
  {
    id: '1',
    title: 'Ikkyo - Première technique',
    description: 'Démonstration complète de la technique Ikkyo avec variations',
    category: 'techniques',
    duration: '5:32',
    views: 1250,
    thumbnail: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    videoUrl: '',
    instructor: 'Maître Tanaka',
    date: '2024-01-15',
    tags: ['Ikkyo', '5e Kyu', 'Immobilisation']
  },
  {
    id: '2',
    title: 'Shiho Nage - Projection 4 directions',
    description: 'Technique de projection dans les 4 directions',
    category: 'techniques',
    duration: '7:15',
    views: 980,
    thumbnail: 'https://images.unsplash.com/photo-1555597673-b21d5c935865?w=400',
    videoUrl: '',
    instructor: 'Maître Tanaka',
    date: '2024-01-20',
    tags: ['Shiho Nage', '5e Kyu', 'Projection']
  },
  {
    id: '3',
    title: 'Stage National 2024',
    description: 'Enregistrement du stage national avec les plus grands maîtres',
    category: 'stages',
    duration: '45:00',
    views: 3200,
    thumbnail: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
    videoUrl: '',
    instructor: 'Plusieurs maîtres',
    date: '2024-02-10',
    tags: ['Stage', 'National', '2024']
  },
  {
    id: '4',
    title: 'Cours débutant - Les bases',
    description: 'Introduction aux fondamentaux de l\'Aïkido pour débutants',
    category: 'cours',
    duration: '25:00',
    views: 5600,
    thumbnail: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
    videoUrl: '',
    instructor: 'Sensei Martin',
    date: '2024-01-05',
    tags: ['Débutant', 'Bases', '6e Kyu']
  },
  {
    id: '5',
    title: 'Démonstration O-Sensei',
    description: 'Archive historique - Démonstration du fondateur de l\'Aïkido',
    category: 'demonstrations',
    duration: '12:30',
    views: 15000,
    thumbnail: 'https://images.unsplash.com/photo-1509822929063-6b6cfc9b42f2?w=400',
    videoUrl: '',
    instructor: 'Morihei Ueshiba',
    date: '1969-01-01',
    tags: ['Archive', 'O-Sensei', 'Historique']
  }
];

/**
 * Carte vidéo
 */
const VideoCard = ({ video, onPlay, onEdit, onDelete }) => {
  const category = VIDEO_CATEGORIES.find(c => c.id === video.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-slate-500 transition-all group"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-slate-900">
        {video.thumbnail ? (
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Film className="w-16 h-16 text-slate-700" />
          </div>
        )}
        
        {/* Overlay play */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={() => onPlay(video)}
            className="p-4 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <Play className="w-10 h-10 text-white" fill="white" />
          </button>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/80 text-white text-xs flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {video.duration}
        </div>
        
        {/* Category badge */}
        <div className="absolute top-2 left-2">
          <Badge className={`${category?.color || 'bg-slate-500'} text-white text-xs`}>
            {category?.icon} {category?.label}
          </Badge>
        </div>
      </div>
      
      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-white text-sm line-clamp-2 mb-2">
          {video.title}
        </h3>
        <p className="text-slate-400 text-xs line-clamp-2 mb-3">
          {video.description}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            {video.instructor}
          </div>
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            {video.views.toLocaleString()}
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {video.tags?.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-slate-700 rounded text-xs text-slate-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Composant principal VideosSection
 */
const VideosSection = ({ category = 'all', embedded = true }) => {
  const [videos, setVideos] = useState(DEMO_VIDEOS);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category === 'all' ? 'all' : category);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtrer les vidéos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Stats
  const totalVideos = videos.length;
  const totalDuration = videos.reduce((sum, v) => {
    const parts = v.duration.split(':');
    return sum + parseInt(parts[0]) * 60 + parseInt(parts[1] || 0);
  }, 0);
  const totalViews = videos.reduce((sum, v) => sum + v.views, 0);

  const handlePlay = (video) => {
    setSelectedVideo(video);
    // TODO: Ouvrir le lecteur vidéo
    alert(`Lecture de: ${video.title}\n\nNote: Intégration vidéo à venir`);
  };

  return (
    <div className="bg-slate-900 min-h-full">
      {/* Header Stats */}
      <div className="p-4 bg-slate-800/50 border-b border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-red-500/20">
              <Video className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-white font-medium">{totalVideos} vidéos</p>
              <p className="text-slate-400 text-sm">
                {Math.floor(totalDuration / 60)}h {totalDuration % 60}min de contenu • {totalViews.toLocaleString()} vues
              </p>
            </div>
          </div>
          
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une vidéo
          </Button>
        </div>
      </div>

      {/* Filtres */}
      <div className="p-4 bg-slate-800/30 border-b border-slate-700">
        <div className="flex flex-wrap items-center gap-4">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une vidéo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* Catégories */}
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              Toutes
            </button>
            {VIDEO_CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors flex items-center gap-1 ${
                  selectedCategory === cat.id
                    ? `${cat.color} text-white`
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {cat.icon} {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grille de vidéos */}
      <div className="p-4">
        <p className="text-slate-400 text-sm mb-4">
          {filteredVideos.length} vidéo{filteredVideos.length > 1 ? 's' : ''} trouvée{filteredVideos.length > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredVideos.map((video, index) => (
            <VideoCard
              key={video.id}
              video={video}
              onPlay={handlePlay}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-20">
            <Video className="w-20 h-20 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Aucune vidéo trouvée</p>
            <p className="text-slate-500 text-sm mt-2">
              Ajoutez votre première vidéo pour commencer
            </p>
          </div>
        )}
      </div>

      {/* Modal Ajouter Vidéo */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-xl p-6 max-w-lg w-full border border-slate-700"
          >
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-red-400" />
              Ajouter une vidéo
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">Titre</label>
                <input
                  type="text"
                  placeholder="Titre de la vidéo"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">URL de la vidéo</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/... ou URL directe"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Catégorie</label>
                <select className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white">
                  {VIDEO_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm text-slate-400 mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Description de la vidéo"
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Annuler
              </Button>
              <Button className="bg-red-500 hover:bg-red-600" onClick={() => setShowAddModal(false)}>
                <Upload className="w-4 h-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default VideosSection;
