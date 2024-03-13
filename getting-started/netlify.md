# Netlify

Netlify provides static site hosting and serverless backend services. [Edge Functions](https://docs.netlify.com/edge-functions/overview/) enables us make the web pages dynamic.

Edge Functions support writing in Deno and TypeScript, and deployment is made easy through the [Netlify CLI](https://docs.netlify.com/cli/get-started/). With Hono, you can create the application for Netlify Edge Functions.

## 1. Setup

A starter for Netlify is available.
Start your project with "create-hono" command.
Select `netlify` template for this example.

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

Move into `my-app` and install the dependencies.

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

Edit `netlify/edge-functions/index.ts`:

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

Run the development server with Netlify CLI. Then, access `http://localhost:8888` in your Web browser.

```
netlify dev
```

## 4. Deploy

You can deploy with a `netlify deploy` command.

```
netlify deploy --prod
```

## `Context`

You can access the Netlify's `Context` through `c.env`:

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
