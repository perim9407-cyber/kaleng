import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { CanData, CanThemeId } from '../types';
import { CAN_THEMES } from '../utils/canData';
import { playCanOpenPop, playMetalClink, playCartoonBoing } from '../utils/audio';

interface CylinderCanProps {
  can: CanData;
  isOpen?: boolean;
  onOpen?: () => void;
  interactive?: boolean;
  onLetterClick?: () => void;
  className?: string;
  size?: 'normal' | 'compact' | 'mini';
}

export const CylinderCan: React.FC<CylinderCanProps> = ({
  can,
  isOpen = false,
  onOpen,
  interactive = true,
  onLetterClick,
  className = '',
  size = 'normal',
}) => {
  const [isPulling, setIsPulling] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const theme = CAN_THEMES[can.themeId] || CAN_THEMES.apple;

  const handlePullTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive || isOpen || isPulling) return;

    setIsPulling(true);
    playCartoonBoing();

    setTimeout(() => {
      playCanOpenPop();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#fcd34d'],
          scalar: 1.1,
        });
      } catch {
        // ignore
      }
      setIsPulling(false);
      onOpen?.();
    }, 240);
  };

  const handleTabHover = () => {
    if (interactive && !isOpen) {
      playMetalClink();
    }
  };

  const titleText = can.title || 'for you';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Container holding the SVG illustration */}
      <div 
        className={`relative ${
          size === 'mini' 
            ? 'w-[72px] h-[86px]' 
            : size === 'compact' 
            ? 'w-[180px] h-[220px]' 
            : 'w-[280px] sm:w-[320px] h-[350px] sm:h-[400px]'
        }`}
      >
        <svg
          viewBox="0 0 320 400"
          className="w-full h-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)]"
        >
          {/* DEFINITIONS FOR GRADIENTS AND MASKS */}
          <defs>
            {/* Metal rim gradient */}
            <linearGradient id="metalRimGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C4C8D6" />
              <stop offset="25%" stopColor="#E2E5EE" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#D4D8E4" />
              <stop offset="100%" stopColor="#B3B8C8" />
            </linearGradient>

            {/* Metal base gradient */}
            <linearGradient id="metalBaseGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#B8BDCB" />
              <stop offset="35%" stopColor="#D7DBE6" />
              <stop offset="65%" stopColor="#E8ECF5" />
              <stop offset="100%" stopColor="#A8ADC0" />
            </linearGradient>

            {/* Can interior shadow */}
            <radialGradient id="canInsideDark" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#2E303A" />
              <stop offset="70%" stopColor="#3F414D" />
              <stop offset="100%" stopColor="#202127" />
            </radialGradient>

            {/* Pull tab metal gradient */}
            <linearGradient id="pullTabGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F8FAFC" />
              <stop offset="40%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
          </defs>

          {/* ========================================================= */}
          {/* 1. BOTTOM BASE RIM */}
          {/* ========================================================= */}
          <path
            d="M 50 290 
               A 110 38 0 0 0 270 290 
               L 270 306 
               A 110 38 0 0 1 50 306 
               Z"
            fill="url(#metalBaseGrad)"
            stroke="#2D2D2D"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          {/* Base bottom outline */}
          <path
            d="M 50 306 A 110 38 0 0 0 270 306"
            fill="none"
            stroke="#2D2D2D"
            strokeWidth="3"
          />

          {/* ========================================================= */}
          {/* 2. CYLINDER BODY WITH WRAPPER LABEL */}
          {/* ========================================================= */}
          {/* Main Body Background */}
          <path
            d="M 50 96 
               L 50 290 
               A 110 38 0 0 0 270 290 
               L 270 96 
               A 110 38 0 0 1 50 96 
               Z"
            fill={theme.labelColor}
            stroke="#2D2D2D"
            strokeWidth="3"
            strokeLinejoin="round"
          />

          {/* Label Highlight & Shading overlay */}
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

          {/* ========================================================= */}
          {/* 3. CENTRAL STRIPE BANNER */}
          {/* ========================================================= */}
          <path
            d="M 50 178 
               L 50 216 
               A 110 38 0 0 0 270 216 
               L 270 178 
               A 110 38 0 0 1 50 178 
               Z"
            fill={theme.stripeColor}
            stroke="#2D2D2D"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* ========================================================= */}
          {/* 4. THEME ILLUSTRATION ON CAN LABEL */}
          {/* ========================================================= */}
          {can.themeId === 'apple' && (
            <g id="apple-illustration">
              {/* Botanical twig left */}
              <g stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 64 210 Q 75 204 88 206" fill="none" stroke="#E68A5E" strokeWidth="2.5" />
                <ellipse cx="68" cy="204" rx="4" ry="2.5" transform="rotate(-25 68 204)" fill="#E68A5E" />
                <ellipse cx="78" cy="198" rx="4" ry="2.5" transform="rotate(-35 78 198)" fill="#E68A5E" />
                <ellipse cx="75" cy="214" rx="3.5" ry="2" transform="rotate(20 75 214)" fill="#E68A5E" />
              </g>

              {/* Botanical sprig right */}
              <g stroke="#2D2D2D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 232 245 Q 242 235 250 220" fill="none" stroke="#22C55E" strokeWidth="2.5" />
                <ellipse cx="236" cy="235" rx="5" ry="2.5" transform="rotate(-40 236 235)" fill="#22C55E" />
                <ellipse cx="246" cy="224" rx="5" ry="2.5" transform="rotate(-50 246 224)" fill="#22C55E" />
              </g>

              {/* Central Ripe Red Apple */}
              <g transform="translate(122, 182)">
                {/* Stem */}
                <path d="M 38 8 Q 38 -4 34 -8" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
                {/* Tiny leaf on stem */}
                <path d="M 38 -2 Q 46 -8 44 -2 Q 40 4 38 -2" fill="#22C55E" stroke="#2D2D2D" strokeWidth="1.5" />
                {/* Apple body with clefts */}
                <path
                  d="M 38 6 
                     C 22 2, 0 16, 2 40 
                     C 4 60, 20 74, 38 72 
                     C 56 74, 72 60, 74 40 
                     C 76 16, 54 2, 38 6 
                     Z"
                  fill="#EE4444"
                  stroke="#2D2D2D"
                  strokeWidth="3"
                  strokeLinejoin="round"
                />
                {/* Glossy White Reflection Curve */}
                <path
                  d="M 12 28 C 8 36, 12 52, 22 58 C 21 54, 18 42, 18 32 C 18 28, 16 26, 12 28 Z"
                  fill="white"
                  opacity="0.95"
                />
              </g>
            </g>
          )}

          {can.themeId === 'tomatoes' && (
            <g id="tomatoes-illustration">
              {/* Tomato 1 (Left) */}
              <g transform="translate(108, 198)">
                <ellipse cx="22" cy="24" rx="20" ry="18" fill="#EF4444" stroke="#2D2D2D" strokeWidth="2.5" />
                <path d="M 22 6 L 22 2" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 14 8 L 22 10 L 30 8" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="18" r="3" fill="white" opacity="0.9" />
              </g>

              {/* Tomato 2 (Center large) */}
              <g transform="translate(138, 190)">
                <ellipse cx="26" cy="28" rx="24" ry="22" fill="#DC2626" stroke="#2D2D2D" strokeWidth="3" />
                <path d="M 26 6 L 26 0" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 16 9 L 26 12 L 36 9" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="17" cy="20" rx="4" ry="7" transform="rotate(-20 17 20)" fill="white" opacity="0.9" />
              </g>

              {/* Tomato 3 (Right) */}
              <g transform="translate(178, 202)">
                <ellipse cx="18" cy="20" rx="18" ry="16" fill="#EF4444" stroke="#2D2D2D" strokeWidth="2.5" />
                <path d="M 18 4 L 18 1" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 12 6 L 18 8 L 24 6" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="15" r="2.5" fill="white" opacity="0.9" />
              </g>
            </g>
          )}

          {can.themeId === 'tuna' && (
            <g id="tuna-illustration" transform="translate(100, 192)">
              {/* Tuna fish body */}
              <path
                d="M 10 24 
                   Q 40 4 80 18 
                   L 105 4 
                   L 98 24 
                   L 106 42 
                   L 80 28 
                   Q 40 40 10 24 
                   Z"
                fill="#38BDF8"
                stroke="#2D2D2D"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Fish belly */}
              <path
                d="M 24 24 Q 50 36 78 28 L 80 26 Q 45 28 24 24 Z"
                fill="#F8FAFC"
                stroke="#2D2D2D"
                strokeWidth="1.5"
              />
              {/* Eye */}
              <circle cx="24" cy="18" r="3.5" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
              <circle cx="23" cy="18" r="1.5" fill="#2D2D2D" />
              {/* Tuna red stamp oval */}
              <g transform="translate(74, 20) rotate(-10)">
                <ellipse cx="16" cy="8" rx="14" ry="7" fill="#EF4444" stroke="#2D2D2D" strokeWidth="1.5" />
                <text x="16" y="11" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">
                  TUNA
                </text>
              </g>
            </g>
          )}

          {/* ========================================================= */}
          {/* 5. DYNAMIC TITLE PRINTED ON FRONT OF THE CAN */}
          {/* ========================================================= */}
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

          {/* ========================================================= */}
          {/* 6. TOP METAL RIM & OPEN/SEALED TOP */}
          {/* ========================================================= */}
          {/* Outer Top Metal Rim Lip */}
          <ellipse
            cx="160"
            cy="96"
            rx="110"
            ry="38"
            fill="url(#metalRimGrad)"
            stroke="#2D2D2D"
            strokeWidth="3.5"
          />

          {/* Inner Rim Lip */}
          <ellipse
            cx="160"
            cy="96"
            rx="102"
            ry="33"
            fill="none"
            stroke="#2D2D2D"
            strokeWidth="2"
          />

          {/* INSIDE OF THE CAN (Visible when opened) */}
          <ellipse
            cx="160"
            cy="96"
            rx="98"
            ry="31"
            fill="url(#canInsideDark)"
          />

          {/* ========================================================= */}
          {/* 7. THE LETTER CARD STICKING OUT (WHEN OPENED) */}
          {/* ========================================================= */}
          {isOpen && (
            <g
              id="letter-card-slot"
              className="cursor-pointer group"
              onClick={onLetterClick}
            >
              {/* Card body sticking out of the can slot */}
              <g transform="translate(160, 96)">
                <motion.g
                  initial={{ y: 90, opacity: 0, rotate: 0 }}
                  animate={{ y: -80, opacity: 1, rotate: 8 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 14,
                    delay: 0.1,
                  }}
                >
                  {/* White card with outline */}
                  <rect
                    x="-40"
                    y="-45"
                    width="78"
                    height="100"
                    rx="5"
                    fill="#FAF8F5"
                    stroke="#2D2D2D"
                    strokeWidth="3"
                    className="transition-transform group-hover:scale-105"
                  />
                  {/* Simulated letter lines */}
                  <line x1="-24" y1="-20" x2="18" y2="-20" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-24" y1="-8" x2="22" y2="-8" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-24" y1="4" x2="10" y2="4" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />
                  <line x1="-24" y1="16" x2="18" y2="16" stroke="#CBD5E1" strokeWidth="3" strokeLinecap="round" />

                  {/* Stamp on corner of paper */}
                  <rect x="14" y="-40" width="16" height="18" fill="#FEE2E2" stroke="#EF4444" strokeWidth="1" strokeDasharray="2,2" rx="1" />
                  <text x="22" y="-28" textAnchor="middle" fontSize="10">💌</text>
                </motion.g>
              </g>

              {/* Click to read badge tooltip */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                transform="translate(195, 30)"
              >
                <rect x="0" y="0" width="85" height="22" rx="11" fill="#1E293B" />
                <text x="42.5" y="15" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                  Click to read!
                </text>
              </motion.g>
            </g>
          )}

          {/* ========================================================= */}
          {/* 8. SEALED METAL LID WITH PULL TAB (WHEN SEALED) */}
          {/* ========================================================= */}
          {!isOpen && (
            <motion.g
              id="sealed-metal-lid"
              animate={
                isPulling
                  ? {
                      y: [-2, -25, -60],
                      scaleY: [1, 0.7, 0.2],
                      opacity: [1, 0.8, 0],
                    }
                  : {
                      y: 0,
                      scaleY: 1,
                      opacity: 1,
                    }
              }
              transition={{ duration: 0.35, ease: 'easeIn' }}
            >
              {/* Metallic Stamped Lid surface */}
              <ellipse
                cx="160"
                cy="96"
                rx="98"
                ry="31"
                fill="#C8CBD6"
                stroke="#2D2D2D"
                strokeWidth="2.5"
              />

              {/* Concentric scored ring for peeling */}
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

              {/* The Metal Pull-Ring Tab */}
              <g
                transform="translate(142, 72)"
                className={interactive ? 'cursor-pointer group' : ''}
                onClick={handlePullTab}
                onMouseEnter={handleTabHover}
              >
                {/* Pull tab shadow */}
                <ellipse cx="18" cy="28" rx="18" ry="12" fill="#000000" opacity="0.25" />

                {/* Pull tab body */}
                <motion.g
                  whileHover={interactive ? { scale: 1.15, rotate: -4 } : {}}
                  whileTap={interactive ? { scale: 0.9, y: 3 } : {}}
                >
                  <path
                    d="M 6 12 
                       C 6 4, 30 4, 30 12 
                       L 34 36 
                       C 34 46, 2 46, 2 36 
                       Z"
                    fill="url(#pullTabGrad)"
                    stroke="#2D2D2D"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Finger loop hole */}
                  <ellipse cx="18" cy="34" rx="9" ry="7" fill="#475569" stroke="#2D2D2D" strokeWidth="2" />

                  {/* Attachment rivet */}
                  <circle cx="18" cy="14" r="5" fill="#E2E8F0" stroke="#2D2D2D" strokeWidth="2" />
                  <circle cx="18" cy="14" r="2" fill="#2D2D2D" />

                  {/* Pull Tab Hint badge */}
                  {interactive && (
                    <motion.g
                      animate={{
                        y: [0, -3, 0],
                      }}
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
                      transform="translate(38, 12)"
                    >
                      <rect x="0" y="0" width="56" height="20" rx="10" fill="#FACC15" stroke="#2D2D2D" strokeWidth="1.5" />
                      <text x="28" y="14" textAnchor="middle" fill="#1C1917" fontSize="9" fontWeight="bold" fontFamily="sans-serif">
                        PULL TAB
                      </text>
                    </motion.g>
                  )}
                </motion.g>
              </g>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Button to open below can if interactive and sealed */}
      {!isOpen && interactive && (
        <motion.button
          onClick={handlePullTab}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="mt-4 px-6 py-2.5 bg-[#FAF7F2] hover:bg-white text-stone-900 border-2 border-[#2D2D2D] rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>🥫 Pull to Open Can</span>
        </motion.button>
      )}
    </div>
  );
};
