"use client";
import { useEffect, useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";

type Model = { id: string };

type Brand = {
  id: string;
  name: string;
  models: Model[];
};

type ApiError = {
  error: string;
};

// ─── helpers ──────────────────────────────────────────────
async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
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
      return { data: null, error: (json as ApiError).error ?? "Hata oluştu" };
    }

    return { data: json as T, error: null };
  } catch {
    return { data: null, error: "Bağlantı hatası" };
  }
}

// ─── component ────────────────────────────────────────────
export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  // Yeni marka
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  // Düzenleme
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  // Silme
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  // ── fetch ──────────────────────────────────────────────
  const fetchBrands = async () => {
    const { data, error } = await apiFetch<Brand[]>("/api/brands");
    if (error) {
      console.error("Fetch hatası:", error);
      setBrands([]);
    } else {
      setBrands(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  // Edit input'a focus
  useEffect(() => {
    if (editId) {
      editInputRef.current?.focus();
    }
  }, [editId]);

  // ── create ─────────────────────────────────────────────
  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed || creating) return;

    setCreating(true);
    const { data, error } = await apiFetch<Brand>("/api/brands", {
      method: "POST",
      body: JSON.stringify({ name: trimmed }),
    });

    if (error) {
      alert(error);
    } else if (data) {
      // Optimistic: listeye hemen ekle
      setBrands((prev) => [...prev, data]);
      setNewName("");
    }
    setCreating(false);
  };

  // ── edit başlat ────────────────────────────────────────
  const startEdit = (brand: Brand) => {
    setEditId(brand.id);
    setEditName(brand.name);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditError(null);
  };

  // ── edit kaydet ────────────────────────────────────────
  const handleEdit = async (id: string) => {
    const trimmed = editName.trim();

    // Değişiklik yoksa kapat
    const currentBrand = brands.find((b) => b.id === id);
    if (!trimmed) {
      setEditError("İsim boş olamaz");
      return;
    }
    if (currentBrand?.name === trimmed) {
      cancelEdit();
      return;
    }

    setEditSaving(true);
    setEditError(null);

    const { data, error } = await apiFetch<Brand>(`/api/brands/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: trimmed }),
    });

    if (error) {
      // Hata göster ama edit modundan çıkma
      setEditError(error);
      setEditSaving(false);
      editInputRef.current?.focus();
      return;
    }

    if (data) {
      // Optimistic: listeyi anında güncelle
      setBrands((prev) =>
        prev.map((b) => (b.id === id ? { ...b, name: data.name } : b))
      );
    }

    setEditId(null);
    setEditName("");
    setEditError(null);
    setEditSaving(false);
  };

  // ── delete ─────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    if (!confirm("Bu markayı silmek istediğinize emin misiniz?")) return;

    setDeletingId(id);
    const { error } = await apiFetch(`/api/brands/${id}`, {
      method: "DELETE",
    });

    if (error) {
      alert(error);
      setDeletingId(null);
      return;
    }

    // Optimistic: listeden hemen kaldır
    setBrands((prev) => prev.filter((b) => b.id !== id));
    setDeletingId(null);
  };

  // ── render ─────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Markalar</h1>

      {/* ── Yeni Marka ── */}
      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Marka adı"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          disabled={creating}
          className="flex-1 border border-slate-200 rounded-xl px-4 py-2
                     focus:outline-none focus:ring-2 focus:ring-[#FF3C00]
                     disabled:opacity-60"
        />
        <button
          onClick={handleCreate}
          disabled={creating || !newName.trim()}
          className="bg-[#FF3C00] text-white px-5 py-2 rounded-xl
                     hover:bg-orange-600 disabled:opacity-50
                     flex items-center gap-2 transition-opacity"
        >
          {creating ? (
            <i className="ri-loader-4-line text-lg animate-spin" />
          ) : (
            <i className="ri-add-line text-lg" />
          )}
          Ekle
        </button>
      </div>

      {/* ── Liste ── */}
      {loading ? (
        <p className="text-gray-400 flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin" /> Yükleniyor...
        </p>
      ) : brands.length === 0 ? (
        <p className="text-gray-400">Henüz marka eklenmemiş.</p>
      ) : (
        <div className="space-y-2">
          {brands.map((brand) => {
            const isEditing = editId === brand.id;
            const isDeleting = deletingId === brand.id;

            return (
              <div
                key={brand.id}
                className={`flex flex-col border rounded-xl px-4 py-3 bg-white
                            transition-opacity
                            ${isDeleting ? "opacity-40 pointer-events-none" : "border-slate-100"}`}
              >
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    /* ── Edit modu ── */
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setEditError(null); // Yazarken hata mesajını temizle
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEdit(brand.id);
                        if (e.key === "Escape") cancelEdit();
                      }}
                      disabled={editSaving}
                      className={`flex-1 border rounded-lg px-3 py-1 mr-4
                                  focus:outline-none focus:ring-2
                                  disabled:opacity-60
                                  ${
                                    editError
                                      ? "border-red-400 focus:ring-red-300"
                                      : "border-slate-200 focus:ring-[#FF3C00]"
                                  }`}
                    />
                  ) : (
                    /* ── Normal mod ── */
                    <div>
                      <p className="font-medium">{brand.name}</p>
                      <p className="text-xs text-gray-400">
                        {brand.models.length} model
                      </p>
                    </div>
                  )}

                  {/* ── Aksiyonlar ── */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleEdit(brand.id)}
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
                          onClick={() => startEdit(brand)}
                          title="Düzenle"
                          className="text-gray-400 hover:text-[#FF3C00] p-2
                                     transition-colors"
                        >
                          <i className="ri-pencil-line text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
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

                {/* ── Inline hata mesajı ── */}
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
    </div>
  );
}