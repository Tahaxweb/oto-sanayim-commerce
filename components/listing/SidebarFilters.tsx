'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, } from 'react'
import 'remixicon/fonts/remixicon.css'
import Button from '../ui/Button'
const BRANDS = ['Ford', 'Renault', 'Volkswagen']
const MODELS = {
  'Renault': ['Clio', 'Megane', 'Fluence', 'Talisman', 'Kadjar'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Transit'],
  'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Jetta'],
}

export default function SidebarFilters({
  initialFilters,
}: {
  initialFilters: {
    marka?: string
    model?: string
    kategori?: string
    fiyatMin?: number
    fiyatMax?: number
  }
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [marka, setMarka] = useState(initialFilters.marka || '')
  const [model, setModel] = useState(initialFilters.model || '')
  const [kategori, setKategori] = useState(initialFilters.kategori || '')
  const [fiyatMin, setFiyatMin] = useState(initialFilters.fiyatMin || 0)
  const [fiyatMax, setFiyatMax] = useState(initialFilters.fiyatMax || 10000)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    // marka
    if (marka) params.set('marka', marka)
    else params.delete('marka')
    // model
    if (model) params.set('model', model)
    else params.delete('model')
    // kategori
    if (kategori) params.set('kategori', kategori)
    else params.delete('kategori')
    // fiyat
    if (fiyatMin > 0) params.set('fiyatMin', String(fiyatMin))
    else params.delete('fiyatMin')
    if (fiyatMax < 10000) params.set('fiyatMax', String(fiyatMax))
    else params.delete('fiyatMax')
    // sayfa sıfırla
    params.set('sayfa', '1')

    router.push(`/urunler?${params.toString()}`)
    setIsMobileOpen(false)
  }

  const resetFilters = () => {
    setMarka('')
    setModel('')
    setKategori('')
    setFiyatMin(0)
    setFiyatMax(10000)
    router.push('/urunler')
  }

  // Mobil trigger (button)
  return (
    <>
      {/* Mobil: filter trigger */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium transition hover:bg-gray-100"
      >
        <i className="ri-filter-3-line text-lg" />
        Filtrele
      </button>

      {/* Overlay (mobile) */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-full lg:w-auto bg-white lg:bg-transparent shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 lg:p-0">
          <div className="lg:bg-white lg:border lg:border-gray-100 lg:rounded-2xl lg:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Filtreler</h2>
              <button
                onClick={resetFilters}
                className="text-xs text-[#FF3C00] hover:underline flex items-center gap-1"
              >
                <i className="ri-refresh-line" />
                Sıfırla
              </button>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-50"
                aria-label="Kapat"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {/* Marka */}
            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Marka</h3>
              <div className="relative">
                <select
                  value={marka}
                  onChange={(e) => {
                    setMarka(e.target.value)
                    setModel('')
                  }}
                  className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition"
                >
                  <option value="">Tümü</option>
                  {BRANDS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
              </div>
            </section>

            {/* Model */}
            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Model</h3>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={!marka}
                  className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Tümü</option>
                  {marka && MODELS[marka as keyof typeof MODELS]?.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
              </div>
              {!marka && (
                <p className="text-xs text-gray-500 mt-2">Önce marka seçin</p>
              )}
            </section>

            {/* Kategori */}
           

            {/* Fiyat */}
            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Fiyat Aralığı</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min (₺)"
                  value={fiyatMin || ''}
                  onChange={(e) => setFiyatMin(e.target.value ? Number(e.target.value) : 0)}
                  className="w-1/2 h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition"
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max (₺)"
                  value={fiyatMax || ''}
                  onChange={(e) => setFiyatMax(e.target.value ? Number(e.target.value) : 10000)}
                  className="w-1/2 h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition"
                  min="0"
                />
              </div>
              <div className="text-xs text-gray-500 mt-2">Örnek: 0–10000</div>
            </section>

            {/* Uygula */}
            <Button
              onClick={applyFilters}
            >
              <i className="ri-search-line mr-2" />
              Filtreleri Uygula
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}