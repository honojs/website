/* eslint-disable @typescript-eslint/no-explicit-any */
import yahooFinance from 'yahoo-finance2'
import type { StockQuote, ChartDataPoint, StockInfo, SearchResult } from '@/types/stock'

export async function fetchQuote(ticker: string): Promise<StockQuote | null> {
  try {
    const quote = (await yahooFinance.quote(ticker)) as any
    if (!quote) return null
    return {
      ticker: quote.symbol ?? ticker,
      name: quote.shortName ?? quote.longName ?? ticker,
      price: quote.regularMarketPrice ?? 0,
      change: quote.regularMarketChange ?? 0,
      changePercent: quote.regularMarketChangePercent ?? 0,
      volume: quote.regularMarketVolume ?? null,
      marketCap: quote.marketCap ?? null,
      pe: quote.trailingPE ?? null,
      high52w: quote.fiftyTwoWeekHigh ?? null,
      low52w: quote.fiftyTwoWeekLow ?? null,
      dayHigh: quote.regularMarketDayHigh ?? null,
      dayLow: quote.regularMarketDayLow ?? null,
      open: quote.regularMarketOpen ?? null,
      previousClose: quote.regularMarketPreviousClose ?? null,
      currency: quote.currency ?? 'USD',
      marketState: quote.marketState ?? 'CLOSED',
    }
  } catch {
    return null
  }
}

export async function fetchChart(ticker: string, period: string): Promise<ChartDataPoint[]> {
  const now = new Date()
  const { interval, period1 } = getPeriodParams(period, now)

  try {
    const result = (await yahooFinance.chart(ticker, {
      period1: period1.toISOString(),
      interval: interval as any,
    })) as any

    const quotes: any[] = result.quotes ?? []
    return quotes
      .filter((q: any) => q.close !== null && q.close !== undefined)
      .map((q: any) => ({
        date: q.date instanceof Date ? q.date.toISOString() : String(q.date),
        close: q.close ?? 0,
        open: q.open ?? null,
        high: q.high ?? null,
        low: q.low ?? null,
        volume: q.volume ?? null,
      }))
  } catch {
    return []
  }
}

function getPeriodParams(period: string, now: Date) {
  const d = new Date(now)
  switch (period) {
    case '1d':
      d.setDate(d.getDate() - 1)
      return { interval: '5m', period1: d }
    case '5d':
      d.setDate(d.getDate() - 5)
      return { interval: '15m', period1: d }
    case '3mo':
      d.setMonth(d.getMonth() - 3)
      return { interval: '1d', period1: d }
    case '1y':
      d.setFullYear(d.getFullYear() - 1)
      return { interval: '1wk', period1: d }
    case '5y':
      d.setFullYear(d.getFullYear() - 5)
      return { interval: '1mo', period1: d }
    default: // '1mo'
      d.setMonth(d.getMonth() - 1)
      return { interval: '1d', period1: d }
  }
}

export async function fetchStockInfo(ticker: string): Promise<StockInfo | null> {
  try {
    const summary = (await yahooFinance.quoteSummary(ticker, {
      modules: ['assetProfile', 'quoteType'],
    })) as any
    const profile = summary.assetProfile
    const quoteType = summary.quoteType
    return {
      ticker,
      name: quoteType?.longName ?? quoteType?.shortName ?? ticker,
      description: profile?.longBusinessSummary ?? null,
      sector: profile?.sector ?? null,
      industry: profile?.industry ?? null,
      employees: profile?.fullTimeEmployees ?? null,
      website: profile?.website ?? null,
      country: profile?.country ?? null,
      exchange: quoteType?.exchange ?? null,
    }
  } catch {
    return null
  }
}

export async function searchStocks(query: string): Promise<SearchResult[]> {
  try {
    const results = (await yahooFinance.search(query, {
      quotesCount: 10,
      newsCount: 0,
    })) as any
    const quotes: any[] = results.quotes ?? []
    return quotes
      .filter((r: any) => r.quoteType === 'EQUITY' && r.symbol)
      .map((r: any) => ({
        ticker: r.symbol as string,
        name: r.shortname ?? r.longname ?? r.symbol,
        exchange: r.exchange ?? null,
        type: r.quoteType ?? null,
      }))
  } catch {
    return []
  }
}
