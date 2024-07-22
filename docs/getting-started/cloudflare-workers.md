# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) は Cloudflare の CDN で JavaScript を実行するエッジランタイムです。

アプリケーションをローカルで開発し、 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) のいくつかのコマンドを使用して公開します。
Wrangler はコンパイラを内蔵しているため、 TypeScript でコードを書けます。

Hono を使った Cloudflare Workers 最初のアプリケーションを作りましょう。

## 1. セットアップ

Cloudflare Workers 向けのスターターが使用できます。
"create-hono" コマンドでプロジェクトを作成してください。
Select `cloudflare-workers` template for this example.

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
bunx create-hono my-app
```

```sh [deno]
deno run -A npm:create-hono my-app
```

:::

`my-app` に移動し、依存関係をインストールします。

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

Cloudflare アカウントを持っている場合、 Cloudflare にデプロイ出来ます。 `package.json` の `$npm_execpath` を選択したパッケージマネージャに置き換える必要があります。

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

それだけです!

## Service Worker モード / Module Worker モード

Cloudflare Workers には2通りの記法があります。 _Module Worker モード_ と _Service Worker モード_ です。Using Hono, you can write with both syntax, but we recommend using Module Worker mode so that binding variables are localized.

```ts
// Module Worker
export default app
```

ただしバインディング変数がローカライズされるため、 今は Module Worker モードが推奨されています。

```ts
// Service Worker
app.fire()
```

## 他のイベントハンドラとともに Hono を使う

_Module Worker モード_ で他のイベントハンドラ( `scheduled` など)を統合できます。

このように、 `app.fetch` を `fetch` ハンドラとしてエクスポートし、必要に応じて他のハンドラも実装します:

```ts
const app = new Hono()

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {},
}
```

## 静的ファイルの提供

::: warning
This "Serve static files" feature for Cloudflare Workers has been deprecated. If you want to create an application that serves static assets files, use [Cloudflare Pages](/docs/getting-started/cloudflare-pages) instead of Cloudflare Workers.
:::

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
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
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

要求されたファイルが見つからないときの処理を `onNotFound` で実装します:

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

```sh [npm]
npm i --save-dev @cloudflare/workers-types
```

```sh [yarn]
yarn add -D @cloudflare/workers-types
```

```sh [pnpm]
pnpm add -D @cloudflare/workers-types
```

```sh [bun]
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

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

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

## Deploy from Github Action

Before deploying code to Cloudflare via CI, you need a cloudflare token. you can manager from here: https://dash.cloudflare.com/profile/api-tokens

If it's a newly created token, select the **Edit Cloudflare Workers** template, if you have already another token, make sure the token has the corresponding permissions(No, token permissions are not shared between cloudflare page and cloudflare worker).

then go to your Github repository settings dashboard: `Settings->Secrets and variables->Actions->Repository secrets`, and add a new secret with the name `CLOUDFLARE_API_TOKEN`.

then create `.github/workflows/deploy.yml` in your hono project root folder,paste the following code:

```yml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

then edit `wrangler.toml`, and add this code after `compatibility_date` line.

```toml
main = "src/index.ts"
minify = true
```

Everything is ready! Now push the code and enjoy it.

## Load env when local development

To configure the environment variables for local development, create the `.dev.vars` file in the root directory of the project.
Then configure your environment variables as you would with a normal env file.

```
SECRET_KEY=value
API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

> For more about this section you can find in the Cloudflare documentation:
> https://developers.cloudflare.com/workers/wrangler/configuration/#secrets

Then we use the `c.env.*` to get the environment variables in our code.  
**For Cloudflare Workers, environment variables must be obtained via `c`, not via `process.env`.**

```ts
type Bindings = {
  SECRET_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/env', (c) => {
  const SECRET_KEY = c.env.SECRET_KEY
  return c.text(SECRET_KEY)
})
```

Before you deploy your project to cloudflare, remember to set the environment variable/secrets in the Cloudflare Worker project's configuration.

> For more about this section you can find in the Cloudflare documentation:
> https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard
