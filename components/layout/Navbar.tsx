'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import classNames from 'classnames'
import 'remixicon/fonts/remixicon.css'
import Button from '../ui/Button'

const NAV_ITEMS = [
  {
    label: 'Ürünler',
    dropdown: [
      { label: 'Motor & Şanzıman', href: '/kategori/motor' },
      { label: 'Fren Sistemi', href: '/kategori/fren' },
      { label: 'Elektrik & Aydınlatma', href: '/kategori/elektrik' },
      { label: 'Karoser & Dış', href: '/kategori/karoser' },
    ],
  },
  {
    label: 'Kurumsal',
    dropdown: [
      { label: 'Bayiler İçin', href: '/kurumsal/bayiler' },
      { label: 'Servisler İçin', href: '/kurumsal/servisler' },
      { label: 'Toptancılar', href: '/kurumsal/toptancilar' },
    ],
  },
    { label: 'İletişim', href: '/contact' },
]

function Navbar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleDropdown = (label: string) => {
    setOpenDropdown((prev) => (prev === label ? null : label))
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
    setOpenDropdown(null)
  }

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  return (
    <>
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LOGO */}
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/images/logos/primary-logo.svg" 
                alt="Logo" 
                width={120} 
                height={40}
                priority
              />
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <NavItem
                  key={item.label}
                  item={item}
                  openDropdown={openDropdown}
                  toggleDropdown={toggleDropdown}
                  setOpenDropdown={setOpenDropdown}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="hidden lg:block">
              <Button ><b>İletişime Geç</b></Button>
            </div>

            {/* MOBILE BUTTON */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700"
            >
              <i className={classNames(
                'text-2xl',
                isMobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'
              )} />
            </button>
          </div>
        </div>
      </nav>

      {/* OVERLAY */}
      <div
        className={classNames(
          'fixed inset-0 bg-black/50 z-40 lg:hidden transition',
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={closeMobileMenu}
      />

      {/* MOBILE MENU */}
      <div
        className={classNames(
          'fixed top-0 right-0 h-full w-full bg-white z-50 lg:hidden transform transition-transform duration-300',
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-b-gray-200 bg-white">
            <Image src="/images/logos/primary-logo.svg" alt="Logo" width={110} height={32} />
            <button onClick={closeMobileMenu}>
              <i className="ri-close-line text-2xl" />
            </button>
          </div>

          {/* CONTENT */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-2">
            {NAV_ITEMS.map((item) => (
              <MobileNavItem
                key={item.label}
                item={item}
                openDropdown={openDropdown}
                toggleDropdown={toggleDropdown}
                closeMobileMenu={closeMobileMenu}
              />
            ))}
                <Button><b>İletişime Geç</b></Button>
          </div>


         
        </div>
      </div>
    </>
  )
}

/* DESKTOP ITEM */
function NavItem({ item, openDropdown, toggleDropdown, setOpenDropdown }: any) {
  if (item.dropdown) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setOpenDropdown(item.label)}
        onMouseLeave={() => setOpenDropdown(null)}
      >
        <button
          onClick={() => toggleDropdown(item.label)}
          className={classNames(
            'flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-bold',
            openDropdown === item.label
              ? 'bg-gray-100 text-black'
              : 'text-gray-700 hover:bg-gray-50 hover:text-black'
          )}
        >
          {item.label}
          <i className={classNames(
            'ri-arrow-down-s-line',
            openDropdown === item.label && 'rotate-180'
          )} />
        </button>

        {/* FIXED DROPDOWN */}
        <div
          className={classNames(
            'absolute top-full left-0 pt-2 min-w-[220px]',
            openDropdown === item.label ? 'block' : 'hidden'
          )}
        >
          <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-2">
            {item.dropdown.map((sub: any) => (
              <Link
                key={sub.label}
                href={sub.href}
                className="block px-4 py-2 text-sm font-bold text-gray-600 hover:text-black hover:bg-gray-50 rounded-lg"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      className="px-4 py-2 text-sm font-bold text-gray-700 hover:text-black hover:bg-gray-50 rounded-lg"
    >
      {item.label}
    </Link>
  )
}

/* MOBILE ITEM */
function MobileNavItem({ item, openDropdown, toggleDropdown, closeMobileMenu }: any) {
  if (item.dropdown) {
    return (
      <div>
        <button
          onClick={() => toggleDropdown(item.label)}
          className="flex items-center justify-between w-full py-3 text-[14px] font-bold text-black"
        >
          {item.label}
          <i className={classNames(
            'ri-arrow-down-s-line text-xl',
            openDropdown === item.label && 'rotate-180'
          )} />
        </button>

        <div className={classNames(
          'overflow-hidden transition-all',
          openDropdown === item.label ? 'max-h-96' : 'max-h-0'
        )}>
          <div className="pl-3 pb-2 space-y-1">
            {item.dropdown.map((sub: any) => (
              <Link
                key={sub.label}
                href={sub.href}
                onClick={closeMobileMenu}
                className="block py-2 text-sm font-bold text-gray-600 hover:text-black"
              >
                {sub.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Link
      href={item.href}
      onClick={closeMobileMenu}
      className="block py-3 text-[15px] font-bold text-black"
    >
      {item.label}
    </Link>
  )
}

export default Navbar