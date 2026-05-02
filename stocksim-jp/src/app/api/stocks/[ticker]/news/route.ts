import { fetchStockNews } from '@/lib/finnhub'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { ticker: string } }
) {
  const news = await fetchStockNews(params.ticker.toUpperCase())
  return Response.json(news)
}
