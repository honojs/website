'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Star, Trash2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { formatUSD, formatPercent } from '@/lib/format'
import type { Watchlist } from '@/types/database'

interface WatchlistEntry extends Watchlist {
  price?: number
  change?: number
  changePercent?: number
}

interface Props {
  initialList: WatchlistEntry[]
}

export function WatchlistClient({ initialList }: Props) {
  const [list, setList] = useState<WatchlistEntry[]>(initialList)
  const [ticker, setTicker] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addToWatchlist() {
    const t = ticker.trim().toUpperCase()
    if (!t) return
    setAdding(true)
    setError(null)

    const quoteRes = await fetch(`/api/stocks/${t}/quote`)
    if (!quoteRes.ok) {
      setError('銘柄が見つかりませんでした')
      setAdding(false)
      return
    }
    const quote = await quoteRes.json()

    const res = await fetch('/api/watchlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticker: t, company_name: quote.name }),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error ?? '追加に失敗しました')
    } else {
      setList((prev) => [
        { id: '', user_id: '', ticker: t, company_name: quote.name, added_at: new Date().toISOString(),
          price: quote.price, change: quote.change, changePercent: quote.changePercent },
        ...prev,
      ])
      setTicker('')
    }
    setAdding(false)
  }

  async function remove(t: string) {
    await fetch(`/api/watchlist?ticker=${t}`, { method: 'DELETE' })
    setList((prev) => prev.filter((w) => w.ticker !== t))
  }

  return (
    <div className='space-y-4'>
      <div className='flex gap-2'>
        <Input
          value={ticker}
          onChange={(e) => setTicker(e.target.value.toUpperCase())}
          placeholder='ティッカーを入力（例：AAPL）'
          onKeyDown={(e) => e.key === 'Enter' && addToWatchlist()}
        />
        <Button onClick={addToWatchlist} disabled={adding}>
          <Plus className='h-4 w-4 mr-1' />
          追加
        </Button>
      </div>

      {error && <p className='text-sm text-loss'>{error}</p>}

      {list.length === 0 ? (
        <div className='py-12 text-center text-muted-foreground'>
          <Star className='h-12 w-12 mx-auto mb-3 opacity-30' />
          <p>ウォッチリストに銘柄を追加してみましょう</p>
        </div>
      ) : (
        <div className='divide-y rounded-lg border'>
          {list.map((item) => (
            <div key={item.ticker} className='flex items-center justify-between p-4'>
              <Link href={`/stocks/${item.ticker}`} className='flex-1 hover:opacity-80'>
                <div className='font-mono font-semibold'>{item.ticker}</div>
                <div className='text-sm text-muted-foreground'>{item.company_name}</div>
              </Link>
              <div className='flex items-center gap-4'>
                {item.price !== undefined && (
                  <div className='text-right'>
                    <div className='font-medium'>{formatUSD(item.price)}</div>
                    <Badge variant={item.change && item.change >= 0 ? 'gain' : 'loss'} className='mt-0.5'>
                      {formatPercent(item.changePercent ?? 0)}
                    </Badge>
                  </div>
                )}
                <Button variant='ghost' size='icon' onClick={() => remove(item.ticker)}>
                  <Trash2 className='h-4 w-4 text-muted-foreground' />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
