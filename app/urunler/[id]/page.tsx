import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { fetchProducts } from '@/lib/api/products'
import ProductGallery from '@/components/product/ProductGallery'
import ProductInfo from '@/components/product/ProductInfo'
import ProductSpecs from '@/components/product/ProductSpecs'
import RelatedProducts from '@/components/product/RelatedProducts'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  
  // Ürünü bul
  const { products } = await fetchProducts({})
  const product = products.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  // WhatsApp mesajı hazırla
  const whatsappMessage = `Merhaba, ${product.isim} (${product.marka} ${product.model}) ürünü hakkında bilgi almak istiyorum. Ürün Kodu: #${id.toUpperCase()}`
  const whatsappLink = `https://wa.me/905551234567?text=${encodeURIComponent(whatsappMessage)}`

  // İlgili ürünler (aynı kategori)
  const relatedProducts = products
    .filter((p) => p.kategori === product.kategori && p.id !== product.id)
    .slice(0, 4)

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-600 transition-colors">Ana Sayfa</Link>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <Link href="/urunler" className="hover:text-orange-600 transition-colors">Ürünler</Link>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <Link href={`/urunler?kategori=${product.kategori}`} className="hover:text-orange-600 transition-colors">
              {product.kategori}
            </Link>
            <i className="ri-arrow-right-s-line text-gray-400" />
            <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.isim}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Üst Bölüm: Galeri + Bilgiler */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-12">
          {/* Sol: Galeri */}
          <ProductGallery product={product} />

          {/* Sağ: Ürün Bilgileri */}
          <ProductInfo product={product} whatsappLink={whatsappLink} />
        </div>

        {/* Teknik Özellikler */}
        <ProductSpecs product={product} />

        {/* İlgili Ürünler */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} />
        )}
      </div>
    </div>
  )
}