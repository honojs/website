# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) は Cloudflare の CDN で JavaScript を実行するエッジランタイムです。

アプリケーションをローカルで開発し、 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) のいくつかのコマンドを使用して公開します。
Wrangler はコンパイラを内蔵しているため、 TypeScript でコードを書けます。

Hono を使った Cloudflare Workers 最初のアプリケーションを作りましょう。

## 1. セットアップ

Cloudflare Workers 向けのスターターが使用できます。
"create-hono" コマンドでプロジェクトを作成してください。

::: code-group

```txt [npm]
npm create hono@latest my-app
```

```txt [yarn]
yarn create hono my-app
```

```txt [pnpm]
pnpm create hono my-app
```

```txt [bun]
bunx create-hono my-app
```

```txt [deno]
deno run -A npm:create-hono my-app
```

:::

`my-app` に移動し、依存関係をインストールします。

::: code-group

```txt [npm]
cd my-app
npm i
```

```txt [yarn]
cd my-app
yarn
```

```txt [pnpm]
cd my-app
pnpm i
```

```txt [bun]
cd my-app
bun i
```

:::

## 2. Hello World

`src/index.ts` をこのように変更します。

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default app
```

## 3. Run

ローカル開発サーバーを起動し、ブラウザで `http://localhost:8787` にアクセスします。

::: code-group

```txt [npm]
npm run dev
```

```txt [yarn]
yarn dev
```

```txt [pnpm]
pnpm dev
```

```txt [bun]
bun run dev
```

:::

## 4. デプロイ

Cloudflare アカウントを持っている場合、 Cloudflare にデプロイ出来ます。 `package.json` の `$npm_execpath` を選択したパッケージマネージャに置き換える必要があります。

::: code-group

```txt [npm]
npm run deploy
```

```txt [yarn]
yarn deploy
```

```txt [pnpm]
pnpm deploy
```

```txt [bun]
bun run deploy
```

:::

それだけです!

## Service Worker モード / Module Worker モード

Cloudflare Workers には2通りの記法があります。 _Service Worker モード_ と _Module Worker モード_ です。

```ts
// Service Worker
app.fire()
```

```ts
// Module Worker
export default app
```

ただしバインディング変数がローカライズされるため、 今は Module Worker モードが推奨されています。

## 他のイベントハンドラとともに Hono を使う

_Module Worker モード_ で他のイベントハンドラ( `scheduled` など)を統合できます。

このように、 `app.fetch` を `fetch` ハンドラとしてエクスポートし、必要に応じて他のハンドラも実装します:

```ts
const app = new Hono()

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {}
}
```

## 静的ファイルの提供

静的ファイルを提供するためにセットアップが必要です。
静的ファイルは Workers Sites を通じて提供されます。
`wrangler.toml` を編集して静的ファイルを提供するディレクトリを設定します。

```toml
[site]
bucket = "./assets"
```

次に `assets` ディレクトリを作成し、ファイルを設置します。

```
./
├── assets
│   ├── favicon.ico
│   └── static
│       ├── demo
│       │   └── index.html
│       ├── fallback.txt
│       └── images
│           └── dinotocat.png
├── package.json
├── src
│   └── index.ts
└── wrangler.toml
```

"アダプタ" を使用します。

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()

app.get('/static/*', serveStatic({ root: './', manifest }))
app.get('/favicon.ico', serveStatic({ path: './favicon.ico' }))
```

[例](https://github.com/honojs/examples/tree/main/serve-static)をご確認ください。

### `rewriteRequestPath`

`http://localhost:8787/static/*` を `./assets/statics` にマップするために `rewriteRequestPath` オプションを使用します:

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

MIME タイプを `mimes` で指定します:

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

要求されたファイルが見つからないときの処理を `notFoundOption` で実装します:

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

## 型

workers types が欲しければ `@cloudflare/workers-types` をインストールする必要があります。

::: code-group

```txt [npm]
npm i --save-dev @cloudflare/workers-types
```

```txt [yarn]
yarn add -D @cloudflare/workers-types
```

```txt [pnpm]
pnpm add -D @cloudflare/workers-types
```

```txt [bun]
bun add --dev @cloudflare/workers-types
```

:::

## テスト

テストのために `jest-environment-miniflare` が推奨されます。
[例](https://github.com/honojs/examples)を読んで設定してください。

このようなアプリケーションに対して

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Please test me!'))
```

このコードを使用して "_200 OK_" レスポンスが返されるかをテストします。

```ts
describe('Test the application', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
  })
})
```

## バインディング

Cloudflare Workers では環境変数、 KV ネームスペース、 R2 バケット、 Durable Object などをバインドし、 `c.env` からアクセスできます。 `Hono` のジェネリクスとしてバインディングの型データを渡します。

```ts
type Bindings = {
  MY_BUCKET: R2Bucket
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Access to environment values
app.put('/upload/:key', async (c, next) => {
  const key = c.req.param('key')
  await c.env.MY_BUCKET.put(key, c.req.body)
  return c.text(`Put ${key} successfully!`)
})
```

## ミドルウェアで環境変数を使用する

Module Worker モードのみで使用できます。
Basic 認証のユーザー名やパスワードなど、ミドルウェア内で環境変数やシークレットを使用したい場合はこのように書きます。

```ts
import { basicAuth } from 'hono/basic-auth'

//...

app.use('/auth/*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
})
```

同じように Bearer 認証や JWT 認証などもできます。
