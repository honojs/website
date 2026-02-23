# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) は Cloudflare の CDN で JavaScript を実行するエッジランタイムです。

アプリケーションをローカルで開発し、 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) のいくつかのコマンドを使用して公開します。
Wrangler はコンパイラを内蔵しているため、 TypeScript でコードを書けます。

Hono を使った Cloudflare Workers 最初のアプリケーションを作りましょう。

## 1. セットアップ

Cloudflare Workers 向けのスターターが使用できます。
"create-hono" コマンドでプロジェクトを作成してください。
`cloudflare-workers` テンプレートを選択します。

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

### ポート番号を変える

ポート番号を変える必要がある場合は、 `wrangler.toml` / `wrangler.json` / `wrangler.jsonc` を以下のドキュメントに従って変更してください:
[Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#local-development-settings)

もしくは CLI オプションで設定することもできます:
[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/#dev)

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

静的ファイルを提供したい場合、 Cloudflare Workers の [Static Assets 機能](https://developers.cloudflare.com/workers/static-assets/) を使うことができます。 `wrangler.toml` でファイルを置くディレクトリを指定します:

```toml
assets = { directory = "public" }
```

次に `public` ディレクトリを作成し、ファイルを設置します. 例えば、 `./public/static/hello.txt` は `/static/hello.txt` として提供されます。

```
.
├── package.json
├── public
│   ├── favicon.ico
│   └── static
│       └── hello.txt
├── src
│   └── index.ts
└── wrangler.toml
```

## 型

Workers の型が欲しい場合は `@cloudflare/workers-types` をインストールする必要があります。

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

テストのために `@cloudflare/vitest-pool-workers` が推奨されます。
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

Cloudflare Workers では環境変数、 KV ネームスペース、 R2 バケット、 Durable Object などをバインドし、 `c.env` からアクセスできます。 `Hono` のジェネリクスとしてバインディングの型定義を渡します。

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

## Github Actions からデプロイする

CI で Cloudflare にデプロイする前に、 Cloudflare のトークンが必要です。 [User API Tokens](https://dash.cloudflare.com/profile/api-tokens) で管理できます。

新しく作られたトークンでは、 **Edit Cloudflare Workers** テンプレートを選択します。 すでにトークンがある場合は、トークンが対応する権限を持っていることを確認してください。 ( Cloudflare Pages と Cloudflare Workers の間で権限が共有されないことに注意してください。

次に GitHub リポジトリの設定ダッシュボードで `Settings->Secrets and variables->Actions->Repository secrets` を開き、 `CLOUDFLARE_API_TOKEN` という名前のシークレットを作成します。

`.github/workflows/deploy.yml` を Hono プロジェクトのルートフォルダに作成し、以下のコードを貼り付けます:

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

準備が整いました! 後はコードを push して楽しんでください。

## ローカル開発環境で環境変数をロードする

ローカル開発環境で環境変数を設定するには、 `.dev.vars` か `.env` ファイルをプロジェクトのルートディレクトリに作成します。
これらのファイルは [dotenv](https://hexdocs.pm/dotenvy/dotenv-file-format.html) の構文を使用します。 以下に例を示します:

```
SECRET_KEY=value
API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

> 詳しくは Cloudflare のドキュメントをご覧ください:
> https://developers.cloudflare.com/workers/wrangler/configuration/#secrets

コードの中で `c.env.*` から環境変数にアクセスします。

::: info
By default, `process.env` is not available in Cloudflare Workers, so it is recommended to get environment variables from `c.env`. If you want to use it, you need to enable [`nodejs_compat_populate_process_env`](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-auto-populating-processenv) flag. You can also import `env` from `cloudflare:workers`. For details, please see [How to access `env` on Cloudflare docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/#how-to-access-env)
:::

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

Cloudflare にプロジェクトをデプロイする前に、環境変数、シークレットを Cloudflare Workers プロジェクトの設定で追加することを忘れないでください。

> 詳しくは Cloudflare のドキュメントをご覧ください:
> https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard
