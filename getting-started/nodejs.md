# Node.js

[Node.js](https://nodejs.org/) is an open-source, cross-platform JavaScript runtime environment.

Hono is not designed for Node.js at first.
But with a [Node.js Adapter](https://github.com/honojs/node-server) it can run on Node.js as well.

::: warning
A Node.js Adapter supports only Node.js v18 or higher.
:::

## 1. Setup

A starter for Node.js is available.
Start your project with "create-hono" command.

```
npm create hono@latest my-app
```

Move to `my-app` and install the dependencies.

```
cd my-app
npm i
```

## 2. Hello World

Edit `src/index.ts`:

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Node.js!'))

serve(app)
```

## 3. Run

Run the development server locally. Then, access `http://localhost:3000` in your Web browser.

```
npm run start
```

## Change port number

You can specify the port number with the `port` option.

```ts
serve({
  fetch: app.fetch,
  port: 8787,
})
```

## Serve static files

You can use `serveStatic` to serve static files from the local file system.

```ts
import { serveStatic } from '@hono/node-server/serve-static'

app.use('/static/*', serveStatic({ root: './' }))
```

### `rewriteRequestPath`

If you want to map `http://localhost:3000/static/*` to `./statics`, you can use the `rewriteRequestPath` option:

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, '/statics'),
  })
)
```
