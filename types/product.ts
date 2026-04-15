export interface Product {
  id: string
  marka: string
  model: string
  kategori: string
  isim: string
  fiyat: number
  resim: string
  populer?: boolean
}

export interface ProductFilters {
  marka?: string
  model?: string
  kategori?: string
  fiyatMin?: number
  fiyatMax?: number
  siralama?: string
  sayfa?: number
}