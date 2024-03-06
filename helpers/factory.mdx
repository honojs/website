---
title: Factory Helper
---

import { Badge } from "/app/components/Badge";

# Factory Helper

The Factory Helper provides useful functions for creating Hono's components such as Middleware. Sometimes it's difficult to set the proper TypeScript types, but this helper facilitates that.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { createFactory, createMiddleware } from 'hono/factory'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { createFactory, createMiddleware } from 'https://deno.land/x/hono/helper.ts'
```

:::

## `createFactory()`

`createFactory()` will create an instance of Factory class.

```ts
import { createFactory } from 'hono/factory'

const factory = createFactory()
```

You can pass your Env types as Generics:

```ts
type Env = {
  Variables: {
    foo: string
  }
}

const factory = createFactory<Env>()
```

## `createMiddleware()`

`createMiddleware()` is shortcut of `factory.createMiddleware()`.
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

app.use(messageMiddleware('Good evening!'))
```

## `factory.createHandlers()` <Badge style="vertical-align: middle;" type="warning" text="Experimental" />

This function helps to define handlers in a different place than `app.get('/')`.

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

const factory = createFactory()

const middleware = factory.createMiddleware(async (c, next) => {
  c.set('foo', 'bar')
  await next()
})

const handlers = factory.createHandlers(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})

app.get('/api', ...handlers)
```
