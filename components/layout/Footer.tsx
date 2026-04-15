import Link from 'next/link'
import Image from 'next/image'

// Data
const QUICK_LINKS = [
  { label: 'Tüm Ürünler', href: '/urunler' },
  { label: 'Motor & Şanzıman', href: '/kategori/motor' },
  { label: 'Fren Sistemi', href: '/kategori/fren' },
  { label: 'Elektrik & Aydınlatma', href: '/kategori/elektrik' },
  { label: 'Fiyat Listesi', href: '/fiyatlar' },
]

const CORPORATE_LINKS = [
  { label: 'Hakkımızda', href: '/hakkimizda' },
  { label: 'Bayiler İçin', href: '/kurumsal/bayiler' },
  { label: 'Servisler İçin', href: '/kurumsal/servisler' },
  { label: 'Gizlilik Politikası', href: '/gizlilik' },
  { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
]

const SOCIAL_LINKS = [
  { icon: 'ri-facebook-fill', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'ri-instagram-line', href: 'https://instagram.com', label: 'Instagram' },
  { icon: 'ri-linkedin-fill', href: 'https://linkedin.com', label: 'LinkedIn' },
]

const CONTACT_INFO = [
  {
    icon: 'ri-map-pin-line',
    title: 'Adres',
    content: ['Atatürk Mah. Sanayi Cad. No:123', 'Keçiören, Ankara'],
  },
  {
    icon: 'ri-phone-line',
    title: 'Telefon',
    content: ['+90 555 123 45 67'],
    href: 'tel:+905551234567',
  },
  {
    icon: 'ri-mail-line',
    title: 'E-posta',
    content: ['info@otosanayim.com'],
    href: 'mailto:info@otosanayim.com',
  },
  {
    icon: 'ri-time-line',
    title: 'Çalışma Saatleri',
    content: ['Pzt-Cmt: 10:00 - 17:00', 'Pazar: Kapalı'],
  },
]

// Components
function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="text-sm hover:text-[#FF3C00] transition-colors flex items-center gap-2"
    >
      <i className="ri-arrow-right-s-line text-[#FF3C00] text-xs" />
      {children}
    </Link>
  )
}

function SocialLink({ icon, href, label }: { icon: string; href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-[#2B2B2B] hover:bg-orange-600 flex items-center justify-center transition-colors"
      aria-label={label}
    >
      <i className={`${icon} text-lg`} />
    </a>
  )
}

function ContactItem({ icon, title, content, href }: {
  icon: string
  title: string
  content: string[]
  href?: string
}) {
  const ContentWrapper = href ? 'a' : 'div'
  const linkProps = href ? { href, className: 'hover:text-[#FF3C00] transition-colors' } : {}

  return (
    <li className="flex items-start gap-3">
      <i className={`${icon} text-[#FF3C00] text-xl mt-0.5 flex-shrink-0`} />
      <div>
        <p className="text-sm font-medium text-white mb-1">{title}</p>
        <ContentWrapper {...linkProps} className={href ? 'block text-sm text-gray-400 hover:text-[#FF3C00] transition-colors' : ''}>
          {content.map((line, i) => (
            <p key={i} className="text-sm text-gray-400">
              {line}
            </p>
          ))}
        </ContentWrapper>
      </div>
    </li>
  )
}

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-white font-bold text-lg mb-4">{title}</h3>
      {children}
    </div>
  )
}

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#18181B] text-gray-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <Image
              src="/images/logos/orange-white-logo.svg"
              alt="OtoSanayim"
              width={150}
              height={50}
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              Türkiye'nin en güvenilir yedek parça platformu. 
              Orijinal ve yan sanayi ürünleriyle hizmetinizdeyiz.
            </p>
            <div className="flex items-center gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => (
                <SocialLink key={social.label} {...social} />
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <FooterSection title="Hızlı Linkler">
            <ul className="space-y-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Corporate */}
          <FooterSection title="Kurumsal">
            <ul className="space-y-3">
              {CORPORATE_LINKS.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </FooterSection>

          {/* Contact */}
          <FooterSection title="İletişim">
            <ul className="space-y-4">
              {CONTACT_INFO.map((contact) => (
                <ContactItem key={contact.title} {...contact} />
              ))}
            </ul>
          </FooterSection>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {currentYear} <span className="text-white font-semibold">OtoSanayim</span>. Tüm hakları saklıdır.
            </p>
            <div className="flex items-center gap-6">
              {['Gizlilik', 'Koşullar', 'Çerezler'].map((item) => (
                <Link
                  key={item}
                  href={`/${item.toLowerCase()}`}
                  className="text-sm text-gray-400 hover:text-[#FF3C00] transition-colors"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* WhatsApp Float Button */}
     
    </footer>
  )
}