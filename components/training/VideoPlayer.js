'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function VideoPlayer({ videoUrl, onClose }) {
  // Función para obtener la URL de embed de YouTube
  const getYouTubeEmbedUrl = (url) => {
    let videoId = null;
    try {
      if (url.includes('youtube.com/watch')) {
        const urlParams = new URLSearchParams(new URL(url).search);
        videoId = urlParams.get('v');
      } else if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
      } else if (url.includes('youtube.com/embed/')) {
        return url; // Ya es embed
      }
    } catch (e) {
      console.error('Error parseando URL de YouTube', e);
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return null;
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(videoUrl);
  const isVideoFile = videoUrl.toLowerCase().endsWith('.mp4') || videoUrl.toLowerCase().endsWith('.webm') || videoUrl.toLowerCase().endsWith('.mov');

  return (
    <div className="w-full mt-3 bg-slate-950 rounded-xl overflow-hidden border border-slate-700/50 shadow-inner relative animate-fadeIn">
      {/* Botón Cerrar */}
      <div className="absolute top-2 right-2 z-10">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-lg backdrop-blur-sm transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="aspect-video w-full bg-black flex items-center justify-center">
        {youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title="Video del Ejercicio"
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : isVideoFile ? (
          <video
            src={videoUrl}
            controls
            className="w-full h-full object-contain"
          />
        ) : (
          <div className="p-4 text-center">
            <p className="text-sm text-slate-400 mb-2">Este enlace no parece ser un video directo ni de YouTube.</p>
            <a 
              href={videoUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sky-400 font-bold hover:underline"
            >
              Abrir enlace en una pestaña nueva
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
