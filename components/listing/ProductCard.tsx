'use client'
import Link from 'next/link'
import { Product } from '@/types/product'
import { useMemo, useState } from 'react'

interface ProductCardProps {
  product: Product
}

// Yardımcı fonksiyon: ID tabanlı belirgin ama tutarlı sayı üretir
const generateFallbackProductCode = (product: Product): string => {
  const title = product.isim?.trim()
  if (!title) return 'OS-N/A'

  const firstChar = title.charAt(0).toLocaleUpperCase('tr-TR')
  const lastChar = title.at(-1)?.toLocaleUpperCase('tr-TR') || ''
  
  // ID'yi kullanarak deterministik "random" 5 haneli sayı üretiyoruz
  // Her ürün için sabit kalır, yeniden yüklemede değişmez
  const seed = product.id.toString()
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash = hash & hash // Integer overflow protection
  }
  const randomNumber = Math.abs(hash % 90000).toString().padStart(5, '0')
  
  return `OS-${firstChar}${lastChar}-${randomNumber}`
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imageError, setImageError] = useState(false)
  const productCode = useMemo(
    () =>
      product.urunKodu?.trim()
        ? product.urunKodu.trim()
        : generateFallbackProductCode(product),
    [product.id, product.isim, product.urunKodu]
  )

  return (
    <Link
      href={`/urunler/${product.id}`}
      className="group overflow-hidden"
    >
      {/* Görsel */}
      <div className="relative aspect-square rounded-xl bg-gray-100 overflow-hidden">
        {!imageError && product.resim ? (
          <img
            src={product.resim}
            alt={product.isim}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          // Placeholder - görsel yok veya hata durumu
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
            <div className="text-center">
              <i className="ri-image-line text-6xl text-gray-300 mb-2"></i>
            </div>
          </div>
        )}
        
        {/* Popüler badge */}
        {product.populer && (
          <span className="absolute top-3 right-3 px-3 py-1 bg-[#FF3C00] text-white text-xs font-semibold rounded-full z-10">
            Popüler
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* İçerik */}
      <div className="py-5 space-y-2">
        {/* Ürün Kodu */}
        <p className="text-xs sm:text-sm font-bold text-[#FF3C00] tracking-wider uppercase font-mono">
          {productCode}
        </p>

        {/* Ürün Adı */}
        <h3 className="text-base font-bold text-gray-900 line-clamp-2 leading-6">
          {product.isim}
        </h3>

        {/* Araç Marka/Model */}
        <p className="text-sm text-gray-600 flex items-center gap-1.5">
          <i className="ri-car-line text-gray-400 w-4 h-4 flex-shrink-0" />
          {product.marka} • {product.model}
        </p>

        {/* Fiyat */}
        <div className="pt-3 border-t border-gray-100 mt-1">
          <p className="text-2xl font-bold text-[#FF3C00]">
            {product.fiyat.toLocaleString('tr-TR')} ₺
          </p>
        </div>
      </div>
    </Link>
  )
}