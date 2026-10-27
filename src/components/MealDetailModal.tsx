import React from 'react';
import { X, Flame, Apple, Sparkles, MapPin } from 'lucide-react';
import { ParsedMeal } from '../types/neis';

interface MealDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  meal?: ParsedMeal;
  schoolName: string;
}

export const MealDetailModal: React.FC<MealDetailModalProps> = ({
  isOpen,
  onClose,
  meal,
  schoolName,
}) => {
  if (!isOpen || !meal) return null;

  // Calorie calculations
  const calVal = meal.calorieValue || 800;
  const walkMinutes = Math.round(calVal / 4);
  const bikeMinutes = Math.round(calVal / 8);
  const soccerMinutes = Math.round(calVal / 9);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-sky-100 overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-sky-100 bg-sky-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs text-xl">
              🥗
            </div>
            <div>
              <h3 className="text-lg font-bold text-sky-950 font-cute">
                영양 성분 & 원산지 정보
              </h3>
              <p className="text-xs text-sky-700/80">
                {schoolName} · {meal.formattedDate} {meal.mealName}
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

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-6">
          
          {/* Calorie & Activity Burn Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>총 섭취 칼로리</span>
              </span>
              <span className="text-lg font-black text-amber-900 font-mono">
                {meal.calories}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-amber-200/60">
              <div className="p-2 bg-white/70 rounded-xl">
                <p className="text-[10px] text-slate-500 font-medium">산책/걷기 🚶</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{walkMinutes}분</p>
              </div>
              <div className="p-2 bg-white/70 rounded-xl">
                <p className="text-[10px] text-slate-500 font-medium">자전거 🚲</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{bikeMinutes}분</p>
              </div>
              <div className="p-2 bg-white/70 rounded-xl">
                <p className="text-[10px] text-slate-500 font-medium">축구/달리기 ⚽</p>
                <p className="text-xs font-extrabold text-slate-800 mt-0.5">{soccerMinutes}분</p>
              </div>
            </div>
          </div>

          {/* Nutritional Breakdown */}
          <div>
            <h4 className="text-xs font-bold text-sky-950 mb-3 flex items-center gap-1.5">
              <Apple className="w-4 h-4 text-sky-600" />
              <span>주요 영양소 함량</span>
            </h4>

            {meal.nutrients.length === 0 ? (
              <p className="text-xs text-slate-400">등록된 상세 영양 정보가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {meal.nutrients.map((nut, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center justify-between"
                  >
                    <span className="text-xs text-slate-600 font-medium truncate">
                      {nut.name}
                    </span>
                    <span className="text-xs font-extrabold text-sky-900 font-mono ml-2">
                      {nut.amount}
                      {nut.unit ? ` ${nut.unit}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ingredient Origins (원산지 정보) */}
          <div>
            <h4 className="text-xs font-bold text-sky-950 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>식재료 원산지 정보</span>
            </h4>

            {meal.origins.length === 0 ? (
              <p className="text-xs text-slate-400">등록된 원산지 정보가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {meal.origins.map((orig, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-slate-800">{orig.name}</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold text-[11px] border border-emerald-200">
                      {orig.origin}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Safe Food Note */}
          <div className="p-3 rounded-2xl bg-sky-50 text-sky-800 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
            <span>
              학교급식은 교육부 및 식품의약품안전처 안전 위생 기준을 엄격히 준수하여 제공됩니다.
            </span>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:scale-95 rounded-xl shadow-xs transition-all"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
