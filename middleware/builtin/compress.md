# Compress Middleware

This middleware compresses the response body, according to `Accept-Encoding` request header.

::: info
Note: On Cloudflare Workers and Lagon, the response body will be compressed automatically, so there is no need to use this middleware.
:::

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { compress } from 'hono/compress'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { compress } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

app.use('*', compress())
```

## Options

- `encoding`: `'gzip'` | `'deflate'`
  - The compression scheme to allow for response compression. Either `gzip` or `deflate`. If not defined, both are allowed and will be used based on the `Accept-Encoding` header. `gzip` is prioritized if this option is not provided and the client provides both in the `Accept-Encoding` header.
