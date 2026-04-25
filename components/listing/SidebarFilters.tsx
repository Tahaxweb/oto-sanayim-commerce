'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import Button from '../ui/Button'

type ApiModel = {
  id: string
  name: string
  brandId: string
  brand?: { id: string; name: string }
}

type ApiBrand = {
  id: string
  name: string
  models: { id: string; name: string }[]
}

type ApiCategory = {
  id: string
  name: string
}

function syncPriceMaxFromInitial(v: number | undefined) {
  if (v == null || Number.isNaN(v)) return 10000
  return v
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

  const [brands, setBrands] = useState<ApiBrand[]>([])
  const [allModels, setAllModels] = useState<ApiModel[]>([])
  const [categories, setCategories] = useState<ApiCategory[]>([])
  const [loadError, setLoadError] = useState('')

  const [marka, setMarka] = useState(initialFilters.marka || '')
  const [model, setModel] = useState(initialFilters.model || '')
  const [kategori, setKategori] = useState(initialFilters.kategori || '')
  const [fiyatMin, setFiyatMin] = useState(
    initialFilters.fiyatMin && initialFilters.fiyatMin > 0 ? initialFilters.fiyatMin : 0
  )
  const [fiyatMax, setFiyatMax] = useState(
    syncPriceMaxFromInitial(initialFilters.fiyatMax)
  )
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const [brRes, moRes, catRes] = await Promise.all([
          fetch('/api/brands'),
          fetch('/api/models'),
          fetch('/api/categories'),
        ])
        const bJson = await brRes.json()
        const mJson = await moRes.json()
        const cJson = await catRes.json()
        if (cancelled) return
        if (Array.isArray(bJson)) setBrands(bJson)
        if (Array.isArray(mJson)) setAllModels(mJson)
        if (Array.isArray(cJson)) {
          setCategories(
            cJson
              .map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))
              .sort((a: ApiCategory, b: ApiCategory) =>
                a.name.localeCompare(b.name, 'tr')
              )
          )
        }
      } catch {
        if (!cancelled) setLoadError('Filtre verileri yüklenemedi')
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    setMarka(initialFilters.marka || '')
    setModel(initialFilters.model || '')
    setKategori(initialFilters.kategori || '')
    setFiyatMin(
      initialFilters.fiyatMin != null && initialFilters.fiyatMin > 0
        ? initialFilters.fiyatMin
        : 0
    )
    setFiyatMax(syncPriceMaxFromInitial(initialFilters.fiyatMax))
  }, [
    initialFilters.marka,
    initialFilters.model,
    initialFilters.kategori,
    initialFilters.fiyatMin,
    initialFilters.fiyatMax,
  ])

  const modelsForSelect = useMemo(() => {
    if (marka) {
      const b = brands.find(
        (x) => x.name.toLowerCase() === marka.toLowerCase()
      )
      return (b?.models ?? [])
        .slice()
        .sort((a, x) => a.name.localeCompare(x.name, 'tr'))
        .map((m) => ({ id: m.id, name: m.name, label: m.name }))
    }
    return allModels
      .slice()
      .sort((a, b) => {
        const an = `${a.brand?.name ?? ''} ${a.name}`
        const bn = `${b.brand?.name ?? ''} ${b.name}`
        return an.localeCompare(bn, 'tr')
      })
      .map((m) => ({
        id: m.id,
        name: m.name,
        label: m.brand?.name ? `${m.name} (${m.brand.name})` : m.name,
      }))
  }, [marka, brands, allModels])

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())

    if (marka.trim()) params.set('marka', marka.trim())
    else params.delete('marka')

    if (model.trim()) params.set('model', model.trim())
    else params.delete('model')

    if (kategori.trim()) params.set('kategori', kategori.trim())
    else params.delete('kategori')

    if (fiyatMin > 0) params.set('fiyatMin', String(fiyatMin))
    else params.delete('fiyatMin')

    if (fiyatMax < 10000) params.set('fiyatMax', String(fiyatMax))
    else params.delete('fiyatMax')

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

  const sortedBrands = useMemo(
    () => brands.slice().sort((a, b) => a.name.localeCompare(b.name, 'tr')),
    [brands]
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setIsMobileOpen(true)}
        className="lg:hidden w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-medium transition hover:bg-gray-100"
      >
        <i className="ri-filter-3-line text-lg" />
        Filtrele
      </button>

      {isMobileOpen && (
        <div
          role="presentation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 lg:z-auto w-full max-w-sm lg:max-w-none lg:w-auto bg-white lg:bg-transparent shadow-2xl lg:shadow-none transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 lg:p-0 h-full overflow-y-auto lg:h-auto lg:overflow-visible">
          <div className="lg:bg-white lg:border lg:border-gray-100 lg:rounded-2xl lg:p-6">
            <div className="flex items-center justify-between mb-6 gap-2">
              <h2 className="text-lg font-bold">Filtreler</h2>
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs text-[#FF3C00] hover:underline flex items-center gap-1 shrink-0"
              >
                <i className="ri-refresh-line" />
                Sıfırla
              </button>
              <button
                type="button"
                onClick={() => setIsMobileOpen(false)}
                className="lg:hidden p-1 rounded-lg hover:bg-gray-50 ml-auto"
                aria-label="Kapat"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {loadError && (
              <p className="text-sm text-red-600 mb-4">{loadError}</p>
            )}

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
                  {sortedBrands.map((b) => (
                    <option key={b.id} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Model</h3>
              <div className="relative">
                <select
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  disabled={modelsForSelect.length === 0}
                  className="w-full h-12 pl-4 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Tümü</option>
                  {modelsForSelect.map((m) => (
                    <option key={m.id} value={m.name}>
                      {m.label}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
              </div>
              {!marka && allModels.length > 0 && (
                <p className="text-xs text-gray-500 mt-2">
                  İsterseniz marka seçmeden tüm modellerden seçebilirsiniz
                </p>
              )}
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Kategori</h3>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10 text-gray-500">
                  <i className="ri-price-tag-3-line text-lg" />
                </div>
                <select
                  value={kategori}
                  onChange={(e) => setKategori(e.target.value)}
                  disabled={categories.length === 0}
                  className="w-full h-12 pl-10 pr-10 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-base appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Tümü</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
              </div>
            </section>

            <section className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Fiyat Aralığı (₺)</h3>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={fiyatMin > 0 ? fiyatMin : ''}
                  onChange={(e) =>
                    setFiyatMin(e.target.value ? Number(e.target.value) : 0)
                  }
                  className="w-1/2 h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition"
                  min={0}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={fiyatMax < 10000 ? fiyatMax : ''}
                  onChange={(e) => {
                    const v = e.target.value
                    setFiyatMax(v === '' ? 10000 : Number(v))
                  }}
                  className="w-1/2 h-12 px-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3C00] transition"
                  min={0}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Boş bırakılan üst sınır sınırsız kabul edilir
              </p>
            </section>

            <Button type="button" onClick={applyFilters}>
              <i className="ri-search-line mr-2" />
              Filtreleri Uygula
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
