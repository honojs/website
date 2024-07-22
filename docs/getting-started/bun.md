# Bun

[Bun](https://bun.sh) はもう一つの JavaScript ランタイムです。 Node.js でも Deno でもありません。 Bun はトランスコンパイラが内蔵されており、 TypeScript でコードを書くことが出来ます。
Hono はもちろん Bun でも動作します。

## 1. Bun のインストール

`bun` コマンドをインストールするために[公式サイト](https://bun.sh)を確認してください。

## 2. セットアップ

### 2.1. Setup a new project

スターターは Bun でも使用できます。 "bun create" コマンドでプロジェクトを作成してください。
選択肢は `bun` を選んでください。

```sh
bun create hono my-app
```

`my-app` に移動し、依存関係をインストールします。

```sh
cd my-app
bun install
```

### 2.2. Setup an existing project

On an existing Bun project, we only need to install `hono` dependencies on the project root directory via

```sh
bun add hono
```

## 3. Hello World

"Hello World" スクリプトは以下の通りです。 他のプラットフォームと良く似ていますね。

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

## 4. Run

以下のコマンドを実行します。

```sh
bun run dev
```

次に、ブラウザで `http://localhost:3000` へアクセスします。

## ポートを変える

エクスポート時に `port` を指定できます。

<!-- prettier-ignore -->
```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app // [!code --]
export default { // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## 静的ファイルの提供

静的ファイルを提供するために `hono/bun` から `serveStatic` をインポートして使用してください、

```ts
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
```

上のコードはこのようなディレクトリ構成で機能します。

```
./
├── favicon.ico
├── src
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

`http://localhost:3000/static/*` を `./statics` にマップしたい場合、 `rewriteRequestPath` オプションを使用できます:

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

MIME タイプを `mimes` で追加できます:

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
  })
)
```

### `onNotFound`

リクエストされたファイルが見つからない場合の処理を `onNotFound` で記述できます:

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

## テスト

`bun:test` を使用し、 Bun でテストできます。

```ts
import { describe, expect, it } from 'bun:test'
import app from '.'

describe('My first test', () => {
  it('Should return 200 Response', async () => {
    const req = new Request('http://localhost/')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
  })
})
```

次に、このコマンドを実行します。

```sh
bun test index.test.ts
```
