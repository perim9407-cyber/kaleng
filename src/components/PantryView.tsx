import React, { useState } from 'react';
import { CanData } from '../types';
import { getPantryCans, deleteCanFromPantry, getShelfLifeStatus, CAN_THEMES } from '../utils/canData';
import { CylinderCan } from './CylinderCan';
import { 
  Package, 
  Trash2, 
  PlusCircle, 
  Sparkles, 
  Calendar,
  Share2
} from 'lucide-react';

interface PantryViewProps {
  onSelectCan: (can: CanData) => void;
  onMakeNew: () => void;
  onShareCan: (can: CanData) => void;
}

export const PantryView: React.FC<PantryViewProps> = ({
  onSelectCan,
  onMakeNew,
  onShareCan,
}) => {
  const [cans, setCans] = useState<CanData[]>(getPantryCans());

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteCanFromPantry(id);
    setCans(getPantryCans());
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#2D2D2D]/20">
        <div>
          <h2 className="font-serif text-3xl font-bold text-stone-900">
            Pantry Shelf ({cans.length})
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Your collection of sealed memories, ambient air, and letters kept safe.
          </p>
        </div>

        <button
          onClick={onMakeNew}
          className="px-5 py-2.5 bg-[#2D2D2D] hover:bg-black text-[#FAF7F2] text-xs sm:text-sm font-bold rounded-full shadow-sm transition-colors flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Can a New Letter</span>
        </button>
      </div>

      {cans.length === 0 ? (
        <div className="text-center py-16 bg-[#FAF7F2] rounded-3xl border-2 border-dashed border-[#2D2D2D]/30 p-8">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-3xl mb-4">
            🥫
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-800">Your Shelf is Empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-6">
            You haven't sealed any cans yet. Create one with ambient sound and your heartfelt message!
          </p>
          <button
            onClick={onMakeNew}
            className="px-6 py-3 bg-[#2D2D2D] text-[#FAF7F2] text-xs sm:text-sm font-bold rounded-full hover:bg-black transition-colors inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Make Your First Can</span>
          </button>
        </div>
      ) : (
        /* The Pantry Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cans.map((can) => {
            const theme = CAN_THEMES[can.themeId] || CAN_THEMES.apple;
            const shelfLife = getShelfLifeStatus(can.createdAt, can.shelfLifeDays);

            return (
              <div
                key={can.id}
                onClick={() => onSelectCan(can)}
                className="group cursor-pointer bg-[#FAF7F2] rounded-3xl border-2 border-[#2D2D2D] shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* Can graphic container */}
                <div className="relative pt-6 pb-2 flex items-center justify-center bg-[#ECE6DC]/60 border-b-2 border-[#2D2D2D]/15">
                  <CylinderCan
                    can={can}
                    isOpen={false}
                    interactive={false}
                    size="compact"
                  />
                </div>

                {/* Card Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 mb-1">
                      <span>"{can.title || 'for you'}"</span>
                      <span className="text-stone-500 font-mono text-[10px]">{shelfLife.statusText}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 font-handwriting text-base">
                      &ldquo;{can.message}&rdquo;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[11px] font-mono text-stone-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(can.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onShareCan(can);
                        }}
                        className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-full transition-colors"
                        title="Share this can"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={(e) => handleDelete(can.id, e)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Delete from pantry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <span className="ml-1 px-3 py-1 bg-[#2D2D2D] text-[#FAF7F2] text-[10px] font-bold rounded-full">
                        Open &rarr;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
