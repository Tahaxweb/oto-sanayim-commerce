import Footer from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'

export default function UrunlerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}
