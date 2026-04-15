import { Product } from '@/types/product'

export default function ProductSpecs({ product }: { product: Product }) {
  const specs = [
    { label: 'Marka', value: product.marka },
    { label: 'Model', value: product.model },
    { label: 'Kategori', value: product.kategori },
    { label: 'Ürün Kodu', value: product.id.toUpperCase() },
    { label: 'Garanti', value: '2 Yıl' },
    { label: 'Menşei', value: 'Türkiye / Almanya' },
  ]

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-12">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <i className="ri-settings-4-line text-[#FF3C00]"></i>
        Teknik Özellikler
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
          >
            <span className="text-sm text-gray-600">{spec.label}</span>
            <span className="text-sm font-semibold text-gray-900">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}