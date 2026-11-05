import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CanData } from '../types';
import { CylinderCan } from './CylinderCan';
import { playAmbientSound, stopAmbientSound } from '../utils/audio';
import { saveCanToPantry, getShelfLifeStatus } from '../utils/canData';
import { 
  Play, 
  Pause, 
  Share2, 
  PlusCircle, 
  Bookmark, 
  BookmarkCheck, 
  Maximize2,
  X,
  Volume2
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
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

  const handleOpen = () => {
    setIsOpen(true);
    setIsReadingLetter(true);
    if (can.soundId && can.soundId !== 'none') {
      setIsPlayingAudio(true);
      playAmbientSound(can.soundId, can.soundDataUrl, () => setIsPlayingAudio(false));
    }
  };

  const toggleAudio = () => {
    if (isPlayingAudio) {
      stopAmbientSound();
      setIsPlayingAudio(false);
    } else {
      setIsPlayingAudio(true);
      playAmbientSound(can.soundId, can.soundDataUrl, () => setIsPlayingAudio(false));
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSound();
    };
  }, []);

  const handleSaveToPantry = () => {
    saveCanToPantry(can);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 sm:py-12 flex flex-col items-center">
      
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
              {/* Sound Player Bar if audio is present */}
              {can.soundId && can.soundId !== 'none' && (
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
                        {can.soundTitle || 'Ambient Atmosphere'}
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

              {/* Unfolded Letter Card */}
              <div className="relative bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-3xl p-6 sm:p-10 shadow-lg text-stone-900">
                {/* Photo inside letter if attached */}
                {can.photoUrl && (
                  <div className="mb-6 flex flex-col items-center">
                    <div
                      onClick={() => setLightboxPhoto(can.photoUrl)}
                      className="cursor-pointer bg-white p-3 rounded-xl border-2 border-[#2D2D2D] shadow-md max-w-xs hover:rotate-0 hover:scale-105 transition-all -rotate-2"
                    >
                      <img
                        src={can.photoUrl}
                        alt="Photo from sender"
                        className="w-full aspect-square object-cover rounded-lg"
                      />
                      {can.photoCaption && (
                        <p className="text-center font-handwriting text-lg text-stone-700 mt-2">
                          {can.photoCaption}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Message Body */}
                <div className="font-handwriting text-2xl sm:text-3xl leading-relaxed text-stone-800 whitespace-pre-wrap min-h-[120px]">
                  {can.message}
                </div>

                {/* Sign-off */}
                <div className="mt-8 pt-4 border-t border-stone-300 flex items-center justify-between text-xs text-stone-500 font-mono">
                  <span>Preserved fresh in tin</span>
                  <span className="font-bold text-stone-800 text-sm font-handwriting text-xl">
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

      {/* Lightbox Photo */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setLightboxPhoto(null)}
          >
            <div
              className="relative max-w-lg w-full bg-[#FAF7F2] p-4 rounded-3xl border-2 border-[#2D2D2D]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-10 right-0 text-white"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={lightboxPhoto}
                alt="Enlarged"
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl"
              />
              {can.photoCaption && (
                <p className="text-center font-handwriting text-xl text-stone-800 mt-2">
                  {can.photoCaption}
                </p>
              )}
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
