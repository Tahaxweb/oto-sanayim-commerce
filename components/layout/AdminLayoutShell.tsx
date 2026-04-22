'use client'

import { usePathname } from 'next/navigation'
import Sidebar from '@/components/layout/Sidebar'

/** Sadece giriş sayfası yan menüsüz tam ekran */
const AUTH_FULLSCREEN_PATHS = ['/admin/login']

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const authFullscreen = AUTH_FULLSCREEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  )

  if (authFullscreen) {
    return <>{children}</>
  }

  return (
    <div>
      <Sidebar>{children}</Sidebar>
    </div>
  )
}
