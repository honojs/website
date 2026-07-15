# Universal Cache Middleware

`@hono/universal-cache` is a third-party middleware package for response and function-level caching in Hono apps.

It supports:

- response caching with `cacheMiddleware()`
- request-scoped defaults with `cacheDefaults()`
- function result caching with `cacheFunction()`
- in-flight deduplication for response and function cache fills
- stale-while-revalidate for cached functions
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

Universal Cache uses bounded, TTL-aware in-memory storage by default (1,000 entries, 50 MiB total, 5 MiB per entry), with these defaults:

```ts
const baseDefaults = {
  base: 'cache',
  maxAge: 60,
  staleMaxAge: 0,
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
  swr: true,
}
```

Default key strategy:

- `cacheMiddleware()`: hash of the method, origin, path, and query; explicitly enabled non-`GET`/`HEAD` methods also include the request body
- middleware keys include configured `varies` headers
- requests containing `authorization` or `cookie` bypass caching unless the header is explicitly included in `varies` or a custom `getKey` is provided
- `cacheFunction()`: hash of serialized function arguments
- middleware name default: normalized request path (e.g. `/api/items` -> `api:items`)
- function name default: a process-local identity derived from `fn.name`
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
  })
)
```

### Override global defaults per route

```ts
app.get(
  '/api/slow/items',
  cacheMiddleware({
    maxAge: 300,
    staleMaxAge: 120,
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
    name: 'get-stats',
    maxAge: 60,
    getKey: (id) => id,
    swr: true,
  }
)
```

## Revalidation and Invalidation

Manual revalidation is disabled by default. Enable it with a private header name and authorize it with `shouldRevalidate`:

```ts
cacheMiddleware({
  revalidateHeader: 'x-my-cache-revalidate',
  shouldRevalidate: (c) =>
    c.req.header('x-cache-token') === process.env.CACHE_TOKEN,
})
```

A request containing `x-my-cache-revalidate: 1` refreshes the entry only when `shouldRevalidate` allows it. Do not expose an ungated revalidation header on public endpoints.
Use a dedicated gate header when possible. Credentialed requests still bypass a public cache key, including manual revalidation requests.

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
- `keepPreviousOn5xx`: keep previous entry when refresh fails in invalidation paths (default: `true`)

Middleware-only:

- `methods`: cacheable methods (default: `GET`, `HEAD`)
- `varies`: request headers to include in key
- `revalidateHeader`: private header used to request revalidation (default: disabled)
- `getKey`: custom request key builder
- `serialize` / `deserialize`: custom response cache format
- `validate`: validate cached response entries
- `shouldBypassCache`: skip cache for matching requests
- `shouldInvalidateCache`: invalidate entry before refresh
- `shouldRevalidate`: authorize manual revalidation requests

Function-only:

- `swr`: enable stale-while-revalidate (default: `true`)
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

- `createCacheStorage({ maxEntries?, maxSize?, maxEntrySize? })`
- `setCacheStorage()` / `getCacheStorage()`
- `setCacheDefaults()` / `getCacheDefaults()`

## Notes

- Cached route responses drop `set-cookie` and hop-by-hop headers.
- Cache hits include an `Age` header based on the stored age and resident time.
- Responses outside the 2xx range, HTTP 206 responses, and responses containing `set-cookie` are not cached.
- Responses with `cache-control: private`, `no-store`, or `no-cache`, streaming content types, or an unsafe `Vary` value are not cached.
- Range, conditional, and client no-cache requests bypass cache reads and writes.
- Every response `Vary` field must be listed in `varies`; otherwise the response is not cached.
- A custom middleware `getKey` replaces the complete default key and opts credentialed requests into caching. Include every relevant tenant, authorization, cookie, method, body, and variation value.
- Stale route entries refresh synchronously on every runtime and are served only as fallback when refresh throws or returns 5xx.
- The default response serializer stops after 3 MiB or one second without delaying response delivery. Custom serializers must set equivalent limits.
- Custom streaming response types should set `Cache-Control: no-store`.
- Cached function values should be serializable for your selected storage driver.
- Set an explicit, unique function `name` for persistent or distributed caching across processes.
- Custom storage drivers should bound operation latency.

## Links

- Source package:
  `https://github.com/honojs/middleware/tree/main/packages/universal-cache`
- Third-party middleware index:
  `/docs/middleware/third-party`
