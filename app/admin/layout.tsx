import AdminLayoutShell from '@/components/layout/AdminLayoutShell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutShell>{children}</AdminLayoutShell>
}