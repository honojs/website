'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Star, Trash2, Plus } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatUSD, formatPercent } from '@/lib/format'

interface QuoteInfo { price: number; change: number; changePercent: number; name: string }

export default function WatchlistPage() {
  const { watchlist, addToWatchlist, removeFromWatchlist, loaded } = usePortfolio()
  const [ticker, setTicker] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quotes, setQuotes] = useState<Record<string, QuoteInfo>>({})

  useEffect(() => {
    watchlist.forEach(({ ticker: t }) => {
      if (quotes[t]) return
      fetch(`/api/stocks/${t}/quote`)
        .then((r) => r.json())
        .then((q) => {
          if (!q.error) setQuotes((prev) => ({ ...prev, [t]: q }))
        })
        .catch(() => {})
    })
  }, [watchlist])

  async function handleAdd() {
    const t = ticker.trim().toUpperCase()
    if (!t) return
    setAdding(true); setError(null)
    const res = await fetch(`/api/stocks/${t}/quote`)
    const q = await res.json()
    if (!res.ok || q.error) { setError('銘柄が見つかりませんでした'); setAdding(false); return }
    addToWatchlist(t, q.name ?? t)
    setQuotes((prev) => ({ ...prev, [t]: q }))
    setTicker('')
    setAdding(false)
  }

  if (!loaded) return <Skeleton className='h-64 w-full' />

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>ウォッチリスト</h1>
        <p className='text-muted-foreground text-sm'>気になる銘柄を登録して追跡しよう</p>
      </div>

      <Card>
        <CardHeader><CardTitle className='text-base'>登録銘柄 ({watchlist.length} 件)</CardTitle></CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex gap-2'>
            <Input value={ticker} onChange={(e) => setTicker(e.target.value.toUpperCase())}
              placeholder='ティッカーを入力（例：AAPL）'
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
            <Button onClick={handleAdd} disabled={adding}>
              <Plus className='h-4 w-4 mr-1' />追加
            </Button>
          </div>
          {error && <p className='text-sm text-loss'>{error}</p>}

          {watchlist.length === 0 ? (
            <div className='py-12 text-center text-muted-foreground'>
              <Star className='h-12 w-12 mx-auto mb-3 opacity-30' />
              <p>ウォッチリストに銘柄を追加してみましょう</p>
            </div>
          ) : (
            <div className='divide-y rounded-lg border'>
              {watchlist.map(({ ticker: t, company_name }) => {
                const q = quotes[t]
                return (
                  <div key={t} className='flex items-center justify-between p-4'>
                    <Link href={`/stocks/${t}`} className='flex-1 hover:opacity-80'>
                      <div className='font-mono font-semibold'>{t}</div>
                      <div className='text-sm text-muted-foreground'>{company_name}</div>
                    </Link>
                    <div className='flex items-center gap-4'>
                      {q && (
                        <div className='text-right'>
                          <div className='font-medium'>{formatUSD(q.price)}</div>
                          <Badge variant={q.change >= 0 ? 'gain' : 'loss'} className='mt-0.5'>
                            {formatPercent(q.changePercent)}
                          </Badge>
                        </div>
                      )}
                      <Button variant='ghost' size='icon' onClick={() => removeFromWatchlist(t)}>
                        <Trash2 className='h-4 w-4 text-muted-foreground' />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
