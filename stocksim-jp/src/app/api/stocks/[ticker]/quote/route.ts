import { fetchQuote } from '@/lib/yahoo'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { ticker: string } }
) {
  const quote = await fetchQuote(params.ticker.toUpperCase())
  if (!quote) {
    return Response.json({ error: 'この銘柄は見つかりませんでした' }, { status: 404 })
  }
  return Response.json(quote)
}
