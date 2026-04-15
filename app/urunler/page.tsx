import { Suspense } from 'react'
import SidebarFilters from '@/components/listing/SidebarFilters'
import ProductGrid, { ProductGridSkeleton } from '@/components/listing/ProductGrid'
import Pagination from '@/components/listing/Pagination'
import SortDropdown from '@/components/listing/SortDropdown'
import ActiveFilters from '@/components/listing/ActiveFilters'
import { fetchProducts } from '@/lib/api/products'
import { ProductFilters } from '@/types/product'

export default async function ListingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Query params parse
  const filters: ProductFilters = {
    marka: typeof searchParams.marka === 'string' ? searchParams.marka : undefined,
    model: typeof searchParams.model === 'string' ? searchParams.model : undefined,
    kategori: typeof searchParams.kategori === 'string' ? searchParams.kategori : undefined,
    fiyatMin: searchParams.fiyatMin ? Number(searchParams.fiyatMin) : undefined,
    fiyatMax: searchParams.fiyatMax ? Number(searchParams.fiyatMax) : undefined,
    siralama: typeof searchParams.siralama === 'string' ? searchParams.siralama : 'populer',
    sayfa: searchParams.sayfa ? Number(searchParams.sayfa) : 1,
  }

  // Server-side data fetch
  const { products, totalPages, totalCount } = await fetchProducts(filters)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Breadcrumb (opsiyonel) */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-[#FF3C00] transition-colors">Ana Sayfa</a>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <span className="font-medium text-gray-900">Ürünler</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className=" mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sol: Sticky Filtre Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <SidebarFilters initialFilters={filters} />
            </div>
          </aside>

          {/* Sağ: Ürün Listesi */}
          <main className="flex-1 min-w-0">
            {/* Header Section */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Yedek Parçalar
                  </h1>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
                      <i className="ri-box-3-line" />
                      {totalCount} Ürün
                    </span>
                    {filters.marka && (
                      <span className="text-gray-600">
                        • <span className="font-medium">{filters.marka}</span>
                      </span>
                    )}
                    {filters.model && (
                      <span className="text-gray-600">
                        • <span className="font-medium">{filters.model}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Sıralama Dropdown */}
                <SortDropdown currentSort={filters.siralama || 'populer'} />
              </div>

              {/* Active Filters */}
              {(filters.marka || filters.model || filters.kategori || filters.fiyatMin || filters.fiyatMax) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ActiveFilters filters={filters} />
                </div>
              )}
            </div>

            {/* Ürün Grid */}
            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination currentPage={filters.sayfa || 1} totalPages={totalPages} />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}