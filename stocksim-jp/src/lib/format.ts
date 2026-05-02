export function formatUSD(amount: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount)
}

export function formatNumber(n: number, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n)
}

export function formatShares(shares: number): string {
  if (Number.isInteger(shares) || shares === Math.floor(shares)) {
    return shares.toFixed(0)
  }
  return shares.toFixed(4).replace(/\.?0+$/, '')
}

export function formatMarketCap(cap: number | null): string {
  if (cap === null) return 'N/A'
  if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
  if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
  if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`
  return `$${cap.toFixed(0)}`
}

export function formatVolume(vol: number | null): string {
  if (vol === null) return 'N/A'
  if (vol >= 1e9) return `${(vol / 1e9).toFixed(2)}B`
  if (vol >= 1e6) return `${(vol / 1e6).toFixed(2)}M`
  if (vol >= 1e3) return `${(vol / 1e3).toFixed(2)}K`
  return vol.toFixed(0)
}

export function formatPercent(pct: number | null): string {
  if (pct === null) return 'N/A'
  const sign = pct >= 0 ? '+' : ''
  return `${sign}${pct.toFixed(2)}%`
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatChartDate(dateStr: string, period: string): string {
  const d = new Date(dateStr)
  if (period === '1d' || period === '5d') {
    return d.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
  }
  if (period === '1mo' || period === '3mo') {
    return d.toLocaleDateString('ja-JP', { month: '2-digit', day: '2-digit' })
  }
  return d.toLocaleDateString('ja-JP', { year: '2-digit', month: '2-digit' })
}
