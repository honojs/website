# Node.js

[Node.js](https://nodejs.org/) is an open-source, cross-platform JavaScript runtime environment.

Hono is not designed for Node.js at first.
But with a [Node.js Adapter](https://github.com/honojs/node-server) it can run on Node.js as well.

::: info
It works on Node.js versions greater than 18.x. The specific required Node.js versions are as follows:

- 18.x => 18.14.1+
- 19.x => 19.7.0+
- 20.x => 20.0.0+

Essentially, you can simply use the latest version of each major release.
:::

## 1. Setup

A starter for Node.js is available.
Start your project with "create-hono" command.

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
Move to `my-app` and install the dependencies.

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

::: code-group

```txt [npm]
npm run dev
```

```txt [yarn]
yarn dev
```

```txt [pnpm]
pnpm dev
```

:::

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

## http2

You can run hono on a [Node.js http2 Server](https://nodejs.org/api/http2.html).

### unencrypted http2

```ts
import { createServer } from 'node:http2'

const server = serve({
  fetch: app.fetch
  createServer,
})
```

### encrypted http2

```ts
import { createSecureServer } from 'node:http2'
import { readFileSync } from 'node:fs'

const server = serve({
  fetch: app.fetch,
  createServer: createSecureServer,
  serverOptions: {
    key: readFileSync('localhost-privkey.pem'),
    cert: readFileSync('localhost-cert.pem'),
  },
})
```
