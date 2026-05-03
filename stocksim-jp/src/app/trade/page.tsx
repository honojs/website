import { TradeInterface } from '@/components/trade/TradeInterface'
import { PageWrapper } from '@/components/ui/motion'

export default function TradePage() {
  return (
    <PageWrapper>
      <div className='max-w-2xl mx-auto space-y-4'>
        <div>
          <h1 className='text-2xl font-bold'>株の売買</h1>
          <p className='text-muted-foreground text-sm'>銘柄を検索して売買注文を出しましょう</p>
        </div>
        <TradeInterface />
      </div>
    </PageWrapper>
  )
}
