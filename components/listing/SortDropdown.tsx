'use client'

export default function SortDropdown({ currentSort }: { currentSort: string }) {
  const handleChange = (value: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set('siralama', value)
    params.set('sayfa', '1')
    window.location.search = params.toString()
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">Sırala:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleChange(e.target.value)}
          className="h-10 pl-3 pr-10 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
        >
          <option value="populer">Popüler</option>
          <option value="fiyat_asc">Fiyat: Artan</option>
          <option value="fiyat_desc">Fiyat: Azalan</option>
          <option value="yeni">Yeni Gelenler</option>
        </select>
        <i className="ri-arrow-down-s-line absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-lg" />
      </div>
    </div>
  )
}