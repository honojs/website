'use client'

import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { usePortfolio } from '@/context/PortfolioContext'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { formatUSD, formatShares } from '@/lib/format'
import type { SearchResult, StockQuote } from '@/types/stock'

function useDebounce<T>(value: T, delay: number): T {
  const [v, setV] = useState<T>(value)
  useEffect(() => {
    const h = setTimeout(() => setV(value), delay)
    return () => clearTimeout(h)
  }, [value, delay])
  return v
}

interface Props {
  preselectedTicker?: string
}

export function TradeInterface({ preselectedTicker }: Props) {
  const { cash_balance, holdings, buy, sell } = usePortfolio()
  const [query, setQuery] = useState(preselectedTicker ?? '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<SearchResult | null>(null)
  const [quote, setQuote] = useState<StockQuote | null>(null)
  const [quoteFetching, setQuoteFetching] = useState(false)
  const [shares, setShares] = useState('')
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [executing, setExecuting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (!debouncedQuery || selected) { setResults([]); return }
    setSearching(true)
    fetch(`/api/stocks/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((d) => { setResults(Array.isArray(d) ? d.slice(0, 8) : []); setSearching(false) })
      .catch(() => setSearching(false))
  }, [debouncedQuery, selected])

  const fetchQuote = useCallback((ticker: string) => {
    setQuoteFetching(true)
    fetch(`/api/stocks/${ticker}/quote`)
      .then((r) => r.json())
      .then((q) => { setQuote(q.error ? null : q); setQuoteFetching(false) })
      .catch(() => setQuoteFetching(false))
  }, [])

  useEffect(() => {
    if (preselectedTicker) {
      const s = { ticker: preselectedTicker, name: preselectedTicker, exchange: null, type: null }
      setSelected(s)
      fetchQuote(preselectedTicker)
    }
  }, [preselectedTicker, fetchQuote])

  function selectStock(s: SearchResult) {
    setSelected(s); setQuery(s.ticker); setResults([]); fetchQuote(s.ticker)
  }

  function clear() {
    setSelected(null); setQuote(null); setQuery(''); setShares(''); setError(null); setSuccess(null)
  }

  async function executeTrade() {
    if (!selected || !quote || !shares) return
    setExecuting(true)
    setError(null)

    // Re-fetch live price at execution time
    let execPrice = quote.price
    try {
      const res = await fetch(`/api/stocks/${selected.ticker}/quote`)
      const fresh = await res.json()
      if (fresh.price) execPrice = fresh.price
    } catch {}

    const sharesNum = parseFloat(shares)
    const err = tradeType === 'buy'
      ? buy(selected.ticker, selected.name, sharesNum, execPrice)
      : sell(selected.ticker, selected.name, sharesNum, execPrice)

    setExecuting(false)
    setConfirmOpen(false)

    if (err) {
      setError(err)
    } else {
      const totalAmt = sharesNum * execPrice
      setSuccess(`${selected.ticker} を ${formatShares(sharesNum)} 株${tradeType === 'buy' ? '購入' : '売却'}しました（${formatUSD(totalAmt)}）`)
      setShares('')
    }
  }

  const sharesNum = parseFloat(shares) || 0
  const totalCost = sharesNum * (quote?.price ?? 0)
  const holding = holdings.find((h) => h.ticker === selected?.ticker)
  const canBuy = sharesNum > 0 && totalCost <= cash_balance && !!quote
  const canSell = sharesNum > 0 && !!holding && holding.shares >= sharesNum && !!quote

  return (
    <div className='space-y-4'>
      <Card>
        <CardHeader><CardTitle>銘柄を検索</CardTitle></CardHeader>
        <CardContent className='space-y-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (selected) clear() }}
              placeholder='ティッカーまたは会社名（例：apple、AAPL）'
              className='pl-9 pr-9'
            />
            {(query || selected) && (
              <button onClick={clear} className='absolute right-3 top-1/2 -translate-y-1/2'>
                <X className='h-4 w-4 text-muted-foreground' />
              </button>
            )}
          </div>
          {searching && <p className='text-sm text-muted-foreground'>検索中...</p>}
          {results.length > 0 && !selected && (
            <div className='rounded-md border divide-y'>
              {results.map((r) => (
                <button key={r.ticker} onClick={() => selectStock(r)}
                  className='w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 text-left transition-colors'>
                  <div>
                    <span className='font-mono font-semibold'>{r.ticker}</span>
                    <span className='ml-2 text-sm text-muted-foreground'>{r.name}</span>
                  </div>
                  {r.exchange && <span className='text-xs text-muted-foreground'>{r.exchange}</span>}
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='font-mono'>{selected.ticker}</span>
              <span className='text-base font-normal text-muted-foreground'>{selected.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {quoteFetching && <p className='text-sm text-muted-foreground'>株価取得中...</p>}
            {quote && (
              <div className='rounded-md bg-muted/30 p-4'>
                <div className='text-3xl font-bold'>{formatUSD(quote.price)}</div>
                <div className={`text-sm font-medium ${quote.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                </div>
              </div>
            )}

            <div className='flex gap-2'>
              <Button variant={tradeType === 'buy' ? 'gain' : 'outline'} className='flex-1' onClick={() => setTradeType('buy')}>買い</Button>
              <Button variant={tradeType === 'sell' ? 'loss' : 'outline'} className='flex-1' onClick={() => setTradeType('sell')}>売り</Button>
            </div>

            {tradeType === 'sell' && holding && (
              <p className='text-xs text-muted-foreground'>保有: {formatShares(holding.shares)} 株（平均取得単価 {formatUSD(holding.avg_cost)}）</p>
            )}

            <div className='space-y-1.5'>
              <Label>株数</Label>
              <Input type='number' value={shares} onChange={(e) => setShares(e.target.value)}
                placeholder='例：1 または 0.5' min='0.0001' step='0.0001' />
            </div>

            {sharesNum > 0 && quote && (
              <div className='rounded-md border p-3 text-sm space-y-1'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>合計金額</span>
                  <span className='font-semibold'>{formatUSD(totalCost)}</span>
                </div>
                {tradeType === 'buy' && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>取引後の現金残高</span>
                    <span className={totalCost > cash_balance ? 'text-loss' : 'text-gain'}>{formatUSD(cash_balance - totalCost)}</span>
                  </div>
                )}
              </div>
            )}

            {error && <p className='text-sm text-loss bg-loss/10 rounded p-2'>{error}</p>}
            {success && <p className='text-sm text-gain bg-gain/10 rounded p-2'>{success}</p>}

            <Button className='w-full' variant={tradeType === 'buy' ? 'gain' : 'loss'}
              disabled={tradeType === 'buy' ? !canBuy : !canSell}
              onClick={() => { setError(null); setSuccess(null); setConfirmOpen(true) }}>
              {tradeType === 'buy' ? '購入確認へ' : '売却確認へ'}
            </Button>

            {tradeType === 'buy' && !canBuy && sharesNum > 0 && quote && (
              <p className='text-xs text-loss'>残高が不足しています（残高: {formatUSD(cash_balance)}）</p>
            )}
            {tradeType === 'sell' && !canSell && sharesNum > 0 && (
              <p className='text-xs text-loss'>
                {holding ? `保有株数が不足しています（保有: ${formatShares(holding.shares)} 株）` : 'この銘柄を保有していません'}
              </p>
            )}
            <p className='text-xs text-muted-foreground'>※ 成行注文のため、約定価格は表示と異なる場合があります（約15分遅延）</p>
          </CardContent>
        </Card>
      )}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注文確認</DialogTitle>
            <DialogDescription>以下の内容でよろしいですか？</DialogDescription>
          </DialogHeader>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'><span className='text-muted-foreground'>銘柄</span><span className='font-mono font-semibold'>{selected?.ticker}</span></div>
            <div className='flex justify-between'><span className='text-muted-foreground'>種別</span><Badge variant={tradeType === 'buy' ? 'gain' : 'loss'}>{tradeType === 'buy' ? '買い（成行）' : '売り（成行）'}</Badge></div>
            <div className='flex justify-between'><span className='text-muted-foreground'>株数</span><span>{formatShares(sharesNum)} 株</span></div>
            <div className='flex justify-between'><span className='text-muted-foreground'>参考金額</span><span className='font-semibold'>{formatUSD(totalCost)}</span></div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConfirmOpen(false)}>キャンセル</Button>
            <Button variant={tradeType === 'buy' ? 'gain' : 'loss'} onClick={executeTrade} disabled={executing}>
              {executing ? '処理中...' : '注文を確定する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
