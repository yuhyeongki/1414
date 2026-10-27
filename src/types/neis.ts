export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드 (e.g. B10)
  ATPT_OFCDC_SC_NM: string;   // 시도교육청명
  SD_SCHUL_CODE: string;       // 표준학교코드 (e.g. 7010572)
  SCHUL_NM: string;            // 학교명
  ENG_SCHUL_NM?: string;       // 영문학교명
  SCHUL_KND_SC_NM: string;     // 학교종류명 (초등학교, 중학교, 고등학교, 특수학교 등)
  LCTN_SC_NM: string;          // 소재지명 (서울특별시 등)
  JU_ORG_NM?: string;          // 관할조직명
  FOND_SC_NM?: string;         // 설립명 (공립, 사립, 국립)
  ORG_RDNZC?: string;          // 도로명우편번호
  ORG_RDNMA?: string;          // 도로명주소
  ORG_TELNO?: string;          // 전화번호
  HMPG_ADRES?: string;         // 홈페이지주소
  COEDU_SC_NM?: string;        // 남녀공학구분명
}

export interface RawMealServiceItem {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string; // 1: 조식, 2: 중식, 3: 석식
  MMEAL_SC_NM: string;   // 조식, 중식, 석식
  MLSV_YMD: string;      // YYYYMMDD
  MLSV_FGR?: number;     // 급식인원수
  DDISH_NM: string;      // 요리명 (HTML br 포함)
  ORPLC_INFO?: string;   // 원산지정보
  CAL_INFO?: string;     // 칼로리정보
  NTR_INFO?: string;     // 영양정보
}

export interface ParsedDish {
  name: string;
  cleanName: string;
  allergens: number[];
  allergyNames: string[];
  isDessert?: boolean;
  isMainMeat?: boolean;
  isRice?: boolean;
  isSoup?: boolean;
  hasMyAllergy?: boolean;
}

export interface ParsedMeal {
  mealCode: '1' | '2' | '3';
  mealName: string;
  dateStr: string;       // YYYYMMDD
  formattedDate: string; // 2026년 10월 27일 화요일
  dayOfWeek: string;     // 월, 화, 수, 목, 금, 토, 일
  dishes: ParsedDish[];
  calories: string;
  calorieValue: number;
  nutrients: { name: string; amount: string; unit: string; percentage?: number }[];
  origins: { name: string; origin: string }[];
}

export interface AllergenItem {
  code: number;
  name: string;
  shortName: string;
  emoji: string;
}

export interface MealReview {
  id: string;
  schoolCode: string;
  date: string;
  sticker: 'delicious' | 'healthy' | 'love' | 'soso';
  rating: number; // 1 - 5
  comment: string;
  createdAt: number;
}
