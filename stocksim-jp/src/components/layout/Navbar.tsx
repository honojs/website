'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { TrendingUp, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketStatusBadge } from '@/components/common/MarketStatusBadge'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function Navbar() {
  const router = useRouter()

  async function handleSignOut() {
    const supabase = getSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className='sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
      <div className='flex h-14 items-center justify-between px-4'>
        <Link href='/dashboard' className='flex items-center gap-2 font-bold text-primary'>
          <TrendingUp className='h-5 w-5' />
          <span className='hidden sm:inline'>StockSim JP</span>
        </Link>

        <div className='flex items-center gap-3'>
          <MarketStatusBadge />
          <Link href='/settings'>
            <Button variant='ghost' size='icon'>
              <User className='h-4 w-4' />
            </Button>
          </Link>
          <Button variant='ghost' size='icon' onClick={handleSignOut} title='ログアウト'>
            <LogOut className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </header>
  )
}
