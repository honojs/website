import { notFound } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fetchQuote, fetchStockInfo } from '@/lib/yahoo'
import { fetchStockNews } from '@/lib/finnhub'
import { formatUSD, formatMarketCap, formatVolume, formatPercent } from '@/lib/format'
import { StockChart } from '@/components/chart/StockChart'
import { TradeInterface } from '@/components/trade/TradeInterface'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { ExternalLink } from 'lucide-react'

export default async function StockDetailPage({ params }: { params: { ticker: string } }) {
  const ticker = params.ticker.toUpperCase()

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: portfolio } = await supabase.from('portfolios').select('cash_balance').eq('user_id', user!.id).single()

  const [quote, info, news] = await Promise.all([
    fetchQuote(ticker),
    fetchStockInfo(ticker),
    fetchStockNews(ticker),
  ])

  if (!quote) notFound()

  const isGain = quote.change >= 0

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='space-y-1'>
        <div className='flex items-center gap-3 flex-wrap'>
          <h1 className='text-3xl font-bold font-mono'>{ticker}</h1>
          <span className='text-lg text-muted-foreground'>{quote.name}</span>
          <Badge variant={isGain ? 'gain' : 'loss'}>
            {quote.marketState === 'REGULAR' ? '通常取引中' : '時間外'}
          </Badge>
        </div>
        <div className='flex items-end gap-3'>
          <span className='text-4xl font-bold'>{formatUSD(quote.price)}</span>
          <span className={`text-lg font-medium ${isGain ? 'text-gain' : 'text-loss'}`}>
            {isGain ? '+' : ''}{quote.change.toFixed(2)} ({formatPercent(quote.changePercent)})
          </span>
        </div>
      </div>

      <div className='grid gap-6 lg:grid-cols-3'>
        <div className='lg:col-span-2 space-y-6'>
          {/* Chart */}
          <Card>
            <CardContent className='pt-6'>
              <StockChart ticker={ticker} />
            </CardContent>
          </Card>

          {/* Key stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>基本情報</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className='grid grid-cols-2 gap-x-6 gap-y-3 text-sm'>
                {[
                  { label: '時価総額', value: formatMarketCap(quote.marketCap) },
                  { label: 'PER', value: quote.pe ? quote.pe.toFixed(1) : 'N/A' },
                  { label: '出来高', value: formatVolume(quote.volume) },
                  { label: '前日終値', value: quote.previousClose ? formatUSD(quote.previousClose) : 'N/A' },
                  { label: '本日高値', value: quote.dayHigh ? formatUSD(quote.dayHigh) : 'N/A' },
                  { label: '本日安値', value: quote.dayLow ? formatUSD(quote.dayLow) : 'N/A' },
                  { label: '52週高値', value: quote.high52w ? formatUSD(quote.high52w) : 'N/A' },
                  { label: '52週安値', value: quote.low52w ? formatUSD(quote.low52w) : 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt className='text-muted-foreground'>{label}</dt>
                    <dd className='font-medium'>{value}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          </Card>

          {/* Company info */}
          {info?.description && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>企業概要</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 text-sm'>
                {info.sector && (
                  <div className='flex gap-2 flex-wrap'>
                    <Badge variant='secondary'>{info.sector}</Badge>
                    {info.industry && <Badge variant='outline'>{info.industry}</Badge>}
                  </div>
                )}
                <p className='text-muted-foreground leading-relaxed line-clamp-6'>{info.description}</p>
                {info.website && (
                  <a href={info.website} target='_blank' rel='noopener noreferrer'
                    className='inline-flex items-center gap-1 text-primary text-xs hover:underline'>
                    公式サイト <ExternalLink className='h-3 w-3' />
                  </a>
                )}
              </CardContent>
            </Card>
          )}

          {/* News */}
          {news.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className='text-base'>最新ニュース</CardTitle>
              </CardHeader>
              <CardContent className='divide-y'>
                {news.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='block py-3 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity'
                  >
                    <p className='text-sm font-medium line-clamp-2'>{item.headline}</p>
                    <p className='text-xs text-muted-foreground mt-1'>
                      {item.source} · {new Date(item.datetime * 1000).toLocaleDateString('ja-JP')}
                    </p>
                  </a>
                ))}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Trade panel */}
        <div>
          <TradeInterface cashBalance={portfolio?.cash_balance ?? 0} preselectedTicker={ticker} />
        </div>
      </div>
    </div>
  )
}
