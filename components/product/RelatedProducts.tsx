import Link from 'next/link'
import { Product } from '@/types/product'
import ProductCard from '@/components/listing/ProductCard'

export default function RelatedProducts({ products }: { products: Product[] }) {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <i className="ri-recycle-line text-[#FF3C00]"></i>
          İlgili Ürünler
        </h2>
        <Link
          href="/urunler"
          className="text-sm font-medium text-[#FF3C00] hover:text-orange-700 flex items-center gap-1"
        >
          Tümünü Gör <i className="ri-arrow-right-line"></i>
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}