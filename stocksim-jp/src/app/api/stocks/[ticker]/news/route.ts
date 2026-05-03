import { fetchStockNews } from '@/lib/finnhub'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params
  const news = await fetchStockNews(ticker.toUpperCase())
  return Response.json(news)
}
