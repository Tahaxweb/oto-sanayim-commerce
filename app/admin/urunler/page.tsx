'use client';

import { useState, useEffect, useMemo } from 'react';
import { useEdgeStore } from '@/lib/edgestore';
import Button from '@/components/ui/Button';
import { generateProductCodeCandidate } from '@/lib/product-code-generate';
import {
  WARRANTY_FORM_OPTIONS,
  warrantyToTrLabel,
  type WarrantyValue,
} from '@/lib/warranty';
import 'remixicon/fonts/remixicon.css';

type Brand = {
  id: string;
  name: string;
};

type Model = {
  id: string;
  name: string;
  brandId: string;
};

type Product = {
  id: string;
  productCode?: string | null;
  name: string;
  price: number;
  image: string;
  images?: string[];
  popular: boolean;
  warranty?: WarrantyValue;
  brandId: string;
  modelId: string;
};

export default function AdminProducts() {
  const { edgestore } = useEdgeStore();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [error, setError] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    brandId: '',
    modelId: '',
    popular: false,
    warranty: 'NONE' as WarrantyValue,
  });

  const [editingId, setEditingId] = useState<string | null>(null);
  const [savedProductCode, setSavedProductCode] = useState<string | null>(null);
  const [originalBrandModel, setOriginalBrandModel] = useState<{
    brandId: string;
    modelId: string;
  } | null>(null);

  // Verileri yükle
  useEffect(() => {
    fetchBrands();
    fetchModels();
    fetchProducts();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/brands');
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Markalar yüklenemedi:', err);
    }
  };

  const fetchModels = async () => {
    try {
      const res = await fetch('/api/models');
      const data = await res.json();
      setModels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Modeller yüklenemedi:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/products', { cache: 'no-store' });
      const data = await res.json();
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Ürünler yüklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    try {
      setUploading(true);
      setError('');
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        const res = await edgestore.myPublicImages.upload({ file });
        newUrls.push(res.url);
      }
      setUploadedImageUrls((prev) => [...prev, ...newUrls]);
    } catch (error) {
      console.error('Resim yükleme hatası:', error);
      setError('Resim yüklenirken bir hata oluştu.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const removeImageAt = (index: number) => {
    setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.brandId || !formData.modelId) {
      alert('Tüm alanları doldurunuz');
      return;
    }

    if (uploadedImageUrls.length === 0) {
      alert('En az bir ürün görseli ekleyin');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        image: uploadedImageUrls[0],
        images: uploadedImageUrls,
        popular: formData.popular,
        warranty: formData.warranty,
        brandId: formData.brandId,
        modelId: formData.modelId,
      };

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        cache: 'no-store',
      });

      if (!res.ok) {
        const errBody = await res.json().catch(() => ({})) as {
          error?: string;
          details?: string;
        };
        const detail =
          typeof errBody.details === 'string' ? errBody.details.trim() : '';
        const errMsg =
          typeof errBody.error === 'string' ? errBody.error.trim() : '';
        const msg = detail
          ? errMsg && errMsg !== detail
            ? `${errMsg}: ${detail}`
            : detail
          : errMsg || 'Ürün kaydedilemedi';
        throw new Error(msg);
      }

      const saved = await res.json().catch(() => null) as {
        productCode?: string | null;
      } | null;
      if (!editingId && saved?.productCode) {
        alert(`Ürün eklendi. Ürün kodu: ${saved.productCode}`);
      } else {
        alert(editingId ? 'Ürün güncellendi' : 'Ürün eklendi');
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error('Hata:', err);
      alert(err instanceof Error ? err.message : 'Bir hata oluştu');
    }
  };

  // Ürün düzenleme
  const handleEdit = (product: Product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      brandId: product.brandId,
      modelId: product.modelId,
      popular: product.popular,
      warranty: product.warranty ?? 'NONE',
    });
    const imgs =
      product.images && product.images.length > 0
        ? product.images
        : product.image
          ? [product.image]
          : [];
    setUploadedImageUrls(imgs);
    setSavedProductCode(product.productCode ?? null);
    setOriginalBrandModel({
      brandId: product.brandId,
      modelId: product.modelId,
    });
    setEditingId(product.id);
  };

  // Ürün sil
  const handleDelete = async (id: string) => {
    if (!confirm('Ürünü silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Silinemedi');

      alert('Ürün silindi');
      fetchProducts();
    } catch (err) {
      console.error('Hata:', err);
      alert('Ürün silinemedi');
    }
  };

  // Form sıfırla
  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      brandId: '',
      modelId: '',
      popular: false,
      warranty: 'NONE',
    });
    setUploadedImageUrls([]);
    setEditingId(null);
    setSavedProductCode(null);
    setOriginalBrandModel(null);
    setError('');
  };

  // Seçilen markaya ait modelleri filtrele
  const filteredModels = models.filter(m => m.brandId === formData.brandId);

  const brandName =
    brands.find((b) => b.id === formData.brandId)?.name ?? '';
  const modelName =
    filteredModels.find((m) => m.id === formData.modelId)?.name ?? '';

  const previewProductCode = useMemo(() => {
    if (!brandName || !modelName) return '';
    return generateProductCodeCandidate(brandName, modelName);
  }, [brandName, modelName]);

  const codeWillChangeOnSave =
    Boolean(editingId && originalBrandModel) &&
    (formData.brandId !== originalBrandModel!.brandId ||
      formData.modelId !== originalBrandModel!.modelId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Ürün Yönetimi</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingId ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Görseller */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Görselleri
                  </label>
                  <div className="relative">
                    {uploadedImageUrls.length > 0 && (
                      <div className="mb-3 grid grid-cols-2 gap-2">
                        {uploadedImageUrls.map((url, idx) => (
                          <div
                            key={`${url}-${idx}`}
                            className="relative aspect-video rounded-lg overflow-hidden border border-gray-200"
                          >
                            <img
                              src={url}
                              alt={`Görsel ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => removeImageAt(idx)}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded"
                              aria-label="Görseli kaldır"
                            >
                              <i className="ri-close-line"></i>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input
                      type="file"
                      onChange={handleFilesChange}
                      accept="image/*"
                      multiple
                      disabled={uploading}
                      className="w-full h-16 text-lg px-6 border-2 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {uploading && (
                      <p className="text-sm text-blue-600 mt-2">Resim yükleniyor...</p>
                    )}
                    {error && (
                      <p className="text-sm text-red-600 mt-2">{error}</p>
                    )}
                  </div>
                </div>

                {/* Ürün Adı */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ürün Adı
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent outline-none"
                    placeholder="Örn: Ön Kaliper Seti"
                  />
                </div>

                {/* Fiyat */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent outline-none"
                    placeholder="1500"
                  />
                </div>

                {/* Marka */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marka
                  </label>
                  <select
                    value={formData.brandId}
                    onChange={(e) =>
                      setFormData({ ...formData, brandId: e.target.value, modelId: '' })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent outline-none"
                  >
                    <option value="">Marka Seçin</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Model */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Model
                  </label>
                  <select
                    value={formData.modelId}
                    onChange={(e) => setFormData({ ...formData, modelId: e.target.value })}
                    disabled={!formData.brandId}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Model Seçin</option>
                    {filteredModels.map((model) => (
                      <option key={model.id} value={model.id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Garanti */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Garanti
                  </label>
                  <select
                    value={formData.warranty}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        warranty: e.target.value as WarrantyValue,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent outline-none"
                  >
                    {WARRANTY_FORM_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ürün kodu (otomatik) */}
                <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
                    Ürün kodu
                  </p>
                  {editingId && savedProductCode && !codeWillChangeOnSave ? (
                    <p className="text-sm text-gray-900 font-mono font-semibold">
                      {savedProductCode}
                    </p>
                  ) : previewProductCode ? (
                    <div className="text-sm text-gray-700">
                      <span className="font-mono font-semibold text-[#FF3C00]">
                        {previewProductCode}
                      </span>
                      <span className="block text-xs text-gray-500 mt-1">
                        Örnek formattır. Kayıtta aynı yapıda benzersiz kod
                        oluşturulur.
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Marka ve model seçince örnek kod görünür.
                    </p>
                  )}
                  {editingId && !savedProductCode && previewProductCode && (
                    <p className="text-xs text-amber-700 mt-2">
                      Bu üründe henüz kod yok; güncellediğinizde atanır.
                    </p>
                  )}
                  {editingId && codeWillChangeOnSave && previewProductCode && (
                    <p className="text-xs text-amber-800 mt-2">
                      Marka veya model değişti; güncellemede yeni benzersiz kod:{' '}
                      <span className="font-mono font-semibold">
                        (örn. {previewProductCode})
                      </span>
                    </p>
                  )}
                </div>

                {/* Popular */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.popular}
                    onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                    className="h-4 w-4 text-[#FF3C00] rounded"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Popüler Ürün
                  </label>
                </div>

                {/* Butonlar */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="flex-1 bg-[#FF3C00] text-white py-2 px-4 rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                  >
                    {uploading ? 'Yükleniyor...' : editingId ? 'Güncelle' : 'Ekle'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="flex-1 bg-gray-300 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-400 font-medium transition"
                    >
                      İptal
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Ürün Listesi - AYNI KALIYOR */}
          <div className="lg:col-span-2">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Yükleniyor...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Henüz ürün eklenmemiş</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
                  >
                    <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover hover:scale-110 transition"
                      />
                      {product.popular && (
                        <div className="absolute top-2 right-2 bg-[#FF3C00] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <i className="ri-star-fill"></i>
                          Popüler
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      {product.productCode && (
                        <p className="text-xs font-mono font-semibold text-[#FF3C00] mb-1">
                          {product.productCode}
                        </p>
                      )}
                      <h3 className="font-semibold text-gray-900 mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-lg font-bold text-[#FF3C00] mb-1">
                        ₺{product.price.toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-600 mb-3">
                        Garanti: {warrantyToTrLabel(product.warranty)}
                      </p>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 text-sm font-medium transition flex items-center justify-center gap-1"
                        >
                          <i className="ri-edit-line"></i>
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 text-sm font-medium transition flex items-center justify-center gap-1"
                        >
                          <i className="ri-delete-bin-line"></i>
                          Sil
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}