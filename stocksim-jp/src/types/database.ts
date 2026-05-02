export interface Profile {
  id: string
  display_name: string
  created_at: string
}

export interface Portfolio {
  id: string
  user_id: string
  cash_balance: number
  initial_balance: number
  created_at: string
  updated_at: string
}

export interface Holding {
  id: string
  portfolio_id: string
  ticker: string
  company_name: string
  shares: number
  avg_cost: number
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  portfolio_id: string
  ticker: string
  company_name: string
  transaction_type: 'buy' | 'sell'
  shares: number
  price: number
  total_amount: number
  executed_at: string
}

export interface Watchlist {
  id: string
  user_id: string
  ticker: string
  company_name: string
  added_at: string
}
