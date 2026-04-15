import { Product } from '@/types/product'
import ProductCard from './ProductCard'
import Button from '../ui/Button'

export default function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-6 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-100/50 rounded-full blur-3xl" />
          <i className="ri-search-line text-6xl text-gray-300 mb-6 relative" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
        <p className="text-gray-600 text-center max-w-sm mb-6">
          Aradığınız kriterlere uygun ürün bulunamadı. Filtreleri değiştirerek tekrar deneyin.
        </p>
        <Button
          onClick={() => window.location.href = '/urunler'}
         
        >
          <i className="ri-refresh-line" />
          Filtreleri Sıfırla
        </Button>
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