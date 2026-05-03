import { fetchStockInfo } from '@/lib/yahoo'

export const dynamic = 'force-dynamic'
export const maxDuration = 30

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params
  const info = await fetchStockInfo(ticker.toUpperCase())
  if (!info) {
    return Response.json({ error: 'データを取得できませんでした' }, { status: 404 })
  }
  return Response.json(info)
}
