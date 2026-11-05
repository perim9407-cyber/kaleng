import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CanData } from '../types';
import { CAN_THEMES } from '../utils/canData';
import { 
  playCanSealingSound, 
  playStampSound, 
  playCartoonChime,
  playMetalClink 
} from '../utils/audio';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface SealingOverlayProps {
  can: CanData;
  isOpen: boolean;
  onComplete: () => void;
}

export const SealingOverlay: React.FC<SealingOverlayProps> = ({
  can,
  isOpen,
  onComplete,
}) => {
  // Stages:
  // 0: Letter and photos slide down into the open can cavity (0 - 900ms)
  // 1: Metal lid lowers onto the inner rim lip with a metallic snap (900ms - 1900ms)
  // 2: Rotary crimping roller seals the rim 360° with vacuum lock (1900ms - 2800ms)
  // 3: Hot-ink stamp presses creation date on the lid (2800ms - 3600ms)
  // 4: Airtight sealed complete! (3600ms - 4300ms)
  const [stage, setStage] = useState<number>(0);

  const creationDateStr = new Date(can.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  const theme = CAN_THEMES[can.themeId] || CAN_THEMES.apple;
  const titleText = can.title || 'for you';

  useEffect(() => {
    if (!isOpen) {
      setStage(0);
      return;
    }

    // Stage 0: Initial paper slide sound
    playMetalClink();

    // Stage 1: Metal lid descends and lands (at 900ms)
    const t1 = setTimeout(() => {
      setStage(1);
      playMetalClink();
    }, 900);

    // Stage 2: Mechanical seamer rotary crimp & vacuum sound (at 1900ms)
    const t2 = setTimeout(() => {
      setStage(2);
      playCanSealingSound();
    }, 1900);

    // Stage 3: Date stamp thump impact (at 2800ms)
    const t3 = setTimeout(() => {
      setStage(3);
      playStampSound();
    }, 2800);

    // Stage 4: Celebration (at 3600ms)
    const t4 = setTimeout(() => {
      setStage(4);
      playCartoonChime();
      try {
        confetti({
          particleCount: 55,
          spread: 75,
          origin: { y: 0.45 },
          colors: ['#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#FCD34D'],
          scalar: 1.05,
        });
      } catch {
        // ignore
      }
    }, 3600);

    // Auto-advance to Share Modal (at 4500ms)
    const t5 = setTimeout(() => {
      onComplete();
    }, 4500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl border-3 border-[#2D2D2D] p-6 sm:p-8 flex flex-col items-center shadow-2xl text-stone-900 overflow-hidden"
      >
        {/* Subtle background machinery grid pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />

        {/* Realistic Status Header */}
        <div className="mb-4">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border-2 border-[#2D2D2D] shadow-xs text-xs font-bold text-stone-800">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-ping" />
            <span>
              {stage === 0 && '📥 Menyelipkan surat ke dalam rongga kaleng...'}
              {stage === 1 && '⚙️ Menempatkan tutup metal ke bibir kaleng...'}
              {stage === 2 && '🔒 Merapatkan bibir kaleng kedap udara (Seaming)...'}
              {stage === 3 && '🏷️ Menstempel tanggal pembuatan di atas tutup...'}
              {stage === 4 && '✨ Kaleng kedap udara! Siap dikirim!'}
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* CENTER STAGE: THE EXACT REALISTIC CYLINDER CAN (IMAGE C787) */}
        {/* ========================================================= */}
        <div className="relative w-[300px] sm:w-[320px] h-[360px] sm:h-[390px] flex items-center justify-center overflow-visible my-2">
          <svg
            viewBox="0 0 320 400"
            className="w-full h-full overflow-visible drop-shadow-[0_14px_28px_rgba(0,0,0,0.14)]"
          >
            <defs>
              <linearGradient id="sealMetalRim" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C4C8D6" />
                <stop offset="25%" stopColor="#E2E5EE" />
                <stop offset="50%" stopColor="#FFFFFF" />
                <stop offset="75%" stopColor="#D4D8E4" />
                <stop offset="100%" stopColor="#B3B8C8" />
              </linearGradient>

              <linearGradient id="sealMetalBase" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#B8BDCB" />
                <stop offset="35%" stopColor="#D7DBE6" />
                <stop offset="65%" stopColor="#E8ECF5" />
                <stop offset="100%" stopColor="#A8ADC0" />
              </linearGradient>

              <radialGradient id="sealInsideDark" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2E303A" />
                <stop offset="70%" stopColor="#3F414D" />
                <stop offset="100%" stopColor="#202127" />
              </radialGradient>

              <linearGradient id="sealTabGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F8FAFC" />
                <stop offset="40%" stopColor="#CBD5E1" />
                <stop offset="100%" stopColor="#94A3B8" />
              </linearGradient>

              {/* Clip path for the interior dark opening so the letter descends inside it */}
              <clipPath id="canOpeningClip">
                <rect x="0" y="-120" width="320" height="216" />
              </clipPath>
            </defs>

            {/* 1. BOTTOM BASE RIM */}
            <path
              d="M 50 290 A 110 38 0 0 0 270 290 L 270 306 A 110 38 0 0 1 50 306 Z"
              fill="url(#sealMetalBase)"
              stroke="#2D2D2D"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <path
              d="M 50 306 A 110 38 0 0 0 270 306"
              fill="none"
              stroke="#2D2D2D"
              strokeWidth="3"
            />

            {/* 2. CYLINDER BODY WITH WRAPPER LABEL */}
            <path
              d="M 50 96 L 50 290 A 110 38 0 0 0 270 290 L 270 96 A 110 38 0 0 1 50 96 Z"
              fill={theme.labelColor}
              stroke="#2D2D2D"
              strokeWidth="3"
              strokeLinejoin="round"
            />
            {/* Shading Highlights */}
            <path
              d="M 50 96 L 50 290 A 110 38 0 0 0 95 322 L 95 128 A 110 38 0 0 1 50 96 Z"
              fill="white"
              opacity="0.12"
              pointerEvents="none"
            />
            <path
              d="M 235 128 L 235 322 A 110 38 0 0 0 270 290 L 270 96 A 110 38 0 0 1 235 128 Z"
              fill="black"
              opacity="0.15"
              pointerEvents="none"
            />

            {/* 3. CENTRAL STRIPE BANNER */}
            <path
              d="M 50 178 L 50 216 A 110 38 0 0 0 270 216 L 270 178 A 110 38 0 0 1 50 178 Z"
              fill={theme.stripeColor}
              stroke="#2D2D2D"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />

            {/* 4. THEME ILLUSTRATION ON CAN LABEL */}
            {can.themeId === 'apple' && (
              <g id="seal-apple-illustration">
                <g stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 64 210 Q 75 204 88 206" fill="none" stroke="#E68A5E" strokeWidth="2.5" />
                  <ellipse cx="68" cy="204" rx="4" ry="2.5" transform="rotate(-25 68 204)" fill="#E68A5E" />
                  <ellipse cx="78" cy="198" rx="4" ry="2.5" transform="rotate(-35 78 198)" fill="#E68A5E" />
                  <ellipse cx="75" cy="214" rx="3.5" ry="2" transform="rotate(20 75 214)" fill="#E68A5E" />
                </g>
                <g stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 232 245 Q 242 235 250 220" fill="none" stroke="#22C55E" strokeWidth="2.5" />
                  <ellipse cx="236" cy="235" rx="5" ry="2.5" transform="rotate(-40 236 235)" fill="#22C55E" />
                  <ellipse cx="246" cy="224" rx="5" ry="2.5" transform="rotate(-50 246 224)" fill="#22C55E" />
                </g>
                <g transform="translate(122, 182)">
                  <path d="M 38 8 Q 38 -4 34 -8" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 38 -2 Q 46 -8 44 -2 Q 40 4 38 -2" fill="#22C55E" stroke="#2D2D2D" strokeWidth="1.5" />
                  <path
                    d="M 38 6 C 22 2, 0 16, 2 40 C 4 60, 20 74, 38 72 C 56 74, 72 60, 74 40 C 76 16, 54 2, 38 6 Z"
                    fill="#EE4444"
                    stroke="#2D2D2D"
                    strokeWidth="3"
                    strokeLinejoin="round"
                  />
                  <path d="M 12 28 C 8 36, 12 52, 22 58 C 21 54, 18 42, 18 32 C 18 28, 16 26, 12 28 Z" fill="white" opacity="0.95" />
                </g>
              </g>
            )}

            {/* DYNAMIC TITLE PRINTED ON FRONT OF THE CAN */}
            <text
              x="160"
              y="166"
              textAnchor="middle"
              fill="#FAF7F2"
              fontFamily="'Caveat', cursive, sans-serif"
              fontSize="26"
              fontWeight="bold"
              stroke="#2D2D2D"
              strokeWidth="1.2"
              className="tracking-wide select-none"
            >
              {titleText}
            </text>

            {/* 5. TOP METAL RIM BASE & DARK OPENING */}
            <ellipse
              cx="160"
              cy="96"
              rx="110"
              ry="38"
              fill="url(#sealMetalRim)"
              stroke="#2D2D2D"
              strokeWidth="3.5"
            />
            <ellipse
              cx="160"
              cy="96"
              rx="102"
              ry="33"
              fill="none"
              stroke="#2D2D2D"
              strokeWidth="2"
            />
            {/* The Dark Interior Cavity */}
            <ellipse
              cx="160"
              cy="96"
              rx="98"
              ry="31"
              fill="url(#sealInsideDark)"
            />

            {/* ========================================================= */}
            {/* 6. REALISTIC ANIMATION: LETTER SLIDING DOWN INTO CAN (STAGE 0) */}
            {/* ========================================================= */}
            <g transform="translate(160, 96)" clipPath="url(#canOpeningClip)">
              <motion.g
                initial={{ y: -80, opacity: 1, rotate: 5 }}
                animate={
                  stage >= 1
                    ? { y: 110, opacity: 0, rotate: 2 }
                    : { y: -80, opacity: 1, rotate: 5 }
                }
                transition={{
                  duration: 0.85,
                  ease: [0.4, 0, 0.2, 1],
                }}
              >
                {/* Polaroid stack backing if photos exist */}
                {can.photos && can.photos.length > 0 && (
                  <rect
                    x="-34"
                    y="-50"
                    width="74"
                    height="108"
                    rx="5"
                    fill="#FFFFFF"
                    stroke="#2D2D2D"
                    strokeWidth="2.5"
                    transform="rotate(6)"
                  />
                )}
                {/* Clean white stationery card with 3 ruled lines */}
                <rect
                  x="-38"
                  y="-55"
                  width="76"
                  height="115"
                  rx="5"
                  fill="#FAF8F5"
                  stroke="#2D2D2D"
                  strokeWidth="3"
                />
                <line x1="-22" y1="-32" x2="20" y2="-32" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-22" y1="-20" x2="20" y2="-20" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
                <line x1="-22" y1="-8" x2="8" y2="-8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
              </motion.g>
            </g>

            {/* Front lip rim overlay so letter realistically slides behind front rim lip */}
            <path
              d="M 50 96 A 110 38 0 0 0 270 96"
              fill="none"
              stroke="#2D2D2D"
              strokeWidth="3.5"
            />

            {/* ========================================================= */}
            {/* 7. REALISTIC ANIMATION: METAL LID DESCENDING (STAGE 1+) */}
            {/* ========================================================= */}
            <AnimatePresence>
              {stage >= 1 && (
                <motion.g
                  key="descending-lid"
                  initial={{ y: -120, opacity: 0, scale: 0.96 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  transition={{
                    type: 'spring',
                    stiffness: 240,
                    damping: 20,
                  }}
                  style={{ transformOrigin: '160px 96px' }}
                >
                  {/* Outer Lid disc */}
                  <ellipse
                    cx="160"
                    cy="96"
                    rx="98"
                    ry="31"
                    fill="#C8CBD6"
                    stroke="#2D2D2D"
                    strokeWidth="2.5"
                  />

                  {/* Scored ring etched into the metal lid */}
                  <ellipse
                    cx="160"
                    cy="96"
                    rx="85"
                    ry="26"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.8"
                    strokeDasharray="4,2"
                  />

                  {/* ROTARY SEAMING BEAM (STAGE 2) */}
                  {stage === 2 && (
                    <motion.ellipse
                      cx="160"
                      cy="96"
                      rx="97"
                      ry="30.5"
                      fill="none"
                      stroke="#FACC15"
                      strokeWidth="3"
                      initial={{ pathLength: 0, opacity: 0.8 }}
                      animate={{ pathLength: 1, opacity: [0.8, 1, 0.4] }}
                      transition={{ duration: 0.8, ease: 'easeInOut' }}
                    />
                  )}

                  {/* STAMPED CREATION DATE (STAGE 3+) */}
                  {stage >= 3 && (
                    <motion.g
                      initial={{ scale: 1.4, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      {/* Date Stamp Text */}
                      <text
                        x="160"
                        y="82"
                        textAnchor="middle"
                        fill="#334155"
                        fontFamily="'Courier Prime', monospace, sans-serif"
                        fontSize="9.5"
                        fontWeight="bold"
                        letterSpacing="1.5"
                      >
                        PKG: {creationDateStr}
                      </text>
                      <text
                        x="160"
                        y="114"
                        textAnchor="middle"
                        fill="#64748B"
                        fontFamily="'Courier Prime', monospace, sans-serif"
                        fontSize="8"
                        fontWeight="bold"
                        letterSpacing="1"
                      >
                        BEST BY 10 DAYS · LOT #{can.id.slice(-4).toUpperCase()}
                      </text>
                    </motion.g>
                  )}

                  {/* THE PULL-TAB RING ATTACHED (STAGE 2+) */}
                  {stage >= 2 && (
                    <motion.g
                      transform="translate(142, 70)"
                      initial={{ scale: 0, y: -10 }}
                      animate={{ scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                    >
                      <ellipse cx="18" cy="28" rx="18" ry="12" fill="#000000" opacity="0.25" />
                      <path
                        d="M 6 12 C 6 4, 30 4, 30 12 L 34 36 C 34 46, 2 46, 2 36 Z"
                        fill="url(#sealTabGrad)"
                        stroke="#2D2D2D"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <ellipse cx="18" cy="34" rx="9" ry="7" fill="#475569" stroke="#2D2D2D" strokeWidth="2" />
                      <circle cx="18" cy="14" r="5" fill="#E2E8F0" stroke="#2D2D2D" strokeWidth="2" />
                      <circle cx="18" cy="14" r="2" fill="#2D2D2D" />
                    </motion.g>
                  )}

                </motion.g>
              )}
            </AnimatePresence>

            {/* Hermetic Seal Sheen Gleam (Stage 4) */}
            {stage >= 4 && (
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.8 }}
                pointerEvents="none"
              >
                <ellipse cx="160" cy="96" rx="98" ry="31" fill="white" opacity="0.4" />
              </motion.g>
            )}

          </svg>
        </div>

        {/* Informational Stamp Banner */}
        <div className="w-full bg-white border-2 border-[#2D2D2D] rounded-2xl p-3 mt-1 flex items-center justify-between text-xs font-mono">
          <div>
            <span className="text-[10px] text-stone-500 uppercase block">Tanggal Pada Tutup</span>
            <span className="font-bold text-stone-800">PKG: {creationDateStr}</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-stone-500 uppercase block">Status Kaleng</span>
            <span className="font-bold text-[#16A34A]">
              {stage < 4 ? 'Sedang Dipres Rapat...' : 'Hermetically Sealed ✓'}
            </span>
          </div>
        </div>

        {/* Action Skip / Next Button */}
        <div className="mt-4 w-full flex items-center justify-between">
          <span className="text-[11px] font-mono text-stone-500">
            {stage < 4 ? 'Menyegel kenangan...' : 'Kaleng siap! Membuka link berbagi...'}
          </span>
          <button
            onClick={onComplete}
            className="px-5 py-2.5 bg-[#2D2D2D] hover:bg-black text-[#FAF7F2] font-bold text-xs rounded-full shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Lanjut Berbagi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
