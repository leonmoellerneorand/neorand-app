// src/app/layout.tsx
import type { Metadata } from 'next'
import { Exo_2, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const exo2 = Exo_2({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'NEORAND Portal',
  description: 'Portal de clientes NEORAND',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${exo2.variable} ${jetbrainsMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
