import localFont from 'next/font/local'
import type { Metadata } from "next";
import "./globals.css";
import { EdgeStoreProvider } from '@/lib/edgestore';
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
  title: "Öztürk Fren Yedek Parça",
  description:
    "Öztürk Fren Yedek Parça: fren ve yedek parça ürünlerinde geniş ürün yelpazesi, güvenilir hizmet ve hızlı çözümler.",
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
      <body className={`${satoshi.className}`}>
       <EdgeStoreProvider>
        {children}
        </EdgeStoreProvider>
      </body>
    </html>
  );
}