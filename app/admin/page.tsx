"use client";
import { useEffect, useState } from "react";

type Brand = {
  id: string;
  name: string;
  models: { id: string }[];
};

export default function AdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      if (Array.isArray(data)) {
        setBrands(data);
      } else {
        console.error("API hatası:", data);
        setBrands([]);
      }
    } catch (err) {
      console.error("Fetch hatası:", err);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Admin Paneli</h1>
      <p className="mt-4 text-gray-600">Hoş geldiniz!</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold">Marka Sayısı</h2>
          <p className="text-3xl font-bold mt-2">
            {loading ? (
              <span className="text-gray-300 animate-pulse">—</span>
            ) : (
              brands.length
            )}{" "}
            <span className="text-base text-gray-600 font-medium">Adet</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold">Model Sayısı</h2>
          <p className="text-3xl font-bold mt-2">
            567 <span className="text-base text-gray-600 font-medium">Adet</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold">Ürün Sayısı</h2>
          <p className="text-3xl font-bold mt-2">
            89 <span className="text-base text-gray-600 font-medium">Adet</span>
          </p>
        </div>
      </div>
    </div>
  );
}