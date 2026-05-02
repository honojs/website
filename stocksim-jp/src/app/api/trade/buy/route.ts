import { createServerSupabaseClient, createServiceSupabaseClient } from '@/lib/supabase/server'
import { fetchQuote } from '@/lib/yahoo'
import { BuySchema } from '@/types/trade'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = BuySchema.safeParse(body)
  if (!parsed.success) {
    return Response.json({ error: '入力が正しくありません' }, { status: 400 })
  }

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const quote = await fetchQuote(parsed.data.ticker)
  if (!quote || quote.price === 0) {
    return Response.json({ error: '株価の取得に失敗しました。しばらくしてから再試行してください' }, { status: 503 })
  }

  const executionPrice = quote.price
  const serviceClient = createServiceSupabaseClient()

  const { data, error } = await serviceClient.rpc('execute_buy', {
    p_user_id: user.id,
    p_ticker: parsed.data.ticker,
    p_company_name: parsed.data.companyName,
    p_shares: parsed.data.shares,
    p_price: executionPrice,
  })

  if (error) {
    console.error('[buy rpc error]', error)
    return Response.json({ error: 'トレードに失敗しました' }, { status: 500 })
  }

  if (data?.error) {
    return Response.json({ error: data.error }, { status: 400 })
  }

  return Response.json({
    success: true,
    executionPrice,
    totalAmount: data?.total_amount,
  })
}
