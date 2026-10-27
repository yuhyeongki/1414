import React, { useState, useEffect, useCallback } from 'react';
import {
  School,
  Sparkles,
  Search,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Heart,
  HelpCircle,
} from 'lucide-react';
import { SchoolInfo, ParsedMeal } from './types/neis';
import { POPULAR_SCHOOLS } from './constants/regions';
import {
  fetchMeals,
  formatDateToYMD,
  getStoredApiKey,
} from './services/neisService';
import { Header } from './components/Header';
import { TodayMealTray } from './components/TodayMealTray';
import { WeeklyMealView } from './components/WeeklyMealView';
import { LunchCountdown } from './components/LunchCountdown';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { AllergySettingsModal } from './components/AllergySettingsModal';
import { MealDetailModal } from './components/MealDetailModal';
import { MealReviewSection } from './components/MealReviewSection';
import { MascotGeupsik } from './components/MascotGeupsik';

const STORAGE_KEY_SCHOOL = 'geupsik_selected_school';
const STORAGE_KEY_FAVORITES = 'geupsik_favorite_schools';
const STORAGE_KEY_ALLERGIES = 'geupsik_my_allergies';

export default function App() {
  // 1. Current Selected School (defaults to 서울고등학교)
  const [currentSchool, setCurrentSchool] = useState<SchoolInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SCHOOL);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return POPULAR_SCHOOLS[0];
  });

  // 2. Favorites List
  const [favorites, setFavorites] = useState<SchoolInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [POPULAR_SCHOOLS[0], POPULAR_SCHOOLS[1]];
  });

  // 3. User Allergen list
  const [myAllergies, setMyAllergies] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_ALLERGIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  });

  // 4. Date management
  const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
  const currentDateStr = formatDateToYMD(selectedDate);

  // 5. Active Meal Code: 1 (조식), 2 (중식 - default), 3 (석식)
  const [selectedMealCode, setSelectedMealCode] = useState<'1' | '2' | '3'>('2');

  // 6. Navigation tabs: 'today' | 'weekly' | 'allergy' | 'review'
  const [activeTab, setActiveTab] = useState<'today' | 'weekly' | 'allergy' | 'review'>('today');

  // 7. Data states
  const [todayMeals, setTodayMeals] = useState<ParsedMeal[]>([]);
  const [weeklyMeals, setWeeklyMeals] = useState<ParsedMeal[]>([]);
  const [isLoadingToday, setIsLoadingToday] = useState(false);
  const [isLoadingWeekly, setIsLoadingWeekly] = useState(false);

  // 8. Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isApiKeyOpen, setIsApiKeyOpen] = useState(false);
  const [isAllergyOpen, setIsAllergyOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [hasCustomKey, setHasCustomKey] = useState<boolean>(() => Boolean(getStoredApiKey()));

  // Save selected school
  const handleSelectSchool = (school: SchoolInfo) => {
    setCurrentSchool(school);
    try {
      localStorage.setItem(STORAGE_KEY_SCHOOL, JSON.stringify(school));
    } catch {
      // ignore
    }
  };

  // Toggle favorite school
  const handleToggleFavorite = (school: SchoolInfo) => {
    setFavorites((prev) => {
      const exists = prev.some((s) => s.SD_SCHUL_CODE === school.SD_SCHUL_CODE);
      const next = exists
        ? prev.filter((s) => s.SD_SCHUL_CODE !== school.SD_SCHUL_CODE)
        : [...prev, school];
      try {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  // Toggle allergy item
  const handleToggleAllergy = (code: number) => {
    setMyAllergies((prev) => {
      const next = prev.includes(code)
        ? prev.filter((c) => c !== code)
        : [...prev, code];
      try {
        localStorage.setItem(STORAGE_KEY_ALLERGIES, JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleClearAllergies = () => {
    setMyAllergies([]);
    try {
      localStorage.removeItem(STORAGE_KEY_ALLERGIES);
    } catch {
      // ignore
    }
  };

  // Calculate current week date range (Monday ~ Friday)
  const getWeekRange = useCallback((refDate: Date) => {
    const d = new Date(refDate);
    const day = d.getDay(); // 0 is Sun, 1 is Mon...
    const diffToMon = day === 0 ? -6 : 1 - day;
    const monday = new Date(d);
    monday.setDate(d.getDate() + diffToMon);

    const friday = new Date(monday);
    friday.setDate(monday.getDate() + 4);

    return {
      monday,
      friday,
      fromYMD: formatDateToYMD(monday),
      toYMD: formatDateToYMD(friday),
      text: `${monday.getMonth() + 1}월 ${monday.getDate()}일 ~ ${friday.getMonth() + 1}월 ${friday.getDate()}일 식단표`,
    };
  }, []);

  const weekInfo = getWeekRange(selectedDate);

  // Fetch today meals
  const loadTodayMeal = useCallback(async () => {
    if (!currentSchool.ATPT_OFCDC_SC_CODE || !currentSchool.SD_SCHUL_CODE) return;
    setIsLoadingToday(true);
    try {
      const res = await fetchMeals(
        currentSchool.ATPT_OFCDC_SC_CODE,
        currentSchool.SD_SCHUL_CODE,
        {
          date: currentDateStr,
          myAllergies,
        }
      );
      setTodayMeals(res.meals || []);

      // If requested mealCode doesn't exist, but other meals exist, auto-select lunch or first available
      if (res.meals && res.meals.length > 0) {
        const hasSelected = res.meals.some((m) => m.mealCode === selectedMealCode);
        if (!hasSelected) {
          const lunch = res.meals.find((m) => m.mealCode === '2');
          setSelectedMealCode(lunch ? '2' : res.meals[0].mealCode);
        }
      }
    } catch (err) {
      console.error('Failed to load today meals', err);
    } finally {
      setIsLoadingToday(false);
    }
  }, [currentSchool, currentDateStr, myAllergies, selectedMealCode]);

  // Fetch weekly meals
  const loadWeeklyMeals = useCallback(async () => {
    if (!currentSchool.ATPT_OFCDC_SC_CODE || !currentSchool.SD_SCHUL_CODE) return;
    setIsLoadingWeekly(true);
    try {
      const res = await fetchMeals(
        currentSchool.ATPT_OFCDC_SC_CODE,
        currentSchool.SD_SCHUL_CODE,
        {
          fromDate: weekInfo.fromYMD,
          toDate: weekInfo.toYMD,
          myAllergies,
        }
      );
      setWeeklyMeals(res.meals || []);
    } catch (err) {
      console.error('Failed to load weekly meals', err);
    } finally {
      setIsLoadingWeekly(false);
    }
  }, [currentSchool, weekInfo.fromYMD, weekInfo.toYMD, myAllergies]);

  // Effect to load data whenever school, date, or allergies change
  useEffect(() => {
    loadTodayMeal();
  }, [currentSchool, currentDateStr, myAllergies]);

  useEffect(() => {
    loadWeeklyMeals();
  }, [currentSchool, weekInfo.fromYMD, myAllergies]);

  // Date Navigation handlers
  const handlePrevDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 1);
    setSelectedDate(next);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const handleSelectToday = () => {
    setSelectedDate(new Date());
  };

  const handlePrevWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - 7);
    setSelectedDate(next);
  };

  const handleNextWeek = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  const handleJumpToWeekday = (direction: number) => {
    const next = new Date(selectedDate);
    // Jump to nearest weekday
    let step = direction > 0 ? 1 : -1;
    next.setDate(next.getDate() + step);
    while (next.getDay() === 0 || next.getDay() === 6) {
      next.setDate(next.getDate() + step);
    }
    setSelectedDate(next);
  };

  // Find currently active meal object for the selected date & code
  const currentMeal = todayMeals.find((m) => m.mealCode === selectedMealCode);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 via-sky-200 to-sky-100 text-slate-800 flex flex-col relative overflow-x-hidden selection:bg-sky-300">
      
      {/* Playful Floating Blue Clouds in background */}
      <div className="absolute top-12 left-10 w-48 h-24 bg-white/40 rounded-full blur-xl pointer-events-none -z-0" />
      <div className="absolute top-36 right-12 w-64 h-32 bg-sky-300/30 rounded-full blur-2xl pointer-events-none -z-0" />
      <div className="absolute bottom-20 left-1/4 w-72 h-36 bg-blue-300/20 rounded-full blur-2xl pointer-events-none -z-0" />

      {/* Top Header */}
      <Header
        currentSchool={currentSchool}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSchoolSearch={() => setIsSearchOpen(true)}
        onOpenApiKeyModal={() => setIsApiKeyOpen(true)}
        onOpenAllergyModal={() => setIsAllergyOpen(true)}
        hasCustomKey={hasCustomKey}
        myAllergiesCount={myAllergies.length}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 md:py-8 z-10 space-y-6">
        
        {/* Hero School Identity Banner (Cute & Friendly) */}
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 shadow-sm border border-sky-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <MascotGeupsik
              expression={currentMeal ? 'happy' : 'eating'}
              size="md"
              className="shrink-0 hidden sm:block"
            />
            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                  {currentSchool.ATPT_OFCDC_SC_NM}
                </span>
                <span className="text-xs font-bold text-sky-800 bg-sky-200/60 px-2.5 py-0.5 rounded-full">
                  {currentSchool.SCHUL_KND_SC_NM}
                </span>
                {favorites.some((f) => f.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE) && (
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <span>⭐</span> 내 즐겨찾기
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-sky-950 font-cute tracking-tight">
                {currentSchool.SCHUL_NM} 급식
              </h1>
              <p className="text-xs sm:text-sm text-sky-800/80 mt-0.5 font-medium">
                나이스(NEIS) 교육정보 개방포털 실시간 연동 서비스
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5"
            >
              <Search className="w-4 h-4" />
              <span>다른 학교 검색</span>
            </button>
            <button
              onClick={() => handleToggleFavorite(currentSchool)}
              className={`p-2.5 rounded-xl border transition-all ${
                favorites.some((f) => f.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE)
                  ? 'bg-amber-50 text-amber-500 border-amber-200 shadow-xs'
                  : 'bg-white text-slate-400 border-sky-100 hover:text-amber-500'
              }`}
              title="즐겨찾기 저장"
            >
              <Heart
                className={`w-4 h-4 ${
                  favorites.some((f) => f.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE)
                    ? 'fill-amber-500 text-amber-500'
                    : ''
                }`}
              />
            </button>
          </div>
        </div>

        {/* Lunch Countdown Clock */}
        <LunchCountdown />

        {/* Tab Switch Views */}
        {activeTab === 'today' ? (
          <div>
            {/* The Main Today's Meal Tray */}
            <TodayMealTray
              school={currentSchool}
              meal={currentMeal}
              availableMeals={todayMeals}
              currentDateStr={currentDateStr}
              selectedMealCode={selectedMealCode}
              onChangeMealCode={setSelectedMealCode}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onSelectToday={handleSelectToday}
              onOpenDatePicker={() => setIsSearchOpen(false)}
              onOpenNutritionModal={() => setIsDetailOpen(true)}
              onOpenAllergyModal={() => setIsAllergyOpen(true)}
              isLoading={isLoadingToday}
              myAllergies={myAllergies}
              onJumpToWeekday={handleJumpToWeekday}
            />

            {/* Meal Review and Community Sticker section */}
            <MealReviewSection
              schoolCode={currentSchool.SD_SCHUL_CODE}
              dateStr={currentDateStr}
              schoolName={currentSchool.SCHUL_NM}
            />
          </div>
        ) : (
          /* Weekly Meal View */
          <div>
            <WeeklyMealView
              meals={weeklyMeals}
              currentDateStr={currentDateStr}
              selectedMealCode={selectedMealCode}
              onChangeMealCode={setSelectedMealCode}
              onSelectDate={(dateStr) => {
                const y = parseInt(dateStr.slice(0, 4), 10);
                const m = parseInt(dateStr.slice(4, 6), 10);
                const d = parseInt(dateStr.slice(6, 8), 10);
                setSelectedDate(new Date(y, m - 1, d));
                setActiveTab('today');
              }}
              onPrevWeek={handlePrevWeek}
              onNextWeek={handleNextWeek}
              weekRangeText={weekInfo.text}
              isLoading={isLoadingWeekly}
              myAllergies={myAllergies}
            />
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="mt-12 bg-sky-800 text-sky-100 py-6 border-t border-sky-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-sm text-white font-cute">급식급식</span>
            <span>·</span>
            <span className="text-sky-300">
              교육부 나이스(NEIS) 교육정보 개방포털 OpenAPI 기반 학교 급식 정보
            </span>
          </div>

          <div className="flex items-center gap-4 text-sky-200">
            <button
              onClick={() => setIsApiKeyOpen(true)}
              className="hover:text-white transition-colors underline"
            >
              나이스 인증키 안내
            </button>
            <button
              onClick={() => setIsAllergyOpen(true)}
              className="hover:text-white transition-colors underline"
            >
              19대 알레르기 성분표
            </button>
            <span>© {new Date().getFullYear()} 급식급식</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SchoolSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectSchool={handleSelectSchool}
        currentSchool={currentSchool}
        favorites={favorites}
        onToggleFavorite={handleToggleFavorite}
      />

      <ApiKeyModal
        isOpen={isApiKeyOpen}
        onClose={() => setIsApiKeyOpen(false)}
        onKeyUpdated={() => {
          setHasCustomKey(Boolean(getStoredApiKey()));
          loadTodayMeal();
          loadWeeklyMeals();
        }}
      />

      <AllergySettingsModal
        isOpen={isAllergyOpen}
        onClose={() => setIsAllergyOpen(false)}
        selectedAllergies={myAllergies}
        onToggleAllergy={handleToggleAllergy}
        onClearAll={handleClearAllergies}
      />

      <MealDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        meal={currentMeal}
        schoolName={currentSchool.SCHUL_NM}
      />

    </div>
  );
}
