import Link from 'next/link'
import { Product } from '@/types/product'
import ProductCard from './ProductCard'

export default function ProductGrid({
  products,
  filtersActive = false,
}: {
  products: Product[]
  filtersActive?: boolean
}) {
  if (products.length === 0) {
    const title = filtersActive
      ? 'Filtrelerinize uygun ürün bulunamadı'
      : 'Listelenecek ürün yok'
    const description = filtersActive
      ? 'Seçtiğiniz filtrelere uygun ürün bulunamadı. Kriterleri değiştirmeyi veya filtreleri sıfırlamayı deneyebilirsiniz.'
      : 'Şu anda gösterilecek ürün bulunmuyor.'

    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-100/50 rounded-full blur-3xl" />
          <i className="ri-search-line text-6xl text-gray-300 mb-6 relative" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-center max-w-sm mb-6">{description}</p>
        {filtersActive && (
          <Link
            href="/urunler"
            className="inline-flex items-center justify-center gap-2 font-medium px-4 py-2.5 text-sm rounded-xl bg-[#FF3C00] text-white hover:bg-[#e63600] transition-all duration-200"
          >
            <i className="ri-refresh-line" />
            Filtreleri sıfırla
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, i) => (
        <div
          key={i}
          className="bg-white border border-gray-100 rounded-2xl overflow-hidden"
        >
          {/* Image skeleton */}
          <div className="aspect-square bg-gradient-to-br from-gray-100 via-gray-50 to-gray-100 animate-pulse" />
          
          {/* Content skeleton */}
          <div className="p-5 space-y-3">
            {/* Code */}
            <div className="h-3 bg-gray-100 rounded-md w-28 animate-pulse" />
            
            {/* Title */}
            <div className="space-y-2">
              <div className="h-4 bg-gray-100 rounded-md w-full animate-pulse" />
              <div className="h-4 bg-gray-100 rounded-md w-4/5 animate-pulse" />
            </div>
            
            {/* Brand/Model */}
            <div className="h-3 bg-gray-100 rounded-md w-1/2 animate-pulse" />
            
            {/* Price */}
            <div className="pt-3 border-t border-gray-100">
              <div className="h-6 bg-gray-100 rounded-md w-24 animate-pulse" />
            </div>
          </div>
          
          {/* Footer */}
          <div className="px-5 pb-4">
            <div className="h-3 bg-gray-100 rounded-md w-32 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  )
}