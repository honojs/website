import { createServerSupabaseClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (!portfolio) return Response.json([])

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('portfolio_id', portfolio.id)
    .order('executed_at', { ascending: false })

  return Response.json(transactions ?? [])
}
