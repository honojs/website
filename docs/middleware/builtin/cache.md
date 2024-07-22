# Cache Middleware

The Cache middleware uses the Web Standards' [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache). It caches a given response according to the `Cache-Control` headers.

The Cache middleware currently supports Cloudflare Workers projects using custom domains and Deno projects using [Deno 1.26+](https://github.com/denoland/deno/releases/tag/v1.26.0).

Please be aware that the Cache API is not currently supported by Deno Deploy. The `caches` variable, which is part of the Cache API, may not be available in the Deno Deploy environment.

See [Usage](#usage) below for instructions on each platform.

## Import

```ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
```

## Usage

::: code-group

```ts [Cloudflare Workers]
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
  })
)
```

```ts [Deno]
// Must use `wait: true` for the Deno runtime
app.get(
  '*',
  cache({
    cacheName: 'my-app',
    cacheControl: 'max-age=3600',
    wait: true,
  })
)
```

:::

## Options

### <Badge type="danger" text="required" /> cacheName: `string` | `(c: Context) => string` | `Promise<string>`

The name of the cache. Can be used to store multiple caches with different identifiers.

### <Badge type="info" text="optional" /> wait: `boolean`

A boolean indicating if Hono should wait for the Promise of the `cache.put` function to resolve before continuing with the request. _Required to be true for the Deno environment_. The default is `false`.

### <Badge type="info" text="optional" /> cacheControl: `string`

A string of directives for the `Cache-Control` header. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) for more information. When this option is not provided, no `Cache-Control` header is added to requests.

### <Badge type="info" text="optional" /> vary: `string` | `string[]`

Sets the `Vary` header in the response. If the original response header already contains a `Vary` header, the values are merged, removing any duplicates. Setting this to `*` will result in an error. For more details on the Vary header and its implications for caching strategies, refer to the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary).

### <Badge type="info" text="optional" /> keyGenerator: `(c: Context) => string | Promise<string>`

Generates keys for every request in the `cacheName` store. This can be used to cache data based on request parameters or context parameters. The default is `c.req.url`.
