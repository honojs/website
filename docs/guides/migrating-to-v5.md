# Migrating to v5

Hono v5 keeps the core small and moves the rest around it. This page lists the breaking changes from v4 and how to update your code.

## Try the release candidate

```sh
npm install hono@next
```

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

## Non-Error throws go to `onError`

A non-Error value thrown from a handler or middleware, such as a string or a plain object, now goes to `onError` wrapped in an `Error`. The original value is available as `err.cause`, and a thrown string is also used as `err.message`. It no longer propagates out of `app.fetch()`.

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
