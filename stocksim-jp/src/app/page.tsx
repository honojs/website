import Link from 'next/link'
import { TrendingUp, BookOpen, BarChart2, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b px-6 py-4'>
        <div className='mx-auto flex max-w-5xl items-center justify-between'>
          <div className='flex items-center gap-2 font-bold text-primary text-lg'>
            <TrendingUp className='h-6 w-6' />
            StockSim JP
          </div>
          <Link href='/auth'>
            <Button>ログイン / 新規登録</Button>
          </Link>
        </div>
      </header>

      <main className='mx-auto max-w-5xl px-6 py-16'>
        <div className='text-center space-y-6 mb-16'>
          <div className='inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary font-medium'>
            完全無料・登録5分
          </div>
          <h1 className='text-4xl font-bold tracking-tight sm:text-5xl'>
            米国株を<span className='text-primary'>仮想$10,000</span>で<br />リスクなく練習
          </h1>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            AppleやNVIDIAなど有名企業の本物の株価データを使って、実際のお金を使う前に投資を学べる日本語シミュレーターです。
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link href='/auth'>
              <Button size='lg' className='w-full sm:w-auto'>無料で始める</Button>
            </Link>
            <Link href='/learn'>
              <Button size='lg' variant='outline' className='w-full sm:w-auto'>
                <BookOpen className='mr-2 h-4 w-4' />
                まず勉強する
              </Button>
            </Link>
          </div>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16'>
          {[
            { icon: TrendingUp, title: 'リアル株価', desc: '実際の市場データ（約15分遅延）を使用' },
            { icon: Shield, title: '仮想資金', desc: '$10,000のバーチャルマネーでリスクゼロ' },
            { icon: BarChart2, title: 'チャート分析', desc: '期間別チャートで価格推移を確認' },
            { icon: BookOpen, title: '初心者向け', desc: '株の基礎知識から学べるコーナー付き' },
          ].map(({ icon: Icon, title, desc }) => (
            <Card key={title}>
              <CardContent className='pt-6'>
                <Icon className='h-8 w-8 text-primary mb-3' />
                <h3 className='font-semibold mb-1'>{title}</h3>
                <p className='text-sm text-muted-foreground'>{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='rounded-lg bg-muted/30 border p-8 text-center'>
          <h2 className='text-2xl font-bold mb-4'>人気銘柄で今すぐ練習</h2>
          <div className='flex flex-wrap justify-center gap-3 mb-6'>
            {['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL', 'AMZN', 'META', 'JPM'].map((t) => (
              <span key={t} className='rounded border px-3 py-1 text-sm font-mono font-semibold'>
                {t}
              </span>
            ))}
          </div>
          <Link href='/auth'>
            <Button size='lg'>今すぐ始める（無料）</Button>
          </Link>
        </div>
      </main>

      <footer className='border-t px-6 py-8 mt-16 text-center text-sm text-muted-foreground'>
        <p>※ このアプリはシミュレーションです。実際の投資は自己責任で行ってください。</p>
        <p className='mt-1'>株価データは約15分遅延しています。</p>
      </footer>
    </div>
  )
}
