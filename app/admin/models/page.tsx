"use client";
import { useEffect, useState } from "react";
import "remixicon/fonts/remixicon.css";

type Brand = {
  id: string;
  name: string;
};

type Model = {
  id: string;
  name: string;
  brandId: string;
  brand: { id: string; name: string };
};

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrandId, setNewBrandId] = useState("");

  // Edit state
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBrandId, setEditBrandId] = useState("");

  // Filter
  const [filterBrandId, setFilterBrandId] = useState("");

  const fetchModels = async () => {
    try {
      const res = await fetch("/api/models");
      const data = await res.json();
      setModels(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch hatası:", err);
      setModels([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      setBrands(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Brands fetch hatası:", err);
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchModels();
  }, []);

  const openModal = () => {
    setNewName("");
    setNewBrandId(brands[0]?.id ?? "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewName("");
    setNewBrandId("");
    setModalOpen(false);
  };

  const handleCreate = async () => {
    if (!newName.trim() || !newBrandId) return;
    setSaving(true);
    await fetch("/api/models", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, brandId: newBrandId }),
    });
    setSaving(false);
    closeModal();
    fetchModels();
  };

  const handleEdit = async (id: string) => {
    if (!editName.trim()) return;
    setSaving(true);
    await fetch(`/api/models/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName, brandId: editBrandId }),
    });
    setEditId(null);
    setSaving(false);
    fetchModels();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu modeli silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/models/${id}`, { method: "DELETE" });
    fetchModels();
  };

  const filteredModels = filterBrandId
    ? models.filter((m) => m.brandId === filterBrandId)
    : models;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Başlık + Ekle Butonu */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modeller</h1>
        <button
          onClick={openModal}
          className="bg-[#FF3C00] text-white px-5 py-2 rounded-xl hover:bg-orange-600 flex items-center gap-2 transition-colors"
        >
          <i className="ri-add-line text-lg" />
          Model Ekle
        </button>
      </div>

      {/* Marka Filtresi */}
      <div className="mb-5">
        <select
          value={filterBrandId}
          onChange={(e) => setFilterBrandId(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF3C00] text-sm"
        >
          <option value="">Tüm Markalar</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Model Listesi */}
      {loading ? (
        <p className="text-gray-400">Yükleniyor...</p>
      ) : filteredModels.length === 0 ? (
        <p className="text-gray-400">Henüz model eklenmemiş.</p>
      ) : (
        <div className="space-y-2">
          {filteredModels.map((model) => (
            <div
              key={model.id}
              className="flex items-center justify-between border border-slate-100 rounded-xl px-4 py-3 bg-white"
            >
              {editId === model.id ? (
                <div className="flex flex-1 gap-2 mr-4">
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEdit(model.id)}
                    autoFocus
                    className="flex-1 border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FF3C00]"
                  />
                  <select
                    value={editBrandId}
                    onChange={(e) => setEditBrandId(e.target.value)}
                    className="border border-slate-200 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FF3C00] text-sm"
                  >
                    {brands.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <p className="font-medium">{model.name}</p>
                  <p className="text-xs text-gray-400">{model.brand.name}</p>
                </div>
              )}

              <div className="flex items-center gap-2">
                {editId === model.id ? (
                  <>
                    <button
                      onClick={() => handleEdit(model.id)}
                      disabled={saving}
                      className="text-green-500 hover:text-green-600 p-2"
                    >
                      <i className="ri-check-line text-lg" />
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="text-gray-400 hover:text-gray-600 p-2"
                    >
                      <i className="ri-close-line text-lg" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setEditId(model.id);
                        setEditName(model.name);
                        setEditBrandId(model.brandId);
                      }}
                      className="text-gray-400 hover:text-[#FF3C00] p-2"
                    >
                      <i className="ri-pencil-line text-lg" />
                    </button>
                    <button
                      onClick={() => handleDelete(model.id)}
                      className="text-gray-400 hover:text-red-500 p-2"
                    >
                      <i className="ri-delete-bin-line text-lg" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {/* Modal Başlık */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Yeni Model Ekle</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {/* Marka Seçimi */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Marka
              </label>
              <select
                value={newBrandId}
                onChange={(e) => setNewBrandId(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition"
              >
                <option value="">Marka seçin</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Adı */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Model Adı
              </label>
              <input
                type="text"
                placeholder="Örn: Corolla, iPhone 15..."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                autoFocus
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#FF3C00] focus:border-transparent transition"
              />
            </div>

            {/* Butonlar */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-xl border border-slate-200 text-gray-600 hover:bg-slate-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleCreate}
                disabled={saving || !newName.trim() || !newBrandId}
                className="bg-[#FF3C00] text-white px-5 py-2 rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {saving ? (
                  <i className="ri-loader-4-line text-lg animate-spin" />
                ) : (
                  <i className="ri-add-line text-lg" />
                )}
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}