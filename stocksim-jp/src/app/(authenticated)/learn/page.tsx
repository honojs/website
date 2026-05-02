import Link from 'next/link'
import { BookOpen, List, HelpCircle, BarChart2, TrendingUp, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

const sections = [
  {
    href: '/learn/glossary',
    icon: List,
    title: '用語集',
    description: '株式投資でよく使う用語を五十音順で解説',
  },
  {
    href: '/learn/howto',
    icon: HelpCircle,
    title: 'このアプリの使い方',
    description: 'StockSim JPの基本的な使い方ガイド',
  },
]

export default function LearnPage() {
  return (
    <div className='space-y-8 max-w-3xl'>
      <div>
        <h1 className='text-2xl font-bold'>基礎知識コーナー</h1>
        <p className='text-muted-foreground'>米国株の基礎から学べるコンテンツです</p>
      </div>

      {/* Navigation */}
      <div className='grid gap-4 sm:grid-cols-2'>
        {sections.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <Card className='h-full hover:bg-muted/30 transition-colors cursor-pointer'>
              <CardHeader>
                <Icon className='h-8 w-8 text-primary mb-2' />
                <CardTitle className='text-base'>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>

      {/* US Stocks intro */}
      <section className='space-y-4'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <TrendingUp className='h-5 w-5 text-primary' />
          米国株とは？
        </h2>
        <div className='space-y-3 text-sm leading-relaxed text-muted-foreground'>
          <p>
            <strong className='text-foreground'>株式</strong>とは、会社の所有権の一部です。
            Apple（AAPL）の株を買うということは、Apple社の一部オーナーになることを意味します。
            会社が成長して株価が上がれば、あなたの持ち分の価値も上がります。
          </p>
          <p>
            <strong className='text-foreground'>なぜ米国株？</strong>
            ニューヨーク証券取引所（NYSE）とNASDAQを合わせると、世界最大の株式市場です。
            Apple・Google・AmazonなどGAFAMをはじめ、世界中の誰もが知っている企業が上場しています。
            また、米国株は<strong className='text-foreground'>1株から購入可能</strong>（日本株は100株単位が多い）なので、少額から始めやすいのも特徴です。
          </p>
          <p>
            <strong className='text-foreground'>日本株との違い</strong>：米国株はすべてUS＄で取引されます。
            取引時間はニューヨーク時間の9:30〜16:00（EST）で、日本時間に換算すると
            冬時間は23:30〜翌6:00、夏時間（EDT）は22:30〜翌5:00です。
          </p>
        </div>
      </section>

      {/* Major indices */}
      <section className='space-y-4'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <BarChart2 className='h-5 w-5 text-primary' />
          主要インデックス
        </h2>
        <div className='grid gap-3'>
          {[
            { name: 'S&P 500', desc: '米国を代表する500社の株価指数。米国経済全体のバロメーター。長期投資家に最も注目される指数です。' },
            { name: 'NASDAQ総合指数', desc: 'テック系企業が多い指数。Apple・Microsoft・NVIDIAなどが構成銘柄。成長株が多くボラティリティが高い傾向。' },
            { name: 'ダウ平均（DOW）', desc: '米国を代表する30社の平均株価。最も歴史ある株価指数（1896年〜）。ニュースでよく取り上げられる。' },
            { name: 'VIX（恐怖指数）', desc: '市場の不安度を示す指数。通常は15〜20前後。20を超えると警戒水準、30以上はパニック水準とされる。' },
          ].map(({ name, desc }) => (
            <Card key={name}>
              <CardContent className='pt-4 pb-4'>
                <p className='font-semibold text-sm'>{name}</p>
                <p className='text-sm text-muted-foreground mt-1'>{desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Beginner stocks */}
      <section className='space-y-4'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <BookOpen className='h-5 w-5 text-primary' />
          初心者向け銘柄紹介
        </h2>
        <p className='text-sm text-muted-foreground'>誰もが知っている有名企業から始めてみましょう</p>
        <div className='overflow-x-auto'>
          <table className='w-full text-sm border-collapse'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2 pr-4 font-medium text-muted-foreground'>ティッカー</th>
                <th className='text-left py-2 pr-4 font-medium text-muted-foreground'>会社名</th>
                <th className='text-left py-2 font-medium text-muted-foreground'>一言説明</th>
              </tr>
            </thead>
            <tbody className='divide-y'>
              {[
                ['AAPL', 'Apple', 'iPhone・Macの会社。世界最大の時価総額'],
                ['MSFT', 'Microsoft', 'WindowsとOfficeとAzure（クラウド）の会社'],
                ['GOOGL', 'Alphabet（Google）', 'Google検索・YouTube・Androidの会社'],
                ['AMZN', 'Amazon', 'EC＋クラウド（AWS）の会社'],
                ['NVDA', 'NVIDIA', 'AI・ゲーム用GPUの会社。近年爆発的成長'],
                ['TSLA', 'Tesla', '電気自動車のパイオニア。イーロン・マスクがCEO'],
                ['META', 'Meta（Facebook）', 'Facebook・Instagram・WhatsAppの会社'],
                ['JPM', 'JPMorgan Chase', '米国最大の銀行'],
                ['KO', 'Coca-Cola', 'コカ・コーラ。バフェットが長期保有する代表銘柄'],
              ].map(([ticker, name, desc]) => (
                <tr key={ticker}>
                  <td className='py-2 pr-4'>
                    <Link href={`/stocks/${ticker}`} className='font-mono font-bold text-primary hover:underline'>
                      {ticker}
                    </Link>
                  </td>
                  <td className='py-2 pr-4'>{name}</td>
                  <td className='py-2 text-muted-foreground'>{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Chart reading */}
      <section className='space-y-4'>
        <h2 className='text-xl font-bold'>チャートの読み方</h2>
        <div className='space-y-3 text-sm text-muted-foreground leading-relaxed'>
          <p>
            このアプリのチャートは<strong className='text-foreground'>エリアチャート</strong>（面グラフ）で、
            終値（その日の最終取引価格）の推移を表示しています。
          </p>
          <div className='grid sm:grid-cols-2 gap-3'>
            <div className='rounded-lg border border-gain/30 bg-gain/5 p-3'>
              <p className='font-semibold text-gain'>緑色 = 上昇</p>
              <p className='mt-1'>期間の最初より価格が上がっているとき、チャートは緑色で表示されます。</p>
            </div>
            <div className='rounded-lg border border-loss/30 bg-loss/5 p-3'>
              <p className='font-semibold text-loss'>赤色 = 下落</p>
              <p className='mt-1'>期間の最初より価格が下がっているとき、チャートは赤色で表示されます。</p>
            </div>
          </div>
          <p>
            期間を切り替えると（1日・5日・1ヶ月・3ヶ月・1年・5年）、異なる時間軸での価格推移を確認できます。
            長期チャートを見ることで、会社の成長トレンドを把握できます。
          </p>
        </div>
      </section>

      {/* Risk warning */}
      <section className='rounded-lg border border-yellow-500/30 bg-yellow-500/5 p-6 space-y-3'>
        <h2 className='text-xl font-bold flex items-center gap-2'>
          <AlertTriangle className='h-5 w-5 text-yellow-500' />
          リスクについて
        </h2>
        <ul className='space-y-2 text-sm text-muted-foreground list-disc list-inside leading-relaxed'>
          <li>株価は必ず上がるとは限りません。元本割れのリスクがあります。</li>
          <li>
            <strong className='text-foreground'>分散投資</strong>が大切です。
            1銘柄に全額投資するのは非常にリスクが高く、複数の銘柄・セクターに分散することでリスクを軽減できます。
          </li>
          <li>
            <strong className='text-foreground'>長期投資</strong>は短期トレードよりも安定しやすいとされています。
            「buy and hold」（買って持ち続ける）戦略は歴史的に良い成績を残してきました。
          </li>
          <li>
            短期的な価格変動に一喜一憂するのではなく、企業の長期的な成長性を見ることが重要です。
          </li>
        </ul>
        <p className='text-xs font-semibold text-yellow-600 dark:text-yellow-400 border-t border-yellow-500/20 pt-3 mt-3'>
          ⚠ このアプリはシミュレーションです。実際の投資は自己責任で行ってください。
          投資に関する最終的な判断はご自身でお願いします。
        </p>
      </section>
    </div>
  )
}
