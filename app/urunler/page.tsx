import { Suspense } from 'react'
import SidebarFilters from '@/components/listing/SidebarFilters'
import ProductGrid, { ProductGridSkeleton } from '@/components/listing/ProductGrid'
import Pagination from '@/components/listing/Pagination'
import SortDropdown from '@/components/listing/SortDropdown'
import ActiveFilters from '@/components/listing/ActiveFilters'
import { ProductFilters } from '@/types/product'
import { getListingProducts } from '@/lib/listing-products'

function filtersAreActive(f: ProductFilters): boolean {
  return !!(
    f.marka?.trim() ||
    f.model?.trim() ||
    f.kategori?.trim() ||
    (f.fiyatMin != null && !Number.isNaN(f.fiyatMin)) ||
    (f.fiyatMax != null && !Number.isNaN(f.fiyatMax))
  )
}

async function ProductListingSection({ filters }: { filters: ProductFilters }) {
  const { products, total, totalPages, page } = await getListingProducts(filters)
  const filtersActive = filtersAreActive(filters)

  return (
    <>
      <p className="text-sm text-gray-500 mb-4">
        {total === 0
          ? filtersActive
            ? 'Filtrelerinize uygun ürün bulunamadı.'
            : 'Listelenecek ürün yok.'
          : `${total} ürün${totalPages > 1 ? ` · Sayfa ${page} / ${totalPages}` : ''}`}
      </p>
      <ProductGrid products={products} filtersActive={filtersActive} />
      <div className="mt-8 flex justify-center">
        <Pagination currentPage={page} totalPages={totalPages} />
      </div>
    </>
  )
}

export default async function ListingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams

  const filters: ProductFilters = {
    marka: typeof sp.marka === 'string' ? sp.marka : undefined,
    model: typeof sp.model === 'string' ? sp.model : undefined,
    kategori: typeof sp.kategori === 'string' ? sp.kategori : undefined,
    fiyatMin: sp.fiyatMin ? Number(sp.fiyatMin) : undefined,
    fiyatMax: sp.fiyatMax ? Number(sp.fiyatMax) : undefined,
    siralama: typeof sp.siralama === 'string' ? sp.siralama : 'populer',
    sayfa: sp.sayfa ? Number(sp.sayfa) : 1,
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <a href="/" className="hover:text-[#FF3C00] transition-colors">Ana Sayfa</a>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <span className="font-medium text-gray-900">Ürünler</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-80 flex-shrink-0">
            <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <SidebarFilters initialFilters={filters} />
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    Yedek Parçalar
                  </h1>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-700 font-semibold">
                      <i className="ri-box-3-line" />
                      Ürün
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
                    {filters.kategori && (
                      <span className="text-gray-600">
                        • <span className="font-medium">{filters.kategori}</span>
                      </span>
                    )}
                  </div>
                </div>

                <SortDropdown currentSort={filters.siralama || 'populer'} />
              </div>

              {(filters.marka ||
                filters.model ||
                filters.kategori ||
                filters.fiyatMin ||
                filters.fiyatMax) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <ActiveFilters filters={filters} />
                </div>
              )}
            </div>

            <Suspense fallback={<ProductGridSkeleton />}>
              <ProductListingSection filters={filters} />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  )
}
