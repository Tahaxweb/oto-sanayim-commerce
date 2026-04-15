'use client'
import { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import Button from '../ui/Button'
import { useRouter } from 'next/navigation'

const BRANDS = [
  'Ford', 'Renault', 'Volkswagen'
]

const MODELS = {
  'Renault': ['Clio', 'Megane', 'Fluence', 'Talisman', 'Kadjar'],
  'Ford': ['Fiesta', 'Focus', 'Mondeo', 'Kuga', 'Transit'],
  'Volkswagen': ['Golf', 'Polo', 'Passat', 'Tiguan', 'Jetta'],
}

function Hero() {
  const router = useRouter()
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (selectedBrand) params.set('marka', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)
    router.push(`/urunler?${params.toString()}`)
  }

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Content */}
      <div className="max-w-5xl w-full space-y-10 text-center">
        {/* Badge */}
        <div className="flex justify-center animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-sm text-orange-700 font-medium">
            <i className="ri-flashlight-fill text-orange-500"></i>
            Türkiye'nin en hızlı yedek parça platformu
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:200ms]">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            Aracın İçin{' '}
            <span className="relative inline-block">
              <span className="text-[#FF3C00]">Doğru Parçayı</span>
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 300 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 5.5C50 2.5 100 1 150 1C200 1 250 2.5 299 5.5"
                  stroke="#FF3C00"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            {' '}Saniyeler İçinde Bul
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto"> orijinal veya yan sanayi yedek parçalar arasından aracınıza <b className="text-gray-900">en uygun parçayı</b> saniyeler içinde bulun. <b className="text-gray-900">Güvenli alışveriş</b>, <b className="text-gray-900">hızlı teslimat</b>.
          </p>
        </div>

        {/* Search Box */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:400ms]">
          <div className="bg-white rounded-2xl border border-gray-100 p-3 max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Marka Select */}
              <div className="relative flex-1 group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${
                  selectedBrand ? 'text-gray-900' : 'text-gray-400 group-focus-within:text-gray-900'
                }`}>
                  <i className="ri-car-line text-xl"></i>
                </div>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value)
                    setSelectedModel('')
                  }}
                  className={`w-full font-medium h-12 pl-12 pr-10 bg-gray-50 hover:bg-gray-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl text-base appearance-none cursor-pointer outline-none transition-all ${
                    selectedBrand ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  <option value="">Marka Seçin</option>
                  {BRANDS.map((brand) => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
                <i className={`ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl transition-colors ${
                  selectedBrand ? 'text-gray-900' : 'text-gray-400 group-focus-within:text-gray-900'
                }`}></i>
              </div>

              {/* Model Select */}
              <div className="relative flex-1 group">
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${
                  selectedModel ? 'text-gray-900' : 'text-gray-400 group-focus-within:text-gray-900'
                }`}>
                  <i className="ri-steering-2-line text-xl"></i>
                </div>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={!selectedBrand}
                  className={`w-full font-medium h-12 pl-12 pr-10 bg-gray-50 hover:bg-gray-100 border-2 border-transparent focus:border-orange-500 focus:bg-white rounded-xl text-base appearance-none cursor-pointer outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 ${
                    selectedModel ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  <option value="">Model Seçin</option>
                  {selectedBrand && MODELS[selectedBrand as keyof typeof MODELS]?.map((model) => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                <i className={`ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl transition-colors ${
                  selectedModel ? 'text-gray-900' : 'text-gray-400 group-focus-within:text-gray-900'
                }`}></i>
              </div>

              {/* Search Button */}
              <div className='sm:w-fit w-full'>
                <Button
                  onClick={handleSearch}
                  disabled={!selectedBrand || !selectedModel}
                >
                  <b>
                    <i className="ri-search-line text-xl"></i>
                    <span className="ml-2">Ara</span>
                  </b>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero