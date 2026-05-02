'use client'

import { useEffect, useState } from 'react'
import { getNYSEStatus } from '@/lib/market-hours'
import { Badge } from '@/components/ui/badge'

export function MarketStatusBadge() {
  const [status, setStatus] = useState(getNYSEStatus())

  useEffect(() => {
    const interval = setInterval(() => setStatus(getNYSEStatus()), 60_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Badge variant={status.isOpen ? 'gain' : 'secondary'} title={status.sublabel}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full ${status.isOpen ? 'bg-gain' : 'bg-muted-foreground'} inline-block`} />
      {status.label}
    </Badge>
  )
}
