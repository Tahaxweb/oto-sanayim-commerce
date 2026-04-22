'use client'
import { ProductFilters } from '@/types/product'

export default function ActiveFilters({ filters }: { filters: ProductFilters }) {
  const activeFilters = []
  
  if (filters.marka) activeFilters.push({ key: 'marka', label: `Marka: ${filters.marka}` })
  if (filters.model) activeFilters.push({ key: 'model', label: `Model: ${filters.model}` })
  if (filters.fiyatMin) activeFilters.push({ key: 'fiyatMin', label: `Min: ${filters.fiyatMin}₺` })
  if (filters.fiyatMax && filters.fiyatMax < 10000) {
    activeFilters.push({ key: 'fiyatMax', label: `Max: ${filters.fiyatMax}₺` })
  }

  if (activeFilters.length === 0) return null

  const handleRemove = (key: string) => {
    const params = new URLSearchParams(window.location.search)
    params.delete(key)
    if (key === 'marka') params.delete('model')
    params.set('sayfa', '1')
    window.location.search = params.toString()
  }

  const handleClearAll = () => {
    window.location.href = '/urunler'
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-6 pb-6 border-b border-gray-100">
      <span className="text-sm text-gray-600 font-medium">Aktif Filtreler:</span>
      
      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => handleRemove(filter.key)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 border border-orange-200 text-orange-700 text-sm font-medium hover:bg-orange-100 transition-colors group"
        >
          <span>{filter.label}</span>
          <i className="ri-close-line text-base group-hover:text-red-600 transition-colors" />
        </button>
      ))}

      {activeFilters.length > 1 && (
        <button
          onClick={handleClearAll}
          className="text-sm text-gray-500 hover:text-gray-900 underline ml-2"
        >
          Tümünü Temizle
        </button>
      )}
    </div>
  )
}