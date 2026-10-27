import { SchoolInfo } from '../types/neis';

export interface EducationOffice {
  code: string;
  name: string;
  shortName: string;
}

export const EDUCATION_OFFICES: EducationOffice[] = [
  { code: '', name: '전체 교육청', shortName: '전체' },
  { code: 'B10', name: '서울특별시교육청', shortName: '서울' },
  { code: 'C10', name: '부산광역시교육청', shortName: '부산' },
  { code: 'D10', name: '대구광역시교육청', shortName: '대구' },
  { code: 'E10', name: '인천광역시교육청', shortName: '인천' },
  { code: 'F10', name: '광주광역시교육청', shortName: '광주' },
  { code: 'G10', name: '대전광역시교육청', shortName: '대전' },
  { code: 'H10', name: '울산광역시교육청', shortName: '울산' },
  { code: 'I10', name: '세종특별자치시교육청', shortName: '세종' },
  { code: 'J10', name: '경기도교육청', shortName: '경기' },
  { code: 'K10', name: '강원특별자치도교육청', shortName: '강원' },
  { code: 'M10', name: '충청북도교육청', shortName: '충북' },
  { code: 'N10', name: '충청남도교육청', shortName: '충남' },
  { code: 'P10', name: '전북특별자치도교육청', shortName: '전북' },
  { code: 'Q10', name: '전라남도교육청', shortName: '전남' },
  { code: 'R10', name: '경상북도교육청', shortName: '경북' },
  { code: 'S10', name: '경상남도교육청', shortName: '경남' },
  { code: 'T10', name: '제주특별자치도교육청', shortName: '제주' },
];

export const POPULAR_SCHOOLS: SchoolInfo[] = [
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010572',
    SCHUL_NM: '서울고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 서초구 효령로 197',
  },
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7010057',
    SCHUL_NM: '경기고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 강남구 영동대로 643',
  },
  {
    ATPT_OFCDC_SC_CODE: 'J10',
    ATPT_OFCDC_SC_NM: '경기도교육청',
    SD_SCHUL_CODE: '7530852',
    SCHUL_NM: '한국디지털미디어고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '경기도',
    ORG_RDNMA: '경기도 안산시 단원구 와동로 119',
  },
  {
    ATPT_OFCDC_SC_CODE: 'G10',
    ATPT_OFCDC_SC_NM: '대전광역시교육청',
    SD_SCHUL_CODE: '7430048',
    SCHUL_NM: '대전과학고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '대전광역시',
    ORG_RDNMA: '대전광역시 유성구 가정로 297',
  },
  {
    ATPT_OFCDC_SC_CODE: 'C10',
    ATPT_OFCDC_SC_NM: '부산광역시교육청',
    SD_SCHUL_CODE: '7150087',
    SCHUL_NM: '부산국제고등학교',
    SCHUL_KND_SC_NM: '고등학교',
    LCTN_SC_NM: '부산광역시',
    ORG_RDNMA: '부산광역시 부산진구 백양관문로 105-70',
  },
  {
    ATPT_OFCDC_SC_CODE: 'B10',
    ATPT_OFCDC_SC_NM: '서울특별시교육청',
    SD_SCHUL_CODE: '7021054',
    SCHUL_NM: '서울대학교사범대학부설중학교',
    SCHUL_KND_SC_NM: '중학교',
    LCTN_SC_NM: '서울특별시',
    ORG_RDNMA: '서울특별시 종로구 대학로 64',
  },
];
