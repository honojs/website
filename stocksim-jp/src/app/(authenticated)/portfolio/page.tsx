import Link from 'next/link'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fetchQuote } from '@/lib/yahoo'
import { formatUSD, formatPercent, formatShares } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table'
import { AllocationPieChart } from '@/components/portfolio/AllocationPieChart'
import type { Holding } from '@/types/database'
import type { HoldingWithValue } from '@/types/trade'
import { TrendingUp, TrendingDown } from 'lucide-react'

export default async function PortfolioPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: portfolio } = await supabase.from('portfolios').select('*').eq('user_id', user!.id).single()
  const { data: holdingsRaw } = await supabase.from('holdings').select('*').eq('portfolio_id', portfolio?.id ?? '')

  const holdingsWithValue: HoldingWithValue[] = await Promise.all(
    (holdingsRaw ?? []).map(async (h: Holding) => {
      const quote = await fetchQuote(h.ticker)
      const currentPrice = quote?.price ?? h.avg_cost
      const currentValue = h.shares * currentPrice
      const costBasis = h.shares * h.avg_cost
      return {
        ticker: h.ticker,
        company_name: h.company_name,
        shares: h.shares,
        avg_cost: h.avg_cost,
        current_price: currentPrice,
        current_value: currentValue,
        gain_loss: currentValue - costBasis,
        gain_loss_percent: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0,
      }
    })
  )

  const totalStockValue = holdingsWithValue.reduce((s, h) => s + h.current_value, 0)
  const cashBalance = portfolio?.cash_balance ?? 0
  const totalValue = cashBalance + totalStockValue
  const totalGainLoss = totalValue - (portfolio?.initial_balance ?? 10000)
  const totalGainLossPct = (totalGainLoss / (portfolio?.initial_balance ?? 10000)) * 100
  const isGain = totalGainLoss >= 0

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>ポートフォリオ</h1>
        <p className='text-muted-foreground text-sm'>保有銘柄と資産状況</p>
      </div>

      {/* Summary cards */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>総資産</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatUSD(totalValue)}</div>
            <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${isGain ? 'text-gain' : 'text-loss'}`}>
              {isGain ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
              {formatUSD(Math.abs(totalGainLoss))} ({formatPercent(totalGainLossPct)})
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>現金残高</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatUSD(cashBalance)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>株式評価額</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatUSD(totalStockValue)}</div>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-6 lg:grid-cols-2'>
        {/* Pie chart */}
        {holdingsWithValue.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>資産配分</CardTitle>
            </CardHeader>
            <CardContent>
              <AllocationPieChart holdings={holdingsWithValue} cashBalance={cashBalance} />
            </CardContent>
          </Card>
        )}

        {/* Holdings table */}
        <Card className={holdingsWithValue.length === 0 ? 'lg:col-span-2' : ''}>
          <CardHeader>
            <CardTitle className='text-base'>保有銘柄</CardTitle>
          </CardHeader>
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
                    <TableHead className='text-right'>平均取得単価</TableHead>
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
                      <TableCell className='text-right'>{formatUSD(h.current_price)}</TableCell>
                      <TableCell className='text-right font-medium'>{formatUSD(h.current_value)}</TableCell>
                      <TableCell className='text-right'>
                        <Badge variant={h.gain_loss >= 0 ? 'gain' : 'loss'}>
                          {h.gain_loss >= 0 ? '+' : ''}{formatUSD(h.gain_loss)}
                          <br />
                          <span className='text-[10px]'>{formatPercent(h.gain_loss_percent)}</span>
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
