import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as jose from 'jose'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

/**
 * Veritabanında admin varken bu sayfa yalnızca giriş yapmış yöneticiye açılır.
 * İlk kurulumda (hiç admin yokken) tek seferlik kayıt için sayfa erişilebilir kalır.
 */
export default async function AdminKayitLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const count = await prisma.admin.count()
  const token = (await cookies()).get('admin_token')?.value

  let sessionOk = false
  const secretStr = process.env.JWT_SECRET
  if (token && secretStr) {
    try {
      const secret = new TextEncoder().encode(secretStr)
      await jose.jwtVerify(token, secret)
      sessionOk = true
    } catch {
      sessionOk = false
    }
  }

  if (count > 0 && !sessionOk) {
    redirect('/admin/login')
  }

  return <>{children}</>
}
