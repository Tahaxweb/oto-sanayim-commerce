'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import 'remixicon/fonts/remixicon.css'

const MIN_PASSWORD = 8

export default function AdminRegisterPage() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const trimmedName = name.trim()
    if (!trimmedName) {
      setError('Kullanıcı adı gerekli.')
      return
    }
    if (password.length < MIN_PASSWORD) {
      setError(`Şifre en az ${MIN_PASSWORD} karakter olmalıdır.`)
      return
    }
    if (password !== confirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: trimmedName, password }),
      })

      const data = (await res.json().catch(() => ({}))) as {
        ilkKurulum?: boolean
        error?: string
      }
      setLoading(false)

      if (res.ok) {
        setName('')
        setPassword('')
        setConfirm('')
        if (data.ilkKurulum) {
          router.push('/admin/login')
        } else {
          router.push('/admin')
        }
        return
      }

      const msg =
        typeof data?.error === 'string'
          ? data.error
          : 'Hesap oluşturulamadı.'
      setError(msg)
    } catch {
      setLoading(false)
      setError('Bağlantı hatası.')
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm w-full">
        <h1 className="text-2xl font-bold mb-1 text-center text-gray-900">
          Hesap oluştur
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Yeni bir yönetici hesabı oluşturun
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Kullanıcı adı
            </label>
            <input
              type="text"
              autoComplete="username"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Örn: ahmet"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Şifre
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder={`En az ${MIN_PASSWORD} karakter`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute cursor-pointer right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                aria-label={showPassword ? 'Şifreyi gizle' : 'Şifreyi göster'}
              >
                <i
                  className={
                    showPassword ? 'ri-eye-off-line text-lg' : 'ri-eye-line text-lg'
                  }
                />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Şifre tekrar
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Şifreyi tekrar girin"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} fullWidth>
            {loading ? 'Oluşturuluyor...' : 'Hesap oluştur'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          <Link
            href="/admin"
            className="font-semibold text-[#FF3C00] hover:underline"
          >
            Panele dön
          </Link>
        </p>
      </div>
    </div>
  )
}
