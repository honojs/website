import { cn } from '@/lib/utils'
import { formatPercent } from '@/lib/format'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface Props {
  change: number
  changePercent: number
  showIcon?: boolean
  className?: string
}

export function PriceChange({ change, changePercent, showIcon = false, className }: Props) {
  const isGain = change >= 0
  return (
    <span className={cn('flex items-center gap-1 font-medium', isGain ? 'text-gain' : 'text-loss', className)}>
      {showIcon && (isGain ? <TrendingUp className='h-4 w-4' /> : <TrendingDown className='h-4 w-4' />)}
      {isGain ? '+' : ''}{change.toFixed(2)} ({formatPercent(changePercent)})
    </span>
  )
}
