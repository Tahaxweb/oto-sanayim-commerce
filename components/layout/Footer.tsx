import Link from 'next/link'
import Image from 'next/image'

const SOCIAL_LINKS = [
  { icon: 'ri-instagram-line', href: 'https://instagram.com', label: 'Instagram' },
  { icon: 'ri-facebook-fill', href: 'https://facebook.com', label: 'Facebook' },
  { icon: 'ri-youtube-fill', href: 'https://youtube.com', label: 'YouTube' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0C0C0E] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-12">
          
          {/* Logo & Slogan */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <Image
              src="/images/logos/orange-white-logo.svg"
              alt="OtoSanayim"
              width={170}
              height={55}
              className="mb-4"
            />
            <p className="text-sm max-w-xs text-gray-500">
              Kaliteli kaliper çözümleriyle yanınızdayız.
            </p>
          </div>

         
          {/* Social & Contact */}
          <div className="flex flex-col items-center lg:items-end gap-6">
            <div className="flex gap-4">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-11 h-11 rounded-2xl bg-zinc-900 hover:bg-[#FF3C00] flex items-center justify-center text-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#FF3C00]/20"
                  aria-label={social.label}
                >
                  <i className={social.icon} />
                </a>
              ))}
            </div>

            <div className="text-center lg:text-right text-sm space-y-1">
              <a href="tel:+905551234567" className="block hover:text-white transition-colors">
                +90 555 123 45 67
              </a>
              <a href="mailto:info@otosanayim.com" className="block hover:text-white transition-colors">
                info@otosanayim.com
              </a>
              <p className="text-gray-500 pt-1">Keçiören, Ankara</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5 bg-black/40 py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© {currentYear} OtoSanayim. Tüm hakları saklıdır.</p>
          
          <div className="flex gap-6">
            <Link href="/gizlilik" className="hover:text-gray-300 transition-colors">
              Gizlilik
            </Link>
            <Link href="/kullanim-kosullari" className="hover:text-gray-300 transition-colors">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}