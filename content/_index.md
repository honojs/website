---
title: Ultrafast web framework on the edge
type: docs
---

# Hono

Hono - *\[炎\] means flame🔥 in Japanese* - is a small, simple, and ultrafast web framework for Cloudflare Workers, Deno, Bun, and others. Fast, but not only fast.

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!!'))

export default app
```

## Features

- **Ultrafast** - the router does not use linear loops.
- **Zero-dependencies** - using only Service Worker and Web Standard API.
- **Middleware** - built-in middleware, custom middleware, and third-party middleware.
- **TypeScript** - first-class TypeScript support.
- **Multi-platform** - works on Cloudflare Workers, Fastly Compute@Edge, Deno, or Bun.

## Benchmarks

### Cloudflare Workers

- Machine: Apple MacBook Pro, 32 GiB, M1 Pro
- Scripts: [benchmarks/handle-event](https://github.com/honojs/hono/tree/master/benchmarks/handle-event)

**Hono is fastest**, compared to other routers for Cloudflare Workers.

```plain
hono - trie-router(default) x 389,510 ops/sec ±3.16% (85 runs sampled)
hono - regexp-router x 452,290 ops/sec ±2.64% (84 runs sampled)
itty-router x 206,013 ops/sec ±3.39% (90 runs sampled)
sunder x 323,131 ops/sec ±0.75% (97 runs sampled)
worktop x 191,218 ops/sec ±2.70% (91 runs sampled)
Fastest is hono - regexp-router
✨  Done in 43.56s.
```

### Deno

- Machine: Apple MacBook Pro, 32 GiB, M1 Pro, Deno v1.22.0
- Scripts: [benchmarks/deno](https://github.com/honojs/hono/tree/master/benchmarks/deno)
- Method: `autocannon -c 100 -d 40 -p 10 'http://127.0.0.1:8000/user/lookup/username/foo'`

**Hono is fastest**, compared to other frameworks for Deno.

| Framework                     | Version |                                   Results |
| ----------------------------- | :-----: | ----------------------------------------: |
| **Hono - RegExpRouter**       |  1.6.0  | **5118k requests in 40.02s, 865 MB read** |
| **Hono - TriRouter(default)** |  1.6.0  | **4932k requests in 40.02s, 833 MB read** |
| Faster                        |   5.7   |     3579k requests in 40.02s, 551 MB read |
| oak                           | 10.5.1  |     2385k requests in 40.02s, 403 MB read |
| opine                         |  2.2.0  |     1491k requests in 40.02s, 346 MB read |

Another benchmark result: [denosaurs/bench](https://github.com/denosaurs/bench)

## Why so fast?

Routers used in Hono are really smart.

- **TrieRouter**(default) - Implemented with Trie tree structure.
- **RegExpRouter** - Match the route with using one big Regex made before dispatch.

## Hono in 1 minute

A demonstration to create an application for Cloudflare Workers with Hono.

![Demo](/images/sc.gif)

## Not only fast

Hono is fast. But not only fast.

### Write Less, do more

Built-in middleware make _"**Write Less, do more**"_ in reality. You can use a lot of middleware without writing code from scratch. Below are examples.

- [Basic Authentication](/docs/builtin-middleware/basic-auth/)
- [Bearer Authentication](/docs/builtin-middleware/bearer-auth/)
- [CORS](/docs/builtin-middleware/cors/)
- [ETag](/docs/builtin-middleware/etag/)
- [html](/docs/builtin-middleware/html/)
- [JSX](/docs/builtin-middleware/jsx/)
- [JWT Authentication](/docs/builtin-middleware/jwt/)
- [Logger](/docs/builtin-middleware/logger/)
- [Pretty JSON](/docs/builtin-middleware/pretty-json/)
- [Serving static files](/docs/builtin-middleware/serve-static/)
- GraphQL (coming soon)

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

### Multi-platform

Thanks to the use of the Web Standard API, Hono works on a variety of platforms.

* Cloudflare Workers
* Fastly Compute@Edge
* Deno / Deno Deploy
* Bun
* Others

### Developer Experience

Hono provides fine _"**Developer Experience**"_. Easy access to Request/Response thanks to the `Context` object.
Above all, Hono is written in TypeScript. So, Hono has _"**Types**"_!

For example, the named path parameters will be literal types.

![Demo](https://user-images.githubusercontent.com/10682/154179671-9e491597-6778-44ac-a8e6-4483d7ad5393.png)
