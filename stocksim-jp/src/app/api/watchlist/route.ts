import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

const WatchlistSchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase(),
  company_name: z.string().min(1).max(200),
})

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { data } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', user.id)
    .order('added_at', { ascending: false })

  return Response.json(data ?? [])
}

export async function POST(request: Request) {
  const body = await request.json()
  const parsed = WatchlistSchema.safeParse(body)
  if (!parsed.success) return Response.json({ error: '入力が正しくありません' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { error } = await supabase.from('watchlists').insert({
    user_id: user.id,
    ticker: parsed.data.ticker,
    company_name: parsed.data.company_name,
  })

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'すでにウォッチリストに追加されています' }, { status: 409 })
    }
    return Response.json({ error: '追加に失敗しました' }, { status: 500 })
  }

  return Response.json({ success: true })
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url)
  const ticker = searchParams.get('ticker')
  if (!ticker) return Response.json({ error: 'ティッカーが必要です' }, { status: 400 })

  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  await supabase.from('watchlists').delete().eq('user_id', user.id).eq('ticker', ticker.toUpperCase())

  return Response.json({ success: true })
}
