# ルーター

ルーターは Hono にとって最も重要な要素です。

Hono は5つのルーターを持ちます。

## RegExpRouter

**RegExpRouter** は JavaScript で最速のルーターです。

これは "RegExp" と呼ばれますが、 Express のような [path-to-regexp](https://github.com/pillarjs/path-to-regexp) を使用する実装ではありません。
それらは線形ループを使用します。
そのため、全てのルートに対して正規表現が照合が実行されルートが増えるほどパフォーマンスが悪化します。

![Router Linear](/images/router-linear.jpg)

Hono の RegExpRouter はルートパターンを "ひとつの巨大な正規表現" に変換します。
そのため一回の照合で結果を取得できます。

![Router RegExp](/images/router-regexp.jpg)

これはほとんどの場合、 radix-tree などのツリーベースのアルゴリズムより高速に動作します。

## TrieRouter

**TrieRouter** は Trie 木を使用するルーターです。
RegExpRouter と同様に線形ループを使用しません。

![Router Tree](/images/router-tree.jpg)

これは RegExpRouter ほど速くはありませんが、 Express よりは圧倒的に高速です。
TrieRouter は全てのルートパターンをサポートしますが RegExpRouter はしません。

## SmartRouter

RegExpRouter は全てのルートパターンをサポートするわけではありません。
そのため、全てのパターンをサポートする他のルーターと組み合わせて使うことが一般的です。

**SmartRouter** は登録済みのルーターから最適なルーターを推測して選択します。
Hono は SmartRouter と2つのルーターをデフォルトで使用します:

```ts
// Inside the core of Hono.
readonly defaultRouter: Router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

アプリケーションが起動したときに、 SmartRouter はルーティングに基づき最速のルーターを選択し、使用します。

## LinearRouter

RegExpRouter は高速ですが、ルートの登録が少し遅くなることがあります。
そのため、リクエスト毎に初期化が行われる環境には適していません。

**LinearRouter** は "ワンショット" の状況に最適化されています。
ルートの登録はコンパイルせずに線形アプローチを使用して行うため RegExpRouter より大幅に高速です。

以下はルート登録も含めたベンチマークの結果です。

```
• GET /user/lookup/username/hey
----------------------------------------------------- -----------------------------
LinearRouter     1.82 µs/iter      (1.7 µs … 2.04 µs)   1.84 µs   2.04 µs   2.04 µs
MedleyRouter     4.44 µs/iter     (4.34 µs … 4.54 µs)   4.48 µs   4.54 µs   4.54 µs
FindMyWay       60.36 µs/iter      (45.5 µs … 1.9 ms)  59.88 µs  78.13 µs  82.92 µs
KoaTreeRouter    3.81 µs/iter     (3.73 µs … 3.87 µs)   3.84 µs   3.87 µs   3.87 µs
TrekRouter       5.84 µs/iter     (5.75 µs … 6.04 µs)   5.86 µs   6.04 µs   6.04 µs

summary for GET /user/lookup/username/hey
  LinearRouter
   2.1x faster than KoaTreeRouter
   2.45x faster than MedleyRouter
   3.21x faster than TrekRouter
   33.24x faster than FindMyWay
```

Fastly Compute のような場合は LinearRouter を使う `hono/quick` プリセットが適しています。

## PatternRouter

**PatternRouter** は Hono で最も小さいルーターです。

Hono は既に十分コンパクトですが、リソースが限られている環境で更に小さくする必要があるなら PatternRouter を使用してください。

PatternRouter のみを使用したアプリケーションは 15KB 以下になります。

```
$ npx wrangler deploy --minify ./src/index.ts
 ⛅️ wrangler 3.20.0
-------------------
Total Upload: 14.68 KiB / gzip: 5.38 KiB
```
