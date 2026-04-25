'use client'
import { useState } from 'react'
import 'remixicon/fonts/remixicon.css'
import Button from '../ui/Button'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

type Brand = {
  id: string;
  name: string;
  models: { id: string; name: string }[];
};

type Category = {
  id: string;
  name: string;
};

function Hero() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [brRes, catRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);
        const bJson = await brRes.json();
        const cJson = await catRes.json();
        if (Array.isArray(bJson)) {
          setBrands(bJson);
        } else {
          console.error("API hatası:", bJson);
          setBrands([]);
        }
        if (Array.isArray(cJson)) {
          setCategories(
            cJson
              .map((c: { id: string; name: string }) => ({ id: c.id, name: c.name }))
              .sort((a: Category, b: Category) =>
                a.name.localeCompare(b.name, "tr")
              )
          );
        } else {
          setCategories([]);
        }
      } catch (err) {
        console.error("Fetch hatası:", err);
        setBrands([]);
        setCategories([]);
      }
    };

    load();
  }, []);

  // Seçilen markaya göre modelleri filtrele
  const filteredModels = selectedBrand
    ? brands.find(b => b.id === selectedBrand)?.models || []
    : [];

  const handleSearch = () => {
    if (!selectedBrand || !selectedModel) return
    const brand = brands.find((b) => b.id === selectedBrand)
    const model = brand?.models.find((m) => m.id === selectedModel)
    if (!brand || !model) return
    const params = new URLSearchParams()
    params.set('marka', brand.name)
    params.set('model', model.name)
    if (selectedCategory) {
      const cat = categories.find((c) => c.id === selectedCategory);
      if (cat) params.set('kategori', cat.name);
    }
    router.push(`/urunler?${params.toString()}`)
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Content */}
      <div className="max-w-5xl w-full space-y-10 text-center">
        {/* Badge */}
        <div className="flex justify-center animate-in fade-in duration-700">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-100 rounded-full text-sm text-orange-700 font-medium">
            <i className="ri-flashlight-fill text-[#FF3C00]"></i>
            Türkiye'nin revizyonlu kaliper platformu
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:200ms]">
          <h1 className="font-bold text-4xl sm:text-5xl lg:text-6xl max-w-4xl mx-auto leading-tight">
            Aracın İçin{' '}
            <span className="relative inline-block">
              <span className="text-[#FF3C00]">Doğru Kaliperi</span>
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
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Türkiye'nin ilk ve tek <b className="text-gray-900">revizyonlu kaliper</b> satış platformu olarak, güvenilir ve yüksek kaliteli çözümleri kullanıcılarla buluşturuyoruz.
          </p>
        </div>

        {/* Search Box */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 [animation-delay:400ms]">
          <div className="bg-white rounded-2xl border border-gray-100 p-3 max-w-4xl mx-auto space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:items-end">
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
                    setSelectedCategory('')
                  }}
                  className={`w-full font-medium h-12 pl-12 pr-10 bg-gray-50 hover:bg-gray-100 border-2 border-transparent focus:border-[#FF3C00] focus:bg-white rounded-xl text-base appearance-none cursor-pointer outline-none transition-all ${
                    selectedBrand ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  <option value="">Marka Seçin</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
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
                  onChange={(e) => {
                    const v = e.target.value
                    setSelectedModel(v)
                    if (!v) setSelectedCategory('')
                  }}
                  disabled={!selectedBrand}
                  className={`w-full font-medium h-12 pl-12 pr-10 bg-gray-50 hover:bg-gray-100 border-2 border-transparent focus:border-[#FF3C00] focus:bg-white rounded-xl text-base appearance-none cursor-pointer outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 ${
                    selectedModel ? 'text-gray-900' : 'text-gray-500'
                  }`}
                >
                  <option value="">Model Seçin</option>
                  {filteredModels.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.name}
                    </option>
                  ))}
                </select>
                <i className={`ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl transition-colors ${
                  selectedModel ? 'text-gray-900' : 'text-gray-400 group-focus-within:text-gray-900'
                }`}></i>
              </div>

              {/* Kategori */}
              <div className="relative flex-1 group sm:col-span-2 lg:col-span-1">
                <div
                  className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors z-10 ${
                    selectedCategory
                      ? "text-gray-900"
                      : "text-gray-400 group-focus-within:text-gray-900"
                  }`}
                >
                  <i className="ri-price-tag-3-line text-xl"></i>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  disabled={
                    categories.length === 0 ||
                    !selectedBrand ||
                    !selectedModel
                  }
                  className={`w-full font-medium h-12 pl-12 pr-10 bg-gray-50 hover:bg-gray-100 border-2 border-transparent focus:border-[#FF3C00] focus:bg-white rounded-xl text-base appearance-none cursor-pointer outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-gray-50 ${
                    selectedCategory ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  <option value="">
                    {categories.length === 0
                      ? "Kategori yok"
                      : "Kategori seçin"}
                  </option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <i
                  className={`ri-arrow-down-s-line absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-xl transition-colors ${
                    selectedCategory
                      ? "text-gray-900"
                      : "text-gray-400 group-focus-within:text-gray-900"
                  }`}
                ></i>
              </div>
            </div>

            {/* Ara — selectlerin altında, sağda */}
            <div className="flex justify-end w-full min-w-0">
              <div className="w-48 max-w-full">
                <Button
                  onClick={handleSearch}
                  disabled={!selectedBrand || !selectedModel}
                  fullWidth
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