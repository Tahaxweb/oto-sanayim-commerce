import localFont from 'next/font/local'
import type { Metadata } from "next";
import "./globals.css";

const satoshi = localFont({
  src: [
    { path: './fonts/Satoshi-Variable.woff2',       style: 'normal' },
    { path: './fonts/Satoshi-Variable-Italic.woff2', style: 'italic' },
  ],
  variable: '--font-satoshi',
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
})

export const metadata: Metadata = {
  title: "Oto Sanayim | Pazaryeri",
  description: "Oto Sanayim, Türkiye'nin önde gelen otomotiv yedek parça pazaryeri. Geniş ürün yelpazesi, güvenilir satıcıları ve hızlı teslimat seçenekleriyle müşterilerine kaliteli hizmet sunar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${satoshi.variable} h-full antialiased`}
    >
      <body className={`${satoshi.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}