# Best Practices

Hono is very flexible. You can write your app as you like.
However, there are best practices that are better to follow.

## Don't make "Controllers" when possible

When possible, you should not create "Ruby on Rails-like Controllers".

```ts
// 🙁
// A RoR-like Controller
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

The issue is related to types. For example, the path parameter cannot be inferred in the Controller without writing complex generics.

```ts
// 🙁
// A RoR-like Controller
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // Can't infer the path param
  return c.json(`get ${id}`)
}
```

Therefore, you don't need to create RoR-like controllers and should write handlers directly after path definitions.

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // Can infer the path param
  return c.json(`get ${id}`)
})
```

## `factory.createHandlers()` in `hono/factory`

If you still want to create a RoR-like Controller, use `factory.createHandlers()` in [`hono/factory`](/docs/helpers/factory). If you use this, type inference will work correctly.

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

// 😃
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

## Building a larger application

Use `app.route()` to build a larger application without creating "Ruby on Rails-like Controllers".

If your application has `/authors` and `/books` endpoints and you wish to separate files from `index.ts`, create `authors.ts` and `books.ts`.

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list authors'))
app.post('/', (c) => c.json('create an author', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list books'))
app.post('/', (c) => c.json('create a book', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

Then, import them and mount on the paths `/authors` and `/books` with `app.route()`.

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

// 😃
app.route('/authors', authors)
app.route('/books', books)

export default app
```

### If you want to use RPC features

The code above works well for normal use cases.
However, if you want to use the `RPC` feature, you can get the correct type by chaining as follows.

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
export type AppType = typeof app
```

If you pass the type of the `app` to `hc`, it will get the correct type.

```ts
import type { AppType } from './authors'
import { hc } from 'hono/client'

// 😃
const client = hc<AppType>('http://localhost') // Typed correctly
```

For more detailed information, please see [the RPC page](/docs/guides/rpc#using-rpc-with-larger-applications).
