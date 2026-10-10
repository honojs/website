# Factory Helper

The Factory Helper provides functions for defining Hono's components, such as handlers and middleware, with the proper TypeScript types.

## Import

```ts
import { Hono } from 'hono'
import {
  createFactory,
  defineHandler,
  defineMiddleware,
} from 'hono/factory'
```

## `defineHandler()` <Badge style="vertical-align: middle;" type="warning" text="Experimental" />

`defineHandler()` defines a handler. The value returned from the handler is converted to a Response, so you can return a plain object or a string.

```ts
import { defineHandler } from 'hono/factory'

app.get(
  '/ping',
  defineHandler(() => ({ pong: true }))
)
```

The returned value is converted as follows:

| Returned value        | Response              |
| --------------------- | --------------------- |
| An object             | JSON, like `c.json()` |
| A string or JSX       | HTML, like `c.html()` |
| `null` or `undefined` | `204 No Content`      |
| A `Response`          | Returned as is        |

To set the status, call `c.status()` before returning. The status is not included in the types, so return `c.json()` when you want the status in the types for the [RPC](/docs/guides/rpc) client.

```ts
app.post(
  '/users',
  defineHandler((c) => {
    c.status(201)
    return { id: '1' }
  })
)
```

### Middleware

Pass middleware before the handler. The middleware runs first, and its `Env` flows into the handler, so `c.get()` is typed.

```ts
const auth = defineMiddleware<{ Variables: { user: User } }>(
  async (c, next) => {
    c.set('user', await getUser(c))
    await next()
  }
)

app.get(
  '/me',
  defineHandler(auth, (c) => c.get('user')) // `User`
)
```

### Validation

Pass an options object to validate the request before the handler runs. Each option is a [Standard Schema](https://standardschema.dev/), such as a Zod or Valibot schema, for one target of the request: `param`, `query`, `header`, `cookie`, `form`, or `json`. The validated values are passed to the handler as the second argument, and are also available through `c.req.valid()`.

```ts
import * as z from 'zod'

app.post(
  '/users/:id',
  defineHandler({
    param: z.object({ id: z.string() }),
    query: z.object({ page: z.coerce.number() }),
    json: z.object({ name: z.string() }),
  })((c, { param, query, json }) => {
    return { id: param.id, page: query.page, name: json.name }
  })
)
```

Add `response` to validate the returned value. The value is validated, transformed by the schema, and returned as JSON. With `response`, the handler can return only a value of the schema's input type or a non-JSON `Response` like `c.redirect()`.

```ts
app.get(
  '/users/:id',
  defineHandler({
    param: z.object({ id: z.string() }),
    response: z.object({ id: z.string(), name: z.string() }),
  })(async (c, { param }) => {
    return await findUser(param.id)
  })
)
```

When the request fails validation, the handler does not run and the response is `400 Bad Request` with the issues of every failed target. The input values are not included.

```json
{
  "error": "Validation failed",
  "issues": [
    {
      "slot": "json",
      "issues": [
        {
          "message": "Invalid input: expected string, received number",
          "path": "name"
        }
      ]
    }
  ]
}
```

When the returned value fails validation, the response is `500 Internal Server Error` with `{ "error": "Response validation failed" }` and without the issues.

Both are thrown as an [`HTTPException`](/docs/api/exception), so you can customize the response in `app.onError()`. The raw issues are in `c.error.cause.issues`.

```ts
app.onError((c) => {
  const err = c.error
  if (err instanceof HTTPException && err.status === 400) {
    console.log(err.cause) // { issues: [{ slot: 'json', issues: [...] }] }
    return c.json({ message: 'Bad Request' }, 400)
  }
  return c.text('Internal Server Error', 500)
})
```

Instead of a schema, you can pass a function. It receives the value and the Context, and the value it returns is used as the validated value. If it returns a `Response`, that response is sent and the handler does not run.

```ts
app.get(
  '/search',
  defineHandler({
    query: (value, c) => {
      const q = value.q
      if (typeof q !== 'string') {
        return c.text('q is required', 400)
      }
      return { q }
    },
  })((c, { query }) => ({ results: search(query.q) }))
)
```

Middleware can be passed before the handler here too. It runs before the validation.

```ts
app.post(
  '/users',
  defineHandler({ json: UserSchema })(auth, (c, { json }) => {
    return createUser(c.get('user'), json)
  })
)
```

The validated input and the response are inferred by the [RPC](/docs/guides/rpc) client. With `response`, the response type is the schema's output, without the failure responses.

```ts
const client = hc<typeof app>('http://localhost')

const res = await client.users[':id'].$post({
  param: { id: '1' },
  json: { name: 'Hono' },
})
const user = await res.json() // { id: string; name: string }
```

### Typing the Context

Without middleware, pass the `Env` and the path as type arguments.

```ts
type Env = {
  Variables: {
    user: User
  }
}

app.get(
  '/users/:id',
  defineHandler<Env, '/users/:id'>((c) => {
    c.get('user') // `User`
    c.req.param('id') // `string`
    return c.get('user')
  })
)
```

To set the `Env` only once, use [`factory.defineHandler()`](#factory-definehandler).

## `defineMiddleware()`

`defineMiddleware()` defines a middleware with the types.

```ts
import { defineMiddleware } from 'hono/factory'

const messageMiddleware = defineMiddleware(async (c, next) => {
  await next()
  c.res.headers.set('X-Message', 'Good morning!')
})
```

Tip: If you want to get an argument like `message`, you can create it as a function like the following.

```ts
const messageMiddleware = (message: string) => {
  return defineMiddleware(async (c, next) => {
    await next()
    c.res.headers.set('X-Message', message)
  })
}

app.use(messageMiddleware('Good evening!'))
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

### Options

### <Badge type="info" text="optional" /> defaultAppOptions: `HonoOptions`

The default options to pass to the Hono application created by `createApp()`.

```ts
const factory = createFactory({
  defaultAppOptions: { strict: false },
})

const app = factory.createApp() // `strict: false` is applied
```

## `factory.defineHandler()`

`factory.defineHandler()` is `defineHandler()` with the `Env` of the factory. Everything in [`defineHandler()`](#definehandler) applies.

```ts
const factory = createFactory<Env>()

const getUser = factory.defineHandler((c) => {
  return c.get('foo') // `string`
})

app.get('/users/:id', getUser)
```

## `factory.defineMiddleware()`

`factory.defineMiddleware()` is `defineMiddleware()` with the `Env` of the factory.

```ts
const factory = createFactory<Env>()

const middleware = factory.defineMiddleware(async (c, next) => {
  c.set('foo', 'bar')
  await next()
})
```

## `factory.createApp()`

`createApp()` helps to create an instance of Hono with the proper types. If you use this method with `createFactory()`, you can avoid redundancy in the definition of the `Env` type.

If your application is like this, you have to set the `Env` in two places:

```ts
import { defineMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    myVar: string
  }
}

// 1. Set the `Env` to `new Hono()`
const app = new Hono<Env>()

// 2. Set the `Env` to `defineMiddleware()`
const mw = defineMiddleware<Env>(async (c, next) => {
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

// factory also has `defineMiddleware()`
const mw = factory.defineMiddleware(async (c, next) => {
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

## `createMiddleware()`

**`createMiddleware()` is deprecated**. Use [`defineMiddleware()`](#definemiddleware) instead. It is the same function with a new name, and `factory.createMiddleware()` is `factory.defineMiddleware()`.

```ts
// Before
const mw = createMiddleware(async (c, next) => {
  await next()
})

// After
const mw = defineMiddleware(async (c, next) => {
  await next()
})
```

## `factory.createHandlers()`

**`factory.createHandlers()` is deprecated**. Use [`defineHandler()`](#definehandler) instead, and pass the middleware before the handler.

```ts
// Before
const handlers = factory.createHandlers(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})
app.get('/api', ...handlers)

// After
const handler = factory.defineHandler(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})
app.get('/api', handler)
```
