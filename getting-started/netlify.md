# Netlify

Netlify は静的サイトホスティングとサーバーレスバックエンドサービスを提供します。 [Edge Functions](https://docs.netlify.com/edge-functions/overview/) を使用すると Web ページを動的にすることが出来ます。

Edge Functions は Deno と TypeScript をサポートしており、 [Netlify CLI](https://docs.netlify.com/cli/get-started/) を使用することで簡単にデプロイ出来ます。 Hono を使用して Netlify Edge Functions 向けのアプリケーションを作成できます。

## 1. セットアップ

Netlify 向けのスターターももちろん用意されています。
"create-hono" コマンドでプロジェクトを始めましょう。

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

`netlify/edge-functions/index.ts` を変更します:

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { handle } from 'https://deno.land/x/hono/adapter/netlify/mod.ts'

const app = new Hono()

app.get('/country', (c) =>
  c.json({
    message: 'Hello Netlify!',
  })
)

export default handle(app)
```

## 3. Run

Netlify CLI で開発サーバーを起動し、 Web ブラウザで `http://localhost:8888` にアクセスします。

```
netlify dev
```

## 4. デプロイ

`netlify deploy` コマンドでデプロイ出来ます。

```
netlify deploy --prod
```

## `Context`

Netlify 向けの `Context` は `c.env` を使用できます:

```ts
// netlify/edge-functions/index.ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { prettyJSON } from 'https://deno.land/x/hono/middleware.ts'

import { handle } from 'https://deno.land/x/hono/adapter/netlify/mod.ts'
import type { Env } from 'https://deno.land/x/hono/adapter/netlify/mod.ts'

const app = new Hono<Env>()

app.get('/country', prettyJSON(), (c) =>
  c.json({
    'You are in': c.env.context.geo.country?.name,
  })
)

export default handle(app)
```
