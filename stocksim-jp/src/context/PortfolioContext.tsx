'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import {
  loadPortfolio, savePortfolio, executeBuy, executeSell,
  DEFAULT_STATE,
  type PortfolioState, type WatchlistItem,
} from '@/lib/portfolio-store'

interface PortfolioContextValue extends PortfolioState {
  buy: (ticker: string, companyName: string, shares: number, price: number) => string | null
  sell: (ticker: string, companyName: string, shares: number, price: number) => string | null
  addToWatchlist: (ticker: string, companyName: string) => void
  removeFromWatchlist: (ticker: string) => void
  reset: () => void
  loaded: boolean
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PortfolioState>(DEFAULT_STATE)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setState(loadPortfolio())
    setLoaded(true)
  }, [])

  function update(next: PortfolioState) {
    setState(next)
    savePortfolio(next)
  }

  function buy(ticker: string, companyName: string, shares: number, price: number): string | null {
    const result = executeBuy(state, ticker, companyName, shares, price)
    if (!result.ok) return result.error
    update(result.state)
    return null
  }

  function sell(ticker: string, companyName: string, shares: number, price: number): string | null {
    const result = executeSell(state, ticker, companyName, shares, price)
    if (!result.ok) return result.error
    update(result.state)
    return null
  }

  function addToWatchlist(ticker: string, companyName: string) {
    if (state.watchlist.some((w) => w.ticker === ticker)) return
    const item: WatchlistItem = { ticker, company_name: companyName, added_at: new Date().toISOString() }
    update({ ...state, watchlist: [item, ...state.watchlist] })
  }

  function removeFromWatchlist(ticker: string) {
    update({ ...state, watchlist: state.watchlist.filter((w) => w.ticker !== ticker) })
  }

  function reset() {
    update({ ...DEFAULT_STATE })
  }

  return (
    <PortfolioContext.Provider value={{ ...state, buy, sell, addToWatchlist, removeFromWatchlist, reset, loaded }}>
      {children}
    </PortfolioContext.Provider>
  )
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext)
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider')
  return ctx
}
