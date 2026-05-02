import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function StockNotFound() {
  return (
    <div className='flex flex-col items-center justify-center py-24 gap-4 text-center'>
      <h2 className='text-2xl font-bold'>銘柄が見つかりませんでした</h2>
      <p className='text-muted-foreground'>
        ティッカーシンボルが正しくないか、データを取得できませんでした。
      </p>
      <Link href='/trade'>
        <Button>銘柄を検索する</Button>
      </Link>
    </div>
  )
}
