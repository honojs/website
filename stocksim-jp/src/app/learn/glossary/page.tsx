import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'

const GLOSSARY = [
  { term: 'EPS', reading: 'イーピーエス', desc: '1株あたりの純利益。Earnings Per Shareの略。高いほど1株あたりの稼ぎが多い。' },
  { term: 'ETF', reading: 'イーティーエフ', desc: 'インデックスに連動する投資信託。1株でS&P 500全体に投資できるVOOなどが有名。' },
  { term: 'インデックス', reading: 'いんでっくす', desc: '複数の銘柄をまとめた指標。S&P 500はアメリカの代表的な500社の平均。' },
  { term: '売り注文', reading: 'うりちゅうもん', desc: '保有している株を売る注文。株価が上がったときに売れば利益が出る。' },
  { term: '含み損', reading: 'ふくみそん', desc: 'まだ売っていない状態の損失。売却すれば確定損となる。' },
  { term: '含み益', reading: 'ふくみえき', desc: 'まだ売っていない状態の利益。売却すれば確定利益となる。' },
  { term: '株価', reading: 'かぶか', desc: '1株あたりの値段。需要と供給によって常に変動する。' },
  { term: '株主', reading: 'かぶぬし', desc: '株を保有している人。会社の一部オーナーとも言える。' },
  { term: '買い注文', reading: 'かいちゅうもん', desc: '株を購入する注文。' },
  { term: '時価総額', reading: 'じかそうがく', desc: '株価×発行済み株数。会社全体の「値段」を表す。Appleは3兆ドル超。' },
  { term: '指値注文', reading: 'さしねちゅうもん', desc: '「この値段で買いたい（売りたい）」と価格を指定する注文。※本アプリは成行のみ対応。' },
  { term: '出来高', reading: 'できだか', desc: '1日に取引された株数。多いほど市場の注目度が高い。' },
  { term: '成行注文', reading: 'なりゆきちゅうもん', desc: '現在の市場価格で即座に売買する注文。本アプリはすべて成行注文。' },
  { term: '損益', reading: 'そんえき', desc: '買った値段と現在値（または売値）の差額。プラスなら利益、マイナスなら損失。' },
  { term: 'ティッカーシンボル', reading: 'てぃっかーしんぼる', desc: '銘柄の略称。AppleはAAPL、TeslaはTSLA。アルファベット1〜5文字程度。' },
  { term: '配当', reading: 'はいとう', desc: '会社が株主に利益の一部を分配するお金。年4回（四半期）支払う会社が多い。' },
  { term: '配当利回り', reading: 'はいとうりまわり', desc: '年間配当÷株価。3%なら株価の3%分を毎年受け取れる計算。' },
  { term: 'PER', reading: 'ピーイーアール', desc: '株価÷EPS（1株利益）。何年分の利益で株を買えるか。低いほど割安とも言われるが、成長株は高くなりやすい。' },
  { term: 'ポートフォリオ', reading: 'ぽーとふぉりお', desc: '自分が保有している銘柄の組み合わせ全体。' },
  { term: '52週高値/安値', reading: 'ごじゅうにしゅうたかね/やすね', desc: '過去1年間の最高値・最安値。現在値との比較で割安・割高の目安になる。' },
  { term: '分散投資', reading: 'ぶんさんとうし', desc: '複数の銘柄やセクターに投資してリスクを分散させること。「卵を一つのかごに盛るな」。' },
  { term: 'ボラティリティ', reading: 'ぼらてぃりてぃ', desc: '価格の変動の激しさ。高いほど価格変動が大きく、ハイリスク・ハイリターンな傾向。' },
]

export default function GlossaryPage() {
  return (
    <div className='max-w-3xl space-y-6'>
      <div>
        <Link href='/learn' className='inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3'>
          <ArrowLeft className='h-4 w-4' />
          基礎知識トップへ
        </Link>
        <h1 className='text-2xl font-bold'>用語集</h1>
        <p className='text-muted-foreground'>株式投資でよく使う用語の解説（五十音順）</p>
      </div>

      <div className='grid gap-3'>
        {GLOSSARY.sort((a, b) => a.reading.localeCompare(b.reading, 'ja')).map(({ term, reading, desc }) => (
          <Card key={term}>
            <CardContent className='py-4'>
              <div className='flex items-baseline gap-2 mb-1'>
                <span className='font-bold text-base'>{term}</span>
                <span className='text-xs text-muted-foreground'>（{reading}）</span>
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>{desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
