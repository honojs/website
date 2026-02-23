# Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) はフルスタックアプリケーションのためのエッジプラットフォームです。
静的なファイルと Cloudflare Workes を用いた動的なコンテンツを提供します。

Hono は完璧に Cloudflare Pages をサポートします。
楽しい開発体験ができます。 Vite の開発サーバーは高速で、 Wrangler を使ったデプロイは爆速です。

## 1. Setup

Cloudflare Pages 向けのスターターも準備されています。
"create-hono" コマンドでプロジェクトを開始できます。
この例では、 `cloudflare-pages` テンプレートを選択します。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono my-app
```

:::

`my-app` に移動して依存関係をインストールします。

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

以下が基本的なディレクトリ構成です。

```text
./
├── package.json
├── public
│   └── static // Put your static files.
│       └── style.css // You can refer to it as `/static/style.css`.
├── src
│   ├── index.tsx // The entry point for server-side.
│   └── renderer.tsx
├── tsconfig.json
└── vite.config.ts
```

## 2. Hello World

`src/index.tsx` をこのように変更します:

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Pages!</h1>)
})

export default app
```

## 3. 実行

開発サーバーをローカルで実行して、 Web ブラウザで `http://localhost:5173` にアクセスします。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 4. デプロイ

Cloudflare アカウントを持っている場合は Cloudflare にデプロイできます。 `package.json` の `$npm_execpath` は選んだパッケージマネージャに変更する必要があります。

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm run deploy
```

```sh [bun]
bun run deploy
```

:::

### Cloudflare ダッシュボードから GitHub 連携でデプロイする

1. [Cloudflare dashboard](https://dash.cloudflare.com) にログインしてアカウントを選択します。
2. Account Home で Workers & Pages > Create application > Pages > Connect to Git を選択します。
3. GitHub アカウントを認可して、リポジトリを選択します。 ビルドとデプロイの設定は次のようになります:

| Configuration option | Value           |
| -------------------- | --------------- |
| Production branch    | `main`          |
| Build command        | `npm run build` |
| Build directory      | `dist`          |

## バインディング

Variables 、 KV 、 D1 などの Cloudflare バインディングを使うことができます。
このセクションでは Variables と KV のセットアップを解説します。

### `wrangler.toml` を作る

まずは、ローカルバインディング用に `wrangler.toml` を作成します:

```sh
touch wrangler.toml
```

`wrangler.toml` を編集して、 `MY_NAME` の Variable を設定します。

```toml
[vars]
MY_NAME = "Hono"
```

### KV を作る

次に、 KV を作ります。 以下の `wrangler` コマンドを実行します:

```sh
wrangler kv namespace create MY_KV --preview
```

このような出力があるので `preview_id` をメモしてください:

```
{ binding = "MY_KV", preview_id = "abcdef" }
```

`MY_KV` のバインディングで `preview_id` を設定します:

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "abcdef"
```

### `vite.config.ts` を変更する

`vite.config.ts` を変更します:

```ts
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import build from '@hono/vite-cloudflare-pages'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx',
      adapter, // Cloudflare Adapter
    }),
    build(),
  ],
})
```

### アプリケーションでバインディングを使用する

Variable と KV をアプリケーションで使用します。 まずは、型を設定します。

```ts
type Bindings = {
  MY_NAME: string
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
```

使います:

```tsx
app.get('/', async (c) => {
  await c.env.MY_KV.put('name', c.env.MY_NAME)
  const name = await c.env.MY_KV.get('name')
  return c.render(<h1>Hello! {name}</h1>)
})
```

### 本番環境では

Cloudflare Pages では、ローカル開発用には `wrangler.toml` を使用しますが、本番環境ではダッシュボードでバインディングを設定します。

## クライアントサイド

Vite の機能を使ってクライアントサイドのスクリプトを書いてアプリケーションに組み込むことができます。
`/src/client.ts` がクライアントのエントリポイントのとき、 script タグに書くだけです。
更に、 `import.meta.env.PROD` は動作環境が開発サーバーかビルド中かを検出するために有用です。

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        {import.meta.env.PROD ? (
          <script type='module' src='/static/client.js'></script>
        ) : (
          <script type='module' src='/src/client.ts'></script>
        )}
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
  )
})
```

スクリプトをうまくビルドするために、下に示すような設定の例を `vite.config.ts` に使うことができます。

```ts
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.ts',
          output: {
            entryFileNames: 'static/client.js',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx',
        }),
      ],
    }
  }
})
```

次のコマンドを実行して、サーバーとクライアントスクリプトをビルドします。

```sh
vite build --mode client && vite build
```

## Cloudflare Pages のミドルウェア

Cloudflare Pages は Hono とは違う[ミドルウェア](https://developers.cloudflare.com/pages/functions/middleware/)システムを持っています。 `_middleware.ts` で `onRequest` を export することで有効化できます:

```ts
// functions/_middleware.ts
export async function onRequest(pagesContext) {
  console.log(`You are accessing ${pagesContext.request.url}`)
  return await pagesContext.next()
}
```

`handleMiddleware` を使うことで、 Hono のミドルウェアを Cloudflare Pages のミドルウェアとして使うことができます。

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'

export const onRequest = handleMiddleware(async (c, next) => {
  console.log(`You are accessing ${c.req.url}`)
  await next()
})
```

Hono のビルトイン、サードパーティミドルウェアも使うことができます。 例えば、 Basic 認証を追加するために [Hono の Basic 認証ミドルウェア](/docs/middleware/builtin/basic-auth) を使うことができます。

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'
import { basicAuth } from 'hono/basic-auth'

export const onRequest = handleMiddleware(
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

このように複数のミドルウェアを使うこともできます:

```ts
import { handleMiddleware } from 'hono/cloudflare-pages'

// ...

export const onRequest = [
  handleMiddleware(middleware1),
  handleMiddleware(middleware2),
  handleMiddleware(middleware3),
]
```

### `EventContext` へのアクセス

[`EventContext`](https://developers.cloudflare.com/pages/functions/api-reference/#eventcontext) オブジェクトには `handleMiddleware` の `c.env` からアクセスできます。

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'

export const onRequest = [
  handleMiddleware(async (c, next) => {
    c.env.eventContext.data.user = 'Joe'
    await next()
  }),
]
```

次に、ハンドラでは `c.env.eventContext` からセットしたデータにアクセスできます:

```ts
// functions/api/[[route]].ts
import type { EventContext } from 'hono/cloudflare-pages'
import { handle } from 'hono/cloudflare-pages'

// ...

type Env = {
  Bindings: {
    eventContext: EventContext
  }
}

const app = new Hono<Env>().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: `Hello, ${c.env.eventContext.data.user}!`, // 'Joe'
  })
})

export const onRequest = handle(app)
```
