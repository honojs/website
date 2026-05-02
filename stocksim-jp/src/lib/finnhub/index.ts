import type { NewsItem } from '@/types/stock'

const FINNHUB_BASE = 'https://finnhub.io/api/v1'

export async function fetchStockNews(ticker: string): Promise<NewsItem[]> {
  const apiKey = process.env.FINNHUB_API_KEY
  if (!apiKey) return []

  const to = new Date()
  const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  const fmt = (d: Date) => d.toISOString().split('T')[0]

  const url = new URL(`${FINNHUB_BASE}/company-news`)
  url.searchParams.set('symbol', ticker)
  url.searchParams.set('from', fmt(from))
  url.searchParams.set('to', fmt(to))
  url.searchParams.set('token', apiKey)

  const res = await fetch(url.toString(), { next: { revalidate: 900 } })
  if (!res.ok) return []

  const data: NewsItem[] = await res.json()
  return Array.isArray(data) ? data.slice(0, 5) : []
}
