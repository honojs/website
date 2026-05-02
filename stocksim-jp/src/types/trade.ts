import { z } from 'zod'

export const BuySchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase(),
  companyName: z.string().min(1).max(200),
  shares: z.number().positive().max(1000000),
})

export const SellSchema = z.object({
  ticker: z.string().min(1).max(10).toUpperCase(),
  companyName: z.string().min(1).max(200),
  shares: z.number().positive().max(1000000),
})

export type BuyRequest = z.infer<typeof BuySchema>
export type SellRequest = z.infer<typeof SellSchema>

export interface TradeResponse {
  success: boolean
  executionPrice?: number
  totalAmount?: number
  error?: string
}

export interface HoldingWithValue {
  ticker: string
  company_name: string
  shares: number
  avg_cost: number
  current_price: number
  current_value: number
  gain_loss: number
  gain_loss_percent: number
}

export interface PortfolioSummary {
  cash_balance: number
  initial_balance: number
  total_stock_value: number
  total_value: number
  total_gain_loss: number
  total_gain_loss_percent: number
  holdings: HoldingWithValue[]
}
