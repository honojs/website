'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, ArrowLeftRight, PieChart, BarChart2, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const items = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'ホーム' },
  { href: '/trade', icon: ArrowLeftRight, label: '売買' },
  { href: '/portfolio', icon: PieChart, label: 'PF' },
  { href: '/market', icon: BarChart2, label: '市場' },
  { href: '/learn', icon: BookOpen, label: '学習' },
]

export function MobileNav({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <nav className={cn('border-t bg-background pb-safe', className)}>
      <div className='flex'>
        {items.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex flex-1 flex-col items-center gap-1 py-2 text-xs',
              pathname.startsWith(href) ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            <Icon className='h-5 w-5' />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
