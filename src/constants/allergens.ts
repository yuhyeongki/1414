import { AllergenItem } from '../types/neis';

export const ALLERGEN_LIST: AllergenItem[] = [
  { code: 1, name: '난류(달걀)', shortName: '달걀', emoji: '🥚' },
  { code: 2, name: '우유', shortName: '우유', emoji: '🥛' },
  { code: 3, name: '메밀', shortName: '메밀', emoji: '🌾' },
  { code: 4, name: '땅콩', shortName: '땅콩', emoji: '🥜' },
  { code: 5, name: '대두(콩)', shortName: '대두', emoji: '🫘' },
  { code: 6, name: '밀', shortName: '밀', emoji: '🍞' },
  { code: 7, name: '고등어', shortName: '고등어', emoji: '🐟' },
  { code: 8, name: '게', shortName: '게', emoji: '🦀' },
  { code: 9, name: '새우', shortName: '새우', emoji: '🦐' },
  { code: 10, name: '돼지고기', shortName: '돼지고기', emoji: '🥓' },
  { code: 11, name: '복숭아', shortName: '복숭아', emoji: '🍑' },
  { code: 12, name: '토마토', shortName: '토마토', emoji: '🍅' },
  { code: 13, name: '아황산류', shortName: '아황산염', emoji: '🍷' },
  { code: 14, name: '호두', shortName: '호두', emoji: '🌰' },
  { code: 15, name: '닭고기', shortName: '닭고기', emoji: '🍗' },
  { code: 16, name: '쇠고기', shortName: '쇠고기', emoji: '🥩' },
  { code: 17, name: '오징어', shortName: '오징어', emoji: '🦑' },
  { code: 18, name: '조개류(굴/전복/홍합)', shortName: '조개류', emoji: '🦪' },
  { code: 19, name: '잣', shortName: '잣', emoji: '🌲' },
];

export const ALLERGEN_MAP: Record<number, AllergenItem> = ALLERGEN_LIST.reduce(
  (acc, item) => {
    acc[item.code] = item;
    return acc;
  },
  {} as Record<number, AllergenItem>
);

export function getAllergenNames(codes: number[]): string[] {
  return codes
    .map((code) => ALLERGEN_MAP[code]?.shortName || `${code}번 알레르기`)
    .filter(Boolean);
}
