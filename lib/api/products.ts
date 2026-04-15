import { Product, ProductFilters } from '@/types/product'

const MOCK_PRODUCTS: Product[] = [
  { 
    id: '1', 
    marka: 'Ford', 
    model: 'Focus', 
    kategori: 'Fren Sistemi', 
    isim: 'Fren Balatası Ön', 
    fiyat: 450, 
     resim: '', 
    populer: true 
  },
  { 
    id: '2', 
    marka: 'Renault', 
    model: 'Clio', 
    kategori: 'Motor & Şanzıman', 
    isim: 'Motor Yağı 5W30 Fully Synthetic', 
    fiyat: 1200, 
     resim: '', 
    populer: true 
  },
  { 
    id: '3', 
    marka: 'Volkswagen', 
    model: 'Golf', 
    kategori: 'Elektrik & Aydınlatma', 
    isim: 'Ön Far Takımı LED', 
    fiyat: 1850, 
      resim: '', 
    populer: false 
  },
  { 
    id: '4', 
    marka: 'Ford', 
    model: 'Kuga', 
    kategori: 'Karoser & Dış', 
    isim: 'Kapı Paneli Sağ Ön', 
    fiyat: 3200, 
    resim: '', 
    populer: false 
  },
  { 
    id: '5', 
    marka: 'Renault', 
    model: 'Megane', 
    kategori: 'Fren Sistemi', 
    isim: 'Fren Diski Ventilli', 
    fiyat: 800, 
      resim: '', 
    populer: true 
  },
  { 
    id: '6', 
    marka: 'Volkswagen', 
    model: 'Passat', 
    kategori: 'Motor & Şanzıman', 
    isim: 'Hava Filtresi Orjinal', 
    fiyat: 350, 
     resim: '', 
    populer: true 
  },
  { 
    id: '7', 
    marka: 'Ford', 
    model: 'Transit', 
    kategori: 'Motor & Şanzıman', 
    isim: 'Yağ Filtresi', 
    fiyat: 180, 
    resim: '', 
    populer: false 
  },
  { 
    id: '8', 
    marka: 'Renault', 
    model: 'Fluence', 
    kategori: 'Elektrik & Aydınlatma', 
    isim: 'Akü 72 Ah', 
    fiyat: 2500, 
      resim: '', 
    populer: true 
  },
  { 
    id: '9', 
    marka: 'Volkswagen', 
    model: 'Tiguan', 
    kategori: 'Karoser & Dış', 
    isim: 'Arka Tampon', 
    fiyat: 4200, 
     resim: '', 
    populer: false 
  },
  { 
    id: '10', 
    marka: 'Ford', 
    model: 'Fiesta', 
    kategori: 'Fren Sistemi', 
    isim: 'Fren Hidroliği DOT4', 
    fiyat: 120, 
     resim: '', 
    populer: false 
  },
  { 
    id: '11', 
    marka: 'Renault', 
    model: 'Talisman', 
    kategori: 'Elektrik & Aydınlatma', 
    isim: 'Sis Farı Takımı', 
    fiyat: 950, 
     resim: '', 
    populer: true 
  },
  { 
    id: '12', 
    marka: 'Volkswagen', 
    model: 'Polo', 
    kategori: 'Motor & Şanzıman', 
    isim: 'Triger Seti', 
    fiyat: 1800, 
  resim: '', 
    populer: true 
  },
  { 
    id: '13', 
    marka: 'Ford', 
    model: 'Mondeo', 
    kategori: 'Karoser & Dış', 
    isim: 'Kaput', 
    fiyat: 5500, 
  resim: '', 
    populer: false 
  },
  { 
    id: '14', 
    marka: 'Renault', 
    model: 'Kadjar', 
    kategori: 'Fren Sistemi', 
    isim: 'ABS Sensörü', 
    fiyat: 680, 
    resim: '', 
    populer: false 
  },
  { 
    id: '15', 
    marka: 'Volkswagen', 
    model: 'Jetta', 
    kategori: 'Elektrik & Aydınlatma', 
    isim: 'Alternatör', 
    fiyat: 3200, 
  resim: '', 
    populer: true 
  },
  { 
    id: '16', 
    marka: 'Ford', 
    model: 'Focus', 
    kategori: 'Motor & Şanzıman', 
    isim: 'Yakıt Filtresi', 
    fiyat: 280, 
    resim: '', 
    populer: false 
  },
  { 
    id: '17', 
    marka: 'Renault', 
    model: 'Clio', 
    kategori: 'Karoser & Dış', 
    isim: 'Çamurluk Sol Ön', 
    fiyat: 1450, 
   resim: '', 
    populer: false 
  },
  { 
    id: '18', 
    marka: 'Volkswagen', 
    model: 'Golf', 
    kategori: 'Fren Sistemi', 
    isim: 'Fren Kaliperi', 
    fiyat: 2200, 
    resim: '', 
    populer: true 
  },
  { 
    id: '19', 
    marka: 'Ford', 
    model: 'Kuga', 
    kategori: 'Elektrik & Aydınlatma', 
    isim: 'Marş Motoru', 
    fiyat: 1900, 
    resim: '', 
    populer: false 
  },
  { 
    id: '20', 
    marka: 'Renault', 
    model: 'Megane', 
    kategori: 'Motor & Şanzıman', 
    isim: 'Karbüratör Temizleyici', 
    fiyat: 95, 
     resim: '', 
    populer: false 
  },
  { 
    id: '21', 
    marka: 'Volkswagen', 
    model: 'Passat', 
    kategori: 'Karoser & Dış', 
    isim: 'Ayna Kapağı Sağ', 
    fiyat: 380, 
  resim: '', 
    populer: true 
  },
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