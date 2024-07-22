# Vercel

Vercel はフロントエンド開発者のためのプラットフォームで、イノベーターがインスピレーションの瞬間に制作をするために必要なスピードと信頼性を提供します。 このセクションでは Vercel 上で実行される Next.js 紹介します。

Next.js は、高速な　Web アプリケーションを作成するための要素を提供する柔軟な React フレームワークです。

Next.js では [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) を使用して Vercel などのエッジランタイムに動的 API を作成できます。
Hono を使用すると、他のランタイムと同じ構文で　API を記述し、多くのミドルウェアが使用できます。

## 1. セットアップ

Next.js 向けのスターターもあります。
"create-hono" コマンドで始めましょう。
Select `nextjs` template for this example.

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

App Router を使用している場合 `app/api/[[...route]]/route.ts` に書いてください。 [Supported HTTP Methods](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods) も参照してください。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
```

Pages Router を使用している場合は `pages/api/[[...route]].ts` に記述します。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import type { PageConfig } from 'next'

export const config: PageConfig = {
  runtime: 'edge',
}

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export default handle(app)
```

## 3. Run

開発サーバーをローカルで動かし、ブラウザで `http://localhost:3000` にアクセスしましょう。

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

今は `/api/hello` で JSON を返すだけですが、 React で UI を作成すれば Hono でフルスタックアプリケーションを作成できます。

## 4. デプロイ

Vercel アカウントを持っている場合は Git 連携でデプロイ出来ます。

## Node.js

Node.js ランタイム上の Next.js で Hono を使うことも出来ます。

まずは Node.js アダプタをインストールしてください。

```sh
npm i @hono/node-server
```

次に、 `@hono/node-server/vercel` からインポートした `handle` を使用します。

```ts
import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'
import type { PageConfig } from 'next'

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

export default handle(app)
```

In order for this to work, it's important to disable Vercel node.js helpers by setting up an enviroment variable in your project dashboard or in your `.env` file

`NODEJS_HELPERS=0`
