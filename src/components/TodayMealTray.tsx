import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Share2,
  Check,
  Flame,
  Info,
  AlertTriangle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ParsedMeal, ParsedDish, SchoolInfo } from '../types/neis';
import { MascotGeupsik } from './MascotGeupsik';
import { ALLERGEN_MAP } from '../constants/allergens';

interface TodayMealTrayProps {
  school: SchoolInfo;
  meal?: ParsedMeal;
  availableMeals: ParsedMeal[];
  currentDateStr: string;
  selectedMealCode: '1' | '2' | '3';
  onChangeMealCode: (code: '1' | '2' | '3') => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  onSelectToday: () => void;
  onOpenDatePicker: () => void;
  onOpenNutritionModal: () => void;
  onOpenAllergyModal: () => void;
  isLoading: boolean;
  myAllergies: number[];
  onJumpToWeekday?: (offset: number) => void;
}

export const TodayMealTray: React.FC<TodayMealTrayProps> = ({
  school,
  meal,
  availableMeals,
  currentDateStr,
  selectedMealCode,
  onChangeMealCode,
  onPrevDay,
  onNextDay,
  onSelectToday,
  onOpenDatePicker,
  onOpenNutritionModal,
  onOpenAllergyModal,
  isLoading,
  myAllergies,
  onJumpToWeekday,
}) => {
  const [copied, setCopied] = useState(false);

  // Group dishes intelligently into lunch tray compartments
  const dishes = meal?.dishes || [];

  // Categorize for 5 tray slots
  const riceDish = dishes.find((d) => d.isRice) || dishes[0];
  const soupDish = dishes.find((d) => d.isSoup) || (dishes[1] !== riceDish ? dishes[1] : undefined);
  const mainDish = dishes.find((d) => d.isMainMeat && d !== riceDish && d !== soupDish) ||
    dishes.find((d) => d !== riceDish && d !== soupDish);
  const remainingDishes = dishes.filter(
    (d) => d !== riceDish && d !== soupDish && d !== mainDish
  );
  const sideDish1 = remainingDishes[0];
  const dessertOrKimchi = remainingDishes.slice(1);

  // Copy meal text to clipboard
  const handleCopyMeal = async () => {
    if (!meal) return;
    const dishListText = meal.dishes.map((d) => `• ${d.cleanName}`).join('\n');
    const shareText = `[급식급식] 🍱 ${school.SCHUL_NM} ${meal.formattedDate} ${meal.mealName}\n${dishListText}\n열량: ${meal.calories}`;
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  // Check if today matches selected date
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const realTodayYMD = `${y}${m}${d}`;
  const isViewingToday = currentDateStr === realTodayYMD;

  // Calorie exercise burn tip
  const getCalorieTip = (cal: number) => {
    if (!cal) return '오늘도 건강하고 든든한 식사하세요!';
    if (cal < 650) return '가볍고 산뜻한 식단! 체육 시간 가벼운 스트레칭이면 충분해요 🧘';
    if (cal < 850) return '영양 가득 황금 밸런스! 축구 45분 ⚽ 또는 자전거 35분 타면 뚝딱!';
    return '열량 뿜뿜 든든 식단! 폭풍 농구 한 판 🏀 또는 신나는 댄스로 파워 소모!';
  };

  return (
    <div className="w-full">
      {/* 1. Header controls: Date scroller & Meal Type Switcher */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-sky-100 mb-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Date Selector with prev/next */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
            <button
              onClick={onPrevDay}
              className="p-2 rounded-xl text-sky-800 hover:bg-sky-100 active:scale-95 transition-all"
              title="이전 날"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenDatePicker}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-sky-50 transition-colors group text-left"
            >
              <Calendar className="w-4 h-4 text-sky-600 group-hover:scale-110 transition-transform" />
              <div>
                <span className="font-bold text-sky-950 text-base sm:text-lg">
                  {meal?.formattedDate || currentDateStr.replace(/(\d{4})(\d{2})(\d{2})/, '$1년 $2월 $3일')}
                </span>
                <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                  {meal?.dayOfWeek || ''}
                </span>
              </div>
            </button>

            <button
              onClick={onNextDay}
              className="p-2 rounded-xl text-sky-800 hover:bg-sky-100 active:scale-95 transition-all"
              title="다음 날"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {!isViewingToday && (
              <button
                onClick={onSelectToday}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-sky-700 bg-sky-100 hover:bg-sky-200 rounded-lg transition-colors ml-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>오늘</span>
              </button>
            )}
          </div>

          {/* Meal Type Buttons (조식, 중식, 석식) */}
          <div className="flex items-center gap-1 p-1 bg-sky-100/70 rounded-xl w-full sm:w-auto justify-center">
            {[
              { code: '1' as const, label: '아침 (조식)' },
              { code: '2' as const, label: '점심 (중식)' },
              { code: '3' as const, label: '저녁 (석식)' },
            ].map((item) => {
              const isAvailable = availableMeals.some((m) => m.mealCode === item.code);
              const isActive = selectedMealCode === item.code;
              return (
                <button
                  key={item.code}
                  onClick={() => onChangeMealCode(item.code)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-sm scale-100'
                      : 'text-sky-800 hover:bg-sky-200/60'
                  }`}
                >
                  <span>{item.label}</span>
                  {isAvailable && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isActive ? 'bg-amber-300' : 'bg-sky-400'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* 2. Loading State */}
      {isLoading ? (
        <div className="bg-white/80 rounded-3xl p-12 text-center shadow-sm border border-sky-100 flex flex-col items-center justify-center min-h-[380px]">
          <MascotGeupsik expression="hungry" size="lg" showSpeechBubble speechText="오늘의 맛있는 급식 찾는 중...!" />
          <p className="mt-4 text-sky-800 font-bold text-lg">나이스(NEIS) 급식 정보를 불러오고 있어요</p>
          <p className="text-sky-600/80 text-xs mt-1">잠시만 기다려주세요 🍚</p>
        </div>
      ) : !meal || meal.dishes.length === 0 ? (
        /* 3. Empty / Weekend / Holiday State */
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 sm:p-12 text-center shadow-sm border border-sky-100 min-h-[380px] flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-4 right-4 text-sky-200 select-none text-6xl opacity-30">
            🏖️
          </div>
          <MascotGeupsik
            expression="empty"
            size="lg"
            showSpeechBubble
            speechText="급식이 없거나 쉬는 날이에요!"
          />
          <h3 className="text-xl sm:text-2xl font-bold font-cute text-sky-950 mt-4">
            이 날에는 제공되는 급식이 없어요
          </h3>
          <p className="text-sky-700/80 text-sm max-w-md mt-2 leading-relaxed">
            주말, 방학, 재량휴업일이거나 해당 식사({selectedMealCode === '1' ? '조식' : selectedMealCode === '3' ? '석식' : '중식'})가 미운영되는 학교일 수 있어요.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {onJumpToWeekday && (
              <>
                <button
                  onClick={() => onJumpToWeekday(-1)}
                  className="px-4 py-2 bg-sky-100 hover:bg-sky-200 text-sky-900 font-bold text-xs rounded-xl transition-colors"
                >
                  👈 이전 평일 급식 보기
                </button>
                <button
                  onClick={() => onJumpToWeekday(1)}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition-colors"
                >
                  다음 평일 급식 보기 👉
                </button>
              </>
            )}
            <button
              onClick={onSelectToday}
              className="px-4 py-2 bg-white border border-sky-200 text-sky-800 hover:bg-sky-50 font-bold text-xs rounded-xl transition-colors"
            >
              오늘 날짜로 이동
            </button>
          </div>
        </div>
      ) : (
        /* 4. The School Lunch Tray (식판) UI */
        <div className="relative">
          
          {/* Top Tray Action Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3 px-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 font-bold text-sky-900 bg-sky-100/90 px-3 py-1 rounded-xl">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>열량: {meal.calories}</span>
              </span>
              <span className="hidden md:inline-block text-sky-700 text-xs font-medium bg-white/70 px-2.5 py-1 rounded-xl border border-sky-100">
                {getCalorieTip(meal.calorieValue)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyMeal}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-sky-800 bg-white/90 hover:bg-sky-100 rounded-xl border border-sky-200 shadow-xs transition-colors"
                title="오늘의 급식 복사하기"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-sky-600" />
                    <span>식단 복사</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenNutritionModal}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-sky-900 bg-sky-200/80 hover:bg-sky-300 rounded-xl transition-colors"
              >
                <Info className="w-3.5 h-3.5 text-sky-700" />
                <span>영양·원산지</span>
              </button>
            </div>
          </div>

          {/* Actual 3D Lunch Tray Visual */}
          <div className="bg-gradient-to-b from-sky-100 via-sky-50 to-blue-100 rounded-3xl p-4 sm:p-7 border-4 border-white tray-shadow relative">
            
            {/* Tray Metallic Polish Accent lines */}
            <div className="absolute top-2 left-6 right-6 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-80" />
            
            {/* 5-Section Tray Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              {/* TOP ROW: 3 Side dish compartments */}
              
              {/* Top Left: Kimchi / Pickled Side */}
              <div className="bg-white/95 rounded-2xl p-4 compartment-shadow border border-sky-100 flex flex-col justify-between min-h-[110px] relative group hover:border-sky-300 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                  <span className="text-[11px] font-bold text-sky-600 flex items-center gap-1">
                    <span>🥬</span> 김치/무침
                  </span>
                  {dessertOrKimchi[0]?.allergens?.length ? (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {dessertOrKimchi[0].allergens.join('.')}
                    </span>
                  ) : null}
                </div>
                <div className="my-auto">
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {dessertOrKimchi[0]?.cleanName || '맛있는 배추김치'}
                  </p>
                  {dessertOrKimchi[0]?.hasMyAllergy && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>내 알레르기 주의 ({dessertOrKimchi[0].allergyNames.join(', ')})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Mid: Main Meat/Protein Course */}
              <div className="bg-white/95 rounded-2xl p-4 compartment-shadow border-2 border-amber-200/70 flex flex-col justify-between min-h-[110px] relative group hover:border-amber-300 transition-colors bg-gradient-to-b from-amber-50/40 to-white">
                <div className="flex items-center justify-between text-xs text-amber-700 font-medium mb-1">
                  <span className="text-[11px] font-bold text-amber-600 flex items-center gap-1">
                    <span>🍗</span> 메인 요리
                  </span>
                  {mainDish?.allergens?.length ? (
                    <span className="text-[10px] text-amber-500 font-mono">
                      {mainDish.allergens.join('.')}
                    </span>
                  ) : null}
                </div>
                <div className="my-auto">
                  <p className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                    {mainDish?.cleanName || '오늘의 특선 메인요리'}
                  </p>
                  {mainDish?.hasMyAllergy && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>내 알레르기 주의 ({mainDish.allergyNames.join(', ')})</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Right: Side dish 1 or Dessert */}
              <div className="bg-white/95 rounded-2xl p-4 compartment-shadow border border-sky-100 flex flex-col justify-between min-h-[110px] relative group hover:border-sky-300 transition-colors">
                <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                  <span className="text-[11px] font-bold text-purple-600 flex items-center gap-1">
                    <span>🥗</span> 반찬 & 후식
                  </span>
                  {sideDish1?.allergens?.length ? (
                    <span className="text-[10px] text-slate-400 font-mono">
                      {sideDish1.allergens.join('.')}
                    </span>
                  ) : null}
                </div>
                <div className="my-auto">
                  <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {sideDish1?.cleanName || dessertOrKimchi[1]?.cleanName || '신선한 샐러드 & 과일'}
                  </p>
                  {sideDish1?.hasMyAllergy && (
                    <div className="mt-1 flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                      <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" />
                      <span>내 알레르기 주의 ({sideDish1.allergyNames.join(', ')})</span>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* BOTTOM ROW: 2 Big Compartments (Rice & Soup) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              
              {/* Bottom Left: Warm Steamed Rice (밥) */}
              <div className="bg-white/95 rounded-3xl p-5 compartment-shadow border border-sky-100 flex flex-col justify-between min-h-[135px] relative group hover:border-sky-300 transition-colors">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-xs font-bold text-sky-700 flex items-center gap-1.5">
                    <span>🍚</span> 따끈따끈 밥
                  </span>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-steam-1" />
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-steam-2" />
                  </div>
                </div>

                <div className="my-auto">
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {riceDish?.cleanName || '친환경 쌀밥'}
                  </h4>
                  {riceDish?.hasMyAllergy && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>내 알레르기 주의 ({riceDish.allergyNames.join(', ')})</span>
                    </div>
                  )}
                </div>
                
                <span className="text-[11px] text-slate-400 font-medium">
                  {riceDish?.allergens?.length ? `알레르기: ${riceDish.allergyNames.join(', ')}` : '맑고 깨끗한 우리 쌀'}
                </span>
              </div>

              {/* Bottom Right: Warm Soup / Stew (국/찌개) */}
              <div className="bg-white/95 rounded-3xl p-5 compartment-shadow border border-amber-100 flex flex-col justify-between min-h-[135px] relative group hover:border-amber-300 transition-colors bg-gradient-to-br from-white to-amber-50/20">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-xs font-bold text-amber-700 flex items-center gap-1.5">
                    <span>🍲</span> 뜨끈한 국 & 찌개
                  </span>
                  {soupDish?.allergens?.length ? (
                    <span className="text-[10px] text-amber-600 font-mono">
                      {soupDish.allergens.join('.')}
                    </span>
                  ) : null}
                </div>

                <div className="my-auto">
                  <h4 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {soupDish?.cleanName || '얼큰 구수한 오늘의 국'}
                  </h4>
                  {soupDish?.hasMyAllergy && (
                    <div className="mt-2 flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>내 알레르기 주의 ({soupDish.allergyNames.join(', ')})</span>
                    </div>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 font-medium">
                  {soupDish?.allergens?.length ? `알레르기: ${soupDish.allergyNames.join(', ')}` : '정성 가득 우려낸 국물'}
                </span>
              </div>

            </div>

            {/* Extra dishes if more than 5 */}
            {dishes.length > 5 && (
              <div className="mt-4 pt-3 border-t border-sky-200/60 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-sky-800">추가 메뉴:</span>
                {dishes.slice(5).map((extra, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold ${
                      extra.hasMyAllergy
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-white text-slate-700 border-sky-100 shadow-xs'
                    }`}
                  >
                    {extra.cleanName}
                    {extra.allergens.length > 0 && (
                      <span className="ml-1 text-[10px] text-slate-400 font-mono">
                        ({extra.allergens.join('.')})
                      </span>
                    )}
                  </span>
                ))}
              </div>
            )}

            {/* Spoon & Chopstick Deco Illustration on Tray edge */}
            <div className="hidden lg:flex items-center justify-end gap-3 mt-3 pr-2 opacity-70">
              <span className="text-xs text-sky-600 font-medium">맛있는 식사 시간 되세요! 🥢🥄</span>
            </div>

          </div>

          {/* Allergy Quick Notice Bar */}
          {myAllergies.length > 0 ? (
            <div className="mt-3 flex items-center justify-between bg-amber-50/90 border border-amber-200 text-amber-900 text-xs px-4 py-2.5 rounded-xl">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  설정된 알레르기({myAllergies.map((c) => ALLERGEN_MAP[c]?.shortName).join(', ')})를 자동으로 감지 중이에요.
                </span>
              </div>
              <button
                onClick={onOpenAllergyModal}
                className="text-amber-800 font-bold hover:underline shrink-0 ml-2"
              >
                설정 변경
              </button>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between bg-sky-100/60 text-sky-800 text-xs px-4 py-2 rounded-xl">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>알레르기가 있으신가요? 알레르기 안심 필터를 켜면 식단표에서 자동 경고해드려요.</span>
              </span>
              <button
                onClick={onOpenAllergyModal}
                className="text-sky-700 font-bold hover:underline shrink-0 ml-2"
              >
                알레르기 등록
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
};
