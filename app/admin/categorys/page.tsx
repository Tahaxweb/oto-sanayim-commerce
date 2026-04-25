"use client";
import { useEffect, useState, useRef } from "react";
import "remixicon/fonts/remixicon.css";

type Category = {
  id: string;
  name: string;
  _count: { products: number };
};

type ApiError = {
  error: string;
};

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

export default function CategorysPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const editInputRef = useRef<HTMLInputElement>(null);

  const fetchCategories = async () => {
    const { data, error } = await apiFetch<Category[]>("/api/categories");
    if (error) {
      console.error("Fetch hatası:", error);
      setCategories([]);
    } else {
      setCategories(data ?? []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editId) {
      editInputRef.current?.focus();
    }
  }, [editId]);

  const handleCreate = async () => {
    const trimmed = newName.trim();
    if (!trimmed || creating) return;

    setCreating(true);
    const { data, error } = await apiFetch<Category>("/api/categories", {
      method: "POST",
      body: JSON.stringify({ name: trimmed }),
    });

    if (error) {
      alert(error);
    } else if (data) {
      setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name, "tr")));
      setNewName("");
    }
    setCreating(false);
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditError(null);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditName("");
    setEditError(null);
  };

  const handleEdit = async (id: string) => {
    const trimmed = editName.trim();

    const current = categories.find((c) => c.id === id);
    if (!trimmed) {
      setEditError("İsim boş olamaz");
      return;
    }
    if (current?.name === trimmed) {
      cancelEdit();
      return;
    }

    setEditSaving(true);
    setEditError(null);

    const { data, error } = await apiFetch<Category>(`/api/categories/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name: trimmed }),
    });

    if (error) {
      setEditError(error);
      setEditSaving(false);
      editInputRef.current?.focus();
      return;
    }

    if (data) {
      setCategories((prev) =>
        prev
          .map((c) => (c.id === id ? { ...c, name: data.name, _count: data._count } : c))
          .sort((a, b) => a.name.localeCompare(b.name, "tr"))
      );
    }

    setEditId(null);
    setEditName("");
    setEditError(null);
    setEditSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kategoriyi silmek istediğinize emin misiniz?")) return;

    setDeletingId(id);
    const { error } = await apiFetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    if (error) {
      alert(error);
      setDeletingId(null);
      return;
    }

    setCategories((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Kategoriler</h1>

      <div className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Kategori adı"
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

      {loading ? (
        <p className="text-gray-400 flex items-center gap-2">
          <i className="ri-loader-4-line animate-spin" /> Yükleniyor...
        </p>
      ) : categories.length === 0 ? (
        <p className="text-gray-400">Henüz kategori eklenmemiş.</p>
      ) : (
        <div className="space-y-2">
          {categories.map((cat) => {
            const isEditing = editId === cat.id;
            const isDeleting = deletingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`flex flex-col border rounded-xl px-4 py-3 bg-white
                            transition-opacity
                            ${isDeleting ? "opacity-40 pointer-events-none" : "border-slate-100"}`}
              >
                <div className="flex items-center justify-between">
                  {isEditing ? (
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editName}
                      onChange={(e) => {
                        setEditName(e.target.value);
                        setEditError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEdit(cat.id);
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
                    <div>
                      <p className="font-medium">{cat.name}</p>
                      <p className="text-xs text-gray-400">
                        {cat._count.products} ürün
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleEdit(cat.id)}
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
                          onClick={() => startEdit(cat)}
                          title="Düzenle"
                          className="text-gray-400 hover:text-[#FF3C00] p-2
                                     transition-colors"
                        >
                          <i className="ri-pencil-line text-lg" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          disabled={
                            isDeleting || cat._count.products > 0
                          }
                          title={
                            cat._count.products > 0
                              ? "Bu kategoride ürün varken silinemez"
                              : "Sil"
                          }
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
