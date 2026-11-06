import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CanData, CanThemeId, AmbientSoundId } from '../types';
import { CAN_THEMES, PRESET_PHOTOS, AMBIENT_SOUND_OPTIONS, extractYouTubeId, saveCanToPantry } from '../utils/canData';
import { CylinderCan } from './CylinderCan';
import { AudioRecorder } from './AudioRecorder';
import { SealingOverlay } from './SealingOverlay';
import { playAmbientSound, stopAmbientSound, playCartoonBoing } from '../utils/audio';
import { 
  Plus, 
  Volume2, 
  VolumeX, 
  Upload, 
  X, 
  Check, 
  Play, 
  Pause,
  Sparkles,
  Music,
  Youtube,
  Mic,
  Disc,
  FileAudio
} from 'lucide-react';

interface CanCreatorProps {
  initialCan?: CanData;
  onCanSealed: (can: CanData) => void;
}

export const CanCreator: React.FC<CanCreatorProps> = ({ initialCan, onCanSealed }) => {
  const [formData, setFormData] = useState<CanData>(() => {
    if (initialCan) {
      const existingPhotos = initialCan.photos && initialCan.photos.length > 0 
        ? initialCan.photos 
        : initialCan.photoUrl 
        ? [{ id: 'photo-init-1', url: initialCan.photoUrl, caption: initialCan.photoCaption || '' }]
        : [];
      return {
        ...initialCan,
        photos: existingPhotos,
      };
    }
    return {
      id: `can-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      themeId: 'apple',
      title: 'for you',
      to: '',
      from: '',
      message: '',
      fontStyle: 'handwriting',
      stampId: 'wax_heart',
      photoUrl: '',
      photoCaption: '',
      photos: [],
      soundSource: 'none',
      soundId: 'none',
      soundTitle: '',
      createdAt: Date.now(),
      shelfLifeDays: 10,
      location: '',
    };
  });

  // Modals for Sound & Photo Pickers
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [soundModalTab, setSoundModalTab] = useState<'upload' | 'youtube' | 'ambient' | 'voice'>('upload');
  const [youtubeInput, setYoutubeInput] = useState(formData.youtubeUrl || '');
  const [youtubeError, setYoutubeError] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [testingSoundId, setTestingSoundId] = useState<string | null>(null);
  const [isSealingAnimation, setIsSealingAnimation] = useState(false);
  const [sealedCanData, setSealedCanData] = useState<CanData | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const handleTestSound = (soundId: AmbientSoundId, soundTitle: string) => {
    if (testingSoundId === soundId) {
      stopAmbientSound();
      setTestingSoundId(null);
    } else {
      setTestingSoundId(soundId);
      playAmbientSound(soundId, formData.soundDataUrl, () => setTestingSoundId(null));
    }
  };

  // Upload custom song / audio file
  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 15 * 1024 * 1024) {
      alert('Audio file size exceeds 15MB. Please choose a smaller track.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const cleanTitle = file.name.replace(/\.[^/.]+$/, '').slice(0, 32);

      setFormData((prev) => ({
        ...prev,
        soundSource: 'upload',
        soundDataUrl: dataUrl,
        soundTitle: cleanTitle,
        youtubeUrl: undefined,
        youtubeId: undefined,
        soundId: 'none',
      }));
      setShowSoundModal(false);
    };
    reader.readAsDataURL(file);
  };

  // Save YouTube Music Link
  const handleSaveYouTube = () => {
    setYoutubeError(null);
    const videoId = extractYouTubeId(youtubeInput);
    if (!videoId) {
      setYoutubeError('Please enter a valid YouTube link (e.g. https://youtu.be/... or youtube.com/watch?v=...)');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      soundSource: 'youtube',
      youtubeUrl: youtubeInput.trim(),
      youtubeId: videoId,
      soundTitle: 'YouTube Soundtrack',
      soundDataUrl: undefined,
      soundId: 'none',
    }));
    setShowSoundModal(false);
  };

  // Helper to compress an image file to a data URL
  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_SIZE = 750;
          let width = img.width;
          let height = img.height;
          if (width > height && width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Upload Multiple Photos (Max 10)
  const handleMultiplePhotosUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setPhotoError(null);
    const currentPhotos = formData.photos || [];
    const remainingSlots = 10 - currentPhotos.length;

    if (remainingSlots <= 0) {
      setPhotoError('Maksimal 10 foto sudah tercapai.');
      return;
    }

    const filesToProcess = files.slice(0, remainingSlots);
    if (files.length > remainingSlots) {
      setPhotoError(`Hanya ${remainingSlots} foto yang ditambahkan (maksimal 10 foto).`);
    }

    try {
      const compressedUrls = await Promise.all(filesToProcess.map((f) => compressImage(f)));
      const newPhotoObjects = compressedUrls.map((url, idx) => ({
        id: `photo-${Date.now()}-${idx}-${Math.random().toString(36).slice(2, 5)}`,
        url,
        caption: '',
      }));

      const updatedPhotos = [...currentPhotos, ...newPhotoObjects];
      setFormData((prev) => ({
        ...prev,
        photos: updatedPhotos,
        photoUrl: updatedPhotos[0]?.url || '',
        photoCaption: updatedPhotos[0]?.caption || '',
      }));
      setShowPhotoModal(false);
    } catch (err) {
      console.error('Failed to process photos', err);
      setPhotoError('Gagal memproses beberapa foto.');
    }
  };

  // Add Preset Photo
  const handleAddPresetPhoto = (presetUrl: string, presetLabel: string) => {
    const currentPhotos = formData.photos || [];
    if (currentPhotos.length >= 10) {
      setPhotoError('Maksimal 10 foto sudah tercapai.');
      return;
    }

    const newPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      url: presetUrl,
      caption: presetLabel,
    };

    const updated = [...currentPhotos, newPhoto];
    setFormData((prev) => ({
      ...prev,
      photos: updated,
      photoUrl: updated[0]?.url || '',
      photoCaption: updated[0]?.caption || '',
    }));
    setShowPhotoModal(false);
  };

  // Remove a photo
  const handleRemovePhoto = (photoId: string) => {
    const currentPhotos = formData.photos || [];
    const updated = currentPhotos.filter((p) => p.id !== photoId);
    setFormData((prev) => ({
      ...prev,
      photos: updated,
      photoUrl: updated[0]?.url || '',
      photoCaption: updated[0]?.caption || '',
    }));
  };

  // Update caption of a specific photo
  const handleUpdateCaption = (photoId: string, caption: string) => {
    const currentPhotos = formData.photos || [];
    const updated = currentPhotos.map((p) => (p.id === photoId ? { ...p, caption } : p));
    setFormData((prev) => ({
      ...prev,
      photos: updated,
      photoCaption: updated[0]?.caption || '',
    }));
  };

  const handleSealCan = (e: React.FormEvent) => {
    e.preventDefault();
    stopAmbientSound();

    const finalizedCan: CanData = {
      ...formData,
      title: formData.title.trim() || 'for you',
      from: formData.from.trim() || 'someone',
      message: formData.message.trim() || 'Sealed with quiet thoughts and fondest memories.',
      createdAt: Date.now(),
    };

    saveCanToPantry(finalizedCan);
    setSealedCanData(finalizedCan);
    setIsSealingAnimation(true);
  };

  const handleSealingComplete = () => {
    setIsSealingAnimation(false);
    if (sealedCanData) {
      onCanSealed(sealedCanData);
    }
  };

  const allThemesList = Object.values(CAN_THEMES);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-16 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: THE REALISTIC CAN (MATCHING USER SCREENSHOT) */}
        {/* ========================================================= */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col items-center justify-center lg:sticky lg:top-24 pt-2 sm:pt-4">
          <div className="relative flex flex-col items-center justify-center w-full max-w-sm">
            {/* Subtle radial glow on desktop */}
            <div className="absolute inset-0 m-auto w-60 sm:w-72 lg:w-80 h-60 sm:h-72 lg:h-80 rounded-full bg-white/40 blur-xl pointer-events-none -z-0" />

            <CylinderCan
              can={formData}
              isOpen={true}
              interactive={false}
              size="normal"
            />

            {/* Subtle artisan footnote under the tin on desktop */}
            <div className="mt-3 hidden lg:flex items-center gap-2 text-[11px] font-mono text-stone-600 bg-[#FAF8F5]/90 px-3.5 py-1.5 rounded-full border border-[#2D2D2D]/20 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
              <span>320ml Sealed Cavity · Live Tin Preview</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: THE FORM CONTROLS IN BESPOKE STATIONERY CARD */}
        {/* ========================================================= */}
        <div className="lg:col-span-7 xl:col-span-7">
          <div className="bg-[#FAF8F5] rounded-3xl border-2 border-[#2D2D2D] p-4 min-[380px]:p-6 sm:p-8 shadow-[0_12px_28px_rgba(0,0,0,0.06)]">
            <div className="mb-5 pb-3 border-b border-[#2D2D2D]/15 flex items-center justify-between">
              <div>
                <h1 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
                  Can a Letter
                </h1>
                <p className="text-xs text-stone-600 mt-0.5">
                  Pack your words, a memory, and ambient sound into an airtight tin.
                </p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-mono font-bold bg-[#D9E5D6] text-stone-800 px-3 py-1 rounded-full border border-[#2D2D2D]/20">
                🥫 Hermetic Seal
              </span>
            </div>

            <form onSubmit={handleSealCan} className="space-y-5 sm:space-y-6">
            
            {/* 1. PICK A CAN (VARIED 8 THEMES CAROUSEL) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs sm:text-sm font-bold text-stone-800">
                  Pick a can
                </label>
                <span className="text-[11px] text-stone-600 font-mono">
                  {CAN_THEMES[formData.themeId]?.name}
                </span>
              </div>

              {/* Scrollable grid/carousel of 8 cans with edge bleed on mobile */}
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-3 pt-1 px-1 -mx-2 sm:mx-0 scrollbar-thin">
                {allThemesList.map((t) => {
                  const isSelected = formData.themeId === t.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => setFormData({ ...formData, themeId: t.id })}
                      className={`cursor-pointer w-20 sm:w-24 h-26 sm:h-28 rounded-2xl p-1.5 sm:p-2 flex flex-col items-center justify-between transition-all bg-[#FAF7F2] shrink-0 ${
                        isSelected
                          ? 'border-[2.5px] border-[#2D2D2D] shadow-md scale-105'
                          : 'border-2 border-[#2D2D2D]/30 hover:border-[#2D2D2D]/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <CylinderCan
                        can={{ ...formData, themeId: t.id, title: '' }}
                        isOpen={true}
                        interactive={false}
                        size="mini"
                      />
                      <span className="text-[9px] font-bold text-stone-700 truncate w-full text-center">
                        {t.name.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. TITLE (0/16) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>Title</span>
                <span className="font-mono text-stone-400">{formData.title.length}/16</span>
              </div>
              <input
                type="text"
                maxLength={16}
                value={formData.title}
                placeholder="for you"
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-full py-3 px-6 text-center text-lg font-bold text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B9356] shadow-xs"
                style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
              />
            </div>

            {/* 3. SOUND (UPLOAD SONG, YOUTUBE, VOICE NOTE, OR AMBIENT) */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-700 mb-1.5">
                <span className="font-bold">Sound</span>
                <span className="text-stone-500">song upload, YouTube link, voice, or ambient</span>
              </div>
              
              {formData.soundSource !== 'none' && (formData.soundTitle || formData.youtubeId) ? (
                <div className="flex items-center justify-between bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-full py-2.5 px-4 shadow-xs">
                  <div className="flex items-center gap-2.5 truncate text-xs font-bold text-stone-800">
                    <span className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs shrink-0">
                      {formData.soundSource === 'youtube' ? (
                        <Youtube className="w-4 h-4 fill-current" />
                      ) : formData.soundSource === 'upload' ? (
                        <Music className="w-4 h-4" />
                      ) : formData.soundSource === 'voice' ? (
                        <Mic className="w-4 h-4" />
                      ) : (
                        <span>♫</span>
                      )}
                    </span>
                    <span className="truncate">
                      {formData.soundTitle || (formData.youtubeId ? `YouTube Music` : 'Custom Audio')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        stopAmbientSound();
                        setFormData({ 
                          ...formData, 
                          soundSource: 'none', 
                          soundId: 'none', 
                          soundTitle: '', 
                          soundDataUrl: undefined,
                          youtubeUrl: undefined,
                          youtubeId: undefined
                        });
                      }}
                      className="p-1 text-stone-400 hover:text-red-600 rounded-full transition-colors"
                      title="Remove audio"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowSoundModal(true)}
                  className="w-full bg-[#FAF7F2] hover:bg-white border-2 border-[#2D2D2D] rounded-full py-2.5 px-4 text-xs font-bold text-stone-800 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold">
                    +
                  </span>
                  <span>Add a sound</span>
                </button>
              )}
            </div>

            {/* 4. LETTER (0/1000) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>Letter</span>
                <span className="font-mono text-stone-400">{formData.message.length}/1000</span>
              </div>
              <textarea
                rows={6}
                maxLength={1000}
                placeholder="Write your letter here"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-2xl p-3.5 sm:p-4 text-base sm:text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B9356] shadow-xs resize-y"
              />
            </div>

            {/* 5. YOUR NAME (shown as "from ___" at the end) */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-700 mb-1.5">
                <span className="font-bold">Your name</span>
                <span className="text-stone-500">shown as "from ___" at the end</span>
              </div>
              <input
                type="text"
                placeholder=""
                value={formData.from}
                onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                className="w-full bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-full py-2.5 sm:py-3 px-4 sm:px-5 text-base sm:text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B9356] shadow-xs"
              />
            </div>

            {/* 6. PHOTO (UP TO 10 PHOTOS WITH POLAROID ANIMATION) */}
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1.5">
                <div className="flex items-center gap-2">
                  <span>Photo</span>
                  <span className="text-stone-500 font-normal">up to 10 photos</span>
                </div>
                <span className="font-mono text-stone-400">
                  {(formData.photos?.length || 0)}/10
                </span>
              </div>

              {formData.photos && formData.photos.length > 0 ? (
                <div className="space-y-3">
                  {/* Horizontal scrolling polaroid strip with animation */}
                  <div className="flex items-start gap-3 overflow-x-auto pb-3 pt-1 px-1 -mx-2 sm:mx-0 scrollbar-thin">
                    <AnimatePresence>
                      {formData.photos.map((photo, index) => {
                        const tilts = [-2, 1.5, -1, 2, -1.8, 1.2];
                        const tilt = tilts[index % tilts.length];

                        return (
                          <motion.div
                            key={photo.id}
                            initial={{ scale: 0.7, opacity: 0, y: 15 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.7, opacity: 0, y: -10 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                            className="relative shrink-0 w-32 sm:w-36 bg-white p-2.5 pb-2 rounded-xl border-2 border-[#2D2D2D] shadow-md transition-transform hover:scale-105 hover:rotate-0"
                            style={{ transform: `rotate(${tilt}deg)` }}
                          >
                            {/* Photo Thumbnail */}
                            <div className="w-full aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-100">
                              <img
                                src={photo.url}
                                alt={`Polaroid ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            {/* Caption Input */}
                            <div className="mt-2">
                              <input
                                type="text"
                                placeholder="Add caption..."
                                value={photo.caption || ''}
                                onChange={(e) => handleUpdateCaption(photo.id, e.target.value)}
                                className="w-full text-xs font-handwriting text-stone-700 bg-transparent border-b border-stone-200 focus:border-[#2D2D2D] focus:outline-none py-0.5 text-center"
                              />
                            </div>

                            {/* Photo Index Badge */}
                            <span className="absolute top-1 left-1 bg-black/60 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-full">
                              #{index + 1}
                            </span>

                            {/* Delete button */}
                            <button
                              type="button"
                              onClick={() => handleRemovePhoto(photo.id)}
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-md cursor-pointer transition-transform hover:scale-110 min-h-[24px] min-w-[24px]"
                              title="Hapus foto"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>

                    {/* Add more button if less than 10 */}
                    {(formData.photos?.length || 0) < 10 && (
                      <button
                        type="button"
                        onClick={() => setShowPhotoModal(true)}
                        className="shrink-0 w-26 sm:w-28 h-36 sm:h-40 rounded-xl border-2 border-dashed border-[#2D2D2D]/40 hover:border-[#2D2D2D] bg-[#FAF7F2] hover:bg-white flex flex-col items-center justify-center gap-1.5 transition-colors cursor-pointer text-stone-600 hover:text-black min-h-[44px]"
                      >
                        <span className="w-7 h-7 rounded-full bg-[#16A34A] text-white flex items-center justify-center font-bold text-sm">
                          +
                        </span>
                        <span className="text-[10px] sm:text-[11px] font-bold text-center leading-tight">
                          Add Photo<br />({(formData.photos?.length || 0)}/10)
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="w-full bg-[#FAF7F2] hover:bg-white border-2 border-[#2D2D2D] rounded-full py-2.5 px-4 text-xs font-bold text-stone-800 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer min-h-[44px]"
                >
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold">
                    +
                  </span>
                  <span>Add a photo (up to 10)</span>
                </button>
              )}
            </div>

            {/* SUBMIT BUTTON: SEAL THE CAN */}
            <div className="pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full min-h-[48px] py-3.5 px-6 bg-[#2D2D2D] hover:bg-black text-[#FAF7F2] font-bold text-sm sm:text-base rounded-full shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Seal the can</span>
              </motion.button>
            </div>

          </form>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SOUND MODAL (UPLOAD AUDIO, YOUTUBE LINK, VOICE, AMBIENT) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showSoundModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowSoundModal(false)}
          >
            <div
              className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#2D2D2D] shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-bold text-base text-stone-900">Choose Audio for the Can</h3>
                <button
                  onClick={() => {
                    stopAmbientSound();
                    setShowSoundModal(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sound Option Tabs (2 cols on narrow mobile, 4 cols on wider screens) */}
              <div className="grid grid-cols-2 min-[460px]:grid-cols-4 gap-1.5 p-1.5 bg-stone-200/70 rounded-2xl min-[460px]:rounded-full text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setSoundModalTab('upload')}
                  className={`py-2 px-1.5 rounded-xl min-[460px]:rounded-full transition-colors text-center cursor-pointer min-h-[38px] flex items-center justify-center ${
                    soundModalTab === 'upload' ? 'bg-[#2D2D2D] text-[#FAF7F2]' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setSoundModalTab('youtube')}
                  className={`py-2 px-1.5 rounded-xl min-[460px]:rounded-full transition-colors text-center cursor-pointer min-h-[38px] flex items-center justify-center ${
                    soundModalTab === 'youtube' ? 'bg-[#2D2D2D] text-[#FAF7F2]' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  YouTube
                </button>
                <button
                  type="button"
                  onClick={() => setSoundModalTab('voice')}
                  className={`py-2 px-1.5 rounded-xl min-[460px]:rounded-full transition-colors text-center cursor-pointer min-h-[38px] flex items-center justify-center ${
                    soundModalTab === 'voice' ? 'bg-[#2D2D2D] text-[#FAF7F2]' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  Record
                </button>
                <button
                  type="button"
                  onClick={() => setSoundModalTab('ambient')}
                  className={`py-2 px-1.5 rounded-xl min-[460px]:rounded-full transition-colors text-center cursor-pointer min-h-[38px] flex items-center justify-center ${
                    soundModalTab === 'ambient' ? 'bg-[#2D2D2D] text-[#FAF7F2]' : 'text-stone-700 hover:text-black'
                  }`}
                >
                  Ambient
                </button>
              </div>

              {/* TAB 1: UPLOAD AUDIO FILE (MP3, WAV, M4A) */}
              {soundModalTab === 'upload' && (
                <div className="space-y-3 pt-2">
                  <label className="border-2 border-dashed border-[#2D2D2D]/40 hover:border-[#2D2D2D] rounded-2xl p-5 sm:p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                    <FileAudio className="w-8 h-8 text-[#16A34A] mb-2" />
                    <span className="text-xs font-bold text-stone-800">Upload song from your device</span>
                    <span className="text-[10px] text-stone-400 mt-1">MP3, WAV, M4A, OGG, WebM (up to 15MB)</span>
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-stone-500 text-center">
                    The recipient will hear this music automatically when pulling the can lid open!
                  </p>
                </div>
              )}

              {/* TAB 2: YOUTUBE MUSIC LINK */}
              {soundModalTab === 'youtube' && (
                <div className="space-y-4 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      Paste YouTube Music / Video Link
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. https://youtu.be/... or https://www.youtube.com/watch?v=..."
                      value={youtubeInput}
                      onChange={(e) => setYoutubeInput(e.target.value)}
                      className="w-full bg-white border-2 border-[#2D2D2D] rounded-full py-2.5 px-4 text-base sm:text-xs font-mono text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B9356]"
                    />
                    {youtubeError && (
                      <p className="text-[11px] text-red-600 mt-1">{youtubeError}</p>
                    )}
                  </div>

                  {/* YouTube Preview if valid ID */}
                  {extractYouTubeId(youtubeInput) && (
                    <div className="bg-white p-3 rounded-2xl border-2 border-stone-200 flex items-center gap-3">
                      <img
                        src={`https://img.youtube.com/vi/${extractYouTubeId(youtubeInput)}/mqdefault.jpg`}
                        alt="YouTube thumbnail"
                        className="w-20 h-14 object-cover rounded-lg"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-stone-800 block">Valid YouTube Track Found</span>
                        <span className="text-[11px] text-[#16A34A] font-mono">Ready to seal into can</span>
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleSaveYouTube}
                    className="w-full py-3 bg-[#2D2D2D] hover:bg-black text-[#FAF7F2] font-bold text-xs rounded-full shadow-sm transition-colors cursor-pointer"
                  >
                    Confirm YouTube Track
                  </button>
                </div>
              )}

              {/* TAB 3: MICROPHONE VOICE RECORDER */}
              {soundModalTab === 'voice' && (
                <div className="pt-2">
                  <AudioRecorder
                    existingAudioUrl={formData.soundDataUrl}
                    onAudioRecorded={(dataUrl) => {
                      setFormData((prev) => ({
                        ...prev,
                        soundSource: 'voice',
                        soundDataUrl: dataUrl,
                        soundTitle: 'Voice Note',
                        youtubeUrl: undefined,
                        youtubeId: undefined,
                        soundId: 'none',
                      }));
                      setShowSoundModal(false);
                    }}
                    onClearAudio={() => {
                      setFormData((prev) => ({
                        ...prev,
                        soundSource: 'none',
                        soundDataUrl: undefined,
                        soundTitle: undefined,
                      }));
                    }}
                  />
                </div>
              )}

              {/* TAB 4: AMBIENT SOUNDSCAPES */}
              {soundModalTab === 'ambient' && (
                <div className="space-y-2 pt-1">
                  <span className="text-xs font-bold text-stone-700 block">Atmospheric soundscapes</span>
                  <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {AMBIENT_SOUND_OPTIONS.filter((s) => s.id !== 'none').map((s) => {
                      const isSelected = formData.soundId === s.id && formData.soundSource === 'ambient';
                      const isTesting = testingSoundId === s.id;
                      return (
                        <div
                          key={s.id}
                          onClick={() => {
                            stopAmbientSound();
                            setFormData({
                              ...formData,
                              soundSource: 'ambient',
                              soundId: s.id as AmbientSoundId,
                              soundTitle: s.name,
                              soundDataUrl: undefined,
                              youtubeUrl: undefined,
                              youtubeId: undefined,
                            });
                            setShowSoundModal(false);
                          }}
                          className={`cursor-pointer p-2.5 rounded-xl border-2 transition-all flex flex-col justify-between ${
                            isSelected ? 'border-[#16A34A] bg-[#16A34A]/10 font-bold' : 'border-[#2D2D2D]/20 bg-white hover:border-[#2D2D2D]'
                          }`}
                        >
                          <span className="text-xs text-stone-800 line-clamp-1">{s.name}</span>
                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                            <span className="text-[10px] text-stone-400">Select</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTestSound(s.id as AmbientSoundId, s.name);
                              }}
                              className="p-1 rounded bg-stone-100 hover:bg-stone-200 text-stone-600"
                            >
                              {isTesting ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PHOTO MODAL (UPLOAD CUSTOM IMAGE OR PICK NOSTALGIC PRESET) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showPhotoModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowPhotoModal(false)}
          >
            <div
              className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#2D2D2D] shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <div>
                  <h3 className="font-bold text-base text-stone-900">Add Photos to the Can</h3>
                  <span className="text-xs text-stone-500 font-mono">
                    {(formData.photos?.length || 0)}/10 photos added
                  </span>
                </div>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {photoError && (
                <div className="bg-red-50 text-red-700 text-xs p-2.5 rounded-xl border border-red-200 font-medium">
                  {photoError}
                </div>
              )}

              {/* Upload custom images (multiple allowed) */}
              <label className="border-2 border-dashed border-[#2D2D2D]/40 hover:border-[#2D2D2D] rounded-2xl p-5 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white group">
                <Upload className="w-7 h-7 text-[#16A34A] mb-1.5 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold text-stone-800">
                  Upload photos from device / camera
                </span>
                <span className="text-[10px] text-stone-400 mt-0.5">
                  Select 1 or multiple photos (PNG, JPG, WebP) · Max 10 total
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleMultiplePhotosUpload}
                  className="hidden"
                  disabled={(formData.photos?.length || 0) >= 10}
                />
              </label>

              {/* Presets */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">Or choose from nostalgic presets</span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_PHOTOS.map((p) => {
                    const isAlreadyAdded = formData.photos?.some((ph) => ph.url === p.url);
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleAddPresetPhoto(p.url, p.label)}
                        className={`cursor-pointer aspect-square rounded-xl overflow-hidden border-2 transition-all relative group ${
                          isAlreadyAdded
                            ? 'border-[#16A34A] ring-2 ring-[#16A34A]/30'
                            : 'border-[#2D2D2D]/20 hover:border-[#2D2D2D]'
                        }`}
                      >
                        <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9px] text-white text-center truncate">
                          {p.label}
                        </div>
                        {isAlreadyAdded && (
                          <div className="absolute top-1 right-1 bg-[#16A34A] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                            ✓
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* SENDER SEALING RITUAL ANIMATION OVERLAY */}
      {/* ========================================================= */}
      {isSealingAnimation && sealedCanData && (
        <SealingOverlay
          can={sealedCanData}
          isOpen={isSealingAnimation}
          onComplete={handleSealingComplete}
        />
      )}

    </div>
  );
};
