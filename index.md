---
title: Hono - Ultrafast web framework for the Edge
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono is a small, simple, and ultrafast web framework for the Edge. It works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Vercel, Lagon, Node.js, and others. Fast, but not only fast.',
      },
    ]
---

# Hono

Hono - _**\[炎\] means flame🔥 in Japanese**_ - is a small, simple, and ultrafast web framework for the Edge.
It works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Vercel, Lagon, Node.js, and others.
Fast, but not only fast.

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

- **Ultrafast** - The routers are really fast and smart. Not using linear loops. Fast.
- **Multi-runtime** - Works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Lagon, or Node.js. The same code runs on all platforms.
- **Batteries Included** - Hono has built-in middleware, custom middleware, and third-party middleware. Batteries included.
- **Fine DX** - First-class TypeScript support. Now, we've got "Types".
- **Small** - About 20kB. Zero-dependencies. Using only Web Standard API.

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

## Why so fast?

**RegExpRouter** is the fastest router in the JavaScript world.
And **Smart Router** is really smart.
It automatically picks the best router from the following routers.
Users can use the fastest router without having to do anything!

- **RegExpRouter** - Match the route using one big Regex made before dispatch.
- **TrieRouter** - Implemented with Trie tree structure. Supports all routing patterns.

See [more information about routes](/concepts/philosophy#routers).

## Hono in 1 minute

A demonstration to create an application for Cloudflare Workers with Hono.

![Demo](/images/sc.gif)

## Not only fast

Hono is fast. But not only fast.

### Run anywhere

Thanks to the use of the **Web Standard API**, Hono works on a lot of platforms.

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute@Edge
- Deno
- Bun
- Lagon
- Next.js
- Others

And by using [a Node.js adaptor](https://github.com/honojs/node-server), Hono works on Node.js.

See [more information about Web Standard](/concepts/philosophy#web-standard).

### Do everything

Built-in middleware makes "**Write Less, do more**" in reality.
You can use a lot of middleware without writing code from scratch. Below are examples.

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

To enable logger and Etag middleware with just this code.

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use('*', etag(), logger())
```

See [more information about Middleware](/concepts/philosophy#middleware).

### Small

Hono is small.
About **20KB** if it is minified.
There are many middleware and adapters, but they are bundled only when used.
By the way, Express bundle size is 572KB.

### Developer Experience

Hono provides fine "**Developer Experience**".
Easy access to Request/Response thanks to the `Context` object.
Then, Hono is written in TypeScript. Hono has "**Types**".

For example, the path parameters will be literal types.

![SS](/images/ss.png)

And the Validator and Hono Client `hc` enable the RPC mode. In RPC mode,
you can use your favorite validator such as Zod and easily share server-side API specs with the client and build type-safe applications.

See [Hono Stacks](/concepts/stacks).
