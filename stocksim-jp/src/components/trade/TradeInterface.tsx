'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
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
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(handler)
  }, [value, delay])
  return debouncedValue
}

interface Props {
  cashBalance: number
  preselectedTicker?: string
}

export function TradeInterface({ cashBalance, preselectedTicker }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(preselectedTicker ?? '')
  const [results, setResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedStock, setSelectedStock] = useState<SearchResult | null>(null)
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
    if (!debouncedQuery || debouncedQuery.length < 1 || selectedStock) {
      setResults([])
      return
    }
    setSearching(true)
    fetch(`/api/stocks/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((r) => r.json())
      .then((data) => {
        setResults(Array.isArray(data) ? data.slice(0, 8) : [])
        setSearching(false)
      })
      .catch(() => setSearching(false))
  }, [debouncedQuery, selectedStock])

  const fetchQuote = useCallback((ticker: string) => {
    setQuoteFetching(true)
    fetch(`/api/stocks/${ticker}/quote`)
      .then((r) => r.json())
      .then((q) => {
        setQuote(q.error ? null : q)
        setQuoteFetching(false)
      })
      .catch(() => setQuoteFetching(false))
  }, [])

  useEffect(() => {
    if (preselectedTicker) {
      const s = { ticker: preselectedTicker, name: preselectedTicker, exchange: null, type: null }
      setSelectedStock(s)
      fetchQuote(preselectedTicker)
    }
  }, [preselectedTicker, fetchQuote])

  function selectStock(stock: SearchResult) {
    setSelectedStock(stock)
    setQuery(stock.ticker)
    setResults([])
    fetchQuote(stock.ticker)
  }

  function clearSelection() {
    setSelectedStock(null)
    setQuote(null)
    setQuery('')
    setShares('')
    setError(null)
    setSuccess(null)
  }

  async function executeTrade() {
    if (!selectedStock || !quote || !shares) return
    setExecuting(true)
    setError(null)

    const endpoint = tradeType === 'buy' ? '/api/trade/buy' : '/api/trade/sell'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ticker: selectedStock.ticker,
        companyName: selectedStock.name,
        shares: parseFloat(shares),
      }),
    })
    const data = await res.json()
    setExecuting(false)
    setConfirmOpen(false)

    if (!res.ok || data.error) {
      setError(data.error ?? 'トレードに失敗しました')
    } else {
      const actionStr = tradeType === 'buy' ? '購入' : '売却'
      setSuccess(`${selectedStock.ticker} を ${formatShares(parseFloat(shares))} 株 ${actionStr}しました（${formatUSD(data.totalAmount)}）`)
      setShares('')
      router.refresh()
    }
  }

  const sharesNum = parseFloat(shares) || 0
  const totalCost = sharesNum * (quote?.price ?? 0)
  const canBuy = sharesNum > 0 && totalCost <= cashBalance && !!quote

  return (
    <div className='space-y-4'>
      {/* Search */}
      <Card>
        <CardHeader>
          <CardTitle>銘柄を検索</CardTitle>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              value={query}
              onChange={(e) => { setQuery(e.target.value); if (selectedStock) clearSelection() }}
              placeholder='ティッカーまたは会社名（例：apple、AAPL）'
              className='pl-9 pr-9'
            />
            {(query || selectedStock) && (
              <button onClick={clearSelection} className='absolute right-3 top-1/2 -translate-y-1/2'>
                <X className='h-4 w-4 text-muted-foreground' />
              </button>
            )}
          </div>

          {searching && <p className='text-sm text-muted-foreground'>検索中...</p>}

          {results.length > 0 && !selectedStock && (
            <div className='rounded-md border divide-y'>
              {results.map((r) => (
                <button
                  key={r.ticker}
                  onClick={() => selectStock(r)}
                  className='w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted/50 text-left transition-colors'
                >
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

      {/* Quote + order */}
      {selectedStock && (
        <Card>
          <CardHeader>
            <CardTitle className='flex items-center gap-2'>
              <span className='font-mono'>{selectedStock.ticker}</span>
              <span className='text-base font-normal text-muted-foreground'>{selectedStock.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            {quoteFetching && <p className='text-sm text-muted-foreground'>株価取得中...</p>}

            {quote && (
              <div className='rounded-md bg-muted/30 p-4 space-y-1'>
                <div className='text-3xl font-bold'>{formatUSD(quote.price)}</div>
                <div className={`text-sm font-medium ${quote.change >= 0 ? 'text-gain' : 'text-loss'}`}>
                  {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                </div>
              </div>
            )}

            <div className='flex gap-2'>
              <Button
                variant={tradeType === 'buy' ? 'gain' : 'outline'}
                className='flex-1'
                onClick={() => setTradeType('buy')}
              >
                買い
              </Button>
              <Button
                variant={tradeType === 'sell' ? 'loss' : 'outline'}
                className='flex-1'
                onClick={() => setTradeType('sell')}
              >
                売り
              </Button>
            </div>

            <div className='space-y-1.5'>
              <Label>株数</Label>
              <Input
                type='number'
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                placeholder='例：1 または 0.5'
                min='0.0001'
                step='0.0001'
              />
            </div>

            {sharesNum > 0 && quote && (
              <div className='rounded-md border p-3 text-sm space-y-1'>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>約定価格（概算）</span>
                  <span>{formatUSD(quote.price)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-muted-foreground'>合計金額</span>
                  <span className='font-semibold'>{formatUSD(totalCost)}</span>
                </div>
                {tradeType === 'buy' && (
                  <div className='flex justify-between'>
                    <span className='text-muted-foreground'>現金残高（取引後）</span>
                    <span className={totalCost > cashBalance ? 'text-loss' : 'text-gain'}>
                      {formatUSD(cashBalance - totalCost)}
                    </span>
                  </div>
                )}
              </div>
            )}

            {error && <p className='text-sm text-loss bg-loss/10 rounded p-2'>{error}</p>}
            {success && <p className='text-sm text-gain bg-gain/10 rounded p-2'>{success}</p>}

            <Button
              className='w-full'
              variant={tradeType === 'buy' ? 'gain' : 'loss'}
              disabled={sharesNum <= 0 || !quote || (tradeType === 'buy' && !canBuy)}
              onClick={() => setConfirmOpen(true)}
            >
              {tradeType === 'buy' ? '購入確認へ' : '売却確認へ'}
            </Button>

            {tradeType === 'buy' && !canBuy && sharesNum > 0 && (
              <p className='text-xs text-loss'>残高が不足しています（残高: {formatUSD(cashBalance)}）</p>
            )}

            <p className='text-xs text-muted-foreground'>
              ※ 成行注文のため、約定価格は表示と異なる場合があります（約15分遅延）
            </p>
          </CardContent>
        </Card>
      )}

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>注文確認</DialogTitle>
            <DialogDescription>以下の内容でよろしいですか？</DialogDescription>
          </DialogHeader>
          <div className='space-y-2 text-sm'>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>銘柄</span>
              <span className='font-mono font-semibold'>{selectedStock?.ticker}</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>注文種別</span>
              <Badge variant={tradeType === 'buy' ? 'gain' : 'loss'}>
                {tradeType === 'buy' ? '買い（成行）' : '売り（成行）'}
              </Badge>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>株数</span>
              <span>{formatShares(sharesNum)} 株</span>
            </div>
            <div className='flex justify-between'>
              <span className='text-muted-foreground'>参考金額</span>
              <span className='font-semibold'>{formatUSD(totalCost)}</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConfirmOpen(false)}>キャンセル</Button>
            <Button
              variant={tradeType === 'buy' ? 'gain' : 'loss'}
              onClick={executeTrade}
              disabled={executing}
            >
              {executing ? '処理中...' : '注文を確定する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
