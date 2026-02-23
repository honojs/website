# Bun

[Bun](https://bun.com) はもう一つの JavaScript ランタイムです。 Node.js でも Deno でもありません。 Bun はトランスコンパイラが内蔵されており、 TypeScript でコードを書くことが出来ます。
Hono はもちろん Bun でも動作します。

## 1. Bun のインストール

`bun` コマンドをインストールするために[公式サイト](https://bun.com)を確認してください。

## 2. セットアップ

### 2.1. 新しいプロジェクトをセットアップする

スターターは Bun でも使用できます。 "bun create" コマンドでプロジェクトを作成してください。
選択肢は `bun` を選んでください。

```sh
bun create hono@latest my-app
```

`my-app` に移動し、依存関係をインストールします。

```sh
cd my-app
bun install
```

### 2.2. すでにあるプロジェクトにセットアップする

すでにある Bun プロジェクトでは、プロジェクトルートのディレクトリで `hono` を依存関係としてインストールするだけです。

```sh
bun add hono
```

Then add the `dev` command to your existing `package.json`.

```json
{
  "scripts": {
    "dev": "bun run --hot src/index.ts"
  }
}
```

See the [Bun starter template](https://github.com/honojs/starter/tree/main/templates/bun) for a minimal example setup. This is the output of running `bun create hono@latest`.

## 3. Hello World

"Hello World" スクリプトは以下の通りです。 他のプラットフォームと良く似ていますね。

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

If you are setting up Hono on an existing project, the `bun run dev` command expects the "Hello World" script to be placed in `src/index.tx`

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

### `onFound`

リクエストされたファイルが見つかった場合の処理を `onFound` で実装できます:

```ts
app.get(
  '/static/*',
  serveStatic({
    // ...
    onFound: (_path, c) => {
      c.header('Cache-Control', `public, immutable, max-age=31536000`)
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

### `precompressed`

`precompressed` オプションでは `.br` や `.gz` のような拡張子を持ってるファイルがあるか確認して、 `Accept-Encoding` ヘッダに基づいてそれらを返します。 Brotli 、 Zstd 、 Gzip の順で優先されます。 それらがなければ元のファイルを返します。

```ts
app.get(
  '/static/*',
  serveStatic({
    precompressed: true,
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
