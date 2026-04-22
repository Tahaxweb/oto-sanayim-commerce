/** Marka/model adından 2 harf (Türkçe büyük harf); harf yoksa X ile tamamlanır */
export function twoLetterPrefix(name: string): string {
  const chars = [...name.normalize('NFC').trim()].filter((c) => /\p{L}/u.test(c));
  if (chars.length === 0) return 'XX';
  const u = (c: string) => c.toLocaleUpperCase('tr-TR');
  const first = u(chars[0]);
  const second = chars[1] ? u(chars[1]) : 'X';
  return first + second;
}

/** Aday kod: İlk2Marka-İlk2Model + 5 rastgele rakam (örn. FO-FO84721) */
export function generateProductCodeCandidate(
  brandName: string,
  modelName: string
): string {
  const b = twoLetterPrefix(brandName);
  const m = twoLetterPrefix(modelName);
  const n = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
  return `${b}-${m}${n}`;
}
