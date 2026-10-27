import React from 'react';
import { ChevronLeft, ChevronRight, Calendar, Flame, AlertTriangle } from 'lucide-react';
import { ParsedMeal } from '../types/neis';

interface WeeklyMealViewProps {
  meals: ParsedMeal[];
  currentDateStr: string;
  selectedMealCode: '1' | '2' | '3';
  onChangeMealCode: (code: '1' | '2' | '3') => void;
  onSelectDate: (dateStr: string) => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  weekRangeText: string;
  isLoading: boolean;
  myAllergies: number[];
}

export const WeeklyMealView: React.FC<WeeklyMealViewProps> = ({
  meals,
  currentDateStr,
  selectedMealCode,
  onChangeMealCode,
  onSelectDate,
  onPrevWeek,
  onNextWeek,
  weekRangeText,
  isLoading,
}) => {
  const mealNameLabel =
    selectedMealCode === '1' ? '조식' : selectedMealCode === '3' ? '석식' : '중식';

  // Group meals by date
  const filteredMeals = meals.filter((m) => m.mealCode === selectedMealCode);

  return (
    <div className="w-full">
      {/* Week Header */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-sky-100 mb-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevWeek}
            className="p-2 rounded-xl text-sky-800 hover:bg-sky-100 active:scale-95 transition-all"
            title="이전 주"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 rounded-xl">
            <Calendar className="w-4 h-4 text-sky-600" />
            <span className="font-extrabold text-sky-950 text-sm sm:text-base">
              {weekRangeText}
            </span>
          </div>

          <button
            onClick={onNextWeek}
            className="p-2 rounded-xl text-sky-800 hover:bg-sky-100 active:scale-95 transition-all"
            title="다음 주"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Meal Type filter */}
        <div className="flex items-center gap-1 p-1 bg-sky-100/70 rounded-xl">
          {[
            { code: '1' as const, label: '아침(조식)' },
            { code: '2' as const, label: '점심(중식)' },
            { code: '3' as const, label: '저녁(석식)' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => onChangeMealCode(item.code)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                selectedMealCode === item.code
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-sky-800 hover:bg-sky-200/60'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

      </div>

      {/* Week Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {[1, 2, 3, 4, 5].map((idx) => (
            <div
              key={idx}
              className="bg-white/60 animate-pulse rounded-2xl p-4 h-64 border border-sky-100 flex flex-col justify-between"
            >
              <div className="h-5 bg-sky-200/60 rounded w-20 mb-3" />
              <div className="space-y-2">
                <div className="h-4 bg-sky-100 rounded w-full" />
                <div className="h-4 bg-sky-100 rounded w-3/4" />
                <div className="h-4 bg-sky-100 rounded w-5/6" />
                <div className="h-4 bg-sky-100 rounded w-2/3" />
              </div>
              <div className="h-4 bg-sky-200/40 rounded w-16 mt-4" />
            </div>
          ))}
        </div>
      ) : filteredMeals.length === 0 ? (
        <div className="bg-white/90 rounded-3xl p-12 text-center border border-sky-100 shadow-sm">
          <p className="text-4xl mb-2">🏖️</p>
          <h4 className="text-lg font-bold text-sky-950 font-cute">
            해당 주간에는 등록된 {mealNameLabel} 식단이 없어요
          </h4>
          <p className="text-xs text-sky-700/80 mt-1">
            방학 중이거나 학사 일정으로 인해 급식이 없는 기간일 수 있습니다.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {filteredMeals.map((mealItem) => {
            const isToday = mealItem.dateStr === currentDateStr;
            const hasAllergyWarning = mealItem.dishes.some((d) => d.hasMyAllergy);

            return (
              <div
                key={mealItem.dateStr}
                onClick={() => onSelectDate(mealItem.dateStr)}
                className={`bg-white rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between border relative group hover:-translate-y-1 hover:shadow-md ${
                  isToday
                    ? 'border-2 border-sky-500 shadow-md ring-2 ring-sky-300/40 bg-sky-50/40'
                    : 'border-sky-100 hover:border-sky-300'
                }`}
              >
                {/* Today badge */}
                {isToday && (
                  <span className="absolute -top-2.5 right-3 bg-sky-500 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    오늘의 급식 ⭐
                  </span>
                )}

                {/* Day Header */}
                <div>
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-sky-100">
                    <div>
                      <span className="text-xs text-slate-500 font-medium">
                        {mealItem.dateStr.slice(4, 6)}월 {mealItem.dateStr.slice(6, 8)}일
                      </span>
                      <h4 className="text-base font-extrabold text-sky-950">
                        {mealItem.dayOfWeek}
                      </h4>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                      {mealItem.mealName}
                    </span>
                  </div>

                  {/* Dishes list */}
                  <ul className="space-y-1.5 my-3 text-xs">
                    {mealItem.dishes.map((dish, dIdx) => (
                      <li
                        key={dIdx}
                        className={`leading-tight flex items-start gap-1 ${
                          dish.hasMyAllergy
                            ? 'font-bold text-rose-600 bg-rose-50 px-1 py-0.5 rounded'
                            : dish.isMainMeat
                            ? 'font-bold text-slate-900'
                            : 'text-slate-700'
                        }`}
                      >
                        <span className="text-sky-400 shrink-0">•</span>
                        <span className="line-clamp-1">{dish.cleanName}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Footer strip: calories & warning */}
                <div className="pt-2 border-t border-sky-50 mt-2 flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1 font-bold text-amber-700">
                    <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{mealItem.calories.split(' ')[0]} kcal</span>
                  </span>

                  {hasAllergyWarning && (
                    <span
                      className="flex items-center gap-0.5 text-rose-600 font-bold"
                      title="내 알레르기 식품 포함"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      <span>주의</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
