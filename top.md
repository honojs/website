---
title: Hono - エッジ向けの超高速Webフレームワーク
titleTemplate: ':title'
---

# Hono

Hono - _**\[炎\] 🔥**_ - は小さく、シンプルで超高速なエッジ向けWebフレームワークです。
あらゆるJavaScriptランタイムで動作します: Cloudflare Workers、 Fastly Compute、 Deno、 Bun、 Vercel、 Netlify、 AWS Lambda、 Lambda@Edge そして Node.js。

速いですが、それだけではありません。

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## クイックスタート

これを実行するだけです:

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

## 特徴

- **超高速** 🚀 - `RegExpRouter` は非常に高速なルーターです。 線形ループを使用しません。 速い!
- **Lightweight** 🪶 - `hono/tiny` プリセットは14kB未満です。 Hono は依存関係が無く Web Standard API のみを使用します。
- **マルチランタイム** 🌍 - Cloudflare Workers、 Fastly Compute、 Deno、 Bun、 AWS Lambda、 Node.js で動作します。 同じコードがすべてのプラットフォーム上で動作します。
- **バッテリー同梱** 🔋 - Hono にはビルドインミドルウェア、カスタムミドルウェア、サードパーティーミドルウェア及びヘルパーが含まれています。 バッテリー同梱!
- **楽しい DX** 😃 - 非常にクリーンな APIs。 最上級の TypeScript サポート。 Now, we've got "Types".

## 使用例

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

| Project                                        | Platform           | What for?                                                                                 |
| ---------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| [cdnjs API Server](https://cdnjs.com/api)      | Cloudflare Workers | A free and open-source CDN service. _Hono is used for their API services_.                |
| [Polyfill.io](https://www.polyfill.io/v3/)     | Fastly Compute     | A CDN service that provides necessary browser polyfills. _Hono is used as a core server_. |
| [Ultra](https://ultrajs.dev)                   | Deno               | A React/Deno framework. _Hono is used for the internal server_.                           |
| [Deno Benchmarks](https://deno.com/benchmarks) | Deno               | A secure TypeScript runtime built on V8. _Hono is used for benchmarking_.                 |
| [Cloudflare Blog](https://blog.cloudflare.com) | Cloudflare Workers | _Some applications featured in the articles use Hono_.                                    |

And the following.

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

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
