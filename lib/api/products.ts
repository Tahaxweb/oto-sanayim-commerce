import { Product, ProductFilters } from '@/types/product'

const MOCK_PRODUCTS: Product[] = [
  { id: '1', marka: 'Ford', model: 'Focus', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Ön Sağ', fiyat: 1450, resim: '', populer: true },
  { id: '2', marka: 'Renault', model: 'Clio', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Ön Sol', fiyat: 1350, resim: '', populer: true },
  { id: '3', marka: 'Volkswagen', model: 'Golf', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Arka Sağ', fiyat: 1250, resim: '', populer: false },
  { id: '4', marka: 'Ford', model: 'Kuga', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Arka Sol', fiyat: 1300, resim: '', populer: false },
  { id: '5', marka: 'Renault', model: 'Megane', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Set (Ön Takım)', fiyat: 2600, resim: '', populer: true },
  { id: '6', marka: 'Volkswagen', model: 'Passat', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Set (Arka Takım)', fiyat: 2400, resim: '', populer: true },
  { id: '7', marka: 'Ford', model: 'Transit', kategori: 'Fren Sistemi', isim: 'Ağır Vasıta Fren Kaliperi', fiyat: 3200, resim: '', populer: false },
  { id: '8', marka: 'Renault', model: 'Fluence', kategori: 'Fren Sistemi', isim: 'Elektronik Park Frenli Kaliper', fiyat: 2800, resim: '', populer: true },
  { id: '9', marka: 'Volkswagen', model: 'Tiguan', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi (Revizyonlu)', fiyat: 1900, resim: '', populer: false },
  { id: '10', marka: 'Ford', model: 'Fiesta', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi (Sıfır)', fiyat: 2100, resim: '', populer: false },
  { id: '11', marka: 'Renault', model: 'Talisman', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Ön Sağ (OEM)', fiyat: 3000, resim: '', populer: true },
  { id: '12', marka: 'Volkswagen', model: 'Polo', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Ön Sol (OEM)', fiyat: 2950, resim: '', populer: true },
  { id: '13', marka: 'Ford', model: 'Mondeo', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Arka Sağ (OEM)', fiyat: 2750, resim: '', populer: false },
  { id: '14', marka: 'Renault', model: 'Kadjar', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Arka Sol (OEM)', fiyat: 2700, resim: '', populer: false },
  { id: '15', marka: 'Volkswagen', model: 'Jetta', kategori: 'Fren Sistemi', isim: 'Performans Fren Kaliperi', fiyat: 4200, resim: '', populer: true },
  { id: '16', marka: 'Ford', model: 'Focus', kategori: 'Fren Sistemi', isim: 'Revizyonlu Fren Kaliperi Ön', fiyat: 1750, resim: '', populer: false },
  { id: '17', marka: 'Renault', model: 'Clio', kategori: 'Fren Sistemi', isim: 'Revizyonlu Fren Kaliperi Arka', fiyat: 1600, resim: '', populer: false },
  { id: '18', marka: 'Volkswagen', model: 'Golf', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi (Tek Piston)', fiyat: 1850, resim: '', populer: true },
  { id: '19', marka: 'Ford', model: 'Kuga', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi (Çift Piston)', fiyat: 3500, resim: '', populer: false },
  { id: '20', marka: 'Renault', model: 'Megane', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Tamir Takımı', fiyat: 450, resim: '', populer: false },
  { id: '21', marka: 'Volkswagen', model: 'Passat', kategori: 'Fren Sistemi', isim: 'Fren Kaliperi Taşıyıcı Braket', fiyat: 900, resim: '', populer: true },
]
export async function fetchProducts(filters: ProductFilters): Promise<{
  products: Product[]
  totalPages: number
  totalCount: number
}> {
  // Simulate network delay
  await new Promise((r) => setTimeout(r, 300))

  let items = [...MOCK_PRODUCTS]

  // Marka
  if (filters.marka) {
    items = items.filter((p) => p.marka === filters.marka)
  }
  // Model
  if (filters.model) {
    items = items.filter((p) => p.model === filters.model)
  }
  // Kategori
  if (filters.kategori) {
    items = items.filter((p) => p.kategori === filters.kategori)
  }
  // Fiyat
  if (filters.fiyatMin !== undefined) {
    items = items.filter((p) => p.fiyat >= filters.fiyatMin!)
  }
  if (filters.fiyatMax !== undefined) {
    items = items.filter((p) => p.fiyat <= filters.fiyatMax!)
  }
  // Sıralama
  switch (filters.siralama) {
    case 'fiyat_asc':
      items.sort((a, b) => a.fiyat - b.fiyat)
      break
    case 'fiyat_desc':
      items.sort((a, b) => b.fiyat - a.fiyat)
      break
    case 'yeni':
      items.sort((a, b) => Number(b.id) - Number(a.id))
      break
    case 'populer':
    default:
      items.sort((a, b) => Number(b.populer) - Number(a.populer))
      break
  }

  // Pagination
  const pageSize = 9
  const page = filters.sayfa || 1
  const totalCount = items.length
  const totalPages = Math.ceil(totalCount / pageSize)
  const start = (page - 1) * pageSize
  const products = items.slice(start, start + pageSize)

  return { products, totalPages, totalCount }
}