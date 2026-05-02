'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export function AuthForm() {
  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setMessage(null)
    setLoading(true)

    const supabase = getSupabaseBrowserClient()

    if (mode === 'register') {
      if (!displayName.trim()) {
        setError('表示名を入力してください')
        setLoading(false)
        return
      }
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: displayName } },
      })
      if (error) {
        setError(
          error.message === 'User already registered'
            ? 'このメールアドレスはすでに登録されています'
            : error.message
        )
      } else {
        setMessage('確認メールを送信しました。メールを確認してからログインしてください。')
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('メールアドレスまたはパスワードが正しくありません')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    }
    setLoading(false)
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background px-4'>
      <div className='w-full max-w-sm'>
        <div className='flex justify-center mb-6'>
          <div className='flex items-center gap-2 font-bold text-primary text-xl'>
            <TrendingUp className='h-7 w-7' />
            StockSim JP
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{mode === 'login' ? 'ログイン' : '新規登録'}</CardTitle>
            <CardDescription>
              {mode === 'login'
                ? '仮想$10,000で米国株を練習しよう'
                : 'アカウントを作成して今すぐ始めよう'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {mode === 'register' && (
                <div className='space-y-1.5'>
                  <Label htmlFor='displayName'>表示名（ニックネーム）</Label>
                  <Input
                    id='displayName'
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder='例：田中太郎'
                    required
                  />
                </div>
              )}
              <div className='space-y-1.5'>
                <Label htmlFor='email'>メールアドレス</Label>
                <Input
                  id='email'
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='your@email.com'
                  required
                />
              </div>
              <div className='space-y-1.5'>
                <Label htmlFor='password'>パスワード</Label>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='6文字以上'
                  minLength={6}
                  required
                />
              </div>

              {error && (
                <p className='text-sm text-loss bg-loss/10 rounded p-2'>{error}</p>
              )}
              {message && (
                <p className='text-sm text-gain bg-gain/10 rounded p-2'>{message}</p>
              )}

              <Button type='submit' className='w-full' disabled={loading}>
                {loading ? '処理中...' : mode === 'login' ? 'ログイン' : '登録する（無料）'}
              </Button>
            </form>

            <div className='mt-4 text-center text-sm text-muted-foreground'>
              {mode === 'login' ? (
                <>
                  アカウントをお持ちでない方は{' '}
                  <button onClick={() => setMode('register')} className='text-primary underline'>
                    新規登録
                  </button>
                </>
              ) : (
                <>
                  すでにアカウントをお持ちの方は{' '}
                  <button onClick={() => setMode('login')} className='text-primary underline'>
                    ログイン
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
