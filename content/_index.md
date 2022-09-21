---
title: Ultrafast web framework for Cloudflare Workers, Deno, and Bun.
type: docs
---

# Hono

Hono - _\[炎\] means flame🔥 in Japanese_ - is a small, simple, and ultrafast web framework for Cloudflare Workers, Deno, Bun, and others. Fast, but not only fast.

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!!'))

export default app
```

## Features

- **Ultrafast** - The routers are really smart. Not using linear loops. The fastest one will be selected from three routers.
- **Zero-dependencies** - Using only Web Standard API. Does not depend on other npm or Deno libraries.
- **Middleware** - Hono has built-in middleware, custom middleware, and third-party middleware. Batteries included.
- **TypeScript** - First-class TypeScript support. Now, we've got "Types".
- **Multi-runtime** - Works on Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, or Node.js. The same code runs on all platforms.

## Benchmarks

### Cloudflare Workers

- Machine: Apple MacBook Pro, 32 GiB, M1 Pro
- Scripts: [benchmarks/handle-event](https://github.com/honojs/hono/tree/main/benchmarks/handle-event)

**Hono is fastest**, compared to other routers for Cloudflare Workers.

```plain
Hono x 616,464 ops/sec ±4.76% (83 runs sampled)
itty-router x 203,074 ops/sec ±3.66% (88 runs sampled)
sunder x 314,306 ops/sec ±2.28% (87 runs sampled)
worktop x 194,111 ops/sec ±2.78% (81 runs sampled)
Fastest is Hono
✨  Done in 30.77s.
```

### Deno

- Machine: Apple MacBook Pro, 32 GiB, M1 Pro, Deno v1.22.0
- Scripts: [benchmarks/deno](https://github.com/honojs/hono/tree/main/benchmarks/deno)
- Method: `oha -z 10s -c 50 'http://127.0.0.1:8000/user/lookup/username/foo'`

**Hono is fastest**, compared to other frameworks for Deno.

| Framework |   Version    |                  Results |
| --------- | :----------: | -----------------------: |
| **Hono**  |    2.2.0     | **Requests/sec: 176976** |
| Fast      | 4.0.0-beta.1 |     Requests/sec: 148011 |
| Faster    |     5.7      |      Requests/sec: 36332 |
| oak       |    10.5.1    |      Requests/sec: 34641 |
| opine     |    2.2.0     |      Requests/sec: 21102 |

Another benchmark result: [denosaurs/bench](https://github.com/denosaurs/bench)

### Bun

See: [SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark)

## Why so fast?

Routers used in Hono are really smart.
**SmartRouter** automatically picks the best router from the following three routers.
Users can use the fastest router without having to do anything!

- **TrieRouter** - Implemented with Trie tree structure.
- **RegExpRouter** - Match the route with using one big Regex made before dispatch.
- **StaticRouter** - Optimized for the static routing.

## Hono in 1 minute

A demonstration to create an application for Cloudflare Workers with Hono.

![Demo](/images/sc.gif)

## Not only fast

Hono is fast. But not only fast.

### Write Less, do more

Built-in middleware make _"**Write Less, do more**"_ in reality. You can use a lot of middleware without writing code from scratch. Below are examples.

- [Basic Authentication](/docs/builtin-middleware/basic-auth/)
- [Bearer Authentication](/docs/builtin-middleware/bearer-auth/)
- [Cache](/docs/builtin-middleware/cache/)
- [Compress](/docs/builtin-middleware/compress/)
- [CORS](/docs/builtin-middleware/cors/)
- [ETag](/docs/builtin-middleware/etag/)
- [html](/docs/builtin-middleware/html/)
- [JSX](/docs/builtin-middleware/jsx/)
- [JWT Authentication](/docs/builtin-middleware/jwt/)
- [Logger](/docs/builtin-middleware/logger/)
- [Pretty JSON](/docs/builtin-middleware/pretty-json/)
- [Serving static files](/docs/builtin-middleware/serve-static/)
- [Validator](/docs/builtin-middleware/validator/)
- [GraphQL Server](https://github.com/honojs/graphql-server)
- [Firebase Authentication](https://github.com/honojs/firebase-auth)
- [Sentry](https://github.com/honojs/sentry)

To enable logger and Etag middleware with just this code.

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use('*', etag(), logger())
```

And, the routing of Hono is so flexible. It's easy to construct large web applications.

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'

const v1 = new Hono()
v1.get('/posts', (c) => {
  return c.text('list posts')
})
  .post(basicAuth({ username, password }), (c) => {
    return c.text('created!', 201)
  })
  .get('/posts/:id', (c) => {
    const id = c.req.param('id')
    return c.text(`your id is ${id}`)
  })

const app = new Hono()
app.route('/v1', v1)
```

### Web Standard

Request and Response object used in Hono are extensions of the Web Standard [Fetch API](https://developer.mozilla.org/ja/docs/Web/API/Fetch_API). If you are familiar with that, you don't need to know more than that.

### Multi-runtime

Thanks to the use of the Web Standard API, Hono works on a variety of platforms.

- Cloudflare Workers
- Fastly Compute@Edge
- Deno / Deno Deploy
- Bun
- Others

And using [a Node.js adaptor](https://github.com/honojs/node-server), Hono will works on Node.js.

### Developer Experience

Hono provides fine _"**Developer Experience**"_. Easy access to Request/Response thanks to the `Context` object.
Above all, Hono is written in TypeScript. So, Hono has _"**Types**"_!

For example, the named path parameters will be literal types.

![Demo](/images/ss.png)
