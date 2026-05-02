'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

interface Props {
  userId: string
  displayName: string
}

export function SettingsClient({ userId, displayName }: Props) {
  const router = useRouter()
  const [name, setName] = useState(displayName)
  const [savingName, setSavingName] = useState(false)
  const [nameMsg, setNameMsg] = useState<string | null>(null)
  const [resetOpen, setResetOpen] = useState(false)
  const [resetting, setResetting] = useState(false)

  async function saveName() {
    if (!name.trim()) return
    setSavingName(true)
    const supabase = getSupabaseBrowserClient()
    const { error } = await supabase.from('profiles').update({ display_name: name }).eq('id', userId)
    setSavingName(false)
    setNameMsg(error ? 'エラーが発生しました' : '保存しました')
    setTimeout(() => setNameMsg(null), 3000)
  }

  async function resetPortfolio() {
    setResetting(true)
    const supabase = getSupabaseBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setResetting(false); return }

    const { error } = await supabase.rpc('reset_portfolio', { p_user_id: user.id })
    setResetting(false)
    setResetOpen(false)

    if (!error) {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className='space-y-6 max-w-lg'>
      {/* Display name */}
      <Card>
        <CardHeader>
          <CardTitle className='text-base'>表示名</CardTitle>
          <CardDescription>ダッシュボードに表示される名前</CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='space-y-1.5'>
            <Label htmlFor='name'>表示名</Label>
            <Input id='name' value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button onClick={saveName} disabled={savingName}>
            {savingName ? '保存中...' : '保存する'}
          </Button>
          {nameMsg && <p className='text-sm text-gain'>{nameMsg}</p>}
        </CardContent>
      </Card>

      {/* Reset */}
      <Card className='border-loss/30'>
        <CardHeader>
          <CardTitle className='text-base text-loss'>ポートフォリオのリセット</CardTitle>
          <CardDescription>
            保有銘柄・取引履歴をすべて削除し、現金を $10,000 に戻します。この操作は取り消せません。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant='destructive' onClick={() => setResetOpen(true)}>
            リセットする
          </Button>
        </CardContent>
      </Card>

      <Dialog open={resetOpen} onOpenChange={setResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>本当にリセットしますか？</DialogTitle>
            <DialogDescription>
              保有銘柄と取引履歴がすべて削除され、現金が $10,000 に戻ります。この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setResetOpen(false)}>キャンセル</Button>
            <Button variant='destructive' onClick={resetPortfolio} disabled={resetting}>
              {resetting ? 'リセット中...' : 'リセットを実行する'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
