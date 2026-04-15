import Image from 'next/image'

const CONTACT_METHODS = [
  {
    icon: 'ri-phone-line',
    title: 'Telefon',
    description: 'Pazartesi - Cumartesi, 10:00 - 17:00',
    value: '+90 555 123 45 67',
    href: 'tel:+905551234567',
    color: 'orange',
  },
  {
    icon: 'ri-whatsapp-line',
    title: 'WhatsApp',
    description: '7/24 mesaj atabilirsiniz',
    value: '+90 555 123 45 67',
    href: 'https://wa.me/905551234567',
    color: 'orange',
  },
  {
    icon: 'ri-mail-line',
    title: 'E-posta',
    description: '24 saat içinde yanıt veriyoruz',
    value: 'info@otosanayim.com',
    href: 'mailto:info@otosanayim.com',
    color: 'orange',
  },
  {
    icon: 'ri-map-pin-line',
    title: 'Adres',
    description: 'Mağazamızı ziyaret edin',
    value: 'Atatürk Mah. Sanayi Cad. No:123, Keçiören/Ankara',
    href: 'https://maps.google.com/?q=Ankara',
    color: 'orange',
  },
]

const WORKING_HOURS = [
  { day: 'Pazartesi', hours: '10:00 - 17:00' },
  { day: 'Salı', hours: '10:00 - 17:00' },
  { day: 'Çarşamba', hours: '10:00 - 17:00' },
  { day: 'Perşembe', hours: '10:00 - 17:00' },
  { day: 'Cuma', hours: '10:00 - 17:00' },
  { day: 'Cumartesi', hours: '10:00 - 17:00' },
  { day: 'Pazar', hours: 'Kapalı', closed: true },
]

const FAQ_ITEMS = [
  {
    question: 'Sipariş nasıl verebilirim?',
    answer: 'WhatsApp, telefon veya e-posta yoluyla bizimle iletişime geçerek sipariş verebilirsiniz.',
  },
  {
    question: 'Kargo ücreti ne kadar?',
    answer: 'Kargo ücretleri bölgeye göre değişmektedir. Detaylı bilgi için lütfen bizimle iletişime geçin.',
  },
  {
    question: 'Ödeme seçenekleri nelerdir?',
    answer: 'Kapıda ödeme, banka havalesi ve kredi kartı ile ödeme yapabilirsiniz.',
  },
  {
    question: 'İade politikanız nedir?',
    answer: '14 gün içinde ürünü iade edebilirsiniz. Detaylar için müşteri hizmetlerimizle görüşün.',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Section */}
      <div className="bg-[#FF3C00] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-42">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold">İletişime Geçin</h1>
            <p className="text-lg sm:text-xl text-orange-100 max-w-2xl mx-auto">
              Size yardımcı olmak için buradayız. İhtiyacınız olan yedek parçayı bulmak için bizimle iletişime geçin.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* İletişim Yöntemleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 mb-12">
          {CONTACT_METHODS.map((method) => (
            <a
              key={method.title}
              href={method.href}
              target={method.href.startsWith('http') ? '_blank' : undefined}
              rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group bg-white rounded-2xl p-6 border border-gray-200 "
            >
              <div className={`w-14 h-14 rounded-xl bg-${method.color}-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <i className={`${method.icon} text-2xl text-${method.color}-600`}></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{method.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{method.description}</p>
              <p className="text-sm font-semibold text-gray-900 group-hover:text-orange-600 transition-colors break-words">
                {method.value}
              </p>
            </a>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol: Harita & Adres */}
          <div className="lg:col-span-2 space-y-6">
            {/* Harita */}
            <div className="bg-white rounded-2xl overflow-hidden ">
              <div className="h-96 sm:h-[500px] bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.0287457609547!2d32.8597419!3d39.9333635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMznCsDU2JzAwLjEiTiAzMsKwNTEnMzUuMSJF!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                ></iframe>
              </div>
            </div>

            {/* Detaylı Adres */}
            <div className="bg-white rounded-2xl p-6  border border-gray-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
                  <i className="ri-map-pin-2-fill text-2xl text-[#FF3C00]"></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Mağaza Adresimiz</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Atatürk Mahallesi, Sanayi Caddesi No:123<br />
                    Keçiören / Ankara<br />
                    Posta Kodu: 06010
                  </p>
                  <a
                    href="https://maps.google.com/?q=Ankara"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 text-orange-600 hover:text-orange-700 font-semibold text-sm"
                  >
                    <i className="ri-navigation-line"></i>
                    Yol Tarifi Al
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Sağ: Çalışma Saatleri & FAQ */}
          <div className="space-y-6">
            {/* Çalışma Saatleri */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center">
                  <i className="ri-time-line text-2xl text-[#FF3C00]"></i>
                </div>
                <h3 className="text-lg font-bold text-gray-900">Çalışma Saatleri</h3>
              </div>
              <div className="space-y-3">
                {WORKING_HOURS.map((schedule) => (
                  <div
                    key={schedule.day}
                    className={`flex justify-between items-center pb-3 border-b border-gray-100 last:border-0 ${
                      schedule.closed ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">{schedule.day}</span>
                    <span
                      className={`text-sm font-semibold ${
                        schedule.closed ? 'text-red-600' : 'text-gray-900'
                      }`}
                    >
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Hızlı Bilgi */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-start gap-3">
                <i className="ri-information-line text-2xl text-orange-600 mt-0.5"></i>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Hızlı İpucu</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    Aradığınız parçayı hızlıca bulmak için <strong>WhatsApp</strong> üzerinden 
                    araç marka, model ve ürün fotoğrafı gönderin. Size en uygun çözümü sunalım!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SSS (FAQ) */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Sıkça Sorulan Sorular</h2>
            <p className="text-gray-600">Merak ettiklerinizi burada bulabilirsiniz</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-200  transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-[#FF3C00] rounded-2xl p-8 sm:p-12 text-white text-center">
          <i className="ri-customer-service-2-line text-5xl mb-4"></i>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Hala Sorunuz mu Var?</h2>
          <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
            Müşteri hizmetleri ekibimiz size yardımcı olmak için hazır. İstediğiniz kanaldan bizimle iletişime geçin.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://wa.me/905551234567"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl hover:bg-orange-50 transition-colors"
            >
              <i className="ri-whatsapp-line text-xl"></i>
              WhatsApp ile Yaz
            </a>
         
          </div>
        </div>
      </div>
    </div>
  )
}