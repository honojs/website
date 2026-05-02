import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fetchQuote } from '@/lib/yahoo'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WatchlistClient } from '@/components/watchlist/WatchlistClient'
import type { Watchlist } from '@/types/database'

export default async function WatchlistPage() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: watchlist } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', user!.id)
    .order('added_at', { ascending: false })

  const enriched = await Promise.all(
    (watchlist ?? []).map(async (w: Watchlist) => {
      const quote = await fetchQuote(w.ticker)
      return { ...w, price: quote?.price, change: quote?.change, changePercent: quote?.changePercent }
    })
  )

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>ウォッチリスト</h1>
        <p className='text-muted-foreground text-sm'>気になる銘柄を登録して追跡しよう</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>登録銘柄 ({enriched.length} 件)</CardTitle>
        </CardHeader>
        <CardContent>
          <WatchlistClient initialList={enriched} />
        </CardContent>
      </Card>
    </div>
  )
}
