---
title: Hono - Ultrafast web framework for the Edges
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono is a small, simple, and ultrafast web framework for the Edges. It works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Vercel, Lagon, AWS Lambda, Node.js, and others. Fast, but not only fast.',
      },
    ]
---

# Hono

Hono - _**\[炎\] means flame🔥 in Japanese**_ - is a small, simple, and ultrafast web framework for the Edges.

It works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Vercel, Lagon, AWS Lambda, and Node.js. This means Hono runs on any JavaScript runtime.

Fast, but not just fast.

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## Quick Start

```
npm create hono@latest my-app
```

## Features

- **Ultrafast** - The router is really fast. Not using linear loops. Fast.
- **Multi-runtime** - Works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Lagon, AWS Lambda or Node.js. The same code runs on all platforms.
- **Batteries Included** - Hono has built-in middleware, custom middleware, and third-party middleware. Batteries included.
- **Delightful DX** - First-class TypeScript support. Now, we've got "Types".
- **Small** - A minimal application with Hono is under 12kB. It has zero dependencies and uses only the Web Standard API.

## Hono in 1 minute

A demonstration to create an application for Cloudflare Workers with Hono.

![Demo](/images/sc.gif)

## Ultrafast

**Hono is the fastest**, compared to other routers for Cloudflare Workers.

```
Hono x 385,807 ops/sec ±5.02% (76 runs sampled)
itty-router x 205,318 ops/sec ±3.63% (84 runs sampled)
sunder x 287,198 ops/sec ±4.90% (74 runs sampled)
worktop x 191,134 ops/sec ±3.06% (85 runs sampled)
Fastest is Hono
✨  Done in 27.51s.
```

See [more benchmarks](/concepts/benchmarks).

## Small

**Hono is so small**. With the `hono/tiny` preset, its size is **under 12KB** when minified. There are many middleware and adapters, but they are bundled only when used. For comparison, the bundle size of Express is 572KB.

```
$ npx wrangler dev --minify ./src/index.ts
 ⛅️ wrangler 2.20.0
--------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.128.165:8787
Total Upload: 11.47 KiB / gzip: 4.34 KiB
```

## Multiple routers

**Hono has multiple routers**.

**RegExpRouter** is the fastest router in the JavaScript world. It matches the route using a single large Regex created before dispatch. With **SmartRouter**, it supports all route patterns.

**LinearRouter** registers the routes very quickly, so it's suitable for an environment that initializes applications every times. **PatternRouter** simply adds and matches the pattern, making it small.

See [more information about routes](/concepts/philosophy#routers).

## Web Standard

Thanks to the use of the **Web Standard API**, Hono works on a lot of platforms.

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute@Edge
- Deno
- Bun
- Lagon
- Vercel
- AWS Lambda
- Others

And by using [a Node.js adaptor](https://github.com/honojs/node-server), Hono works on Node.js.

See [more information about Web Standard](/concepts/philosophy#web-standard).

## Middleware

**Hono has many middleware**. These makes "Write Less, do more" a reality.

Out of the box, Hono provides middleware for:

- [Basic Authentication](/middleware/builtin/basic-auth)
- [Bearer Authentication](/middleware/builtin/bearer-auth)
- [Cache](/middleware/builtin/cache)
- [Compress](/middleware/builtin/compress)
- [CORS](/middleware/builtin/cors)
- [ETag](/middleware/builtin/etag)
- [html](/middleware/builtin/html)
- [JSX](/middleware/builtin/jsx)
- [JWT Authentication](/middleware/builtin/jwt)
- [Logger](/middleware/builtin/logger)
- [Pretty JSON](/middleware/builtin/pretty-json)
- [GraphQL Server](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Firebase Authentication](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)

For example, adding ETag and request logging only takes a few lines of code with Hono:

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use('*', etag(), logger())
```

See [more information about Middleware](/concepts/philosophy#middleware).

## Developer Experience

Hono provides a delightful "**Developer Experience**".
Easy access to Request/Response thanks to the `Context` object.
Hono is written in TypeScript. Hono has "**Types**".

For example, the path parameters will be literal types.

![SS](/images/ss.png)

And the Validator and Hono Client `hc` enable the RPC mode. In RPC mode,
you can use your favorite validator such as Zod and easily share server-side API specs with the client and build type-safe applications.

See [Hono Stacks](/concepts/stacks).
