# Vercel

Vercel is the platform for frontend developers, providing the speed and reliability innovators need to create at the moment of inspiration. This section introduces Next.js running on Vercel.

Next.js is a flexible React framework that gives you building blocks to create fast web applications.

In Next.js, [Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) allows you to create dynamic APIs on Edge Runtime such as Vercel.
With Hono, you can write APIs with the same syntax as other runtimes and use many middleware.

## 1. Setup

A starter for Next.js is available.
Start your project with "create-hono" command.

```
npm create hono@latest my-app
```

Move into `my-app` and install the dependencies.

```
cd my-app
npm i
```

## 2. Hello World

If you use the App Router, Edit `app/api/[...route]/route.ts`.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const config = {
  runtime: 'edge',
}

const app = new Hono().basePath("/api")

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export const GET = handle(app)
```

If you use the Pages Router, Edit `pages/api/[...route].ts`.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const config = {
  runtime: 'edge',
}

const app = new Hono().basePath("/api")

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export default handle(app)
```

## 3. Run

Run the development server locally. Then, access `http://localhost:3000` in your Web browser.

```
npm run dev
```

Now, `/api/hello` just returns JSON, but if you build React UIs, you can create a full-stack application with Hono.

## 4. Deploy

If you have a Vercel account, you can deploy by linking the Git repository.

## Node.js

You can also run Hono on Next.js running on the Node.js runtime.

First, install the Node.js adapter.

```
npm i @hono/node-server
```

Next, you can utilize the `handle` function imported from `@hono/node-server/vercel`.

```ts
import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

export default handle(app)
```
