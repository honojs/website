import { createServerSupabaseClient } from '@/lib/supabase/server'
import { fetchQuote } from '@/lib/yahoo'
import type { Holding } from '@/types/database'
import type { HoldingWithValue, PortfolioSummary } from '@/types/trade'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: '認証が必要です' }, { status: 401 })

  const { data: portfolio } = await supabase
    .from('portfolios')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!portfolio) return Response.json({ error: 'ポートフォリオが見つかりません' }, { status: 404 })

  const { data: holdings } = await supabase
    .from('holdings')
    .select('*')
    .eq('portfolio_id', portfolio.id)

  const holdingsWithValue: HoldingWithValue[] = await Promise.all(
    (holdings ?? []).map(async (h: Holding) => {
      const quote = await fetchQuote(h.ticker)
      const currentPrice = quote?.price ?? h.avg_cost
      const currentValue = h.shares * currentPrice
      const costBasis = h.shares * h.avg_cost
      return {
        ticker: h.ticker,
        company_name: h.company_name,
        shares: h.shares,
        avg_cost: h.avg_cost,
        current_price: currentPrice,
        current_value: currentValue,
        gain_loss: currentValue - costBasis,
        gain_loss_percent: costBasis > 0 ? ((currentValue - costBasis) / costBasis) * 100 : 0,
      }
    })
  )

  const totalStockValue = holdingsWithValue.reduce((sum, h) => sum + h.current_value, 0)
  const totalValue = portfolio.cash_balance + totalStockValue
  const totalGainLoss = totalValue - portfolio.initial_balance
  const totalGainLossPercent = portfolio.initial_balance > 0
    ? (totalGainLoss / portfolio.initial_balance) * 100
    : 0

  const summary: PortfolioSummary = {
    cash_balance: portfolio.cash_balance,
    initial_balance: portfolio.initial_balance,
    total_stock_value: totalStockValue,
    total_value: totalValue,
    total_gain_loss: totalGainLoss,
    total_gain_loss_percent: totalGainLossPercent,
    holdings: holdingsWithValue,
  }

  return Response.json(summary)
}
