'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, ArrowLeftRight, PieChart, Clock, Star,
  BarChart2, BookOpen, Settings, TrendingUp,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ダッシュボード' },
  { href: '/trade', icon: ArrowLeftRight, label: '株の売買' },
  { href: '/portfolio', icon: PieChart, label: 'ポートフォリオ' },
  { href: '/history', icon: Clock, label: '取引履歴' },
  { href: '/watchlist', icon: Star, label: 'ウォッチリスト' },
  { href: '/market', icon: BarChart2, label: '市場概況' },
  { href: '/learn', icon: BookOpen, label: '基礎知識' },
  { href: '/settings', icon: Settings, label: '設定' },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn('flex w-60 flex-col border-r bg-background', className)}>
      <div className='flex h-14 items-center gap-2 border-b px-6 font-bold text-primary'>
        <TrendingUp className='h-5 w-5' />
        StockSim JP
      </div>
      <nav className='flex-1 space-y-1 p-4'>
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              pathname.startsWith(href)
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className='h-4 w-4' />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
