export interface MarketStatus {
  isOpen: boolean
  label: string
  sublabel: string
}

export function getNYSEStatus(): MarketStatus {
  const now = new Date()
  const etStr = now.toLocaleString('en-US', { timeZone: 'America/New_York' })
  const et = new Date(etStr)
  const dayOfWeek = et.getDay()
  const hours = et.getHours()
  const minutes = et.getMinutes()
  const timeNum = hours * 100 + minutes

  const isWeekday = dayOfWeek >= 1 && dayOfWeek <= 5
  const isMarketHours = timeNum >= 930 && timeNum < 1600

  const isOpen = isWeekday && isMarketHours

  return {
    isOpen,
    label: isOpen ? '市場オープン' : '市場クローズ',
    sublabel: isOpen ? 'NYSE取引時間中' : 'NYSE取引時間外（シミュレーションは24時間取引可能）',
  }
}
