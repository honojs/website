import { fetchStockInfo } from '@/lib/yahoo'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: Request,
  { params }: { params: { ticker: string } }
) {
  const info = await fetchStockInfo(params.ticker.toUpperCase())
  if (!info) {
    return Response.json({ error: 'データを取得できませんでした' }, { status: 404 })
  }
  return Response.json(info)
}
