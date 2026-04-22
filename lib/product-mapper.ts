import type { Product } from '@/types/product';
import { warrantyToTrLabel, type WarrantyValue } from '@/lib/warranty';

export type ApiProduct = {
  id: string;
  productCode?: string | null;
  name: string;
  price: number;
  image: string;
  images?: string[];
  popular: boolean;
  warranty?: WarrantyValue | null;
  brand?: { name: string };
  model?: { name: string };
};

function galleryUrls(p: ApiProduct): string[] {
  const fromDb = (p.images ?? []).filter(
    (u): u is string => typeof u === 'string' && u.trim().length > 0
  );
  if (fromDb.length > 0) {
    return [...new Set(fromDb)];
  }
  if (typeof p.image === 'string' && p.image.trim()) {
    return [p.image.trim()];
  }
  return [];
}

export function apiProductToStorefront(p: ApiProduct): Product {
  const imgs = galleryUrls(p);
  return {
    id: p.id,
    urunKodu: p.productCode ?? null,
    isim: p.name,
    marka: p.brand?.name ?? '',
    model: p.model?.name ?? '',
    fiyat: p.price,
    resim: imgs[0] ?? '',
    resimler: imgs,
    populer: p.popular,
    garanti: warrantyToTrLabel(p.warranty ?? 'NONE'),
  };
}
