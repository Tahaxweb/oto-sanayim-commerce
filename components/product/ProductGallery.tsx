'use client'
import { useState } from 'react'
import { Product } from '@/types/product'

export default function ProductGallery({ product }: { product: Product }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageError, setImageError] = useState(false)

  // Mock: Birden fazla görsel varsa (şimdilik tek görsel)
  // Boş string kontrolü ekledik
  const images = product.resim 
    ? [product.resim, product.resim, product.resim, product.resim]
    : []

  const hasValidImage = images.length > 0 && images[selectedImage]

  return (
    <div className="space-y-4">
      {/* Ana Görsel */}
      <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden ">
        {hasValidImage && !imageError ? (
          <img
            src={images[selectedImage]}
            alt={product.isim}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-50">
            <div className="text-center">
              <i className="ri-image-line text-7xl text-gray-300 mb-3"></i>
              <p className="text-sm text-gray-400 font-medium">Görsel Mevcut Değil</p>
            </div>
          </div>
        )}

        {/* Zoom badge - sadece görsel varsa göster */}
        {hasValidImage && !imageError && (
          <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-lg text-xs text-gray-600 font-medium shadow-sm">
            <i className="ri-zoom-in-line mr-1"></i>
            Yakınlaştır
          </div>
        )}
      </div>

      {/* Thumbnail'ler - sadece görsel varsa göster */}
      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-xl border-2 overflow-hidden transition-all ${
                selectedImage === index
                  ? 'border-[#FF3C00] ring-2 ring-[#FF3C00]/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {img ? (
                <img
                  src={img}
                  alt={`${product.isim} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Thumbnail hatasında da placeholder göster
                    e.currentTarget.style.display = 'none'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <i className="ri-image-line text-2xl text-gray-300"></i>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}