# Best Practices

Hono is very flexible. You can write your app as you like.
However, there are best practices that are better to follow.

## Define handlers with `defineHandler()`

A handler written as a plain function loses the types. The path parameter cannot be inferred, and the `Env` is unknown.

```ts
// 🙁
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // Can't infer the path param
  return c.json(`get ${id}`)
}

app.get('/books/:id', bookPermalink)
```

Define it with [`defineHandler()`](/docs/helpers/factory#definehandler) from `hono/factory` instead. Pass the `Env` and the path as type arguments, and the handler is typed wherever you write it. The returned value is converted to a Response, so you can return a plain object.

```ts
import { defineHandler } from 'hono/factory'

// 😃
const bookPermalink = defineHandler<Env, '/books/:id'>((c) => {
  const id = c.req.param('id') // Can infer the path param
  return { id }
})

app.get('/books/:id', bookPermalink)
```

Writing the handler inline is fine too. The path is inferred from `app.get()`, and the return value is still converted.

```ts
// 😃
app.get(
  '/books/:id',
  defineHandler((c) => {
    const id = c.req.param('id')
    return { id }
  })
)
```

## Validate in `defineHandler()`

Put the validation in `defineHandler()` instead of a validator middleware. Pass a [Standard Schema](https://standardschema.dev/), such as a Zod schema, for each target of the request. The validated values come as the second argument with the types, and the request is rejected with `400 Bad Request` before the handler runs.

```ts
import * as z from 'zod'

// 😃
const createBook = defineHandler({
  json: z.object({ title: z.string(), author: z.string() }),
})(async (c, { json }) => {
  const book = await db.books.create(json) // `{ title: string; author: string }`
  c.status(201)
  return book
})

app.post('/books', createBook)
```

With `param`, the path parameter is typed without the path type argument.

```ts
// 😃
const bookPermalink = defineHandler({
  param: z.object({ id: z.string() }),
})(async (c, { param }) => {
  return await db.books.find(param.id)
})

app.get('/books/:id', bookPermalink)
```

Add `response` when the shape of the response matters, for example when it is a public API. The returned value is validated, and extra fields are stripped by the schema.

```ts
const BookSchema = z.object({ id: z.string(), title: z.string() })

// 😃
const bookPermalink = defineHandler({
  param: z.object({ id: z.string() }),
  response: BookSchema,
})(async (c, { param }) => {
  return await db.books.find(param.id) // Only `id` and `title` are sent
})
```

## Put middleware next to the handler

Middleware that belongs to one handler, such as authentication, goes before the handler in `defineHandler()`. The `Env` of the middleware flows into the handler, so `c.get()` is typed. Middleware for many routes still goes in `app.use()`.

```ts
import { defineHandler, defineMiddleware } from 'hono/factory'

const auth = defineMiddleware<{ Variables: { user: User } }>(
  async (c, next) => {
    c.set('user', await getUser(c))
    await next()
  }
)

// 😃
const createBook = defineHandler({
  json: z.object({ title: z.string() }),
})(auth, async (c, { json }) => {
  return await db.books.create({ ...json, owner: c.get('user').id })
})

app.post('/books', createBook)
```

## Building a larger application

Use `app.route()` to build a larger application. Each resource gets its own file with a Hono instance and its handlers.

If your application has `/authors` and `/books` endpoints and you wish to separate files from `index.ts`, create `authors.ts` and `books.ts`.

```ts
// authors.ts
import { Hono } from 'hono'
import { defineHandler } from 'hono/factory'
import * as z from 'zod'

const app = new Hono()

app.get(
  '/',
  defineHandler(async () => await db.authors.list())
)
app.post(
  '/',
  defineHandler({ json: z.object({ name: z.string() }) })(
    async (c, { json }) => {
      c.status(201)
      return await db.authors.create(json)
    }
  )
)
app.get(
  '/:id',
  defineHandler({ param: z.object({ id: z.string() }) })(
    async (c, { param }) => await db.authors.find(param.id)
  )
)

export default app
```

```ts
// books.ts
import { Hono } from 'hono'
import { defineHandler } from 'hono/factory'
import * as z from 'zod'

const app = new Hono()

app.get(
  '/',
  defineHandler(async () => await db.books.list())
)
app.post(
  '/',
  defineHandler({ json: z.object({ title: z.string() }) })(
    async (c, { json }) => {
      c.status(201)
      return await db.books.create(json)
    }
  )
)
app.get(
  '/:id',
  defineHandler({ param: z.object({ id: z.string() }) })(
    async (c, { param }) => await db.books.find(param.id)
  )
)

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

When the handlers grow, move them out of the route file. A handler defined with `defineHandler()` keeps its types in any file.

```ts
// books/handlers.ts
export const listBooks = defineHandler(
  async () => await db.books.list()
)

export const createBook = defineHandler({
  json: z.object({ title: z.string() }),
})(async (c, { json }) => {
  c.status(201)
  return await db.books.create(json)
})
```

```ts
// books/index.ts
import { createBook, listBooks } from './handlers'

const app = new Hono()

app.get('/', listBooks)
app.post('/', createBook)

export default app
```

### If you want to use RPC features

The code above works well for normal use cases.
However, if you want to use the `RPC` feature, you can get the correct type by chaining as follows. `defineHandler()` gives the client the validated input and the returned value.

```ts
// authors.ts
import { Hono } from 'hono'
import { defineHandler } from 'hono/factory'
import * as z from 'zod'

const app = new Hono()
  .get(
    '/',
    defineHandler(async () => await db.authors.list())
  )
  .post(
    '/',
    defineHandler({ json: z.object({ name: z.string() }) })(
      async (c, { json }) => {
        c.status(201)
        return await db.authors.create(json)
      }
    )
  )
  .get(
    '/:id',
    defineHandler({ param: z.object({ id: z.string() }) })(
      async (c, { param }) => await db.authors.find(param.id)
    )
  )

export default app
export type AppType = typeof app
```

If you pass the type of the `app` to `hc`, it will get the correct type.

```ts
import type { AppType } from './authors'
import { hc } from 'hono/client'

// 😃
const client = hc<AppType>('http://localhost') // Typed correctly

const res = await client.index.$post({ json: { name: 'Yusuke' } })
const author = await res.json() // The type of `db.authors.create()`
```

For more detailed information, please see [the RPC page](/docs/guides/rpc#using-rpc-with-larger-applications).

## HEAD Request Best Practices

### Understanding Hono's HEAD Handling

Hono automatically handles HEAD requests by converting them to GET requests and stripping the response body. This behavior is built into the framework's dispatch layer and happens before route matching occurs.

### ✅ Do: Use GET Routes for HEAD Requests

```typescript
// GOOD: This GET route automatically handles HEAD requests
app.get(
  '/api/users',
  defineHandler(async (c) => {
    const users = await getUsers()
    c.header('X-Total-Count', users.length.toString())
    return users
  })
)

// HEAD /api/users will return:
// - Same headers as GET (including X-Total-Count)
// - Status 200
// - No body (null)
```

### ✅ Do: Use Middleware for HEAD-Specific Logic

```typescript
// GOOD: Use middleware when HEAD needs different behavior
app.use('/api/resource', async (c, next) => {
  await next()

  // Add HEAD-specific headers after the handler
  if (c.req.method === 'HEAD') {
    c.header('X-HEAD-Processed', 'true')
    // Don't compute expensive body content for HEAD
    c.res = new Response(null, c.res)
  }
})
```

### ❌ Don't: Try to Create Dedicated HEAD Handlers

```typescript
// BAD: This won't work as expected
app.head('/api/users', (c) => {
  // This handler will NEVER be called
  c.header('X-Custom', 'value')
  return c.text('ignored')
})

// BAD: Using on() also won't work
app.on('HEAD', '/api/users', (c) => {
  // Still converted to GET before route matching
})
```

### Performance Considerations

- **Avoid expensive operations in GET handlers if you expect many HEAD requests**: Use middleware to detect HEAD and skip body generation
- **Cache headers work identically**: HEAD responses respect the same caching rules as GET
- **Middleware compatibility**: Most middleware works with HEAD, but body-processing middleware (like compression) automatically skips HEAD requests

### Testing HEAD Requests

```typescript
// Always test both GET and HEAD responses
it('handles HEAD requests correctly', async () => {
  const getRes = await app.request('/api/users')
  const headRes = await app.request('/api/users', { method: 'HEAD' })

  expect(headRes.status).toBe(getRes.status)
  expect(headRes.headers.get('X-Total-Count')).toBe(
    getRes.headers.get('X-Total-Count')
  )
  expect(headRes.body).toBe(null)
})
```

### Notes

- The automatic HEAD conversion ensures consistent headers between GET and HEAD responses
- This behavior is consistent across all Hono runtimes (Cloudflare Workers, Deno, Bun, Node.js)
- If you need completely different logic for HEAD vs GET, consider using different endpoints rather than trying to override the framework's HEAD handling
