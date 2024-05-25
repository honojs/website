# Factory Helper

The Factory Helper provides useful functions for creating Hono's components such as Middleware. Sometimes it's difficult to set the proper TypeScript types, but this helper facilitates that.

## Import

```ts
import { Hono } from 'hono'
import { createFactory, createMiddleware } from 'hono/factory'
```

## `createFactory()`

`createFactory()` will create an instance of the Factory class.

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

## `factory.createHandlers()`

`createHandlers()` helps to define handlers in a different place than `app.get('/')`.

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

## `factory.createApp()` <Badge style="vertical-align: middle;" type="warning" text="Experimental" />

`createApp()` helps to create an instance of Hono with the proper types. If you use this method with `createFactory()`, you can avoid redundancy in the definition of the `Env` type.

If your application is like this, you have to set the `Env` in two places:

```ts
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    myVar: string
  }
}

// 1. Set the `Env` to `new Hono()`
const app = new Hono<Env>()

// 2. Set the `Env` to `createMiddleware()`
const mw = createMiddleware<Env>(async (c, next) => {
  await next()
})

app.use(mw)
```

By using `createFactory()` and `createApp()`, you can set the `Env` only in one place.

```ts
import { createFactory } from 'hono/factory'

// ...

// Set the `Env` to `createFactory()`
const factory = createFactory<Env>()

const app = factory.createApp()

// factory also has `createMiddleware()`
const mw = factory.createMiddleware(async (c, next) => {
  await next()
})
```

`createFactory()` can receive the `initApp` option to initialize an `app` created by `createApp()`. The following is an example that uses the option.

```ts
// factory-with-db.ts
type Env = {
  Bindings: {
    MY_DB: D1Database
  }
  Variables: {
    db: DrizzleD1Database
  }
}

export default createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = drizzle(c.env.MY_DB)
      c.set('db', db)
      await next()
    })
  },
})
```

```ts
// crud.ts
import factoryWithDB from './factory-with-db'

const app = factoryWithDB.createApp()

app.post('/posts', (c) => {
  c.var.db.insert()
  // ...
})
```
