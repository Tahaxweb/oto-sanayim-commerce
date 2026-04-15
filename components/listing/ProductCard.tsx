'use client'
import Image from 'next/image'
import Link from 'next/link'
import { Product } from '@/types/product'
import { useMemo, useState } from 'react'

interface ProductCardProps {
  product: Product
}

// Yardımcı fonksiyon: ID tabanlı belirgin ama tutarlı sayı üretir
const generateProductCode = (product: Product): string => {
  if (!product.kategori) return 'OS-N/A'
  
  // Kategori ilk ve son harfler (Büyük harf)
  const firstChar = product.kategori.charAt(0).toUpperCase()
  const lastChar = product.kategori.at(-1)?.toUpperCase() || ''
  
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
  const productCode = useMemo(() => generateProductCode(product), [product.id, product.kategori])

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
          <span className="absolute top-3 right-3 px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-full z-10">
            Popüler
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* İçerik */}
      <div className="py-5 space-y-2">
        {/* Ürün Kodu */}
        <p className="text-xs sm:text-sm font-bold text-orange-600 tracking-wider uppercase font-mono">
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
          <p className="text-2xl font-bold text-orange-600">
            {product.fiyat.toLocaleString('tr-TR')} ₺
          </p>
        </div>
      </div>
    </Link>
  )
}