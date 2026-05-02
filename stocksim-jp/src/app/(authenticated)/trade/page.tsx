import { createServerSupabaseClient } from '@/lib/supabase/server'
import { TradeInterface } from '@/components/trade/TradeInterface'

export default async function TradePage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: portfolio } = await supabase.from('portfolios').select('cash_balance').eq('user_id', user!.id).single()

  return (
    <div className='max-w-2xl mx-auto space-y-4'>
      <div>
        <h1 className='text-2xl font-bold'>株の売買</h1>
        <p className='text-muted-foreground text-sm'>銘柄を検索して売買注文を出しましょう</p>
      </div>
      <TradeInterface cashBalance={portfolio?.cash_balance ?? 0} />
    </div>
  )
}
