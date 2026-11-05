import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CanData } from '../types';
import { encodeCanToHash } from '../utils/canData';
import { 
  X, 
  Copy, 
  Check, 
  ExternalLink, 
  QrCode, 
  Send, 
  Share2, 
  Sparkles,
  Smartphone
} from 'lucide-react';

interface ShareModalProps {
  can: CanData;
  isOpen: boolean;
  onClose: () => void;
  onOpenAsRecipient: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  can,
  isOpen,
  onClose,
  onOpenAsRecipient,
}) => {
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);

  if (!isOpen) return null;

  const hash = encodeCanToHash(can);
  const shareUrl = `${window.location.origin}${window.location.pathname}#can=${hash}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🥫 I sealed a letter, a photo, and the air where I am into a tin can for you! Pull the tab to unseal: ${shareUrl}`
  )}`;

  const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
    `🥫 I sealed a canned letter for you! Pull the tab to unseal:`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `I packed a canned letter with memories & sound. Pull the tab to open: ${shareUrl}`
  )}`;

  // Quick reliable QR code image generator using SVG endpoint
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(
    shareUrl
  )}&bgcolor=fcfbf7&color=1c1917`;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.94, opacity: 0 }}
        className="relative w-full max-w-lg bg-[#FAF7F2] rounded-3xl shadow-2xl border-2 border-[#2D2D2D] overflow-hidden text-stone-900"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-stone-200 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-[#16A34A] uppercase tracking-wider mb-1 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Can Hermetically Sealed</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              Ready to Send "{can.title || 'for you'}"
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-5">
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Your heartfelt message, photo, and ambient sound note have been packed into the vintage tin. Send this link—they will get to pull the metal tab and peel the lid open!
          </p>

          {/* Shareable Link Box */}
          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-stone-500 mb-1.5">
              Canned Letter Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs font-mono text-stone-700 truncate shadow-xs focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="shrink-0 px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quick Share Buttons */}
          <div className="grid grid-cols-3 gap-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#25D366]/10 hover:bg-[#25D366]/20 text-[#128C7E] text-xs font-medium rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 border border-[#25D366]/20"
            >
              <span>WhatsApp</span>
            </a>
            <a
              href={telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2.5 px-3 bg-[#0088cc]/10 hover:bg-[#0088cc]/20 text-[#0088cc] text-xs font-medium rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 border border-[#0088cc]/20"
            >
              <span>Telegram</span>
            </a>
            <button
              onClick={() => setShowQr(!showQr)}
              className="py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg text-center transition-colors flex items-center justify-center gap-1.5 border border-stone-200"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{showQr ? 'Hide QR' : 'QR Code'}</span>
            </button>
          </div>

          {/* Optional QR Code Preview */}
          <AnimatePresence>
            {showQr && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex flex-col items-center p-4 bg-white rounded-xl border border-stone-200 text-center"
              >
                <img
                  src={qrImageUrl}
                  alt="QR Code"
                  className="w-40 h-40 object-contain rounded-md border border-stone-100"
                />
                <span className="text-[11px] font-mono text-stone-500 mt-2">
                  Scan with a phone camera to unseal
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Test Recipient View Action */}
          <div className="pt-2">
            <button
              onClick={() => {
                onClose();
                onOpenAsRecipient();
              }}
              className="w-full py-3 bg-[#FAF7F2] hover:bg-white text-stone-900 border-2 border-[#2D2D2D] rounded-full font-bold text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <ExternalLink className="w-4 h-4 text-emerald-700" />
              <span>Preview & Unseal this Can Right Now</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
          <span>Preserved in your Pantry shelf</span>
          <button
            onClick={onClose}
            className="text-stone-700 hover:underline font-medium"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
