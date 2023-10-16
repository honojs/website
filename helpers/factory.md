# Factory Helper

The Factory Helper provides useful functions for creating Hono's components such as Middleware. Sometimes it's difficult to set the proper TypeScript types, but this helper facilitates that.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { createMiddleware } from 'https://deno.land/x/hono/helper.ts'
```

:::

## createMiddleware

This function will create your custom middleware.

```ts
const messageMiddleware = createMiddleware(async (c, next) => {
  await next()
  c.res.headers.set('X-Message', 'Good morning!')
})
```

Tip: If you want to get an argument like `message`, you can create it as a function like the following.

```ts
const messageMiddleware = (message: string) => {
  return createMiddleware(async (c, next) => {
    await next()
    c.res.headers.set('X-Message', message)
  })
}

app.use('*', messageMiddleware('Good evening!'))
```
