'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { PageWrapper, FadeIn, StaggerList, StaggerItem } from '@/components/ui/motion'
import { PriceChange } from '@/components/common/PriceChange'
import { formatUSD, formatPercent } from '@/lib/format'
import type { StockQuote, MarketIndex } from '@/types/stock'

const POPULAR = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL', 'META', 'AMZN', 'JPM']

export default function DashboardPage() {
  const { cash_balance, initial_balance, holdings, loaded } = usePortfolio()
  const [holdingQuotes, setHoldingQuotes] = useState<Record<string, StockQuote>>({})
  const [indices, setIndices] = useState<MarketIndex[]>([])
  const [indicesLoading, setIndicesLoading] = useState(true)

  useEffect(() => {
    if (!loaded || holdings.length === 0) return
    holdings.forEach(({ ticker }) => {
      fetch(`/api/stocks/${ticker}/quote`)
        .then((r) => r.json())
        .then((q) => setHoldingQuotes((prev) => ({ ...prev, [ticker]: q })))
        .catch(() => {})
    })
  }, [loaded, holdings])

  useEffect(() => {
    fetch('/api/market/indices')
      .then((r) => r.json())
      .then((d) => { setIndices(d); setIndicesLoading(false) })
      .catch(() => setIndicesLoading(false))
  }, [])

  const totalStockValue = holdings.reduce((sum, h) => {
    const price = holdingQuotes[h.ticker]?.price ?? h.avg_cost
    return sum + h.shares * price
  }, 0)
  const totalValue = cash_balance + totalStockValue
  const totalGainLoss = totalValue - initial_balance
  const totalGainLossPct = (totalGainLoss / initial_balance) * 100
  const isGain = totalGainLoss >= 0

  if (!loaded) return <div className='space-y-4'><Skeleton className='h-32 w-full' /><Skeleton className='h-48 w-full' /></div>

  return (
    <PageWrapper>
      <div className='space-y-6'>
        <h1 className='text-2xl font-bold'>ダッシュボード</h1>

        {/* Asset summary */}
        <StaggerList className='grid gap-4 sm:grid-cols-3'>
          <StaggerItem className='sm:col-span-2'>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>総資産</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-3xl font-bold'>{formatUSD(totalValue)}</div>
                <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${isGain ? 'text-gain' : 'text-loss'}`}>
                  {isGain ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
                  {formatUSD(Math.abs(totalGainLoss))} ({formatPercent(totalGainLossPct)}) 開始時比
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card>
              <CardHeader className='pb-2'>
                <CardTitle className='text-sm font-medium text-muted-foreground'>現金残高</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{formatUSD(cash_balance)}</div>
                <p className='text-xs text-muted-foreground mt-1'>株式 {formatUSD(totalStockValue)}</p>
              </CardContent>
            </Card>
          </StaggerItem>
        </StaggerList>

        {/* Holdings preview */}
        {holdings.length > 0 && (
          <FadeIn delay={0.15}>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between pb-2'>
                <CardTitle className='text-base'>保有銘柄</CardTitle>
                <Link href='/portfolio' className='flex items-center gap-1 text-sm text-primary'>
                  詳細 <ArrowRight className='h-3 w-3' />
                </Link>
              </CardHeader>
              <CardContent>
                <div className='space-y-1'>
                  {holdings.slice(0, 5).map((h) => {
                    const q = holdingQuotes[h.ticker]
                    const price = q?.price ?? h.avg_cost
                    const gainLoss = (price - h.avg_cost) * h.shares
                    const gainLossPct = ((price - h.avg_cost) / h.avg_cost) * 100
                    return (
                      <Link key={h.ticker} href={`/stocks/${h.ticker}`}>
                        <div className='flex items-center justify-between rounded-md hover:bg-muted/50 p-2 -mx-2 transition-colors'>
                          <div>
                            <div className='font-semibold font-mono'>{h.ticker}</div>
                            <div className='text-xs text-muted-foreground'>{h.shares.toFixed(4).replace(/\.?0+$/, '')} 株</div>
                          </div>
                          <div className='text-right'>
                            <div className='font-medium'>{formatUSD(price)}</div>
                            <PriceChange change={gainLoss} changePercent={gainLossPct} className='text-xs justify-end' />
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {holdings.length === 0 && (
          <FadeIn delay={0.15}>
            <Card>
              <CardContent className='py-8 text-center text-muted-foreground'>
                <p>まだ株を保有していません。</p>
                <Link href='/trade' className='text-primary underline text-sm'>最初の株を買ってみよう →</Link>
              </CardContent>
            </Card>
          </FadeIn>
        )}

        {/* Market indices */}
        <FadeIn delay={0.2}>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base'>主要インデックス</CardTitle>
            </CardHeader>
            <CardContent>
              {indicesLoading ? (
                <div className='grid gap-3 sm:grid-cols-4'>
                  {[1,2,3,4].map(i => <Skeleton key={i} className='h-20' />)}
                </div>
              ) : (
                <StaggerList className='grid gap-3 sm:grid-cols-4'>
                  {indices.map(({ ticker, name, price, change, changePercent }) => (
                    <StaggerItem key={ticker}>
                      <div className='rounded-md border p-3 h-full'>
                        <div className='text-xs text-muted-foreground'>{name}</div>
                        <div className='font-bold text-lg'>{formatUSD(price, 0)}</div>
                        <Badge variant={change >= 0 ? 'gain' : 'loss'} className='mt-1'>
                          {formatPercent(changePercent)}
                        </Badge>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerList>
              )}
            </CardContent>
          </Card>
        </FadeIn>

        {/* Popular stocks */}
        <FadeIn delay={0.25}>
          <Card>
            <CardHeader className='pb-2'>
              <CardTitle className='text-base'>注目銘柄</CardTitle>
            </CardHeader>
            <CardContent>
              <StaggerList className='grid grid-cols-4 gap-2 sm:grid-cols-8'>
                {POPULAR.map((ticker) => (
                  <StaggerItem key={ticker}>
                    <Link href={`/stocks/${ticker}`}>
                      <div className='rounded-md border p-2 text-center hover:bg-muted/50 transition-colors cursor-pointer'>
                        <div className='font-mono text-sm font-bold'>{ticker}</div>
                      </div>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerList>
            </CardContent>
          </Card>
        </FadeIn>
      </div>
    </PageWrapper>
  )
}
