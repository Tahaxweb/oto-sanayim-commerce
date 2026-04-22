import { notFound } from 'next/navigation'
import Link from 'next/link'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductSpecs from '@/components/product/ProductSpecs'
import RelatedProducts from '@/components/product/RelatedProducts'
import { getProductById, getRelatedProducts } from '@/lib/product-detail'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product, 4)

  const kod = product.urunKodu?.trim() || id.slice(0, 8).toUpperCase()
  const whatsappMessage = `Merhaba, ${product.isim} (${product.marka} ${product.model}) ürünü hakkında bilgi almak istiyorum. Ürün Kodu: ${kod}`
  const whatsappLink = `https://wa.me/905360142818?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <Link href="/" className="hover:text-[#FF3C00] transition-colors">Ana Sayfa</Link>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <Link href="/urunler" className="hover:text-[#FF3C00] transition-colors">Ürünler</Link>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.isim}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          <ProductGallery product={product} />
          <ProductInfo product={product} whatsappLink={whatsappLink} />
        </div>

        <ProductSpecs product={product} />

        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  )
}
