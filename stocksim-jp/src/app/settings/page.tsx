'use client'

import { useState } from 'react'
import { usePortfolio } from '@/context/PortfolioContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { PageWrapper, StaggerList, StaggerItem } from '@/components/ui/motion'
import { formatUSD } from '@/lib/format'

export default function SettingsPage() {
  const { cash_balance, holdings, transactions, reset, loaded } = usePortfolio()
  const [confirmOpen, setConfirmOpen] = useState(false)

  function handleReset() {
    reset()
    setConfirmOpen(false)
  }

  return (
    <PageWrapper>
    <div className='space-y-6 max-w-lg'>
      <div>
        <h1 className='text-2xl font-bold'>設定</h1>
        <p className='text-muted-foreground text-sm'>ポートフォリオの管理</p>
      </div>

      <StaggerList>
      <StaggerItem>
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>現在の状況</CardTitle>
        </CardHeader>
        <CardContent className='space-y-2 text-sm'>
          <div className='flex justify-between'><span className='text-muted-foreground'>現金残高</span><span className='font-semibold'>{formatUSD(cash_balance)}</span></div>
          <div className='flex justify-between'><span className='text-muted-foreground'>保有銘柄数</span><span className='font-semibold'>{holdings.length} 銘柄</span></div>
          <div className='flex justify-between'><span className='text-muted-foreground'>取引回数</span><span className='font-semibold'>{transactions.length} 件</span></div>
          <p className='text-xs text-muted-foreground pt-2'>データはこのブラウザのlocalStorageに保存されています。</p>
        </CardContent>
      </Card>
      </StaggerItem>

      <StaggerItem>
      <Card className='border-loss/30'>
        <CardHeader>
          <CardTitle className='text-base text-loss'>ポートフォリオのリセット</CardTitle>
          <CardDescription>保有銘柄・取引履歴をすべて削除し、現金を $10,000 に戻します。この操作は取り消せません。</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='destructive' onClick={() => setConfirmOpen(true)}>リセットする</Button>
        </CardContent>
      </Card>
      </StaggerItem>
      </StaggerList>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>本当にリセットしますか？</DialogTitle>
            <DialogDescription>保有銘柄と取引履歴がすべて削除され、現金が $10,000 に戻ります。この操作は取り消せません。</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setConfirmOpen(false)}>キャンセル</Button>
            <Button variant='destructive' onClick={handleReset}>リセットを実行する</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
    </PageWrapper>
  )
}
