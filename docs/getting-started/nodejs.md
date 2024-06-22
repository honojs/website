# Node.js

[Node.js](https://nodejs.org/) is an open-source, cross-platform JavaScript runtime environment.

Hono was not designed for Node.js at first. But with a [Node.js Adapter](https://github.com/honojs/node-server) it can run on Node.js as well.

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
Select `nodejs` template for this example.

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
Move to `my-app` and install the dependencies.

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

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
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

## Access the raw Node.js APIs

You can access the Node.js APIs from `c.env.incoming` and `c.env.outgoing`.

```ts
import { Hono } from 'hono'
import { serve, type HttpBindings } from '@hono/node-server'
// or `Http2Bindings` if you use HTTP2

type Bindings = HttpBindings & {
  /* ... */
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  })
})

serve(app)
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
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
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

## Dockerfile

Here is an example of a Dockerfile.

```Dockerfile
FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*json tsconfig.json src ./

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
```

The following steps shall be taken in advance.

1. Run `npm install typescript tsc-alias --save-dev`.
2. Modify the `package.json`.
    ```diff
    {
    + "type": "module",
      "scripts": {
        ...
    +   "build": "tsc && tsc-alias"
      }
    }
    ```
3. Modify the `tsconfig.json` 
    ```diff
    {
      "compilerOptions": {
        ...
    +   "outDir": "./dist" 
      },
    + "exclude": ["node_modules"],
    + "tsc-alias": {
    +   "resolveFullPaths": true
    + }
    }
    ```