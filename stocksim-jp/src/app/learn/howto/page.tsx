import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const STEPS = [
  {
    num: 1,
    title: '登録・ログイン',
    desc: 'メールアドレスとパスワードで登録すると、自動的に仮想資金 $10,000 が付与されます。表示名（ニックネーム）も設定しましょう。',
  },
  {
    num: 2,
    title: 'ダッシュボードを確認する',
    desc: 'ログイン後はダッシュボードが表示されます。総資産・現金残高・主要インデックスの動向を確認できます。',
  },
  {
    num: 3,
    title: '気になる銘柄を調べる',
    desc: '「株の売買」ページまたは「市場概況」から気になる銘柄を検索・確認しましょう。個別銘柄ページでは株価チャートや企業情報を確認できます。',
  },
  {
    num: 4,
    title: '買い注文を出す',
    desc: '銘柄詳細ページまたは「株の売買」ページで株数を入力して「購入確認へ」ボタンを押します。確認モーダルで内容を確認してから「注文を確定する」を押すと約定します。注文は現在値での成行注文です。',
  },
  {
    num: 5,
    title: 'ポートフォリオを管理する',
    desc: '「ポートフォリオ」ページで保有銘柄の評価損益・資産配分の円グラフを確認できます。「取引履歴」ページでは過去の取引を一覧で見られます。',
  },
  {
    num: 6,
    title: '売り注文を出す',
    desc: '保有している銘柄の売り注文は「株の売買」または銘柄詳細ページから行えます。「売り」ボタンを選択し、売却する株数を入力してください。保有株数を超えて売ることはできません。',
  },
  {
    num: 7,
    title: 'ウォッチリストを活用する',
    desc: 'まだ買わないけど気になる銘柄は「ウォッチリスト」に追加しておきましょう。株価の変動を一覧でチェックできます。',
  },
]

export default function HowtoPage() {
  return (
    <div className='max-w-3xl space-y-6'>
      <div>
        <Link href='/learn' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3'>
          <ArrowLeft className='h-4 w-4' />
          基礎知識トップへ
        </Link>
        <h1 className='text-2xl font-bold'>このアプリの使い方</h1>
        <p className='text-muted-foreground'>StockSim JPの基本的な使い方ガイド</p>
      </div>

      <div className='space-y-4'>
        {STEPS.map(({ num, title, desc }) => (
          <Card key={num}>
            <CardHeader className='pb-2'>
              <CardTitle className='flex items-center gap-3 text-base'>
                <span className='flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold flex-shrink-0'>
                  {num}
                </span>
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className='border-muted bg-muted/20'>
        <CardContent className='pt-6'>
          <h3 className='font-semibold mb-2'>注意事項</h3>
          <ul className='space-y-1.5 text-sm text-muted-foreground list-disc list-inside'>
            <li>株価は約15分遅延したデータを使用しています</li>
            <li>注文はすべて成行注文（現在値での即時約定）です</li>
            <li>端株（小数点以下の株数）での取引が可能です（例：0.5株）</li>
            <li>市場時間外でもシミュレーション取引は可能です</li>
            <li>「設定」ページからポートフォリオを$10,000にリセットできます</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
