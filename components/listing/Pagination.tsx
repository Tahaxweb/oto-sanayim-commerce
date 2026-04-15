'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Pagination({
  currentPage,
  totalPages,
}: {
  currentPage: number
  totalPages: number
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sayfa', String(page))
    router.push(`/urunler?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handlePage(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-gray-50"
      >
        <i className="ri-arrow-left-s-line" />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => handlePage(p)}
          className={`px-3 py-2 rounded-lg border transition ${
            p === currentPage
              ? 'border-[#FF3C00] bg-[#FF3C00] text-white'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => handlePage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition hover:bg-gray-50"
      >
        <i className="ri-arrow-right-s-line" />
      </button>
    </div>
  )
}