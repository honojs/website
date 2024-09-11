# Context Storage Middleware

The Context Storage Middleware stores the Hono `Context` in the `AsyncLocalStorage`, to make it globally accessible.

::: info
**Note** This middleware uses `AsyncLocalStorage`. The runtime should support it.

**Cloudflare Workers**: To enable `AsyncLocalStorage`, add the [`nodejs_compat` or `nodejs_als` flag](https://developers.cloudflare.com/workers/configuration/compatibility-dates/#nodejs-compatibility-flag) to your `wrangler.toml` file.
:::

## Import

```ts
import { Hono } from 'hono'
import { contextStorage, getContext } from 'hono/context-storage'
```

## Usage

The `getContext()` will return the current Context object if the `contextStorage()` is applied as a middleware.

```ts
type Env = {
  Variables: {
    message: string
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

app.use(async (c, next) => {
  c.set('message', 'Hello!')
  await next()
})

// You can access the variable outside the handler.
const getMessage = () => {
  return getContext<Env>().var.message
}

app.get('/', (c) => {
  return c.text(getMessage())
})
```

On Cloudflare Workers, you can access the bindings outside the handler.

```ts
type Env = {
  Bindings: {
    KV: KVNamespace
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

const setKV = (value: string) => {
  return getContext<Env>().env.KV.put('key', value)
}
```
