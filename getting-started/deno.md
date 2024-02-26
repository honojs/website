# Deno

[Deno](https://deno.com/) は V8 上に構築された JavaScript ランタイムです。 Node.js ではありません。
Hono は Deno でも動作します。

Hono を使用して TypeScript でコードを書き、 `deno` コマンドでアプリケーションを起動します。 そして "Deno Deploy" にデプロイ出来ます。

## 1. Deno のインストール

まず `deno` コマンドをインストールします。
[公式ドキュメント](https://docs.deno.com/runtime/manual/getting_started/installation) を参照してください。

## 2. セットアップ

Deno でもスターターを使用できます。
"create-hono" コマンドでプロジェクトを作成してください。

```txt
deno run -A npm:create-hono my-app
```

`my-app` に移動しますが、 Deno では Hono を明示的にインストールする必要はありません。

```
cd my-app
```

## 3. Hello World

最初のアプリケーションを書いていきましょう。

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

## 4. Run

このコマンドだけです:

```
deno run --allow-net hello.ts
```

## ポートをかえる

`port` オプションでポート番号を指定できます。

```ts
Deno.serve({ port: 8787 }, app.fetch)
```

## 静的ファイルの提供

静的ファイルを提供するには `hono/middleware.ts` から `serveStatic` をインポートして使用します。

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))

Deno.serve(app.fetch)
```

上のコードは、このようなディレクトリ構成で機能します。

```
./
├── favicon.ico
├── index.ts
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

`http://localhost:8000/static/*` を `./statics` にマップしたい場合、 `rewriteRequestPath` をオプションに追加してください:

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

MIME 型を追加するためには `mimes` を使用します:

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    }
  })
)
```

### `onNotFound`

`notFoundOption` を使用して、リクエストされたファイルが見つからない場合の処理を記述できます:

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
  })
)
```

## Deno Deploy

Deno Deploy は Deno のためのエッジランタイムプラットフォームです。
Deno Deploy でワールドワイドにアプリケーションを公開できます。

Hono は Deno Deploy もサポートしています。 [公式ドキュメント](https://docs.deno.com/deploy/manual/)を参照してください。

## テスト

Deno でアプリケーションをテストするのは簡単です。
`Deno.test` と、公式ライブラリの `assert` か `assertEquals` を使用して書いてください。

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { assertEquals } from 'https://deno.land/std/assert/mod.ts'

Deno.test('Hello World', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))

  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})
```

次にこのコマンドを実行します:

```
deno test hello.ts
```

## JSX プラグマ

Deno 上の Hono は JSX ミドルウェアをサポートしています。
使用する場合は、 JSX プラグマを記述して JSX 関数を指定します。

```tsx
/** @jsx jsx */
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jsx } from 'https://deno.land/x/hono/middleware.ts'

const app = new Hono()

app.get('/', (c) => {
  return c.html(<h1>Hello Deno!</h1>)
})

Deno.serve(app.fetch)
```

## `npm:` 指定子

`npm:hono` も使用できます。

```ts
import { Hono } from 'npm:hono'
```

`npm:hono` か `deno.land/x/hono` を使用できます。

サードパーティーミドルウェアを使用する場合、 `npm:@hono/zod-validator` のように `npm:` 指定子を使用する必要があります。 また、 `npm:` と `deno.land/x/hono` の併用は避けるべきです。

~~しかし、 `mpn:hono` を Deno Deploy では使用できません。 Deno Deploy で使用したい場合は `deno.land/x/hono` を使用してください。~~

2023年9月6日現在、 Deno は [Deno Deploy でのネイティブ npm サポート](https://deno.com/blog/npm-on-deno-deploy)を発表しました。 但し、 `hono` と `@hono` はまだテストされていません。

問題が発生した場合、テストを走らせたい場合は issue か プルリクエストを立ててください。
