# Cloudflare Pages

Cloudflare Pages is a JAMstack platform for front-end developers to collaborate and deploy websites.

It supports many frameworks and is usually suited for distributing static files.
But, Cloudflare Pages runs on Cloudflare Workers, and with [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/), you can build full-stack applications.

## 1. Setup

A starter for Cloudflare Pages is available.
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

Edit `functions/api/[[route]].ts`

```ts
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello, Cloudflare Pages!',
  })
})

export const onRequest = handle(app, '/api')
```

## 3. Run

Run the development server locally. Then, access `http://localhost:8788` in your Web browser.

```
npm run dev
```

## 4. Deploy

If you have a Cloudflare account, you can deploy to Cloudflare.

```
npm run deploy
```

That's all!
