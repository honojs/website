---
title: Hono - Ultrafast web framework for the Edges
titleTemplate: ':title'
---

# Hono

Hono - _**\[炎\] means flame🔥 in Japanese**_ - is a small, simple, and ultrafast web framework for the Edges.
It works on any JavaScript runtime: Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js.

Fast, but not only fast.

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## Quick Start

Just run this:

::: code-group

```txt [npm]
npm create hono@latest
```

```txt [yarn]
yarn create hono
```

```txt [pnpm]
pnpm create hono
```

```txt [bun]
bunx create-hono
```

```txt [deno]
deno run -A npm:create-hono
```

:::

## Features

- **Ultrafast** 🚀 - The router `RegExpRouter` is really fast. Not using linear loops. Fast.
- **Lightweight** 🪶 - The `hono/tiny` preset is under 14kB. Hono has zero dependencies and uses only the Web Standard API.
- **Multi-runtime** 🌍 - Works on Cloudflare Workers, Fastly Compute, Deno, Bun, AWS Lambda, or Node.js. The same code runs on all platforms.
- **Batteries Included** 🔋 - Hono has built-in middleware, custom middleware, third-party middleware, and helpers. Batteries included.
- **Delightful DX** 😃 - Super clean APIs. First-class TypeScript support. Now, we've got "Types".

## Use-cases

Hono is a simple web application framework similar to Express, without a frontend.
But it runs on CDN Edges and allows you to construct larger applications when combined with middleware.
Here are some examples of use-cases.

- Building Web APIs
- Proxy of backend servers
- Front of CDN
- Edge application
- Base server for a library
- Full-stack application

## Who is using Hono?

| Project                                                            | Platform           | What for?                                                                               |
| ------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------- |
| [cdnjs](https://cdnjs.com)                                         | Cloudflare Workers | A free and open-source CDN service. _Hono is used for the api server_.                  |
| [Cloudflare D1](https://www.cloudflare.com/developer-platform/d1/) | Cloudflare Workers | Serverless SQL databases. _Hono is used for the internal api server_.                   |
| [Unkey](https://unkey.dev)                                         | Cloudflare Workers | An open-source API authentication and authorization. _Hono is used for the api server_. |
| [OpenStatus](https://openstatus.dev)                               | Bun                | An open-source website & API monitoring platform. _Hono is used for the api server_.    |
| [Deno Benchmarks](https://deno.com/benchmarks)                     | Deno               | A secure TypeScript runtime built on V8. _Hono is used for benchmarking_.               |
| [Deno Docs](https://docs.deno.com/)                                | Deno               | An official Deno documentation site. _Hono is used for the web server_.                 |

And the following.

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

Do you want to see more? See [Who is using Hono in production?](https://github.com/orgs/honojs/discussions/1510).

## Hono in 1 minute

A demonstration to create an application for Cloudflare Workers with Hono.

![Demo](/images/sc.gif)

## Ultrafast

**Hono is the fastest**, compared to other routers for Cloudflare Workers.

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
Fastest is Hono
✨  Done in 28.06s.
```

See [more benchmarks](/concepts/benchmarks).

## Lightweight

**Hono is so small**. With the `hono/tiny` preset, its size is **under 14KB** when minified. There are many middleware and adapters, but they are bundled only when used. For context, the size of Express is 572KB.

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

**LinearRouter** registers the routes very quickly, so it's suitable for an environment that initializes applications every time. **PatternRouter** simply adds and matches the pattern, making it small.

See [more information about routes](/concepts/routers).

## Web Standard

Thanks to the use of the **Web Standard API**, Hono works on a lot of platforms.

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Deno
- Bun
- Vercel
- AWS Lambda
- Lambda@Edge
- Others

And by using [a Node.js adaptor](https://github.com/honojs/node-server), Hono works on Node.js.

See [more information about Web Standard](/concepts/web-standard).

## Middleware & Helpers

**Hono has many middleware and helpers**. These makes "Write Less, do more" a reality.

Out of the box, Hono provides middleware and helpers for:

- [Basic Authentication](/middleware/builtin/basic-auth)
- [Bearer Authentication](/middleware/builtin/bearer-auth)
- [Body Limit](/middleware/builtin/body-limit)
- [Cache](/middleware/builtin/cache)
- [Compress](/middleware/builtin/compress)
- [Cookie](/helpers/cookie)
- [CORS](/middleware/builtin/cors)
- [ETag](/middleware/builtin/etag)
- [html](/helpers/html)
- [JSX](/guides/jsx)
- [JWT Authentication](/middleware/builtin/jwt)
- [Logger](/middleware/builtin/logger)
- [Pretty JSON](/middleware/builtin/pretty-json)
- [Secure Headers](/middleware/builtin/secure-headers)
- [SSG](/helpers/ssg)
- [Streaming](/helpers/streaming)
- [GraphQL Server](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Firebase Authentication](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)
- Others!

For example, adding ETag and request logging only takes a few lines of code with Hono:

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use(etag(), logger())
```

See [more information about Middleware](/concepts/middleware).

## Developer Experience

Hono provides a delightful "**Developer Experience**".

Easy access to Request/Response thanks to the `Context` object.
Moreover, Hono is written in TypeScript. Hono has "**Types**".

For example, the path parameters will be literal types.

![SS](/images/ss.png)

And, the Validator and Hono Client `hc` enable the RPC mode. In RPC mode,
you can use your favorite validator such as Zod and easily share server-side API specs with the client and build type-safe applications.

See [Hono Stacks](/concepts/stacks).
