/**
 * 🎨 GALERIE DES ILLUSTRATIONS - Techniques d'Aïkido
 * Page pour visualiser toutes les illustrations des techniques
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Search, Filter, Image as ImageIcon, 
  ChevronDown, X, ZoomIn, Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const API_URL = process.env.REACT_APP_BACKEND_URL;

// Configuration des ceintures
const getBeltConfig = (color, name) => {
  if (name?.toUpperCase().includes('DAN') || 
      name?.toUpperCase().includes('SHODAN') || 
      name?.toUpperCase().includes('NIDAN') || 
      name?.toUpperCase().includes('SANDAN') || 
      name?.toUpperCase().includes('YONDAN')) {
    return { label: 'Noire', emoji: '⚫', bg: 'bg-black' };
  }
  
  const colorMap = {
    '#FFFFFF': { label: 'Blanche', emoji: '⚪', bg: 'bg-gray-200' },
    '#fbbf24': { label: 'Jaune', emoji: '🟡', bg: 'bg-yellow-400' },
    '#f97316': { label: 'Orange', emoji: '🟠', bg: 'bg-orange-500' },
    '#22c55e': { label: 'Verte', emoji: '🟢', bg: 'bg-green-500' },
    '#3b82f6': { label: 'Bleue', emoji: '🔵', bg: 'bg-blue-500' },
    '#92400e': { label: 'Marron', emoji: '🟤', bg: 'bg-amber-800' },
    '#1c1917': { label: 'Noire', emoji: '⚫', bg: 'bg-black' },
  };
  
  const lowerColor = color?.toLowerCase();
  return Object.entries(colorMap).find(([hex]) => hex.toLowerCase() === lowerColor)?.[1] 
    || { label: 'Blanche', emoji: '⚪', bg: 'bg-gray-200' };
};

const IllustrationsGallery = ({ embedded = false }) => {
  const [kyuLevels, setKyuLevels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showOnlyWithImages, setShowOnlyWithImages] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/api/kyu-levels`);
        const data = await response.json();
        // Trier par order décroissant
        const sorted = data.sort((a, b) => b.order - a.order);
        setKyuLevels(sorted);
      } catch (err) {
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrer les techniques
  const filteredTechniques = kyuLevels.flatMap(kyu => {
    if (selectedGrade !== 'all' && kyu.id !== selectedGrade) return [];
    
    return (kyu.techniques || [])
      .filter(t => {
        const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
        const hasImage = showOnlyWithImages ? !!t.image_url : true;
        return matchesSearch && hasImage;
      })
      .map(t => ({ ...t, kyuName: kyu.name, kyuColor: kyu.color }));
  });

  // Stats
  const totalTechniques = kyuLevels.reduce((sum, k) => sum + (k.techniques?.length || 0), 0);
  const techniquesWithImages = kyuLevels.reduce((sum, k) => 
    sum + (k.techniques?.filter(t => t.image_url)?.length || 0), 0);

  if (loading) {
    return (
      <div className={`${embedded ? 'min-h-[400px]' : 'min-h-screen'} bg-slate-900 flex items-center justify-center`}>
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'min-h-screen'} bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950`}>
      {/* Header - Masqué en mode embedded */}
      {!embedded && (
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <a 
                href="/"
                className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-white" />
              </a>
              <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                  <ImageIcon className="w-8 h-8" />
                  Galerie des Illustrations
                </h1>
                <p className="text-cyan-100">
                  {techniquesWithImages} illustrations sur {totalTechniques} techniques
                </p>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="h-3 bg-white/20 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(techniquesWithImages / totalTechniques) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-white/70 text-sm mt-2">
              {Math.round((techniquesWithImages / totalTechniques) * 100)}% des techniques illustrées
            </p>
          </div>
        </div>
      )}
      
      {/* Stats en mode embedded */}
      {embedded && (
        <div className="p-4 bg-slate-800/50 border-b border-slate-700">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-6 h-6 text-pink-400" />
              <div>
                <p className="text-white font-medium">{techniquesWithImages} illustrations</p>
                <p className="text-slate-400 text-sm">sur {totalTechniques} techniques ({Math.round((techniquesWithImages / totalTechniques) * 100)}%)</p>
              </div>
            </div>
            <div className="w-48 h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(techniquesWithImages / totalTechniques) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </div>
      )}
              animate={{ width: `${(techniquesWithImages / totalTechniques) * 100}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-white/70 text-sm mt-2">
            {Math.round((techniquesWithImages / totalTechniques) * 100)}% des techniques illustrées
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="sticky top-0 z-10 bg-slate-800/95 backdrop-blur-sm border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4">
          {/* Recherche */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une technique..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Filtre par grade */}
          <select
            value={selectedGrade}
            onChange={(e) => setSelectedGrade(e.target.value)}
            className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="all">Tous les grades</option>
            {kyuLevels.map(kyu => (
              <option key={kyu.id} value={kyu.id}>
                {getBeltConfig(kyu.color, kyu.name).emoji} {kyu.name}
              </option>
            ))}
          </select>

          {/* Toggle images seulement */}
          <button
            onClick={() => setShowOnlyWithImages(!showOnlyWithImages)}
            className={`px-4 py-2 rounded-lg border transition-colors ${
              showOnlyWithImages 
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300' 
                : 'bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500'
            }`}
          >
            <ImageIcon className="w-4 h-4 inline mr-2" />
            Avec illustrations ({techniquesWithImages})
          </button>
        </div>
      </div>

      {/* Grille d'illustrations */}
      <div className="max-w-7xl mx-auto p-6">
        <p className="text-slate-400 mb-4">
          {filteredTechniques.length} technique{filteredTechniques.length > 1 ? 's' : ''} trouvée{filteredTechniques.length > 1 ? 's' : ''}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredTechniques.map((technique, index) => {
            const beltConfig = getBeltConfig(technique.kyuColor, technique.kyuName);
            
            return (
              <motion.div
                key={technique.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.02 }}
                className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all hover:shadow-lg hover:shadow-cyan-500/10 group"
              >
                {/* Image */}
                <div 
                  className="relative aspect-square bg-slate-900 cursor-pointer"
                  onClick={() => technique.image_url && setSelectedImage(technique)}
                >
                  {technique.image_url ? (
                    <>
                      <img 
                        src={technique.image_url} 
                        alt={technique.name}
                        className="w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ZoomIn className="w-10 h-10 text-white" />
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                      <ImageIcon className="w-16 h-16 mb-2" />
                      <span className="text-sm">Pas d'illustration</span>
                    </div>
                  )}
                  
                  {/* Badge grade */}
                  <div className="absolute top-2 left-2">
                    <Badge className={`${beltConfig.bg} text-white text-xs`}>
                      {beltConfig.emoji} {technique.kyuName}
                    </Badge>
                  </div>
                </div>

                {/* Infos */}
                <div className="p-3">
                  <h3 className="font-semibold text-white text-sm truncate" title={technique.name}>
                    {technique.name}
                  </h3>
                  {technique.description && (
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">
                      {technique.description}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredTechniques.length === 0 && (
          <div className="text-center py-20">
            <ImageIcon className="w-20 h-20 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">Aucune technique trouvée</p>
          </div>
        )}
      </div>

      {/* Modal zoom image */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="relative max-w-4xl w-full bg-slate-800 rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 bg-slate-900 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedImage.name}</h2>
                <p className="text-slate-400 text-sm">{selectedImage.kyuName}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            {/* Image */}
            <div className="bg-slate-900 p-4">
              <img 
                src={selectedImage.image_url} 
                alt={selectedImage.name}
                className="w-full max-h-[60vh] object-contain rounded-lg"
              />
            </div>

            {/* Description */}
            {selectedImage.description && (
              <div className="p-4 border-t border-slate-700">
                <p className="text-slate-300">{selectedImage.description}</p>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 bg-slate-900 flex justify-end gap-2">
              <a
                href={selectedImage.image_url}
                download={`${selectedImage.name}.png`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Télécharger
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default IllustrationsGallery;
