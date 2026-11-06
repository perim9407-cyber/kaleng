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
  const theme = CAN_THEMES[can.themeId] || CAN_THEMES.apple;

  const handlePullTab = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!interactive || isOpen || isPulling) return;

    setIsPulling(true);
    // 1. First: Metallic lever tension click as finger lifts the ring tab
    playMetalClink();

    // 2. Realistic vacuum pop and scored lid peeling tear
    setTimeout(() => {
      playCanOpenPop();
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.45 },
          colors: ['#F59E0B', '#10B981', '#EF4444', '#3B82F6', '#EC4899', '#FCD34D'],
          scalar: 1.1,
        });
      } catch {
        // ignore
      }
      setIsPulling(false);
      onOpen?.();
    }, 280);
  };

  const handleTabHover = () => {
    if (interactive && !isOpen) {
      playMetalClink();
    }
  };

  const titleText = can.title || 'for you';

  const creationDateStr = new Date(can.createdAt || Date.now()).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      
      {/* Container holding the SVG illustration */}
      <div 
        className={`relative max-w-full mx-auto ${
          size === 'mini' 
            ? 'w-[68px] sm:w-[72px] h-[84px] sm:h-[88px]' 
            : size === 'compact' 
            ? 'w-[150px] sm:w-[180px] h-[190px] sm:h-[225px]' 
            : 'w-[225px] min-[380px]:w-[260px] sm:w-[290px] md:w-[320px] h-[280px] min-[380px]:h-[325px] sm:h-[365px] md:h-[400px]'
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
          {/* 4. THEME ILLUSTRATION ON CAN LABEL (8 DISTINCT THEMES) */}
          {/* ========================================================= */}
          
          {/* THEME 1: APPLE */}
          {can.themeId === 'apple' && (
            <g id="apple-illustration">
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

          {/* THEME 2: TOMATOES */}
          {can.themeId === 'tomatoes' && (
            <g id="tomatoes-illustration">
              <g transform="translate(108, 198)">
                <ellipse cx="22" cy="24" rx="20" ry="18" fill="#EF4444" stroke="#2D2D2D" strokeWidth="2.5" />
                <path d="M 22 6 L 22 2" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 14 8 L 22 10 L 30 8" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
                <circle cx="14" cy="18" r="3" fill="white" opacity="0.9" />
              </g>
              <g transform="translate(138, 190)">
                <ellipse cx="26" cy="28" rx="24" ry="22" fill="#DC2626" stroke="#2D2D2D" strokeWidth="3" />
                <path d="M 26 6 L 26 0" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 16 9 L 26 12 L 36 9" fill="none" stroke="#22C55E" strokeWidth="2.5" strokeLinecap="round" />
                <ellipse cx="17" cy="20" rx="4" ry="7" transform="rotate(-20 17 20)" fill="white" opacity="0.9" />
              </g>
              <g transform="translate(178, 202)">
                <ellipse cx="18" cy="20" rx="18" ry="16" fill="#EF4444" stroke="#2D2D2D" strokeWidth="2.5" />
                <path d="M 18 4 L 18 1" stroke="#2D2D2D" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 12 6 L 18 8 L 24 6" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
                <circle cx="24" cy="15" r="2.5" fill="white" opacity="0.9" />
              </g>
            </g>
          )}

          {/* THEME 3: TUNA */}
          {can.themeId === 'tuna' && (
            <g id="tuna-illustration" transform="translate(100, 192)">
              <path
                d="M 10 24 Q 40 4 80 18 L 105 4 L 98 24 L 106 42 L 80 28 Q 40 40 10 24 Z"
                fill="#38BDF8"
                stroke="#2D2D2D"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              <path d="M 24 24 Q 50 36 78 28 L 80 26 Q 45 28 24 24 Z" fill="#F8FAFC" stroke="#2D2D2D" strokeWidth="1.5" />
              <circle cx="24" cy="18" r="3.5" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
              <circle cx="23" cy="18" r="1.5" fill="#2D2D2D" />
              <g transform="translate(74, 20) rotate(-10)">
                <ellipse cx="16" cy="8" rx="14" ry="7" fill="#EF4444" stroke="#2D2D2D" strokeWidth="1.5" />
                <text x="16" y="11" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="sans-serif">TUNA</text>
              </g>
            </g>
          )}

          {/* THEME 4: SWEET PEACHES */}
          {can.themeId === 'peaches' && (
            <g id="peaches-illustration" transform="translate(125, 185)">
              {/* Peach Leaf */}
              <path d="M 34 8 Q 50 -6 60 2 Q 54 14 34 8" fill="#15803D" stroke="#2D2D2D" strokeWidth="2" />
              {/* Left Peach half */}
              <ellipse cx="24" cy="36" rx="20" ry="22" fill="#FB923C" stroke="#2D2D2D" strokeWidth="2.5" />
              {/* Right sliced peach half */}
              <ellipse cx="46" cy="38" rx="20" ry="22" fill="#FDBA74" stroke="#2D2D2D" strokeWidth="2.5" />
              {/* Peach pit */}
              <ellipse cx="46" cy="38" rx="7" ry="10" fill="#9A3412" stroke="#2D2D2D" strokeWidth="1.5" />
              {/* White highlight curve */}
              <path d="M 12 30 Q 14 46 22 52" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          )}

          {/* THEME 5: WILD STRAWBERRY */}
          {can.themeId === 'strawberry' && (
            <g id="strawberry-illustration" transform="translate(120, 186)">
              {/* White flower left */}
              <g transform="translate(4, 18)">
                <circle cx="0" cy="0" r="5" fill="white" stroke="#2D2D2D" strokeWidth="1.5" />
                <circle cx="0" cy="0" r="2.5" fill="#FACC15" />
              </g>
              {/* Strawberry body */}
              <g transform="translate(35, 12)">
                <path
                  d="M 2 8 C 8 2, 28 2, 34 8 C 38 24, 26 48, 18 52 C 10 48, -2 24, 2 8 Z"
                  fill="#E11D48"
                  stroke="#2D2D2D"
                  strokeWidth="2.5"
                />
                {/* Green Calyx Leaf */}
                <path d="M 18 8 L 8 0 L 14 6 L 18 0 L 22 6 L 28 0 L 18 8 Z" fill="#22C55E" stroke="#2D2D2D" strokeWidth="1.5" />
                {/* Yellow seeds */}
                <circle cx="12" cy="18" r="1" fill="#FEF08A" />
                <circle cx="24" cy="18" r="1" fill="#FEF08A" />
                <circle cx="18" cy="26" r="1" fill="#FEF08A" />
                <circle cx="12" cy="34" r="1" fill="#FEF08A" />
                <circle cx="24" cy="34" r="1" fill="#FEF08A" />
                <circle cx="18" cy="42" r="1" fill="#FEF08A" />
              </g>
            </g>
          )}

          {/* THEME 6: MORNING COFFEE */}
          {can.themeId === 'coffee' && (
            <g id="coffee-illustration" transform="translate(126, 184)">
              {/* Cup handle */}
              <path d="M 54 26 C 68 26, 68 46, 54 46" fill="none" stroke="#2D2D2D" strokeWidth="3" strokeLinecap="round" />
              {/* Cup body */}
              <path
                d="M 12 16 L 16 48 C 16 56, 52 56, 52 48 L 56 16 Z"
                fill="#FAF8F5"
                stroke="#2D2D2D"
                strokeWidth="2.5"
              />
              {/* Saucer */}
              <ellipse cx="34" cy="56" rx="30" ry="6" fill="#E2E8F0" stroke="#2D2D2D" strokeWidth="2.5" />
              {/* Coffee liquid & Latte Heart */}
              <ellipse cx="34" cy="16" rx="22" ry="7" fill="#78350F" stroke="#2D2D2D" strokeWidth="1.5" />
              <path d="M 34 14 C 32 11, 28 11, 28 14 C 28 17, 34 20, 34 20 C 34 20, 40 17, 40 14 C 40 11, 36 11, 34 14 Z" fill="#FEF3C7" />
              {/* Steam swirl */}
              <path d="M 28 8 Q 32 2 30 -4" fill="none" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" />
              <path d="M 38 8 Q 42 2 40 -4" fill="none" stroke="#FAF8F5" strokeWidth="2" strokeLinecap="round" />
            </g>
          )}

          {/* THEME 7: MIDNIGHT STAR */}
          {can.themeId === 'midnight' && (
            <g id="midnight-illustration" transform="translate(126, 184)">
              {/* Golden Crescent Moon */}
              <path
                d="M 28 4 C 14 16, 14 44, 28 56 C 18 52, 10 38, 10 30 C 10 18, 18 8, 28 4 Z"
                fill="#FDE047"
                stroke="#2D2D2D"
                strokeWidth="2.5"
              />
              {/* Big Twinkle Star */}
              <g transform="translate(48, 22)">
                <path d="M 0 -12 L 3 -3 L 12 0 L 3 3 L 0 12 L -3 3 L -12 0 L -3 -3 Z" fill="#FDE047" stroke="#2D2D2D" strokeWidth="1.5" />
              </g>
              {/* Small stars */}
              <circle cx="48" cy="48" r="2.5" fill="#FFFFFF" />
              <circle cx="62" cy="12" r="2" fill="#FFFFFF" />
              <circle cx="16" cy="10" r="1.5" fill="#FFFFFF" />
            </g>
          )}

          {/* THEME 8: SARDINES */}
          {can.themeId === 'sardines' && (
            <g id="sardines-illustration" transform="translate(110, 186)">
              {/* Olive sprig */}
              <path d="M 8 40 Q 20 20 40 12" fill="none" stroke="#84CC16" strokeWidth="2.5" />
              <ellipse cx="18" cy="30" rx="4" ry="2.5" fill="#84CC16" />
              <ellipse cx="30" cy="20" rx="4" ry="2.5" fill="#84CC16" />
              {/* Sardine 1 */}
              <path
                d="M 20 26 Q 50 14 86 24 L 98 16 L 94 28 L 98 38 L 86 32 Q 50 36 20 26 Z"
                fill="#CBD5E1"
                stroke="#2D2D2D"
                strokeWidth="2"
              />
              <circle cx="28" cy="24" r="2" fill="#2D2D2D" />
              {/* Sardine 2 */}
              <path
                d="M 12 40 Q 45 28 80 38 L 92 30 L 88 42 L 92 52 L 80 46 Q 45 50 12 40 Z"
                fill="#94A3B8"
                stroke="#2D2D2D"
                strokeWidth="2"
              />
              <circle cx="20" cy="38" r="2" fill="#2D2D2D" />
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
              className={interactive ? "cursor-pointer group" : ""}
              onClick={interactive ? onLetterClick : undefined}
            >
              {/* Card body sticking out of the can slot matching image.png */}
              <g transform="translate(202, 94)">
                <motion.g
                  initial={{ y: 90, opacity: 0, rotate: 0 }}
                  animate={{ y: -74, opacity: 1, rotate: 5 }}
                  transition={{
                    type: 'spring',
                    stiffness: 180,
                    damping: 15,
                    delay: 0.08,
                  }}
                >
                  {/* Clean white stationery card with outline */}
                  <rect
                    x="-35"
                    y="-56"
                    width="70"
                    height="115"
                    rx="5"
                    fill="#FAF8F5"
                    stroke="#2D2D2D"
                    strokeWidth="3"
                    className="transition-transform group-hover:scale-105"
                  />
                  {/* 3 Clean Ruled Lines matching image.png */}
                  <line x1="-20" y1="-32" x2="18" y2="-32" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="-20" y1="-20" x2="18" y2="-20" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1="-20" y1="-8" x2="6" y2="-8" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
                </motion.g>
              </g>

              {/* Click to read badge tooltip (only for recipient interactive view) */}
              {interactive && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  transform="translate(225, 25)"
                >
                  <rect x="0" y="0" width="85" height="22" rx="11" fill="#1E293B" />
                  <text x="42.5" y="15" textAnchor="middle" fill="#FDE047" fontSize="10" fontWeight="bold" fontFamily="sans-serif">
                    Click to read!
                  </text>
                </motion.g>
              )}
            </g>
          )}

          {/* FRONT RIM LIP OVERLAY (Tucks the letter card inside the hole matching image.png) */}
          {isOpen && (
            <g pointerEvents="none">
              <path
                d="M 50 96 A 110 38 0 0 0 270 96 L 262 96 A 102 33 0 0 1 58 96 Z"
                fill="url(#metalRimGrad)"
                stroke="#2D2D2D"
                strokeWidth="2"
              />
              <path
                d="M 50 96 A 110 38 0 0 0 270 96"
                fill="none"
                stroke="#2D2D2D"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M 58 96 A 102 33 0 0 0 262 96"
                fill="none"
                stroke="#2D2D2D"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* ========================================================= */}
          {/* 8. METAL LID (ONLY VISIBLE WHEN SEALED - NO LID WHEN OPEN) */}
          {/* ========================================================= */}
          {!isOpen && (
            /* SEALED METAL LID WITH CREATION DATE & PULL TAB */
            <motion.g
              id="sealed-metal-lid"
              animate={
                isPulling
                  ? {
                      y: [-2, -28, -65],
                      scaleY: [1, 0.65, 0.2],
                      rotateX: [0, -45, -100],
                      opacity: [1, 0.85, 0],
                    }
                  : {
                      y: 0,
                      scaleY: 1,
                      rotateX: 0,
                      opacity: 1,
                    }
              }
              transition={{ duration: 0.35, ease: 'easeIn' }}
              style={{ transformOrigin: '160px 68px' }}
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

              {/* AUTHENTIC CREATION DATE STAMPED DIRECTLY ON TOP OF LID */}
              <g id="lid-stamped-date">
                {/* Creation Date */}
                <text
                  x="160"
                  y="82"
                  textAnchor="middle"
                  fill="#334155"
                  fontFamily="'Courier Prime', monospace, sans-serif"
                  fontSize="9.5"
                  fontWeight="bold"
                  letterSpacing="1.5"
                  opacity="0.9"
                >
                  PKG: {creationDateStr}
                </text>
                {/* Expiry & Lot info */}
                <text
                  x="160"
                  y="114"
                  textAnchor="middle"
                  fill="#64748B"
                  fontFamily="'Courier Prime', monospace, sans-serif"
                  fontSize="8"
                  fontWeight="bold"
                  letterSpacing="1"
                  opacity="0.8"
                >
                  BEST BY 10 DAYS · LOT #{can.id.slice(-4).toUpperCase()}
                </text>
              </g>

              {/* The Metal Pull-Ring Tab */}
              <g
                transform="translate(142, 70)"
                className={interactive ? 'cursor-pointer group' : ''}
                onClick={handlePullTab}
                onMouseEnter={handleTabHover}
              >
                {/* Pull tab shadow */}
                <ellipse cx="18" cy="28" rx="18" ry="12" fill="#000000" opacity="0.25" />

                {/* Pull tab body with animated spring tension */}
                <motion.g
                  whileHover={interactive ? { scale: 1.16, rotate: -4 } : {}}
                  whileTap={interactive ? { scale: 0.9, y: 4 } : {}}
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
    </div>
  );
};
