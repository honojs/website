import { searchStocks } from '@/lib/yahoo'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim()
  if (!q || q.length < 1) return Response.json([])

  const results = await searchStocks(q)
  return Response.json(results)
}
