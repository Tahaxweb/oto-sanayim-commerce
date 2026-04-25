import Link from 'next/link'
import Hero from '@/components/home/Hero'
import ProductGrid from '@/components/listing/ProductGrid'
import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { prisma } from '@/lib/prisma'
import { apiProductToStorefront, type ApiProduct } from '@/lib/product-mapper'
import type { Product } from '@/types/product'

export const revalidate = 120

async function getHomeProducts(): Promise<{
  allProducts: Product[]
  byCategory: Array<{ category: string; products: Product[] }>
}> {
  const rows = await prisma.product.findMany({
    include: {
      brand: true,
      model: true,
      category: true,
    },
    orderBy: [{ popular: 'desc' }, { createdAt: 'desc' }],
  })

  const allProducts = rows.map((p) =>
    apiProductToStorefront(p as unknown as ApiProduct)
  )

  const grouped = new Map<string, Product[]>()
  for (const p of allProducts) {
    const key = p.kategori?.trim() || 'Diğer'
    const arr = grouped.get(key) ?? []
    if (arr.length < 10) arr.push(p)
    grouped.set(key, arr)
  }

  const byCategory = Array.from(grouped.entries())
    .sort((a, b) => a[0].localeCompare(b[0], 'tr'))
    .map(([category, products]) => ({ category, products }))

  return { allProducts, byCategory }
}

export default async function Home() {
  const { allProducts, byCategory } = await getHomeProducts()

  return (
    <>
      <Navbar />
      <Hero />

      <section className="bg-gray-50/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Bütün Ürünler
              </h2>
              <Link
                href="/urunler"
                className="text-sm font-semibold text-[#FF3C00] hover:underline"
              >
                Tümünü Gör
              </Link>
            </div>
            <ProductGrid products={allProducts} />
          </div>

          {byCategory.map((section) => (
            <div key={section.category}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {section.category}
                </h3>
                <Link
                  href={`/urunler?kategori=${encodeURIComponent(section.category)}`}
                  className="text-sm font-semibold text-[#FF3C00] hover:underline"
                >
                  Kategorideki Tüm Ürünler
                </Link>
              </div>
              <ProductGrid products={section.products} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </>
  )
}
