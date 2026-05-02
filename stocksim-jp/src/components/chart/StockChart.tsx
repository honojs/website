'use client'

import { useState, useEffect } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, TooltipProps,
} from 'recharts'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { formatChartDate, formatUSD } from '@/lib/format'
import type { ChartDataPoint } from '@/types/stock'

type Period = '1d' | '5d' | '1mo' | '3mo' | '1y' | '5y'

const PERIODS: { value: Period; label: string }[] = [
  { value: '1d', label: '1日' },
  { value: '5d', label: '5日' },
  { value: '1mo', label: '1ヶ月' },
  { value: '3mo', label: '3ヶ月' },
  { value: '1y', label: '1年' },
  { value: '5y', label: '5年' },
]

function CustomTooltip({ active, payload, label }: TooltipProps<number, string>) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className='rounded border bg-background p-2 shadow text-xs'>
      <p className='text-muted-foreground'>{label}</p>
      <p className='font-semibold'>{formatUSD(payload[0].value ?? 0)}</p>
    </div>
  )
}

interface Props {
  ticker: string
  initialPeriod?: Period
}

export function StockChart({ ticker, initialPeriod = '1mo' }: Props) {
  const [period, setPeriod] = useState<Period>(initialPeriod)
  const [data, setData] = useState<ChartDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [isPositive, setIsPositive] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/stocks/${ticker}/chart?period=${period}`)
      .then((r) => r.json())
      .then((raw: ChartDataPoint[]) => {
        setData(raw)
        if (raw.length >= 2) {
          setIsPositive(raw[raw.length - 1].close >= raw[0].close)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [ticker, period])

  const color = isPositive ? '#22c55e' : '#ef4444'

  return (
    <div className='w-full space-y-3'>
      <Tabs value={period} onValueChange={(v) => setPeriod(v as Period)}>
        <TabsList>
          {PERIODS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {loading ? (
        <Skeleton className='h-64 w-full' />
      ) : data.length === 0 ? (
        <div className='flex h-64 items-center justify-center text-muted-foreground text-sm'>
          チャートデータを取得できませんでした
        </div>
      ) : (
        <ResponsiveContainer width='100%' height={280}>
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${ticker}`} x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor={color} stopOpacity={0.3} />
                <stop offset='95%' stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray='3 3' stroke='#27272a' />
            <XAxis
              dataKey='date'
              tickFormatter={(v) => formatChartDate(v, period)}
              tick={{ fontSize: 11, fill: '#71717a' }}
              tickLine={false}
              axisLine={false}
              interval='preserveStartEnd'
            />
            <YAxis
              domain={['auto', 'auto']}
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: '#71717a' }}
              tickLine={false}
              axisLine={false}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type='monotone'
              dataKey='close'
              stroke={color}
              strokeWidth={2}
              fill={`url(#grad-${ticker})`}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
