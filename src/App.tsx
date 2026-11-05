import React, { useState, useEffect } from 'react';
import { CanData } from './types';
import { DEFAULT_CAN_DATA, decodeCanFromHash, getPantryCans } from './utils/canData';
import { CanCreator } from './components/CanCreator';
import { CanUnsealView } from './components/CanUnsealView';
import { PantryView } from './components/PantryView';
import { ShareModal } from './components/ShareModal';
import { 
  Package, 
  Sparkles, 
  PenTool, 
  Heart, 
  HelpCircle, 
  X, 
  Layers,
  Volume2,
  Calendar,
  Share2
} from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'create' | 'unseal' | 'pantry'>('create');
  const [activeCan, setActiveCan] = useState<CanData>(DEFAULT_CAN_DATA);
  const [shareModalCan, setShareModalCan] = useState<CanData | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState<boolean>(false);

  // Parse URL hash on mount or hashchange
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash && (hash.includes('can=') || hash.length > 20)) {
        const decoded = decodeCanFromHash(hash);
        if (decoded) {
          setActiveCan(decoded);
          setCurrentView('unseal');
        }
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleCanSealed = (can: CanData) => {
    setActiveCan(can);
    setShareModalCan(can);
  };

  const handleSelectPantryCan = (can: CanData) => {
    setActiveCan(can);
    setCurrentView('unseal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#D9E5D6] text-stone-900 font-sans-clean">
      
      {/* Top Bar following Top Bar Contract (3 Zones) */}
      <header className="sticky top-0 z-40 bg-[#D9E5D6]/90 backdrop-blur-md border-b border-[#2D2D2D]/15">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => setCurrentView('create')}
            className="flex items-center gap-2 text-left group cursor-pointer"
          >
            <span className="text-xl">🥫</span>
            <span className="text-lg font-bold font-serif tracking-tight text-stone-900 group-hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0">
              Canned Letter
            </span>
          </button>

          {/* Zone 2: Clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-bold text-stone-700">
            <button
              onClick={() => setCurrentView('create')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                currentView === 'create' ? 'border-[#2D2D2D] text-stone-950 font-black' : 'border-transparent text-stone-600'
              }`}
            >
              Can a Letter
            </button>
            <button
              onClick={() => setCurrentView('unseal')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                currentView === 'unseal' ? 'border-[#2D2D2D] text-stone-950 font-black' : 'border-transparent text-stone-600'
              }`}
            >
              Unseal Can
            </button>
            <button
              onClick={() => setCurrentView('pantry')}
              className={`hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
                currentView === 'pantry' ? 'border-[#2D2D2D] text-stone-950 font-black' : 'border-transparent text-stone-600'
              }`}
            >
              My Pantry Shelf
            </button>
            <button
              onClick={() => setShowHowItWorks(true)}
              className="hover:text-stone-900 transition-colors whitespace-nowrap shrink-0 text-stone-600 cursor-pointer"
            >
              How It Works
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            {currentView !== 'create' ? (
              <button
                onClick={() => setCurrentView('create')}
                className="px-4 py-2 text-xs font-bold text-[#FAF7F2] bg-[#2D2D2D] hover:bg-black rounded-full shadow-sm transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-yellow-300" />
                <span>New Can</span>
              </button>
            ) : (
              <button
                onClick={() => setShowHowItWorks(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-stone-800 hover:text-black bg-[#FAF7F2] hover:bg-white border-2 border-[#2D2D2D] rounded-full shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-stone-600" />
                <span>Guide</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-[#2D2D2D]/15 bg-[#D9E5D6]/95 py-2 px-3 text-xs font-bold text-stone-700">
          <button
            onClick={() => setCurrentView('create')}
            className={`px-3 py-1 rounded-full ${currentView === 'create' ? 'text-black bg-[#FAF7F2] border border-[#2D2D2D]' : ''}`}
          >
            Create
          </button>
          <button
            onClick={() => setCurrentView('unseal')}
            className={`px-3 py-1 rounded-full ${currentView === 'unseal' ? 'text-black bg-[#FAF7F2] border border-[#2D2D2D]' : ''}`}
          >
            Unseal
          </button>
          <button
            onClick={() => setCurrentView('pantry')}
            className={`px-3 py-1 rounded-full ${currentView === 'pantry' ? 'text-black bg-[#FAF7F2] border border-[#2D2D2D]' : ''}`}
          >
            Pantry
          </button>
          <button
            onClick={() => setShowHowItWorks(true)}
            className="px-2 py-1 text-stone-600"
          >
            Guide
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'create' && (
          <CanCreator
            initialCan={activeCan}
            onCanSealed={handleCanSealed}
          />
        )}

        {currentView === 'unseal' && (
          <CanUnsealView
            can={activeCan}
            onMakeOwn={() => setCurrentView('create')}
            onShare={() => setShareModalCan(activeCan)}
          />
        )}

        {currentView === 'pantry' && (
          <PantryView
            onSelectCan={handleSelectPantryCan}
            onMakeNew={() => setCurrentView('create')}
            onShareCan={(can) => setShareModalCan(can)}
          />
        )}
      </main>

      {/* Share Modal */}
      {shareModalCan && (
        <ShareModal
          can={shareModalCan}
          isOpen={true}
          onClose={() => setShareModalCan(null)}
          onOpenAsRecipient={() => {
            setActiveCan(shareModalCan);
            setCurrentView('unseal');
          }}
        />
      )}

      {/* "How It Works" Modal */}
      {showHowItWorks && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowHowItWorks(false)}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF8F5] rounded-2xl p-6 sm:p-8 shadow-2xl border border-stone-300 text-stone-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <h3 className="font-serif text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>🥫</span>
                <span>The Art of Canned Letters</span>
              </h3>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
              <p>
                Inspired by viral digital stationery trends and European canned delicacies, <strong>Canned Letter</strong> reimagines how we send messages across distances.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h5 className="font-semibold text-stone-800">Choose your tin</h5>
                    <p className="text-stone-500 text-xs">Pick from vintage Lisbon Sardines, Atlantic Mackerel, French Yellow Peaches, or Cat Tuna tins.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h5 className="font-semibold text-stone-800">Pack your contents</h5>
                    <p className="text-stone-500 text-xs">Write a heartfelt note, choose a vintage postal seal, and enclose a Polaroid photo snapshot.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h5 className="font-semibold text-stone-800">Seal the air where you are</h5>
                    <p className="text-stone-500 text-xs">Capture 10 seconds of ambient audio (ocean waves, summer rain, cafe hum, or your real voice recording).</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 font-mono text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    4
                  </span>
                  <div>
                    <h5 className="font-semibold text-stone-800">Pull-tab unsealing ritual</h5>
                    <p className="text-stone-500 text-xs">When your recipient opens the link, they pull the metal tab. A metallic pop sounds, the lid peels back, and your memories spill out.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setShowHowItWorks(false)}
                className="px-4 py-2 bg-stone-900 text-white rounded-lg text-xs font-medium hover:bg-stone-800"
              >
                Start Canning
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-stone-200/90 py-6 px-4 bg-[#F5F2EB] text-center text-xs font-mono text-stone-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🥫 Canned Letter</span>
            <span aria-hidden="true">·</span>
            <span>Hermetically Sealed with Affection</span>
          </div>
          <div className="flex items-center gap-4 text-stone-400">
            <span>No signup required</span>
            <span aria-hidden="true">·</span>
            <span>Preserved in your browser</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
