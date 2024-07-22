# Netlify

Netlify は静的サイトホスティングとサーバーレスバックエンドサービスを提供します。 [Edge Functions](https://docs.netlify.com/edge-functions/overview/) を使用すると Web ページを動的にすることが出来ます。

Edge Functions は Deno と TypeScript をサポートしており、 [Netlify CLI](https://docs.netlify.com/cli/get-started/) を使用することで簡単にデプロイ出来ます。 Hono を使用して Netlify Edge Functions 向けのアプリケーションを作成できます。

## 1. セットアップ

Netlify 向けのスターターももちろん用意されています。
"create-hono" コマンドでプロジェクトを始めましょう。
Select `netlify` template for this example.

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

`my-app` に移動します。

## 2. Hello World

`netlify/edge-functions/index.ts` を変更します:

```ts
import { Hono } from 'jsr:@hono/hono'
import { handle } from 'jsr:@hono/hono/netlify'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default handle(app)
```

## 3. Run

Netlify CLI で開発サーバーを起動し、 Web ブラウザで `http://localhost:8888` にアクセスします。

```sh
netlify dev
```

## 4. デプロイ

`netlify deploy` コマンドでデプロイ出来ます。

```sh
netlify deploy --prod
```

## `Context`

Netlify 向けの `Context` は `c.env` を使用できます:

```ts
import { Hono } from 'jsr:@hono/hono'
import { handle } from 'jsr:@hono/hono/netlify'

// Import the type definition
import type { Context } from 'https://edge.netlify.com/'

export type Env = {
  Bindings: {
    context: Context
  }
}

const app = new Hono<Env>()

app.get('/country', (c) =>
  c.json({
    'You are in': c.env.context.geo.country?.name,
  })
)

export default handle(app)
```
