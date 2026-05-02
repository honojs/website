'use client'

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { formatUSD } from '@/lib/format'
import type { HoldingWithValue } from '@/types/trade'

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#f97316', '#ec4899']

interface Props {
  holdings: HoldingWithValue[]
  cashBalance: number
}

export function AllocationPieChart({ holdings, cashBalance }: Props) {
  const data = [
    ...holdings.map((h) => ({ name: h.ticker, value: h.current_value })),
    { name: '現金', value: cashBalance },
  ]

  return (
    <ResponsiveContainer width='100%' height={300}>
      <PieChart>
        <Pie
          data={data}
          cx='50%'
          cy='50%'
          innerRadius={70}
          outerRadius={110}
          paddingAngle={2}
          dataKey='value'
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => formatUSD(value)} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
