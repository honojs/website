import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { PortfolioProvider } from '@/context/PortfolioContext'
import { AppShell } from '@/components/layout/AppShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'StockSim JP — 米国株シミュレーター',
  description: '仮想資金$10,000で米国株投資を練習できる日本語シミュレーター',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ja'>
      <body className={inter.className}>
        <PortfolioProvider>
          <AppShell>{children}</AppShell>
        </PortfolioProvider>
      </body>
    </html>
  )
}
