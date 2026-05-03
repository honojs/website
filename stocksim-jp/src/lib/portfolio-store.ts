export interface Holding {
  ticker: string
  company_name: string
  shares: number
  avg_cost: number
}

export interface Transaction {
  id: string
  ticker: string
  company_name: string
  transaction_type: 'buy' | 'sell'
  shares: number
  price: number
  total_amount: number
  executed_at: string
}

export interface WatchlistItem {
  ticker: string
  company_name: string
  added_at: string
}

export interface PortfolioState {
  cash_balance: number
  initial_balance: number
  holdings: Holding[]
  transactions: Transaction[]
  watchlist: WatchlistItem[]
}

const KEY = 'stocksim_portfolio'

export const DEFAULT_STATE: PortfolioState = {
  cash_balance: 10000,
  initial_balance: 10000,
  holdings: [],
  transactions: [],
  watchlist: [],
}

export function loadPortfolio(): PortfolioState {
  if (typeof window === 'undefined') return DEFAULT_STATE
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return { ...DEFAULT_STATE, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_STATE
  }
}

export function savePortfolio(state: PortfolioState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(state))
}

export function executeBuy(
  state: PortfolioState,
  ticker: string,
  companyName: string,
  shares: number,
  price: number
): { ok: true; state: PortfolioState } | { ok: false; error: string } {
  const totalCost = shares * price
  if (state.cash_balance < totalCost) {
    return { ok: false, error: '残高が不足しています' }
  }

  const existingIdx = state.holdings.findIndex((h) => h.ticker === ticker)
  let holdings = [...state.holdings]

  if (existingIdx >= 0) {
    const existing = holdings[existingIdx]
    const newShares = existing.shares + shares
    const newAvgCost = (existing.shares * existing.avg_cost + shares * price) / newShares
    holdings[existingIdx] = { ...existing, shares: newShares, avg_cost: newAvgCost }
  } else {
    holdings = [...holdings, { ticker, company_name: companyName, shares, avg_cost: price }]
  }

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    ticker,
    company_name: companyName,
    transaction_type: 'buy',
    shares,
    price,
    total_amount: totalCost,
    executed_at: new Date().toISOString(),
  }

  return {
    ok: true,
    state: {
      ...state,
      cash_balance: state.cash_balance - totalCost,
      holdings,
      transactions: [transaction, ...state.transactions],
    },
  }
}

export function executeSell(
  state: PortfolioState,
  ticker: string,
  companyName: string,
  shares: number,
  price: number
): { ok: true; state: PortfolioState } | { ok: false; error: string } {
  const holding = state.holdings.find((h) => h.ticker === ticker)
  if (!holding || holding.shares < shares) {
    return { ok: false, error: '保有株数が不足しています' }
  }

  const totalAmount = shares * price
  const newShares = holding.shares - shares

  const holdings =
    newShares < 0.0001
      ? state.holdings.filter((h) => h.ticker !== ticker)
      : state.holdings.map((h) =>
          h.ticker === ticker ? { ...h, shares: newShares } : h
        )

  const transaction: Transaction = {
    id: crypto.randomUUID(),
    ticker,
    company_name: companyName,
    transaction_type: 'sell',
    shares,
    price,
    total_amount: totalAmount,
    executed_at: new Date().toISOString(),
  }

  return {
    ok: true,
    state: {
      ...state,
      cash_balance: state.cash_balance + totalAmount,
      holdings,
      transactions: [transaction, ...state.transactions],
    },
  }
}
