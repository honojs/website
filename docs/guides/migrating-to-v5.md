# Migrating to v5

Hono v5 keeps the core small and moves the rest around it. This page lists the breaking changes from v4 and how to update your code.

## ESM only

`hono` is published as ESM only. The CommonJS build is removed.

On Node.js, version 22.12 or later is required. `require('hono')` still works there, because Node.js 22.12 can `require()` ES modules.

## Runtime adapters are separate packages

The runtime adapters under `hono/<runtime>` are no longer bundled with `hono`. Install the corresponding package and import from it.

| Before                    | After                      |
| ------------------------- | -------------------------- |
| `hono/aws-lambda`         | `@hono/aws-lambda`         |
| `hono/bun`                | `@hono/bun`                |
| `hono/cloudflare-workers` | `@hono/cloudflare-workers` |
| `hono/deno`               | `@hono/deno`               |
| `hono/lambda-edge`        | `@hono/lambda-edge`        |
| `hono/netlify`            | `@hono/netlify`            |
| `hono/service-worker`     | `@hono/service-worker`     |
| `hono/vercel`             | `@hono/vercel`             |

```ts
// Before
import { serveStatic } from 'hono/bun'

// After
import { serveStatic } from '@hono/bun'
```

`hono/cloudflare-pages` is removed without a replacement. Cloudflare recommends Workers with static assets, so use `hono` on Workers instead.

`hono/adapter` (`env()` and `getRuntimeKey()`) stays in `hono`.

## `onError()` and `notFound()` register routable middleware

`onError()` now accepts middleware with the `(c, next)` signature instead of `(err, c)`. Read the error from `c.error`:

```ts
// From
app.onError((err, c) => {
  console.error(err)
  return c.text('Custom Error', 500)
})

// To
app.onError((c) => {
  console.error(c.error)
  return c.text('Custom Error', 500)
})
```

`notFound((c) => c.text('Not Found', 404))` keeps the same single-handler syntax. Both APIs also accept an optional path and multiple middleware:

```ts
app.notFound(
  '/api/*',
  async (c, next) => {
    c.header('x-not-found', 'api')
    await next()
  },
  (c) => c.text('API resource not found', 404)
)
```

The following routing rules apply to both APIs:

- Registrations compose rather than replacing the previous handler. Return a response to stop the chain, or call `next()` to delegate.
- Paths are independent of the request's HTTP method and relative to `basePath()`. Omitting the path registers `*` within the current base path.
- `route()` imports sub-app handlers, including `notFound()` handlers. More deeply nested sub-apps take priority; at the same depth, handlers run in registration order, not path specificity order.
- Scopes match the request path, regardless of which app registered the original route. Request parameters still come from the original route, not the fallback scope.

`notFound()` middleware runs for both unmatched requests and explicit `c.notFound()` calls. If the chain reaches its end without a finalized response, the built-in error or not-found handler is used. Errors thrown by `onError()` middleware are handled by the built-in error handler rather than escaping from `app.fetch()`.

## Non-Error throws go to `onError`

A non-Error value thrown from a handler or middleware, such as a string or a plain object, now goes to `onError` wrapped in an `Error`. The original value is available as `c.error.cause`, and a thrown string is also used as `c.error.message`. It no longer propagates out of `app.fetch()`.

## `getColorEnabledAsync()` is removed

`getColorEnabledAsync()` from `hono/utils/color` is removed. Use `getColorEnabled()` and pass the bindings on Cloudflare Workers. The `logger()` middleware does this by itself, so it needs no change.

```ts
// Before
const enabled = await getColorEnabledAsync()

// After
const enabled = getColorEnabled(c.env)
```

## `c.req.query()` may return `undefined` values

`c.req.query()` and `c.req.queries()` without a key now return `Record<string, string | undefined>` and `Record<string, string[] | undefined>`, since a key may be absent.

```ts
// Before
const { name } = c.req.query() // string

// After
const { name } = c.req.query() // string | undefined
```

## `c.req.json()` returns `unknown`

`c.req.json()` returns `Promise<unknown>` instead of `Promise<any>`. Pass the type explicitly, or use `c.req.valid()` with a validator.

```ts
// Before
const body = await c.req.json() // any

// After
const body = await c.req.json<{ name: string }>()
```

## `c.json()` throws for a value that is not JSON serializable

`c.json(undefined)` used to return an empty body. It now throws a `TypeError`, like `Response.json()`. The same applies to a function or a symbol.

## Wildcard matching is the same in every router

A `*` at the end of a segment is a wildcard in every router, and it may match nothing. A `*` in the middle of a segment, such as `/x*y`, is not a wildcard. A segment that is only `*` matches one non-empty segment.

| Route          | Path          | v5       |
| -------------- | ------------- | -------- |
| `/x*/y`        | `/x/y`        | Match    |
| `/x*/y`        | `/xz/y`       | Match    |
| `/x*/y`        | `/x/z/y`      | No match |
| `/x*y`         | `/xay`        | No match |
| `/wild/*/card` | `/wild//card` | No match |

TrieRouter and PatternRouter did not match `/x*/y` to `/xz/y` before. In RegExpRouter, `/x*/y` and `/x/*` can not be registered together and throw `UnsupportedPathError`, so SmartRouter falls back to TrieRouter.

## Removed deprecated features

### `app.mount()`

Use the [Mount Middleware](/docs/middleware/builtin/mount) instead.

```ts
import { mount } from 'hono/mount'

// Before
app.mount('/itty-router', ittyRouter.handle)

// After
app.all('/itty-router/*', mount(ittyRouter.handle))
```

### `app.fire()`

Use `fire()` from `@hono/service-worker` instead.

```ts
import { fire } from '@hono/service-worker'

// Before
app.fire()

// After
fire(app)
```

### `c.req.matchedRoutes` and `c.req.routePath`

Use `matchedRoutes()` and `routePath()` from `hono/route` instead.

```ts
import { routePath } from 'hono/route'

// Before
app.get('/posts/:id', (c) => c.text(c.req.routePath))

// After
app.get('/posts/:id', (c) => c.text(routePath(c)))
```

### SSG hook options

The `beforeRequestHook`, `afterResponseHook`, and `afterGenerateHook` options of `toSSG()` are removed. Pass them as a plugin via `plugins` instead. `defaultPlugin()`, which skips non-200 responses, is applied only when `plugins` is omitted, so add it explicitly if you need it.

```ts
import { defaultPlugin, toSSG } from 'hono/ssg'

// Before
toSSG(app, fs, { beforeRequestHook })

// After
toSSG(app, fs, { plugins: [{ beforeRequestHook }, defaultPlugin()] })
```

### Others

- Bearer Auth Middleware - `noAuthenticationHeaderMessage`, `invalidAuthenticationHeaderMessage`, and `invalidTokenMessage` are removed. Use `noAuthenticationHeader.message`, `invalidAuthenticationHeader.message`, and `invalidToken.message` instead.
- Serve Static Middleware - the `pathResolve` option is removed. It was no longer used.
- SSG Helper - `SSG_DISABLED_RESPONSE` is removed. Use `X_HONO_DISABLE_SSG_HEADER_KEY` instead.
- `timingSafeEqual()` in `hono/utils/buffer` only accepts strings. The `hashFunction` option of the Basic Auth and Bearer Auth middleware is typed as `(input: string) => string | null | Promise<string | null>` accordingly.
- `getQueryStrings()` in `hono/utils/url` is removed. Use the `URL` API instead.
- `UnOfficalStatusCode` in `hono/utils/http-status` is removed. Use `UnofficialStatusCode` instead.
