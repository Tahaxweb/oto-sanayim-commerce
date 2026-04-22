export interface Product {
  id: string
  /** Veritabanından; yoksa kart bileşeninde yedek kod üretilir */
  urunKodu?: string | null
  marka: string
  model: string
  isim: string
  fiyat: number
  resim: string
  /** Galeri görselleri (en az biri `resim` ile aynı olabilir) */
  resimler?: string[]
  populer?: boolean
  /** Mağaza metni; veritabanı garanti alanından türetilir */
  garanti?: string
}

export interface ProductFilters {
  marka?: string
  model?: string
  fiyatMin?: number
  fiyatMax?: number
  siralama?: string
  sayfa?: number
}