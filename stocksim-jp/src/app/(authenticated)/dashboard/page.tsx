import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fetchQuote } from '@/lib/yahoo'
import { formatUSD, formatPercent } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PriceChange } from '@/components/common/PriceChange'
import Link from 'next/link'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import type { Holding } from '@/types/database'

const INDICES = [
  { ticker: '^GSPC', name: 'S&P 500' },
  { ticker: '^IXIC', name: 'NASDAQ' },
  { ticker: '^DJI', name: 'ダウ平均' },
]

const POPULAR = ['AAPL', 'NVDA', 'TSLA', 'MSFT', 'GOOGL']

export default async function DashboardPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase.from('profiles').select('display_name').eq('id', user!.id).single()
  const { data: portfolio } = await supabase.from('portfolios').select('*').eq('user_id', user!.id).single()
  const { data: holdings } = await supabase.from('holdings').select('*').eq('portfolio_id', portfolio?.id ?? '').limit(5)

  const [indicesData, holdingQuotes] = await Promise.all([
    Promise.all(INDICES.map(({ ticker, name }) =>
      fetchQuote(ticker).then((q) => ({ ticker, name, quote: q }))
    )),
    Promise.all((holdings ?? []).map((h: Holding) =>
      fetchQuote(h.ticker).then((q) => ({ holding: h, quote: q }))
    )),
  ])

  const totalStockValue = holdingQuotes.reduce((sum, { holding, quote }) => {
    return sum + holding.shares * (quote?.price ?? holding.avg_cost)
  }, 0)

  const totalValue = (portfolio?.cash_balance ?? 0) + totalStockValue
  const totalGainLoss = totalValue - (portfolio?.initial_balance ?? 10000)
  const totalGainLossPct = (totalGainLoss / (portfolio?.initial_balance ?? 10000)) * 100

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>おかえりなさい、{profile?.display_name ?? 'ゲスト'}さん</h1>
        <p className='text-muted-foreground text-sm'>ポートフォリオの状況です</p>
      </div>

      {/* Asset summary */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <Card className='sm:col-span-2'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>総資産</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-3xl font-bold'>{formatUSD(totalValue)}</div>
            <div className={`flex items-center gap-1 mt-1 text-sm font-medium ${totalGainLoss >= 0 ? 'text-gain' : 'text-loss'}`}>
              {totalGainLoss >= 0 ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />}
              {formatUSD(Math.abs(totalGainLoss))} ({formatPercent(totalGainLossPct)}) 開始時比
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-medium text-muted-foreground'>現金残高</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatUSD(portfolio?.cash_balance ?? 0)}</div>
            <p className='text-xs text-muted-foreground mt-1'>株式 {formatUSD(totalStockValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings preview */}
      {holdings && holdings.length > 0 && (
        <Card>
          <CardHeader className='flex flex-row items-center justify-between pb-2'>
            <CardTitle className='text-base'>保有銘柄</CardTitle>
            <Link href='/portfolio' className='flex items-center gap-1 text-sm text-primary'>
              詳細 <ArrowRight className='h-3 w-3' />
            </Link>
          </CardHeader>
          <CardContent>
            <div className='space-y-3'>
              {holdingQuotes.map(({ holding, quote }) => {
                const currentPrice = quote?.price ?? holding.avg_cost
                const gainLoss = (currentPrice - holding.avg_cost) * holding.shares
                const gainLossPct = ((currentPrice - holding.avg_cost) / holding.avg_cost) * 100
                return (
                  <Link key={holding.ticker} href={`/stocks/${holding.ticker}`}>
                    <div className='flex items-center justify-between rounded-md hover:bg-muted/50 p-2 -mx-2 transition-colors'>
                      <div>
                        <div className='font-semibold font-mono'>{holding.ticker}</div>
                        <div className='text-xs text-muted-foreground'>{holding.shares.toFixed(4)} 株</div>
                      </div>
                      <div className='text-right'>
                        <div className='font-medium'>{formatUSD(currentPrice)}</div>
                        <PriceChange change={gainLoss} changePercent={gainLossPct} className='text-xs justify-end' />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Market indices */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>主要インデックス</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-3 sm:grid-cols-3'>
            {indicesData.map(({ ticker, name, quote }) => (
              <div key={ticker} className='rounded-md border p-3'>
                <div className='text-xs text-muted-foreground'>{name}</div>
                <div className='font-bold text-lg'>{quote ? formatUSD(quote.price, 0) : 'N/A'}</div>
                {quote && (
                  <Badge variant={quote.change >= 0 ? 'gain' : 'loss'} className='mt-1'>
                    {formatPercent(quote.changePercent)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Popular stocks */}
      <Card>
        <CardHeader className='pb-2'>
          <CardTitle className='text-base'>注目銘柄</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='grid gap-2 sm:grid-cols-5'>
            {POPULAR.map((ticker) => (
              <Link key={ticker} href={`/stocks/${ticker}`}>
                <div className='rounded-md border p-3 text-center hover:bg-muted/50 transition-colors cursor-pointer'>
                  <div className='font-mono font-bold'>{ticker}</div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
