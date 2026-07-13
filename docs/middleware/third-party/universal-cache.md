# Universal Cache Middleware

`@hono/universal-cache` is a third-party middleware package for response and function-level caching in Hono apps.

It supports:

- response caching with `cacheMiddleware()`
- request-scoped defaults with `cacheDefaults()`
- function result caching with `cacheFunction()`
- stale-while-revalidate (SWR)
- custom keying, serialization, and cache invalidation hooks

## Install

```txt
npm i @hono/universal-cache
```

## Import

```ts
import { Hono } from 'hono'
import {
  cacheDefaults,
  cacheFunction,
  cacheMiddleware,
} from '@hono/universal-cache'
```

## Default Behavior

Universal Cache uses an in-memory `unstorage` driver by default, with these defaults:

```ts
const baseDefaults = {
  base: 'cache',
  maxAge: 60,
  staleMaxAge: 0,
  swr: true,
  keepPreviousOn5xx: true,
}

const middlewareDefaults = {
  ...baseDefaults,
  group: 'hono/handlers',
  methods: ['GET', 'HEAD'],
  varies: [],
}

const functionDefaults = {
  ...baseDefaults,
  group: 'hono/functions',
}
```

Default key strategy:

- `cacheMiddleware()`: hash of the method, origin, path, and query; explicitly enabled non-`GET`/`HEAD` methods also include the request body
- middleware keys include configured `varies` headers and automatically vary by `authorization` and `cookie` when present
- `cacheFunction()`: hash of serialized function arguments
- middleware name default: normalized request path (e.g. `/api/items` -> `api:items`)
- function name default: `fn.name` (fallback: `_`)
- integrity default: auto-derived hash (middleware by cache namespace, function by function source)

## Usage

### Cache route responses

```ts
const app = new Hono()

app.get(
  '/api/items',
  cacheMiddleware({
    maxAge: 60,
    staleMaxAge: 30,
    swr: true,
  }),
  (c) => c.json({ items: ['a', 'b'] })
)
```

### Set global cache defaults

```ts
app.use(
  '*',
  cacheDefaults({
    maxAge: 60,
    staleMaxAge: 30,
    swr: true,
  })
)
```

### Use storage adapters (via unstorage)

```ts
import { createStorage } from 'unstorage'
import redisDriver from 'unstorage/drivers/redis'

app.use(
  '*',
  cacheDefaults({
    storage: createStorage({
      driver: redisDriver({ url: 'redis://localhost:6379' }),
    }),
    maxAge: 60,
    staleMaxAge: 30,
    swr: true,
  })
)
```

### Override global defaults per route

```ts
app.get(
  '/api/slow/items',
  cacheMiddleware({
    config: { maxAge: 300, staleMaxAge: 120 },
    varies: ['accept-language'],
  }),
  (c) => c.json({ ok: true })
)
```

### Cache function results

```ts
const getStats = cacheFunction(
  async (id: string) => {
    return { id, ts: Date.now() }
  },
  {
    maxAge: 60,
    getKey: (id) => id,
  }
)
```

## Revalidation and Invalidation

Manual revalidation is disabled by default. Enable it with a private header name and authorize it with `shouldRevalidate`:

```ts
cacheMiddleware({
  revalidateHeader: 'x-my-cache-revalidate',
  shouldRevalidate: (c) =>
    c.req.header('authorization') ===
    `Bearer ${process.env.CACHE_TOKEN}`,
})
```

A request containing `x-my-cache-revalidate: 1` refreshes the entry only when `shouldRevalidate` allows it. Do not expose an ungated revalidation header on public endpoints.

You can also use:

- `shouldBypassCache`
- `shouldInvalidateCache`
- `shouldRevalidate`

## Options Summary

Base options (`cacheMiddleware` + `cacheFunction`):

- `storage`: custom unstorage instance
- `base`: storage prefix (default: `cache`)
- `group`: storage group segment (default middleware: `hono/handlers`, function: `hono/functions`)
- `name`: cache entry name (default inferred from route/function name)
- `hash`: custom hash function for default keys/integrity
- `integrity`: manual integrity value for cache busting
- `maxAge`: max age in seconds (default: `60`)
- `staleMaxAge`: stale max age in seconds, `-1` means unlimited stale (default: `0`)
- `swr`: enable stale-while-revalidate (default: `true`)
- `keepPreviousOn5xx`: keep previous entry when refresh fails in invalidation paths (default: `true`)
- `revalidateHeader`: private header used to request revalidation (default: disabled)

Middleware-only:

- `config`: request-scoped defaults to apply before route options
- `methods`: cacheable methods (default: `GET`, `HEAD`)
- `varies`: request headers to include in key
- `getKey`: custom request key builder
- `serialize` / `deserialize`: custom response cache format
- `validate`: validate cached response entries
- `shouldBypassCache`: skip cache for matching requests
- `shouldInvalidateCache`: invalidate entry before refresh
- `shouldRevalidate`: authorize manual revalidation requests

Function-only:

- `getKey`: custom key builder from function args
- `serialize` / `deserialize`: custom function entry format
- `validate`: validate cached function entries
- `shouldBypassCache`: skip cache for matching calls
- `shouldInvalidateCache`: invalidate entry before refresh

## Key APIs

### `cacheMiddleware(options | maxAge)`

Caches route responses (default methods: `GET`, `HEAD`).

### `cacheDefaults(options)`

Sets request-scoped default options for cache middleware.

### `cacheFunction(fn, options | maxAge)`

Wraps a function with caching behavior.

### Storage/default helpers

- `createCacheStorage()`
- `setCacheStorage()` / `getCacheStorage()`
- `setCacheDefaults()` / `getCacheDefaults()`

## Notes

- Cached route responses drop `set-cookie` and hop-by-hop headers.
- Responses outside the 2xx range, HTTP 206 responses, and responses containing `set-cookie` are not cached.
- Responses with `cache-control: private`, `no-store`, or `no-cache`, or `Vary: *`, are not cached.
- A custom middleware `getKey` replaces the complete default key. Include every relevant tenant, authorization, cookie, method, body, and variation value.
- On `workerd`, stale route entries refresh synchronously instead of using background self-fetch.
- Cached function values should be serializable for your selected storage driver.

## Links

- Source package:
  `https://github.com/honojs/middleware/tree/main/packages/universal-cache`
- Third-party middleware index:
  `/docs/middleware/third-party`
