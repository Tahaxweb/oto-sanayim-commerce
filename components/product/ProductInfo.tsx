'use client'
import { Product } from '@/types/product'
import { useMemo, useState, useEffect } from 'react'

// Ürün kodu oluşturma (ProductCard'taki ile aynı)
const generateFallbackProductCode = (product: Product): string => {
  const title = product.isim?.trim()
  if (!title) return 'OS-N/A'
  const firstChar = title.charAt(0).toLocaleUpperCase('tr-TR')
  const lastChar = title.at(-1)?.toLocaleUpperCase('tr-TR') || ''
  const seed = product.id.toString()
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash = hash & hash
  }
  const randomNumber = Math.abs(hash % 90000).toString().padStart(5, '0')
  return `OS-${firstChar}${lastChar}-${randomNumber}`
}

// Çalışma saatleri kontrolü
const checkWorkingHours = () => {
  const now = new Date()
  const day = now.getDay() // 0 = Pazar, 1 = Pazartesi, ...
  const hours = now.getHours()
  
  // Pazar günü değil VE saat 10-17 arası
  const isWorkingDay = day !== 0
  const isWorkingHours = hours >= 10 && hours < 17
  
  return {
    isAvailable: isWorkingDay && isWorkingHours,
    day,
    hours
  }
}

// Sonraki çalışma saati mesajı
const getNextAvailableMessage = (day: number, hours: number) => {
  if (day === 0) { // Pazar
    return 'Pazartesi 10:00\'da tekrar açılacağız'
  }
  if (hours < 10) {
    return 'Bugün 10:00\'da açılacağız'
  }
  if (hours >= 17) {
    if (day === 6) { // Cumartesi akşamı
      return 'Pazartesi 10:00\'da tekrar açılacağız'
    }
    return 'Yarın 10:00\'da tekrar açılacağız'
  }
  return ''
}

interface ProductInfoProps {
  product: Product
  whatsappLink: string
}

export default function ProductInfo({ product, whatsappLink }: ProductInfoProps) {
  const productCode = useMemo(
    () =>
      product.urunKodu?.trim()
        ? product.urunKodu.trim()
        : generateFallbackProductCode(product),
    [product.id, product.isim, product.urunKodu]
  )
  const [workingStatus, setWorkingStatus] = useState(() => checkWorkingHours())

  // Her dakika kontrol et (opsiyonel - anlık güncelleme için)
  useEffect(() => {
    const interval = setInterval(() => {
      setWorkingStatus(checkWorkingHours())
    }, 60000) // 1 dakikada bir

    return () => clearInterval(interval)
  }, [])

  const nextAvailableMsg = getNextAvailableMessage(workingStatus.day, workingStatus.hours)

  return (
    <div className="space-y-6">
      {product.populer && (
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-red-50 text-red-700 text-sm font-semibold rounded-full flex items-center gap-1">
            <i className="ri-fire-line"></i>
            Popüler
          </span>
        </div>
      )}

      {/* Başlık */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {product.isim}
        </h1>
        <p className="text-sm text-[#FF3C00] font-mono">{productCode}</p>
      </div>

      {/* Fiyat */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-[#FF3C00]">
          {product.fiyat.toLocaleString('tr-TR')} ₺
        </span>
        <span className="text-sm text-gray-500">KDV Dahil</span>
      </div>

      {/* Araç Bilgisi */}
      <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <i className="ri-car-line text-xl text-[#FF3C00]"></i>
          <div>
            <p className="text-sm text-gray-500">Uyumlu Araç</p>
            <p className="font-semibold">{product.marka} {product.model}</p>
          </div>
        </div>
      </div>

      {/* Stok Durumu */}
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-green-700">Stokta Mevcut</span>
        <span className="text-sm text-gray-500">• 1-2 iş günü içinde kargo</span>
      </div>

      {/* Çalışma Saatleri Uyarısı */}
      {!workingStatus.isAvailable && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
          <i className="ri-time-line text-xl text-amber-600 mt-0.5"></i>
          <div>
            <p className="text-sm font-semibold text-amber-900">Mesai Dışı</p>
            <p className="text-sm text-amber-700 mt-1">
              Çalışma saatlerimiz: <b>Pazartesi-Cumartesi 10:00-17:00</b>
            </p>
            <p className="text-xs text-amber-600 mt-1">{nextAvailableMsg}</p>
          </div>
        </div>
      )}

      {/* WhatsApp Sipariş Butonu */}
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-3 w-full h-14 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all duration-300 "
      >
        <i className="ri-whatsapp-line text-2xl"></i>
        <span>WhatsApp ile Sipariş Ver</span>
      </a>

      {/* Alternatif İletişim */}
      <div className="flex gap-3">
        {/* Telefon - sadece çalışma saatlerinde aktif */}
        {workingStatus.isAvailable ? (
          <a
            href="tel:+905360142818"
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
          >
            <i className="ri-phone-line text-lg"></i>
            Ara
          </a>
        ) : (
          <button
            disabled
            className="flex-1 flex items-center justify-center gap-2 h-12 bg-gray-100 text-gray-400 font-medium rounded-xl cursor-not-allowed opacity-60"
            title="Çalışma saatleri dışında arama yapılamaz"
          >
            <i className="ri-phone-line text-lg"></i>
            Ara
          </button>
        )}

        {/* SMS - her zaman aktif */}
        <a
          href="sms:+905360142818"
          className="flex-1 flex items-center justify-center gap-2 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
        >
          <i className="ri-message-3-line text-lg"></i>
          SMS
        </a>
      </div>

    

      {/* Güven Badgeleri */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div className="text-center">
          <i className="ri-shield-check-line text-2xl text-[#FF3C00] mb-1"></i>
          <p className="text-xs text-gray-600 font-medium">Güvenli Ödeme</p>
        </div>
        <div className="text-center">
          <i className="ri-truck-line text-2xl text-[#FF3C00] mb-1"></i>
          <p className="text-xs text-gray-600 font-medium">Hızlı Kargo</p>
        </div>
        <div className="text-center">
          <i className="ri-customer-service-2-line text-2xl text-[#FF3C00] mb-1"></i>
          <p className="text-xs text-gray-600 font-medium">7/24 Destek</p>
        </div>
      </div>
    </div>
  )
}