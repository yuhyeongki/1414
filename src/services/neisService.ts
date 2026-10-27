import {
  SchoolInfo,
  RawMealServiceItem,
  ParsedMeal,
  ParsedDish,
} from '../types/neis';
import { getAllergenNames } from '../constants/allergens';

const API_KEY_STORAGE_KEY = 'geupsik_neis_api_key';

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    if (key.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Failed to save API key to localStorage', e);
  }
}

// Format date helper: Date object or YYYYMMDD string -> YYYYMMDD
export function formatDateToYMD(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}${m}${d}`;
}

// Convert YYYYMMDD to human readable Korean date
export function formatYMDToKorean(ymd: string): { formatted: string; dayOfWeek: string } {
  if (!ymd || ymd.length !== 8) {
    return { formatted: ymd, dayOfWeek: '' };
  }
  const year = parseInt(ymd.substring(0, 4), 10);
  const month = parseInt(ymd.substring(4, 6), 10);
  const day = parseInt(ymd.substring(6, 8), 10);

  const dateObj = new Date(year, month - 1, day);
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayOfWeek = days[dateObj.getDay()];

  return {
    formatted: `${year}년 ${month}월 ${day}일`,
    dayOfWeek,
  };
}

// Parse dish string from NEIS (e.g., "현미밥<br/>쇠고기미역국 (5.6.16)<br/>돈육간장불고기 (5.6.10.13)...")
export function parseDishes(rawText: string, myAllergies: number[] = []): ParsedDish[] {
  if (!rawText) return [];

  // Split by <br/>, <br>, or newline
  const lines = rawText
    .split(/<br\s*\/?>|\n/gi)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line) => {
    // Extract allergy numbers like (5.6.16) or (1.2)
    const allergyMatch = line.match(/\(([\d.]+)\)/);
    let allergens: number[] = [];
    if (allergyMatch && allergyMatch[1]) {
      allergens = allergyMatch[1]
        .split('.')
        .map((n) => parseInt(n, 10))
        .filter((n) => !isNaN(n));
    }

    // Clean dish name: remove (numbers), remove asterisks or special notes
    const cleanName = line
      .replace(/\(([\d.]+)\)/g, '')
      .replace(/[*#]/g, '')
      .trim();

    const allergyNames = getAllergenNames(allergens);
    const hasMyAllergy = myAllergies.some((code) => allergens.includes(code));

    // Guess dish compartment type
    const lower = cleanName.toLowerCase();
    const isRice = /밥|라이스|볶음밥|비빔밥|덮밥|필라프|주먹밥/.test(lower);
    const isSoup = /국|찌개|탕|스프|수프|나베|순두부|전골/.test(lower);
    const isDessert = /과일|우유|요구르트|요거트|푸딩|음료|에이드|주스|젤리|마카롱|도넛|와플|떡|케이크|아이스크림|사과|샤인머스캣|수박|바나나|딸기|포도|귤|오렌지/.test(lower);
    const isMainMeat = /고기|불고기|갈비|돈까스|치킨|닭|오리|스테이크|함박|가츠|탕수육|구이|볶음|조림|찜/.test(lower);

    return {
      name: line,
      cleanName,
      allergens,
      allergyNames,
      isRice,
      isSoup,
      isDessert,
      isMainMeat,
      hasMyAllergy,
    };
  });
}

// Parse Origin string: "쌀 : 국내산<br/>돼지고기 : 국내산..."
export function parseOrigins(rawText?: string): { name: string; origin: string }[] {
  if (!rawText) return [];
  const lines = rawText
    .split(/<br\s*\/?>|\n/gi)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line) => {
    const parts = line.split(':');
    return {
      name: parts[0]?.trim() || line,
      origin: parts[1]?.trim() || '국내산/수입',
    };
  });
}

// Parse Nutrient string: "탄수화물(g) : 110.4<br/>단백질(g) : 42.1..."
export function parseNutrients(rawText?: string): { name: string; amount: string; unit: string; percentage?: number }[] {
  if (!rawText) return [];
  const lines = rawText
    .split(/<br\s*\/?>|\n/gi)
    .map((l) => l.trim())
    .filter(Boolean);

  return lines.map((line) => {
    const parts = line.split(':');
    const nameWithUnit = parts[0]?.trim() || '';
    const amount = parts[1]?.trim() || '';

    const unitMatch = nameWithUnit.match(/\((.*?)\)/);
    const unit = unitMatch ? unitMatch[1] : '';
    const cleanName = nameWithUnit.replace(/\(.*?\)/, '').trim();

    return {
      name: cleanName,
      amount,
      unit,
    };
  });
}

// Parse single raw meal into domain model
export function parseMealItem(item: RawMealServiceItem, myAllergies: number[] = []): ParsedMeal {
  const { formatted, dayOfWeek } = formatYMDToKorean(item.MLSV_YMD);
  const dishes = parseDishes(item.DDISH_NM, myAllergies);
  const origins = parseOrigins(item.ORPLC_INFO);
  const nutrients = parseNutrients(item.NTR_INFO);

  const calMatch = (item.CAL_INFO || '').match(/([\d.]+)/);
  const calorieValue = calMatch ? Math.round(parseFloat(calMatch[1])) : 0;

  return {
    mealCode: (item.MMEAL_SC_CODE as '1' | '2' | '3') || '2',
    mealName: item.MMEAL_SC_NM || '중식',
    dateStr: item.MLSV_YMD,
    formattedDate: formatted,
    dayOfWeek,
    dishes,
    calories: item.CAL_INFO || `${calorieValue} Kcal`,
    calorieValue,
    nutrients,
    origins,
  };
}

// Search schools via server proxy, with fallback to direct NEIS API
export async function searchSchools(
  schoolName: string,
  regionCode?: string,
  page = 1,
  pageSize = 25
): Promise<{ schools: SchoolInfo[]; total: number; message?: string }> {
  const query = schoolName.trim();
  if (!query) return { schools: [], total: 0 };

  const apiKey = getStoredApiKey();

  // 1. Try server proxy
  try {
    const params = new URLSearchParams({
      name: query,
      pIndex: String(page),
      pSize: String(pageSize),
    });
    if (regionCode) params.append('regionCode', regionCode);
    if (apiKey) params.append('key', apiKey);

    const res = await fetch(`/api/neis/school?${params.toString()}`, {
      headers: apiKey ? { 'x-neis-key': apiKey } : {},
    });

    if (res.ok) {
      const data = await res.json();
      if (data.schoolInfo && data.schoolInfo[1]?.row) {
        const total = data.schoolInfo[0]?.head?.[0]?.list_total_count || data.schoolInfo[1].row.length;
        return {
          schools: data.schoolInfo[1].row,
          total,
        };
      }
      if (data.RESULT) {
        return {
          schools: [],
          total: 0,
          message: data.RESULT.MESSAGE || '검색 결과가 없습니다.',
        };
      }
    }
  } catch (err) {
    console.warn('Proxy school search failed, falling back to direct NEIS call:', err);
  }

  // 2. Direct client fallback
  try {
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: String(page),
      pSize: String(pageSize),
      SCHUL_NM: query,
    });
    if (regionCode) params.append('ATPT_OFCDC_SC_CODE', regionCode);
    if (apiKey) params.append('KEY', apiKey);

    const directRes = await fetch(`https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`);
    if (directRes.ok) {
      const data = await directRes.json();
      if (data.schoolInfo && data.schoolInfo[1]?.row) {
        return {
          schools: data.schoolInfo[1].row,
          total: data.schoolInfo[0]?.head?.[0]?.list_total_count || data.schoolInfo[1].row.length,
        };
      }
      if (data.RESULT) {
        return {
          schools: [],
          total: 0,
          message: data.RESULT.MESSAGE,
        };
      }
    }
  } catch (directErr) {
    console.error('Direct school search failed:', directErr);
  }

  return { schools: [], total: 0, message: '학교 검색에 실패했습니다. 학교명을 확인해주세요.' };
}

// Fetch meals for date range or single date
export async function fetchMeals(
  officeCode: string,
  schoolCode: string,
  options: {
    date?: string;
    fromDate?: string;
    toDate?: string;
    mealCode?: string;
    myAllergies?: number[];
  }
): Promise<{ meals: ParsedMeal[]; rawCount: number; message?: string }> {
  const apiKey = getStoredApiKey();
  const myAllergies = options.myAllergies || [];

  // Helper to process response
  const processData = (data: any) => {
    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1]?.row) {
      const rows: RawMealServiceItem[] = data.mealServiceDietInfo[1].row;
      const parsed = rows.map((r) => parseMealItem(r, myAllergies));
      return {
        meals: parsed,
        rawCount: rows.length,
      };
    }
    if (data.RESULT) {
      return {
        meals: [],
        rawCount: 0,
        message: data.RESULT.MESSAGE || '급식 데이터가 없습니다.',
      };
    }
    return { meals: [], rawCount: 0, message: '급식 정보가 없습니다.' };
  };

  // 1. Try server proxy
  try {
    const params = new URLSearchParams({
      officeCode,
      schoolCode,
    });
    if (options.date) params.append('date', options.date);
    if (options.fromDate) params.append('fromDate', options.fromDate);
    if (options.toDate) params.append('toDate', options.toDate);
    if (options.mealCode) params.append('mealCode', options.mealCode);
    if (apiKey) params.append('key', apiKey);

    const res = await fetch(`/api/neis/meal?${params.toString()}`, {
      headers: apiKey ? { 'x-neis-key': apiKey } : {},
    });

    if (res.ok) {
      const data = await res.json();
      return processData(data);
    }
  } catch (err) {
    console.warn('Proxy meal search failed, falling back to direct NEIS call:', err);
  }

  // 2. Direct client fallback
  try {
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '100',
      ATPT_OFCDC_SC_CODE: officeCode,
      SD_SCHUL_CODE: schoolCode,
    });
    if (options.date) params.append('MLSV_YMD', options.date);
    if (options.fromDate) params.append('MLSV_FROM_YMD', options.fromDate);
    if (options.toDate) params.append('MLSV_TO_YMD', options.toDate);
    if (options.mealCode) params.append('MMEAL_SC_CODE', options.mealCode);
    if (apiKey) params.append('KEY', apiKey);

    const directRes = await fetch(`https://open.neis.go.kr/hub/mealServiceDietInfo?${params.toString()}`);
    if (directRes.ok) {
      const data = await directRes.json();
      return processData(data);
    }
  } catch (directErr) {
    console.error('Direct meal search failed:', directErr);
  }

  return { meals: [], rawCount: 0, message: '급식 데이터를 불러오지 못했습니다.' };
}

// Verify API key
export async function testNeisKey(key: string): Promise<{ valid: boolean; message: string }> {
  try {
    const res = await fetch('/api/neis/verify-key', {
      headers: key ? { 'x-neis-key': key } : {},
    });
    if (res.ok) {
      const data = await res.json();
      return {
        valid: data.valid !== false,
        message: data.message || '인증이 완료되었습니다.',
      };
    }
  } catch {
    // direct fallback test
  }

  try {
    const params = new URLSearchParams({
      Type: 'json',
      pIndex: '1',
      pSize: '1',
      SCHUL_NM: '서울고등학교',
    });
    if (key) params.append('KEY', key);

    const direct = await fetch(`https://open.neis.go.kr/hub/schoolInfo?${params.toString()}`);
    const data = await direct.json();
    if (data.RESULT && data.RESULT.CODE && data.RESULT.CODE.startsWith('ERROR')) {
      return { valid: false, message: data.RESULT.MESSAGE || '인증키가 유효하지 않습니다.' };
    }
    return { valid: true, message: '나이스 API 키가 정상 확인되었습니다!' };
  } catch (err: any) {
    return { valid: false, message: `연결 테스트 실패: ${err.message}` };
  }
}
