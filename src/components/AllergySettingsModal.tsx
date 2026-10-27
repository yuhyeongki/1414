import React from 'react';
import { X, ShieldAlert, Check } from 'lucide-react';
import { ALLERGEN_LIST } from '../constants/allergens';

interface AllergySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergies: number[];
  onToggleAllergy: (code: number) => void;
  onClearAll: () => void;
}

export const AllergySettingsModal: React.FC<AllergySettingsModalProps> = ({
  isOpen,
  onClose,
  selectedAllergies,
  onToggleAllergy,
  onClearAll,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-sky-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-sky-100 bg-sky-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-sky-950 font-cute">
                알레르기 안심 필터 설정
              </h3>
              <p className="text-xs text-sky-700/80">
                주의해야 할 식재료를 체크하면 식단표에서 즉시 강조해드려요.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected count info & Clear button */}
        <div className="px-5 py-3 bg-amber-50/60 border-b border-amber-100 flex items-center justify-between text-xs">
          <span className="font-bold text-amber-900">
            선택된 알레르기 식품: {selectedAllergies.length}개
          </span>
          {selectedAllergies.length > 0 && (
            <button
              onClick={onClearAll}
              className="text-amber-700 hover:text-amber-900 font-semibold underline"
            >
              모두 해제하기
            </button>
          )}
        </div>

        {/* Allergen List (19 items) */}
        <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {ALLERGEN_LIST.map((item) => {
            const isChecked = selectedAllergies.includes(item.code);
            return (
              <button
                key={item.code}
                onClick={() => onToggleAllergy(item.code)}
                type="button"
                className={`p-3 rounded-2xl border text-left flex items-center justify-between gap-2 transition-all duration-150 ${
                  isChecked
                    ? 'border-amber-400 bg-amber-50 shadow-xs ring-1 ring-amber-300'
                    : 'border-slate-100 bg-slate-50/50 hover:bg-white hover:border-sky-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl shrink-0">{item.emoji}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {item.shortName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      #{item.code}번
                    </span>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-lg flex items-center justify-center transition-colors ${
                    isChecked ? 'bg-amber-500 text-white' : 'border border-slate-200 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            * 나이스 표준 19개 알레르기 유발 물질 표시제 기준
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            확인
          </button>
        </div>

      </div>
    </div>
  );
};
