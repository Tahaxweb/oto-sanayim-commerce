"use client";
import { useEffect, useState } from "react";

type Brand = {
  id: string;
  name: string;
  models: { id: string }[];
};

type Models = {
  id: string;
  name: string;
  brand: { id: string; name: string };
};


export default function AdminPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Models[]>([]);
  const [productCount, setProductCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadDashboard() {
      setLoading(true);
      try {
        const [brandsRes, modelsRes, countRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/models"),
          fetch("/api/products/count"),
        ]);

        const brandsData = await brandsRes.json();
        const modelsData = await modelsRes.json();
        const countJson = await countRes.json().catch(() => ({}));

        if (cancelled) return;

        setBrands(Array.isArray(brandsData) ? brandsData : []);
        setModels(Array.isArray(modelsData) ? modelsData : []);

        const n =
          countRes.ok &&
          typeof countJson === "object" &&
          countJson !== null &&
          typeof (countJson as { count?: unknown }).count === "number"
            ? (countJson as { count: number }).count
            : null;
        setProductCount(n);
      } catch (err) {
        console.error("Dashboard verisi yüklenemedi:", err);
        if (!cancelled) {
          setBrands([]);
          setModels([]);
          setProductCount(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
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
            {loading ? (
              <span className="text-gray-300 animate-pulse">—</span>
            ) : (
              models.length
            )}{" "}
            <span className="text-base text-gray-600 font-medium">Adet</span>
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <h2 className="text-xl font-semibold">Ürün Sayısı</h2>
          <p className="text-3xl font-bold mt-2">
            {loading ? (
              <span className="text-gray-300 animate-pulse">—</span>
            ) : productCount !== null ? (
              productCount
            ) : (
              <span className="text-gray-400 text-xl">—</span>
            )}{" "}
            <span className="text-base text-gray-600 font-medium">Adet</span>
          </p>
        </div>
      </div>
    </div>
  );
}