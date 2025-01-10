# Compress Middleware

This middleware compresses the response body, according to `Accept-Encoding` request header.

::: info
**Note**: On Cloudflare Workers and Deno Deploy, the response body will be compressed automatically, so there is no need to use this middleware.

**Bun**: This middleware uses `CompressionStream` which is not yet supported in bun.
:::

## Import

```ts
import { Hono } from 'hono'
import { compress } from 'hono/compress'
```

## Usage

```ts
const app = new Hono()

app.use(compress())
```

## Options

### <Badge type="info" text="optional" /> encoding: `'gzip'` | `'deflate'`

The compression scheme to allow for response compression. Either `gzip` or `deflate`. If not defined, both are allowed and will be used based on the `Accept-Encoding` header. `gzip` is prioritized if this option is not provided and the client provides both in the `Accept-Encoding` header.

### <Badge type="info" text="optional" /> threshold: `number`

The minimum size in bytes to compress. Defaults to 1024 bytes.
