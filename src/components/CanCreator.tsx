import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CanData, CanThemeId, AmbientSoundId } from '../types';
import { CAN_THEMES, PRESET_PHOTOS, AMBIENT_SOUND_OPTIONS, saveCanToPantry } from '../utils/canData';
import { CylinderCan } from './CylinderCan';
import { AudioRecorder } from './AudioRecorder';
import { playAmbientSound, stopAmbientSound, playCartoonBoing } from '../utils/audio';
import { 
  Plus, 
  Volume2, 
  VolumeX, 
  Upload, 
  X, 
  Check, 
  Camera, 
  Play, 
  Pause,
  Sparkles
} from 'lucide-react';

interface CanCreatorProps {
  initialCan?: CanData;
  onCanSealed: (can: CanData) => void;
}

export const CanCreator: React.FC<CanCreatorProps> = ({ initialCan, onCanSealed }) => {
  const [formData, setFormData] = useState<CanData>(
    initialCan || {
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
      soundId: 'none',
      soundTitle: '',
      createdAt: Date.now(),
      shelfLifeDays: 10,
      location: '',
    }
  );

  // Modals for Sound & Photo Pickers
  const [showSoundModal, setShowSoundModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [testingSoundId, setTestingSoundId] = useState<string | null>(null);

  const handleTestSound = (soundId: AmbientSoundId, soundTitle: string) => {
    if (testingSoundId === soundId) {
      stopAmbientSound();
      setTestingSoundId(null);
    } else {
      setTestingSoundId(soundId);
      playAmbientSound(soundId, formData.soundDataUrl, () => setTestingSoundId(null));
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;
        if (width > height && width > MAX_SIZE) {
          height = (height * MAX_SIZE) / width;
          width = MAX_SIZE;
        } else if (height > MAX_SIZE) {
          width = (width * MAX_SIZE) / height;
          height = MAX_SIZE;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormData((prev) => ({ ...prev, photoUrl: dataUrl }));
        setShowPhotoModal(false);
      };
    };
    reader.readAsDataURL(file);
  };

  const handleSealCan = (e: React.FormEvent) => {
    e.preventDefault();
    stopAmbientSound();
    playCartoonBoing();

    const finalizedCan: CanData = {
      ...formData,
      title: formData.title.trim() || 'for you',
      from: formData.from.trim() || 'someone',
      message: formData.message.trim() || 'Sealed with quiet thoughts and fondest memories.',
      createdAt: Date.now(),
    };

    saveCanToPantry(finalizedCan);
    setTimeout(() => {
      onCanSealed(finalizedCan);
    }, 200);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: THE REALISTIC CAN (MATCHING USER SCREENSHOT) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center lg:sticky lg:top-24 pt-4 sm:pt-10">
          <CylinderCan
            can={formData}
            isOpen={true} // In creator mode, shows the letter card peeking out just like the reference screenshot!
            interactive={false}
            size="normal"
          />
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: THE FORM CONTROLS (MATCHING USER SCREENSHOT) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6">
          <form onSubmit={handleSealCan} className="space-y-6">
            
            {/* 1. PICK A CAN */}
            <div>
              <label className="block text-sm font-bold text-stone-800 mb-2">
                Pick a can
              </label>
              <div className="flex items-center gap-3">
                {(['tuna', 'tomatoes', 'apple'] as CanThemeId[]).map((tId) => {
                  const isSelected = formData.themeId === tId;
                  return (
                    <div
                      key={tId}
                      onClick={() => setFormData({ ...formData, themeId: tId })}
                      className={`cursor-pointer w-24 h-28 rounded-2xl p-2 flex flex-col items-center justify-center transition-all bg-[#FAF7F2] ${
                        isSelected
                          ? 'border-[2.5px] border-[#2D2D2D] shadow-md scale-105'
                          : 'border-2 border-[#2D2D2D]/30 hover:border-[#2D2D2D]/60 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <CylinderCan
                        can={{ ...formData, themeId: tId, title: '' }}
                        isOpen={false}
                        interactive={false}
                        size="mini"
                      />
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

            {/* 3. SOUND (10s of the air where you are · optional) */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-700 mb-1.5">
                <span className="font-bold">Sound</span>
                <span className="text-stone-500">10s of the air where you are · optional</span>
              </div>
              
              {formData.soundId && formData.soundId !== 'none' ? (
                <div className="flex items-center justify-between bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-full py-2.5 px-4 shadow-xs">
                  <div className="flex items-center gap-2 truncate text-xs font-bold text-stone-800">
                    <span className="w-6 h-6 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs">
                      ♫
                    </span>
                    <span className="truncate">{formData.soundTitle || 'Custom Audio'}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleTestSound(formData.soundId, formData.soundTitle || '')}
                      className="p-1 text-stone-600 hover:text-stone-900"
                    >
                      {testingSoundId ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        stopAmbientSound();
                        setFormData({ ...formData, soundId: 'none', soundTitle: '', soundDataUrl: undefined });
                      }}
                      className="p-1 text-stone-400 hover:text-red-600"
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
                className="w-full bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-2xl p-4 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B9356] shadow-xs resize-y"
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
                className="w-full bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-full py-3 px-5 text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B9356] shadow-xs"
              />
            </div>

            {/* 6. PHOTO (up to 1) */}
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-700 mb-1.5">
                <span className="font-bold">Photo</span>
                <span className="text-stone-500">up to 1</span>
              </div>

              {formData.photoUrl ? (
                <div className="flex items-center justify-between bg-[#FAF7F2] border-2 border-[#2D2D2D] rounded-2xl p-3 shadow-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={formData.photoUrl}
                      alt="Enclosed snapshot"
                      className="w-12 h-12 rounded-lg object-cover border border-stone-300"
                    />
                    <div>
                      <span className="text-xs font-bold text-stone-800 block">Photo attached</span>
                      <input
                        type="text"
                        placeholder="Add handwritten caption..."
                        value={formData.photoCaption || ''}
                        onChange={(e) => setFormData({ ...formData, photoCaption: e.target.value })}
                        className="text-xs text-stone-600 bg-transparent border-b border-stone-300 focus:outline-none focus:border-stone-800 py-0.5"
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: '', photoCaption: '' })}
                    className="p-1.5 text-stone-400 hover:text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPhotoModal(true)}
                  className="w-full bg-[#FAF7F2] hover:bg-white border-2 border-[#2D2D2D] rounded-full py-2.5 px-4 text-xs font-bold text-stone-800 flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-[#16A34A] text-white flex items-center justify-center text-xs font-bold">
                    +
                  </span>
                  <span>Add a photo</span>
                </button>
              )}
            </div>

            {/* SUBMIT BUTTON: SEAL THE CAN */}
            <div className="pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-3.5 px-6 bg-[#2D2D2D] hover:bg-black text-[#FAF7F2] font-bold text-base rounded-full shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                <span>Seal the can</span>
              </motion.button>
            </div>

          </form>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SOUND MODAL (RECORD VOICE OR PICK AMBIENT ATMOSPHERE) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showSoundModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowSoundModal(false)}
          >
            <div
              className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#2D2D2D] shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-bold text-base text-stone-900">Add a sound</h3>
                <button
                  onClick={() => {
                    stopAmbientSound();
                    setShowSoundModal(false);
                  }}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Option A: Voice Recording */}
              <AudioRecorder
                existingAudioUrl={formData.soundDataUrl}
                onAudioRecorded={(dataUrl) => {
                  setFormData((prev) => ({
                    ...prev,
                    soundId: 'custom_voice',
                    soundDataUrl: dataUrl,
                    soundTitle: 'Voice Note',
                  }));
                  setShowSoundModal(false);
                }}
                onClearAudio={() => {
                  setFormData((prev) => ({
                    ...prev,
                    soundId: 'none',
                    soundDataUrl: undefined,
                    soundTitle: undefined,
                  }));
                }}
              />

              {/* Option B: Ambient Soundscapes */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-700 block">Or pick ambient atmosphere</span>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                  {AMBIENT_SOUND_OPTIONS.filter((s) => s.id !== 'custom_voice' && s.id !== 'none').map((s) => {
                    const isSelected = formData.soundId === s.id;
                    const isTesting = testingSoundId === s.id;
                    return (
                      <div
                        key={s.id}
                        onClick={() => {
                          stopAmbientSound();
                          setFormData({
                            ...formData,
                            soundId: s.id as AmbientSoundId,
                            soundTitle: s.name,
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
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* PHOTO MODAL (UPLOAD OR PRESETS) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showPhotoModal && (
          <div
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
            onClick={() => setShowPhotoModal(false)}
          >
            <div
              className="relative w-full max-w-md bg-[#FAF7F2] rounded-3xl p-6 border-2 border-[#2D2D2D] shadow-2xl space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h3 className="font-bold text-base text-stone-900">Add a photo</h3>
                <button
                  onClick={() => setShowPhotoModal(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Upload custom */}
              <label className="border-2 border-dashed border-[#2D2D2D]/40 hover:border-[#2D2D2D] rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white">
                <Upload className="w-6 h-6 text-stone-500 mb-1" />
                <span className="text-xs font-bold text-stone-800">Upload from device</span>
                <span className="text-[10px] text-stone-400">PNG, JPG, WebP</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {/* Presets */}
              <div>
                <span className="text-xs font-bold text-stone-700 block mb-2">Or choose a preset</span>
                <div className="grid grid-cols-3 gap-2">
                  {PRESET_PHOTOS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setFormData({ ...formData, photoUrl: p.url });
                        setShowPhotoModal(false);
                      }}
                      className="cursor-pointer aspect-square rounded-xl overflow-hidden border-2 border-[#2D2D2D]/20 hover:border-[#2D2D2D] relative group"
                    >
                      <img src={p.url} alt={p.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[9px] text-white text-center truncate">
                        {p.label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
