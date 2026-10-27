import React from 'react';
import { School, KeyRound, ShieldAlert } from 'lucide-react';
import { SchoolInfo } from '../types/neis';

interface HeaderProps {
  currentSchool: SchoolInfo;
  activeTab: 'today' | 'weekly' | 'allergy' | 'review';
  setActiveTab: (tab: 'today' | 'weekly' | 'allergy' | 'review') => void;
  onOpenSchoolSearch: () => void;
  onOpenApiKeyModal: () => void;
  onOpenAllergyModal: () => void;
  hasCustomKey: boolean;
  myAllergiesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchool,
  activeTab,
  setActiveTab,
  onOpenSchoolSearch,
  onOpenApiKeyModal,
  onOpenAllergyModal,
  hasCustomKey,
  myAllergiesCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-sky-600/95 backdrop-blur-md border-b border-sky-500 shadow-sm transition-colors text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 md:gap-8">
        
        {/* Zone 1: Brand Title (Single-line wordmark) */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab('today');
            }}
            className="flex items-center gap-2 group text-white hover:text-sky-100 transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
              🍱
            </div>
            <span className="text-xl font-extrabold tracking-tight font-cute text-white whitespace-nowrap">
              급식급식
            </span>
          </a>

          {/* Current school quick pill in header */}
          <button
            onClick={onOpenSchoolSearch}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-sky-700/60 hover:bg-sky-700 rounded-full text-sky-100 border border-sky-400/40 transition-colors ml-2 max-w-[200px]"
            title="학교 변경하기"
          >
            <School className="w-3.5 h-3.5 text-sky-200 shrink-0" />
            <span className="truncate">{currentSchool.SCHUL_NM}</span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, 4 items) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('today')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeTab === 'today'
                ? 'text-white'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            오늘 급식
            {activeTab === 'today' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('weekly')}
            className={`whitespace-nowrap transition-colors relative py-1 ${
              activeTab === 'weekly'
                ? 'text-white'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            주간 식단표
            {activeTab === 'weekly' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-yellow-300 rounded-full" />
            )}
          </button>

          <button
            onClick={onOpenAllergyModal}
            className="flex items-center gap-1.5 text-sky-200 hover:text-white whitespace-nowrap py-1 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 text-amber-300" />
            <span>알레르기 안심</span>
            {myAllergiesCount > 0 && (
              <span className="px-1.5 py-0.2 bg-amber-400 text-amber-950 text-[10px] font-bold rounded-full">
                {myAllergiesCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenApiKeyModal}
            className="flex items-center gap-1 text-sky-200 hover:text-white whitespace-nowrap py-1 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-sky-300" />
            <span>나이스 API 키</span>
            {hasCustomKey && (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="내 인증키 적용중" />
            )}
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenSchoolSearch}
            className="px-3.5 py-2 text-xs md:text-sm font-bold text-sky-900 bg-white hover:bg-yellow-100 active:scale-95 transition-all rounded-xl shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <School className="w-4 h-4 text-sky-600" />
            <span>학교 변경</span>
          </button>
        </div>

      </div>

      {/* Mobile sub bar for quick tabs */}
      <div className="flex md:hidden items-center justify-around px-2 py-2 bg-sky-700/80 border-t border-sky-500/50 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            activeTab === 'today' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-100'
          }`}
        >
          🍱 오늘 급식
        </button>
        <button
          onClick={() => setActiveTab('weekly')}
          className={`px-3 py-1 rounded-lg transition-colors ${
            activeTab === 'weekly' ? 'bg-white text-sky-900 shadow-sm' : 'text-sky-100'
          }`}
        >
          📅 주간 식단
        </button>
        <button
          onClick={onOpenAllergyModal}
          className="px-2.5 py-1 rounded-lg text-sky-100 hover:bg-sky-600 transition-colors flex items-center gap-1"
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
          <span>알레르기</span>
        </button>
        <button
          onClick={onOpenApiKeyModal}
          className="px-2.5 py-1 rounded-lg text-sky-100 hover:bg-sky-600 transition-colors flex items-center gap-1"
        >
          <KeyRound className="w-3.5 h-3.5 text-sky-200" />
          <span>API 설정</span>
        </button>
      </div>
    </header>
  );
};
