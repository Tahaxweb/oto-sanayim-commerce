"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import "remixicon/fonts/remixicon.css";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      console.log("Response:", res.status, data);
      setLoading(false);

      if (res.ok) {
        router.push("/admin");
      } else {
        setError(data.error || "Bir hata oluştu");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg border border-slate-100 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Giriş</h1>

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Pass"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <i className={showPassword ? "ri-eye-off-line text-lg" : "ri-eye-line text-lg"} />
          </button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <Button onClick={handleLogin} disabled={loading} fullWidth>
          {loading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </Button>
      </div>
    </div>
  );
}