export const WARRANTY_VALUES = ['NONE', 'ONE_YEAR', 'TWO_YEARS'] as const;

export type WarrantyValue = (typeof WARRANTY_VALUES)[number];

export const WARRANTY_FORM_OPTIONS: { value: WarrantyValue; label: string }[] =
  [
    { value: 'NONE', label: 'Garanti yok' },
    { value: 'ONE_YEAR', label: '1 yıl' },
    { value: 'TWO_YEARS', label: '2 yıl' },
  ];

export function parseWarrantyFromBody(v: unknown): WarrantyValue {
  if (v === 'ONE_YEAR' || v === 'TWO_YEARS' || v === 'NONE') return v;
  return 'NONE';
}

export function warrantyToTrLabel(
  w: WarrantyValue | string | null | undefined
): string {
  if (w === 'ONE_YEAR') return '1 yıl';
  if (w === 'TWO_YEARS') return '2 yıl';
  return 'Garanti yok';
}
