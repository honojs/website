import { fetchQuote } from '@/lib/yahoo'
import { formatUSD, formatPercent, formatVolume } from '@/lib/format'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const INDICES = [
  { ticker: '^GSPC', name: 'S&P 500', description: '米国代表500社の株価指数' },
  { ticker: '^IXIC', name: 'NASDAQ総合', description: 'テック系企業が多い指数' },
  { ticker: '^DJI', name: 'ダウ平均', description: '米国代表30社の平均株価' },
  { ticker: '^VIX', name: 'VIX（恐怖指数）', description: '市場の不安度。20以上で警戒' },
]

const STOCKS = ['AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META','BRK-B','JPM','KO','JNJ','V','MA','UNH','HD','PG','DIS','NFLX','BABA','TSM']

export default async function MarketPage() {
  const [indicesData, stocksData] = await Promise.all([
    Promise.all(INDICES.map(({ ticker, name, description }) =>
      fetchQuote(ticker).then((q) => ({ ticker, name, description, quote: q }))
    )),
    Promise.all(STOCKS.map((ticker) =>
      fetchQuote(ticker).then((q) => ({ ticker, quote: q }))
    )),
  ])

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>市場概況</h1>
        <p className='text-muted-foreground text-sm'>主要指数と人気銘柄の状況</p>
      </div>

      <Card>
        <CardHeader><CardTitle className='text-base'>主要インデックス</CardTitle></CardHeader>
        <CardContent>
          <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
            {indicesData.map(({ ticker, name, description, quote }) => (
              <div key={ticker} className='rounded-lg border p-4'>
                <div className='text-xs text-muted-foreground mb-0.5'>{description}</div>
                <div className='font-semibold'>{name}</div>
                <div className='text-2xl font-bold mt-2'>{quote ? formatUSD(quote.price, 2) : 'N/A'}</div>
                {quote && (
                  <>
                    <Badge variant={quote.change >= 0 ? 'gain' : 'loss'} className='mt-1.5'>{formatPercent(quote.changePercent)}</Badge>
                    {ticker === '^VIX' && (
                      <p className='text-xs text-muted-foreground mt-1'>
                        {quote.price >= 30 ? 'パニック水準' : quote.price >= 20 ? '警戒水準' : '安定水準'}
                      </p>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className='text-base'>人気銘柄</CardTitle></CardHeader>
        <CardContent>
          <div className='divide-y'>
            {stocksData.map(({ ticker, quote }) => (
              <div key={ticker} className='flex items-center justify-between py-3'>
                <div>
                  <span className='font-mono font-semibold'>{ticker}</span>
                  {quote && <span className='ml-2 text-sm text-muted-foreground'>{quote.name}</span>}
                </div>
                {quote ? (
                  <div className='flex items-center gap-4'>
                    <span className='font-medium'>{formatUSD(quote.price)}</span>
                    <Badge variant={quote.change >= 0 ? 'gain' : 'loss'} className='min-w-20 justify-center'>{formatPercent(quote.changePercent)}</Badge>
                    <span className='text-xs text-muted-foreground hidden sm:block'>出来高 {formatVolume(quote.volume)}</span>
                  </div>
                ) : (
                  <span className='text-muted-foreground text-sm'>N/A</span>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
