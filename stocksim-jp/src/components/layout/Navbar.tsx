'use client'

import Link from 'next/link'
import { TrendingUp } from 'lucide-react'
import { MarketStatusBadge } from '@/components/common/MarketStatusBadge'

export function Navbar() {
  return (
    <header className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center justify-between px-4'>
        <Link href='/dashboard' className='flex items-center gap-2 font-bold text-primary'>
          <TrendingUp className='h-5 w-5' />
          <span className='hidden sm:inline'>StockSim JP</span>
        </Link>
        <MarketStatusBadge />
      </div>
    </header>
  )
}
