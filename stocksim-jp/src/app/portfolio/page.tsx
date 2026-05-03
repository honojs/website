'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AllocationPieChart } from '@/components/portfolio/AllocationPieChart'
import { PageWrapper, FadeIn, StaggerList, StaggerItem } from '@/components/ui/motion'
import { formatUSD, formatPercent, formatShares } from '@/lib/format'
import type { StockQuote } from '@/types/stock'
import type { HoldingWithValue } from '@/types/trade'

export default function PortfolioPage() {
  const { cash_balance, initial_balance, holdings, loaded } = usePortfolio()
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({})
  const [quotesLoading, setQuotesLoading] = useState(false)

  useEffect(() => {
    if (!loaded || holdings.length === 0) return
    setQuotesLoading(true)
    Promise.all(
      holdings.map((h) =>
        fetch(`/api/stocks/${h.ticker}/quote`)
          .then((r) => r.json())
          .then((q): [string, StockQuote] => [h.ticker, q])
          .catch((): [string, StockQuote | null] => [h.ticker, null])
      )
    ).then((results) => {
      const map: Record<string, StockQuote> = {}
      results.forEach(([ticker, q]) => { if (q) map[ticker] = q as StockQuote })
      setQuotes(map)
      setQuotesLoading(false)
    })
  }, [loaded, holdings])

  if (!loaded) return <div className='space-y-4'><Skeleton className='h-32 w-full' /><Skeleton className='h-64 w-full' /></div>

  const holdingsWithValue: HoldingWithValue[] = holdings.map((h) => {
    const price = quotes[h.ticker]?.price ?? h.avg_cost
    const currentValue = h.shares * price
    const costBasis = h.shares * h.avg_cost
    return {
      ticker: h.ticker,
      company_name: h.company_name,
      shares: h.shares,
      avg_cost: h.avg_cost,
      current_price: price,
      current_value: currentValue,
      gain_loss: currentValue - costBasis,
      gain_loss_percent: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0,
    }
  })

  const totalStockValue = holdingsWithValue.reduce((s, h) => s + h.current_value, 0)
  const totalValue = cash_balance + totalStockValue
  const totalGainLoss = totalValue - initial_balance
  const totalGainLossPct = (totalGainLoss / initial_balance) * 100
  const isGain = totalGainLoss >= 0

  return (
    <PageWrapper>
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>ポートフォリオ</h1>
        <p className='text-muted-foreground text-sm'>保有銘柄と資産状況</p>
      </div>

      <StaggerList className='grid gap-4 sm:grid-cols-3'>
        <StaggerItem>
          <Card>
            <CardHeader className='pb-2'><CardTitle className='text-sm font-medium text-muted-foreground'>総資産</CardTitle></CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>{formatUSD(totalValue)}</div>
              <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${isGain ? 'text-gain' : 'text-loss'}`}>
                {isGain ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
                {formatUSD(Math.abs(totalGainLoss))} ({formatPercent(totalGainLossPct)})
              </div>
            </CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardHeader className='pb-2'><CardTitle className='text-sm font-medium text-muted-foreground'>現金残高</CardTitle></CardHeader>
            <CardContent><div className='text-2xl font-bold'>{formatUSD(cash_balance)}</div></CardContent>
          </Card>
        </StaggerItem>
        <StaggerItem>
          <Card>
            <CardHeader className='pb-2'><CardTitle className='text-sm font-medium text-muted-foreground'>株式評価額</CardTitle></CardHeader>
            <CardContent><div className='text-2xl font-bold'>{formatUSD(totalStockValue)}</div></CardContent>
          </Card>
        </StaggerItem>
      </StaggerList>

      <FadeIn delay={0.2}>
      <div className='grid gap-6 lg:grid-cols-2'>
        {holdingsWithValue.length > 0 && (
          <Card>
            <CardHeader><CardTitle className='text-base'>資産配分</CardTitle></CardHeader>
            <CardContent>
              {quotesLoading ? <Skeleton className='h-64 w-full' /> : (
                <AllocationPieChart holdings={holdingsWithValue} cashBalance={cash_balance} />
              )}
            </CardContent>
          </Card>
        )}

        <Card className={holdingsWithValue.length === 0 ? 'lg:col-span-2' : ''}>
          <CardHeader><CardTitle className='text-base'>保有銘柄</CardTitle></CardHeader>
          <CardContent>
            {holdingsWithValue.length === 0 ? (
              <div className='py-8 text-center text-muted-foreground'>
                <p>まだ株を保有していません。</p>
                <Link href='/trade' className='text-primary underline text-sm'>株を買う →</Link>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>銘柄</TableHead>
                    <TableHead className='text-right'>株数</TableHead>
                    <TableHead className='text-right'>平均単価</TableHead>
                    <TableHead className='text-right'>現在値</TableHead>
                    <TableHead className='text-right'>評価額</TableHead>
                    <TableHead className='text-right'>損益</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {holdingsWithValue.map((h) => (
                    <TableRow key={h.ticker}>
                      <TableCell>
                        <Link href={`/stocks/${h.ticker}`} className='hover:underline'>
                          <div className='font-mono font-semibold'>{h.ticker}</div>
                          <div className='text-xs text-muted-foreground'>{h.company_name}</div>
                        </Link>
                      </TableCell>
                      <TableCell className='text-right font-mono'>{formatShares(h.shares)}</TableCell>
                      <TableCell className='text-right'>{formatUSD(h.avg_cost)}</TableCell>
                      <TableCell className='text-right'>{quotesLoading ? '...' : formatUSD(h.current_price)}</TableCell>
                      <TableCell className='text-right font-medium'>{formatUSD(h.current_value)}</TableCell>
                      <TableCell className='text-right'>
                        <span className={h.gain_loss >= 0 ? 'text-gain' : 'text-loss'}>
                          {h.gain_loss >= 0 ? '+' : ''}{formatUSD(h.gain_loss)}<br />
                          <span className='text-xs'>{formatPercent(h.gain_loss_percent)}</span>
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
      </FadeIn>
    </div>
    </PageWrapper>
  )
}
