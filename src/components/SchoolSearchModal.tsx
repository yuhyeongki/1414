import React, { useState, useEffect } from 'react';
import {
  Search,
  X,
  School,
  MapPin,
  Star,
  Sparkles,
  Loader2,
  Building2,
} from 'lucide-react';
import { SchoolInfo } from '../types/neis';
import { searchSchools } from '../services/neisService';
import { EDUCATION_OFFICES, POPULAR_SCHOOLS } from '../constants/regions';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: SchoolInfo) => void;
  currentSchool: SchoolInfo;
  favorites: SchoolInfo[];
  onToggleFavorite: (school: SchoolInfo) => void;
}

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSchool,
  currentSchool,
  favorites,
  onToggleFavorite,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOfficeCode, setSelectedOfficeCode] = useState('');
  const [selectedKind, setSelectedKind] = useState<'all' | 'elem' | 'mid' | 'high'>('all');
  const [results, setResults] = useState<SchoolInfo[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searched, setSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Reset or initialize on open
  useEffect(() => {
    if (isOpen) {
      setErrorMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) {
      setErrorMsg('학교명을 2글자 이상 입력해주세요.');
      return;
    }

    setIsSearching(true);
    setErrorMsg('');
    try {
      const res = await searchSchools(searchTerm.trim(), selectedOfficeCode || undefined, 1, 30);
      setResults(res.schools || []);
      setSearched(true);
      if (res.schools.length === 0) {
        setErrorMsg(res.message || '검색된 학교가 없습니다. 학교명을 다시 확인해주세요.');
      }
    } catch {
      setErrorMsg('학교 검색 중 오류가 발생했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // Filter by school kind
  const filteredResults = results.filter((s) => {
    if (selectedKind === 'all') return true;
    if (selectedKind === 'elem') return s.SCHUL_KND_SC_NM.includes('초등');
    if (selectedKind === 'mid') return s.SCHUL_KND_SC_NM.includes('중학교');
    if (selectedKind === 'high') return s.SCHUL_KND_SC_NM.includes('고등학교');
    return true;
  });

  const isFavorite = (code: string) => favorites.some((f) => f.SD_SCHUL_CODE === code);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-sky-100 flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-sky-100 bg-sky-50/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-sky-950 font-cute">학교 찾기</h3>
              <p className="text-xs text-sky-700/80">
                전국 초·중·고·특수학교의 나이스(NEIS) 급식을 조회하세요.
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

        {/* Search Bar Form */}
        <div className="p-5 border-b border-sky-100">
          <form onSubmit={handleSearch} className="space-y-3">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-sky-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="예: 서울고, 경기고, 대원국제중, 판교초"
                  className="w-full pl-10 pr-4 py-2.5 bg-sky-50/50 border border-sky-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all text-slate-900"
                  autoFocus
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 shrink-0"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>검색</span>
                )}
              </button>
            </div>

            {/* Region dropdown & Kind filter tabs */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
              <select
                value={selectedOfficeCode}
                onChange={(e) => setSelectedOfficeCode(e.target.value)}
                className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none font-medium"
              >
                {EDUCATION_OFFICES.map((office) => (
                  <option key={office.code} value={office.code}>
                    {office.name}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1 p-0.5 bg-sky-100/60 rounded-lg">
                {[
                  { key: 'all' as const, label: '전체' },
                  { key: 'elem' as const, label: '초등' },
                  { key: 'mid' as const, label: '중등' },
                  { key: 'high' as const, label: '고등' },
                ].map((k) => (
                  <button
                    key={k.key}
                    type="button"
                    onClick={() => setSelectedKind(k.key)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                      selectedKind === k.key
                        ? 'bg-white text-sky-900 shadow-xs'
                        : 'text-sky-700 hover:text-sky-900'
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>
          </form>

          {errorMsg && (
            <p className="mt-2 text-xs text-rose-500 font-medium">{errorMsg}</p>
          )}
        </div>

        {/* Scrollable Body: Favorites / Search Results / Popular */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* Favorites (즐겨찾기 학교) */}
          {favorites.length > 0 && !searched && (
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950 mb-2.5">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>즐겨찾기 한 학교 ({favorites.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {favorites.map((fav) => (
                  <div
                    key={fav.SD_SCHUL_CODE}
                    className="p-3 rounded-xl border border-amber-200/80 bg-amber-50/40 hover:bg-amber-100/60 transition-colors flex items-center justify-between gap-2"
                  >
                    <button
                      onClick={() => {
                        onSelectSchool(fav);
                        onClose();
                      }}
                      className="text-left flex-1 truncate"
                    >
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {fav.SCHUL_NM}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {fav.ATPT_OFCDC_SC_NM} · {fav.SCHUL_KND_SC_NM}
                      </p>
                    </button>
                    <button
                      onClick={() => onToggleFavorite(fav)}
                      className="p-1 text-amber-500 hover:scale-110 transition-transform"
                      title="즐겨찾기 해제"
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search Results List */}
          {searched ? (
            <div>
              <div className="text-xs font-bold text-sky-950 mb-2">
                검색 결과 ({filteredResults.length}개)
              </div>
              {filteredResults.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  조건에 일치하는 학교가 없습니다.
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredResults.map((s) => {
                    const isSelected = s.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE;
                    const isFav = isFavorite(s.SD_SCHUL_CODE);

                    return (
                      <div
                        key={s.SD_SCHUL_CODE}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'border-sky-500 bg-sky-50 ring-1 ring-sky-400'
                            : 'border-slate-100 hover:border-sky-200 hover:bg-sky-50/40'
                        }`}
                      >
                        <button
                          onClick={() => {
                            onSelectSchool(s);
                            onClose();
                          }}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-900">
                              {s.SCHUL_NM}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-100 text-sky-800">
                              {s.SCHUL_KND_SC_NM}
                            </span>
                            {isSelected && (
                              <span className="text-[10px] font-bold text-sky-600 bg-sky-200/60 px-1.5 py-0.5 rounded">
                                현재 선택됨
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                            <span>{s.ATPT_OFCDC_SC_NM}</span>
                            {s.ORG_RDNMA && (
                              <>
                                <span>·</span>
                                <span className="flex items-center gap-0.5 truncate max-w-[260px]">
                                  <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                  <span className="truncate">{s.ORG_RDNMA}</span>
                                </span>
                              </>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => onToggleFavorite(s)}
                          className={`p-1.5 rounded-lg transition-transform hover:scale-110 ${
                            isFav ? 'text-amber-500' : 'text-slate-300 hover:text-amber-400'
                          }`}
                          title={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Popular Recommendation Schools */
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-950 mb-2.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>추천 및 대표 학교 (클릭하여 바로보기)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {POPULAR_SCHOOLS.map((pop) => (
                  <button
                    key={pop.SD_SCHUL_CODE}
                    onClick={() => {
                      onSelectSchool(pop);
                      onClose();
                    }}
                    className="p-3 text-left rounded-xl border border-sky-100 bg-white hover:bg-sky-50/70 hover:border-sky-300 transition-all flex items-start gap-2.5 group"
                  >
                    <Building2 className="w-4 h-4 text-sky-500 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <div className="truncate">
                      <p className="text-xs font-bold text-slate-900 group-hover:text-sky-700 truncate">
                        {pop.SCHUL_NM}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {pop.ATPT_OFCDC_SC_NM} · {pop.SCHUL_KND_SC_NM}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
