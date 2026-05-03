import { fetchQuote } from '@/lib/yahoo'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

const INDICES = [
  { ticker: '^GSPC', name: 'S&P 500' },
  { ticker: '^IXIC', name: 'NASDAQ' },
  { ticker: '^DJI', name: 'ダウ平均' },
  { ticker: '^VIX', name: 'VIX' },
]

export async function GET() {
  const results = await Promise.all(
    INDICES.map(async ({ ticker, name }) => {
      const quote = await fetchQuote(ticker)
      if (!quote) return { ticker, name, price: 0, change: 0, changePercent: 0 }
      return {
        ticker,
        name,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
      }
    })
  )
  return Response.json(results)
}
