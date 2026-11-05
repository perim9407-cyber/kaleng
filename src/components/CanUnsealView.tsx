import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CanData } from '../types';
import { CylinderCan } from './CylinderCan';
import { playAmbientSound, stopAmbientSound } from '../utils/audio';
import { saveCanToPantry } from '../utils/canData';
import { 
  Play, 
  Pause, 
  Share2, 
  PlusCircle, 
  Bookmark, 
  BookmarkCheck, 
  Maximize2,
  X,
  Volume2,
  Youtube,
  Music,
  ExternalLink,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Camera
} from 'lucide-react';

interface CanUnsealViewProps {
  can: CanData;
  onMakeOwn: () => void;
  onShare: () => void;
}

export const CanUnsealView: React.FC<CanUnsealViewProps> = ({ can, onMakeOwn, onShare }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReadingLetter, setIsReadingLetter] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const photosList = can.photos && can.photos.length > 0 
    ? can.photos 
    : can.photoUrl 
    ? [{ id: 'photo-single-1', url: can.photoUrl, caption: can.photoCaption || '' }] 
    : [];

  // Reset to sealed whenever a different can is loaded
  useEffect(() => {
    setIsOpen(false);
    setIsReadingLetter(false);
    setIsPlayingAudio(false);
    setActivePhotoIdx(0);
    setLightboxIdx(null);
    stopAmbientSound();
    if (localAudioRef.current) {
      localAudioRef.current.pause();
    }
  }, [can.id]);

  // Play audio when opened
  const handleOpen = () => {
    setIsOpen(true);
    setIsReadingLetter(true);

    if (can.soundSource === 'upload' || can.soundSource === 'voice') {
      if (can.soundDataUrl) {
        if (!localAudioRef.current) {
          localAudioRef.current = new Audio(can.soundDataUrl);
          localAudioRef.current.onended = () => setIsPlayingAudio(false);
        }
        localAudioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
      }
    } else if (can.soundSource === 'ambient' && can.soundId && can.soundId !== 'none') {
      setIsPlayingAudio(true);
      playAmbientSound(can.soundId, undefined, () => setIsPlayingAudio(false));
    }
  };

  const handleReseal = () => {
    setIsOpen(false);
    setIsReadingLetter(false);
    setIsPlayingAudio(false);
    stopAmbientSound();
    if (localAudioRef.current) {
      localAudioRef.current.pause();
    }
  };

  const toggleAudio = () => {
    if (can.soundSource === 'upload' || can.soundSource === 'voice') {
      if (!localAudioRef.current && can.soundDataUrl) {
        localAudioRef.current = new Audio(can.soundDataUrl);
        localAudioRef.current.onended = () => setIsPlayingAudio(false);
      }
      if (localAudioRef.current) {
        if (isPlayingAudio) {
          localAudioRef.current.pause();
          setIsPlayingAudio(false);
        } else {
          localAudioRef.current.play().then(() => setIsPlayingAudio(true)).catch(console.error);
        }
      }
    } else if (can.soundSource === 'ambient' && can.soundId) {
      if (isPlayingAudio) {
        stopAmbientSound();
        setIsPlayingAudio(false);
      } else {
        setIsPlayingAudio(true);
        playAmbientSound(can.soundId, undefined, () => setIsPlayingAudio(false));
      }
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
      if (localAudioRef.current) {
        localAudioRef.current.pause();
        localAudioRef.current = null;
      }
    };
  }, []);

  const handleSaveToPantry = () => {
    saveCanToPantry(can);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const creationDateStr = new Date(can.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      
      {/* Recipient Invitation Banner (When can is sealed) */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 text-center max-w-md bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-3xl p-4 shadow-sm"
        >
          <span className="text-xs font-mono font-bold text-[#16A34A] uppercase tracking-wider block mb-1">
            🥫 Kiriman Kaleng Tersegel
          </span>
          <h2 className="text-lg sm:text-xl font-bold font-serif text-stone-900">
            Ada kaleng surat dari <span className="underline decoration-wavy decoration-[#16A34A]">{can.from || 'seseorang'}</span> untukmu!
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            Tersegel kedap udara sejak <span className="font-mono font-bold">{creationDateStr}</span>. Tarik cincin pull-tab di atas tutup untuk membuka!
          </p>
        </motion.div>
      )}

      {/* Tabletop Can Display */}
      <div className="w-full flex flex-col items-center">
        
        {/* Realistic Cylindrical Can */}
        <CylinderCan
          can={can}
          isOpen={isOpen}
          onOpen={handleOpen}
          interactive={true}
          onLetterClick={() => setIsReadingLetter(true)}
          size="normal"
        />

        {/* Revealed Letter and Contents */}
        <AnimatePresence>
          {isOpen && isReadingLetter && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="w-full mt-8 sm:mt-12 space-y-6 max-w-2xl"
            >
              {/* ========================================================= */}
              {/* YOUTUBE EMBEDDED SOUNDTRACK PLAYER */}
              {/* ========================================================= */}
              {can.soundSource === 'youtube' && can.youtubeId && (
                <div className="bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-3xl p-4 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 rounded-full bg-[#EF4444] text-white flex items-center justify-center">
                        <Youtube className="w-4 h-4 fill-current" />
                      </span>
                      <span className="text-xs font-bold text-stone-900">
                        {can.soundTitle || 'YouTube Soundtrack'}
                      </span>
                    </div>
                    {can.youtubeUrl && (
                      <a
                        href={can.youtubeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] font-mono text-stone-500 hover:text-black flex items-center gap-1"
                      >
                        <span>Open on YouTube</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>

                  {/* YouTube iFrame Player */}
                  <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#2D2D2D]/20 shadow-xs bg-black">
                    <iframe
                      src={`https://www.youtube.com/embed/${can.youtubeId}?autoplay=1&enablejsapi=1`}
                      title="YouTube soundtrack"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* UPLOADED SONG / VOICE / AMBIENT SOUND PLAYER BAR */}
              {/* ========================================================= */}
              {can.soundSource !== 'youtube' && can.soundSource !== 'none' && (can.soundDataUrl || (can.soundId && can.soundId !== 'none')) && (
                <div className="bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-full p-2.5 px-4 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleAudio}
                      className="w-10 h-10 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 cursor-pointer shadow-sm hover:scale-105 active:scale-95 transition-transform"
                    >
                      {isPlayingAudio ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>
                    <div>
                      <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block">
                        The air where you are
                      </span>
                      <span className="text-xs font-bold text-stone-800">
                        {can.soundTitle || (can.soundSource === 'upload' ? 'Enclosed Song' : 'Ambient Atmosphere')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pr-2">
                    {[0.6, 1, 0.4, 0.9, 0.5, 0.8].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1 bg-[#16A34A] rounded-full"
                        animate={isPlayingAudio ? { height: [4, h * 20, 4] } : { height: 4 }}
                        transition={{ repeat: Infinity, duration: 0.8 + i * 0.1, ease: 'easeInOut' }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ========================================================= */}
              {/* UNFOLDED LETTER CARD & PHOTO */}
              {/* ========================================================= */}
              <div className="relative bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-3xl p-6 sm:p-10 shadow-lg text-stone-900">
                
                {/* Multi-Photo Polaroid Deck (up to 10 photos) */}
                {photosList.length > 0 && (
                  <div className="mb-8 flex flex-col items-center">
                    
                    {/* Header badge if multiple photos */}
                    {photosList.length > 1 && (
                      <div className="mb-3 flex items-center gap-1.5 text-xs font-mono text-stone-600 bg-stone-200/60 px-3 py-1 rounded-full">
                        <Camera className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span className="font-bold">
                          Foto {activePhotoIdx + 1} dari {photosList.length}
                        </span>
                        <span className="text-[10px] text-stone-400">· Klik untuk memperbesar</span>
                      </div>
                    )}

                    {/* Main Featured Polaroid with Animated Spring */}
                    <div className="relative flex items-center justify-center">
                      
                      {/* Left Navigation Arrow */}
                      {photosList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : photosList.length - 1))}
                          className="absolute -left-4 sm:-left-8 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FAF7F2] border-2 border-[#2D2D2D] shadow-md flex items-center justify-center text-stone-800 hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          title="Foto sebelumnya"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                      )}

                      {/* Stack layer background effects for depth */}
                      {photosList.length > 1 && (
                        <div 
                          className="absolute inset-0 max-w-xs w-64 sm:w-72 h-80 bg-white/70 rounded-2xl border-2 border-[#2D2D2D]/40 shadow-sm pointer-events-none transform rotate-3 scale-95" 
                        />
                      )}
                      {photosList.length > 2 && (
                        <div 
                          className="absolute inset-0 max-w-xs w-64 sm:w-72 h-80 bg-white/50 rounded-2xl border-2 border-[#2D2D2D]/20 shadow-sm pointer-events-none transform -rotate-3 scale-90" 
                        />
                      )}

                      {/* Active Polaroid Card */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={photosList[activePhotoIdx]?.id || activePhotoIdx}
                          initial={{ scale: 0.9, opacity: 0, rotate: -2 }}
                          animate={{ scale: 1, opacity: 1, rotate: [-1, 1, -0.5][activePhotoIdx % 3] }}
                          exit={{ scale: 0.9, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                          onClick={() => setLightboxIdx(activePhotoIdx)}
                          className="relative z-10 cursor-pointer bg-white p-3.5 pb-4 rounded-2xl border-2 border-[#2D2D2D] shadow-lg max-w-xs w-64 sm:w-72 hover:scale-105 transition-all group"
                        >
                          <div className="w-full aspect-square rounded-xl overflow-hidden border border-stone-200 bg-stone-100 relative">
                            <img
                              src={photosList[activePhotoIdx]?.url}
                              alt="Enclosed snapshot"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-xs">
                              {activePhotoIdx + 1} / {photosList.length}
                            </div>
                          </div>

                          {photosList[activePhotoIdx]?.caption ? (
                            <p className="text-center font-handwriting text-2xl text-stone-800 mt-3 px-1 leading-snug">
                              {photosList[activePhotoIdx]?.caption}
                            </p>
                          ) : (
                            <p className="text-center font-mono text-[11px] text-stone-400 mt-2">
                              (Sentuh foto untuk memperbesar)
                            </p>
                          )}
                        </motion.div>
                      </AnimatePresence>

                      {/* Right Navigation Arrow */}
                      {photosList.length > 1 && (
                        <button
                          type="button"
                          onClick={() => setActivePhotoIdx((prev) => (prev < photosList.length - 1 ? prev + 1 : 0))}
                          className="absolute -right-4 sm:-right-8 z-20 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FAF7F2] border-2 border-[#2D2D2D] shadow-md flex items-center justify-center text-stone-800 hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                          title="Foto berikutnya"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      )}
                    </div>

                    {/* Thumbnail Strip (if multiple photos) */}
                    {photosList.length > 1 && (
                      <div className="flex items-center gap-2 mt-4 overflow-x-auto max-w-xs sm:max-w-md py-1 px-2 scrollbar-thin">
                        {photosList.map((photo, i) => {
                          const isActive = i === activePhotoIdx;
                          return (
                            <button
                              key={photo.id || i}
                              type="button"
                              onClick={() => setActivePhotoIdx(i)}
                              className={`shrink-0 w-12 h-14 bg-white p-1 rounded-lg border-2 transition-all cursor-pointer ${
                                isActive
                                  ? 'border-[#16A34A] scale-110 shadow-md ring-2 ring-[#16A34A]/30'
                                  : 'border-[#2D2D2D]/30 opacity-70 hover:opacity-100 hover:border-[#2D2D2D]'
                              }`}
                            >
                              <img
                                src={photo.url}
                                alt={`Thumb ${i + 1}`}
                                className="w-full h-9 object-cover rounded-sm"
                              />
                              <span className="text-[9px] font-mono font-bold block text-center text-stone-600 mt-0.5">
                                #{i + 1}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                  </div>
                )}

                {/* Message Body */}
                <div className="font-handwriting text-2xl sm:text-3xl leading-relaxed text-stone-800 whitespace-pre-wrap min-h-[120px]">
                  {can.message}
                </div>

                {/* Sign-off */}
                <div className="mt-8 pt-4 border-t border-stone-300 flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Preserved fresh in tin</span>
                  <span className="font-bold text-stone-800 text-sm font-handwriting text-2xl">
                    from {can.from || 'someone'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Below Letter */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                <button
                  onClick={onMakeOwn}
                  className="px-5 py-3 bg-[#2D2D2D] hover:bg-black text-[#FAF7F2] font-bold text-xs sm:text-sm rounded-full shadow-md transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4 text-emerald-400" />
                  <span>Make your own Canned Letter</span>
                </button>

                <button
                  onClick={onShare}
                  className="px-4 py-3 bg-[#FAF7F2] hover:bg-white text-stone-800 font-bold text-xs sm:text-sm rounded-full border-2 border-[#2D2D2D] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>

                <button
                  onClick={handleReseal}
                  className="px-4 py-3 bg-[#FAF7F2] hover:bg-white text-stone-800 font-bold text-xs sm:text-sm rounded-full border-2 border-[#2D2D2D] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                  title="Tutup kembali kaleng untuk mengulang tarikan tutup"
                >
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span>Tutup Kembali Kaleng</span>
                </button>

                <button
                  onClick={handleSaveToPantry}
                  className="px-4 py-3 bg-[#FAF7F2] hover:bg-white text-stone-800 font-bold text-xs sm:text-sm rounded-full border-2 border-[#2D2D2D] shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <BookmarkCheck className="w-4 h-4 text-[#16A34A]" />
                      <span className="text-[#16A34A]">Saved to Pantry!</span>
                    </>
                  ) : (
                    <>
                      <Bookmark className="w-4 h-4" />
                      <span>Save to Pantry</span>
                    </>
                  )}
                </button>
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* Lightbox Photo with Navigation */}
      <AnimatePresence>
        {lightboxIdx !== null && photosList[lightboxIdx] && (
          <div
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-4 select-none"
            onClick={() => setLightboxIdx(null)}
          >
            <div
              className="relative max-w-lg w-full bg-[#FAF7F2] p-4 sm:p-6 rounded-3xl border-2 border-[#2D2D2D] shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                className="absolute -top-11 right-0 text-white hover:text-stone-300 p-1 cursor-pointer transition-colors"
                title="Tutup"
              >
                <X className="w-7 h-7" />
              </button>

              {/* Prev / Next Buttons in Lightbox if multiple */}
              {photosList.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx((prev) => (prev !== null && prev > 0 ? prev - 1 : photosList.length - 1));
                    }}
                    className="absolute -left-4 sm:-left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#2D2D2D] shadow-lg flex items-center justify-center text-stone-800 hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                    title="Foto sebelumnya"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIdx((prev) => (prev !== null && prev < photosList.length - 1 ? prev + 1 : 0));
                    }}
                    className="absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#2D2D2D] shadow-lg flex items-center justify-center text-stone-800 hover:scale-110 active:scale-95 transition-all cursor-pointer z-20"
                    title="Foto berikutnya"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Enlarged Image */}
              <div className="w-full bg-stone-900 rounded-2xl overflow-hidden flex items-center justify-center max-h-[65vh]">
                <img
                  src={photosList[lightboxIdx].url}
                  alt={`Enlarged ${lightboxIdx + 1}`}
                  className="w-full h-auto max-h-[65vh] object-contain"
                />
              </div>

              {/* Photo Caption & Counter */}
              <div className="mt-3 flex items-center justify-between text-xs text-stone-500 font-mono border-t border-stone-200 pt-2">
                <span className="font-bold text-stone-800 font-handwriting text-xl truncate pr-2">
                  {photosList[lightboxIdx].caption || 'Kenangan di dalam kaleng'}
                </span>
                <span className="shrink-0 bg-stone-200/80 px-2 py-0.5 rounded-full text-[11px] font-bold text-stone-700">
                  {lightboxIdx + 1} / {photosList.length}
                </span>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
