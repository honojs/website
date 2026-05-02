export interface StockQuote {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number | null
  marketCap: number | null
  pe: number | null
  high52w: number | null
  low52w: number | null
  dayHigh: number | null
  dayLow: number | null
  open: number | null
  previousClose: number | null
  currency: string
  marketState: string
}

export interface ChartDataPoint {
  date: string
  close: number
  open: number | null
  high: number | null
  low: number | null
  volume: number | null
}

export interface StockInfo {
  ticker: string
  name: string
  description: string | null
  sector: string | null
  industry: string | null
  employees: number | null
  website: string | null
  country: string | null
  exchange: string | null
}

export interface SearchResult {
  ticker: string
  name: string
  exchange: string | null
  type: string | null
}

export interface MarketIndex {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
}

export interface NewsItem {
  id: number
  headline: string
  summary: string
  source: string
  url: string
  datetime: number
  image: string
}
