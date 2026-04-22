"use client";
import { useEffect, useState, useRef } from "react";
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

type ApiResponse<T> = { data: T | null; error: string | null };

// ─── API Helper ────────────────────────────────────────
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    const json = await res.json();

    if (!res.ok) {
      return { data: null, error: json.error ?? "Hata oluştu" };
    }

    return { data: json as T, error: null };
  } catch (err) {
    return { data: null, error: "Bağlantı hatası" };
  }
}

// ─── Component ─────────────────────────────────────────
export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newBrandId, setNewBrandId] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  // Edit
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editBrandId, setEditBrandId] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Delete
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filter
  const [filterBrandId, setFilterBrandId] = useState("");

  const editInputRef = useRef<HTMLInputElement>(null);

  // ── Fetch ──────────────────────────────────────────────
  const fetchBrands = async () => {
    const { data } = await apiFetch<Brand[]>("/api/brands");
    if (data) setBrands(data);
  };

  const fetchModels = async () => {
    const { data } = await apiFetch<Model[]>("/api/models");
    if (data) setModels(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
    fetchModels();
  }, []);

  useEffect(() => {
    if (editId) editInputRef.current?.focus();
  }, [editId]);

  // ── Modal ──────────────────────────────────────────────
  const openModal = () => {
    setCreateError(null);
    setNewName("");
    setNewBrandId(brands[0]?.id ?? "");
    setModalOpen(true);
  };

  const closeModal = () => {
    setNewName("");
    setNewBrandId("");
    setCreateError(null);
    setModalOpen(false);
  };

  // ── Create ─────────────────────────────────────────────
  const handleCreate = async () => {
    const name = newName.trim();
    if (!name || !newBrandId) {
      setCreateError("Model adı ve marka zorunludur.");
      return;
    }

    setCreating(true);
    setCreateError(null);

    const { data, error } = await apiFetch<Model>("/api/models", {
      method: "POST",
      body: JSON.stringify({ name, brandId: newBrandId }),
    });

    if (error) {
      setCreateError(error);
      setCreating(false);
      return;
    }

    if (data) {
      // Optimistic: listeye hemen ekle
      setModels((prev) => [data, ...prev]);
      closeModal();
    }

    setCreating(false);
  };

  // ── Edit ───────────────────────────────────────────────
  const startEdit = (model: Model) => {
    setEditId(model.id);
    setEditName(model.name);
    setEditBrandId(model.brandId);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditBrandId("");
    setEditError(null);
  };

  const handleEdit = async (id: string) => {
    const name = editName.trim();
    if (!name) {
      setEditError("Model adı zorunludur.");
      return;
    }

    const currentModel = models.find((m) => m.id === id);
    if (currentModel?.name === name && currentModel?.brandId === editBrandId) {
      cancelEdit();
      return;
    }

    setEditSaving(true);
    setEditError(null);

    const { data, error } = await apiFetch<Model>(`/api/models/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name, brandId: editBrandId }),
    });

    if (error) {
      setEditError(error);
      setEditSaving(false);
      editInputRef.current?.focus();
      return;
    }

    if (data) {
      // Optimistic: listeyi güncelle
      setModels((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, name: data.name, brandId: data.brandId, brand: data.brand }
            : m
        )
      );
    }

    setEditId(null);
    setEditName("");
    setEditBrandId("");
    setEditError(null);
    setEditSaving(false);
  };

  // ── Delete ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Bu modeli silmek istediğinize emin misiniz?")) return;

    setDeletingId(id);
    const { error } = await apiFetch(`/api/models/${id}`, {
      method: "DELETE",
    });

    if (error) {
      alert(error);
      setDeletingId(null);
      return;
    }

    // Optimistic: listeden kaldır
    setModels((prev) => prev.filter((m) => m.id !== id));
    setDeletingId(null);
  };

  // ── Render ─────────────────────────────────────────────
  const filteredModels = filterBrandId
    ? models.filter((m) => m.brandId === filterBrandId)
    : models;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Modeller</h1>
        <button
          onClick={openModal}
          className="bg-[#FF3C00] text-white px-5 py-2 rounded-xl
                     hover:bg-orange-600 flex items-center gap-2
                     transition-colors"
        >
          <i className="ri-add-line text-lg" />
          Model Ekle
        </button>
      </div>

      {/* Filter */}
      <div className="mb-5">
        <select
          value={filterBrandId}
          onChange={(e) => setFilterBrandId(e.target.value)}
          className="border border-slate-200 rounded-xl px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-[#FF3C00]
                     text-sm"
        >
          <option value="">Tüm Markalar</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      {/* Models List */}
      {loading ? (
        <p className="text-gray-400 flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin" /> Yükleniyor...
        </p>
      ) : filteredModels.length === 0 ? (
        <p className="text-gray-400">Henüz model eklenmemiş.</p>
      ) : (
        <div className="space-y-2">
          {filteredModels.map((model) => {
            const isEditing = editId === model.id;
            const isDeleting = deletingId === model.id;

            return (
              <div
                key={model.id}
                className={`flex flex-col border rounded-xl px-4 py-3 bg-white
                            transition-opacity
                            ${isDeleting ? "opacity-40 pointer-events-none" : "border-slate-100"}`}
              >
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    /* Edit Mode */
                    <div className="flex flex-1 gap-2 mr-4">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editName}
                        onChange={(e) => {
                          setEditName(e.target.value);
                          setEditError(null);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleEdit(model.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        disabled={editSaving}
                        className={`flex-1 border rounded-lg px-3 py-1
                                  focus:outline-none focus:ring-2
                                  disabled:opacity-60
                                  ${
                                    editError
                                      ? "border-red-400 focus:ring-red-300"
                                      : "border-slate-200 focus:ring-[#FF3C00]"
                                  }`}
                      />
                      <select
                        value={editBrandId}
                        onChange={(e) => setEditBrandId(e.target.value)}
                        disabled={editSaving}
                        className="border border-slate-200 rounded-lg px-3 py-1
                                 focus:outline-none focus:ring-2
                                 focus:ring-[#FF3C00] text-sm disabled:opacity-60"
                      >
                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    /* Normal Mode */
                    <div>
                      <p className="font-medium">{model.name}</p>
                      <p className="text-xs text-gray-400">{model.brand.name}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleEdit(model.id)}
                          disabled={editSaving}
                          title="Kaydet (Enter)"
                          className="text-green-500 hover:text-green-600 p-2
                                   disabled:opacity-50 transition-colors"
                        >
                          {editSaving ? (
                            <i className="ri-loader-4-line text-lg animate-spin" />
                          ) : (
                            <i className="ri-check-line text-lg" />
                          )}
                        </button>
                        <button
                          onClick={cancelEdit}
                          disabled={editSaving}
                          title="İptal (Escape)"
                          className="text-gray-400 hover:text-gray-600 p-2
                                   disabled:opacity-50 transition-colors"
                        >
                          <i className="ri-close-line text-lg" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(model)}
                          title="Düzenle"
                          className="text-gray-400 hover:text-[#FF3C00] p-2
                                   transition-colors"
                        >
                          <i className="ri-pencil-line text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(model.id)}
                          disabled={isDeleting}
                          title="Sil"
                          className="text-gray-400 hover:text-red-500 p-2
                                   disabled:opacity-50 transition-colors"
                        >
                          {isDeleting ? (
                            <i className="ri-loader-4-line text-lg animate-spin" />
                          ) : (
                            <i className="ri-delete-bin-line text-lg" />
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Edit Error */}
                {isEditing && editError && (
                  <p className="text-red-500 text-xs mt-1 ml-1">
                    <i className="ri-error-warning-line mr-1" />
                    {editError}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-black/40 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 p-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">Yeni Model Ekle</h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1
                         rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-xl" />
              </button>
            </div>

            {/* Brand Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Marka
              </label>
              <select
                value={newBrandId}
                onChange={(e) => setNewBrandId(e.target.value)}
                disabled={creating}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5
                         focus:outline-none focus:ring-2 focus:ring-[#FF3C00]
                         focus:border-transparent transition disabled:opacity-60"
              >
                <option value="">Marka seçin</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Model Name */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Model Adı
              </label>
              <input
                type="text"
                placeholder="Örn: Corolla, iPhone 15..."
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value);
                  setCreateError(null);
                }}
                onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                disabled={creating}
                autoFocus
                className={`w-full border rounded-xl px-4 py-2.5
                           focus:outline-none focus:ring-2 focus:border-transparent
                           transition disabled:opacity-60
                           ${
                             createError
                               ? "border-red-400 focus:ring-red-300"
                               : "border-slate-200 focus:ring-[#FF3C00]"
                           }`}
              />
              {createError && (
                <p className="text-red-500 text-xs mt-1">
                  <i className="ri-error-warning-line mr-1" />
                  {createError}
                </p>
              )}
            </div>

            {/* Buttons */}
            <div className="flex gap-2 justify-end">
              <button
                onClick={closeModal}
                disabled={creating}
                className="px-4 py-2 rounded-xl border border-slate-200
                         text-gray-600 hover:bg-slate-50 transition-colors
                         disabled:opacity-50"
              >
                İptal
              </button>
               <button
                onClick={handleCreate}
                disabled={creating || !newName.trim() || !newBrandId}
                className="bg-[#FF3C00] text-white px-5 py-2 rounded-xl hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
              >
                {creating ? (
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