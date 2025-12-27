# Next.js

Next.js is a flexible React framework that gives you building blocks to create fast web applications.

You can run Hono on Next.js when using the Node.js runtime.\
On Vercel, deploying Hono with Next.js is easy by using Vercel Functions.

## 1. Setup

A starter for Next.js is available.
Start your project with "create-hono" command.
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
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono my-app
```

:::

Move into `my-app` and install the dependencies.

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

If you use the App Router, Edit `app/api/[[...route]]/route.ts`. Refer to the [Supported HTTP Methods](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods) section for more options.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
```

## 3. Run

Run the development server locally. Then, access `http://localhost:3000` in your Web browser.

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

Now, `/api/hello` just returns JSON, but if you build React UIs, you can create a full-stack application with Hono.

## 4. Deploy

If you have a Vercel account, you can deploy by linking the Git repository.

## Pages Router

If you use the Pages Router, you'll need to install the Node.js adapter first.

::: code-group

```sh [npm]
npm i @hono/node-server
```

```sh [yarn]
yarn add @hono/node-server
```

```sh [pnpm]
pnpm add @hono/node-server
```

```sh [bun]
bun add @hono/node-server
```

:::

Then, you can utilize the `handle` function imported from `@hono/node-server/vercel` in `pages/api/[[...route]].ts`.

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
    message: 'Hello Next.js!',
  })
})

export default handle(app)
```

In order for this to work with the Pages Router, it's important to disable Vercel Node.js helpers by setting up an environment variable in your project dashboard or in your `.env` file.

```text
NODEJS_HELPERS=0
```
