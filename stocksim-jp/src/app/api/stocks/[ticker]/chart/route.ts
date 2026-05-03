import { fetchChart } from '@/lib/yahoo'

export const dynamic = 'force-dynamic'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params
  const { searchParams } = new URL(req.url)
  const period = searchParams.get('period') ?? '1mo'
  const data = await fetchChart(ticker.toUpperCase(), period)
  return Response.json(data)
}
