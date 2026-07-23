# Routing

Routing of Hono is flexible and intuitive.
Let's take a look.

## Basic

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// HTTP Methods
app.get('/', (c) => c.text('GET /'))
app.post('/', (c) => c.text('POST /'))
app.put('/', (c) => c.text('PUT /'))
app.delete('/', (c) => c.text('DELETE /'))

// Wildcard
app.get('/wild/*/card', (c) => {
  return c.text('GET /wild/*/card')
})

// Any HTTP methods
app.all('/hello', (c) => c.text('Any Method /hello'))

// Custom HTTP method
app.on('PURGE', '/cache', (c) => c.text('PURGE Method /cache'))

// Multiple Method
app.on(['PUT', 'DELETE'], '/post', (c) =>
  c.text('PUT or DELETE /post')
)

// Multiple Paths
app.on('GET', ['/hello', '/ja/hello', '/en/hello'], (c) =>
  c.text('Hello')
)
```

## Path Parameter

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/user/:name', async (c) => {
  const name = c.req.param('name')
  //       ^?
  // ...
})
```

or all parameters at once:

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/posts/:id/comment/:comment_id', async (c) => {
  const { id, comment_id } = c.req.param()
  //       ^?
  // ...
})
```

## Routing Priority

Understanding how Hono matches routes is crucial, especially when dealing with overlapping paths like static segments and parameters. **Handlers and middleware are matched in the order they are registered.** The first route definition that matches the incoming request path will be used, and the process stops there (unless `next()` is called in middleware).

This means the order of your route definitions matters significantly. Specific static routes should usually be defined *before* more general parameterized routes that could potentially match the same path.

Consider this example:

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Static route defined first
app.get('/book/a', (c) => c.text('a')) // Specific 'a' route
// Parameterized route defined second
app.get('/book/:slug', (c) => c.text('common')) // General ':slug' route
```

```
GET /book/a ---> `a` (Matches the first, specific route)
GET /book/b ---> `common` (Matches the second, parameterized route)
```

If the order were reversed:

```ts twoslash
import { Hono } from 'hono' // Corrected typo: Hono() -> Hono
const app = new Hono()
// ---cut---
// Parameterized route defined first
app.get('/book/:slug', (c) => c.text('common')) // General ':slug' route
// Static route defined second
app.get('/book/a', (c) => c.text('a')) // Specific 'a' route
```

```
GET /book/a ---> `common` (Matches the first route '/book/:slug', the second route is never reached)
GET /book/b ---> `common` (Matches the first route '/book/:slug')
```

Similarly, wildcard routes capture everything if placed too early:

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Wildcard defined first
app.get('*', (c) => c.text('common')) // Catches everything
// Specific route defined second
app.get('/foo', (c) => c.text('foo')) // This route will never be reached
```

```
GET /foo ---> `common`
```

**Middleware and Fallbacks:**

*   If you have middleware that should run for specific routes or all routes below it, register it *before* those routes:

```ts twoslash
import { Hono } from 'hono'
import { logger } from 'hono/logger'
const app = new Hono()
// ---cut---
app.use(logger()) // Logger runs for all subsequent routes
app.get('/foo', (c) => c.text('foo'))
```

*   If you want to define a "_fallback_" handler for requests that don't match any specific routes above it, register it *last* (often using a wildcard):

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/bar', (c) => c.text('bar')) // Specific 'bar' route
app.get('*', (c) => c.text('fallback')) // Fallback for anything else
```

```
GET /bar ---> `bar`
GET /foo ---> `fallback`
```

## Optional Parameter

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Will match `/api/animal` and `/api/animal/:type`
app.get('/api/animal/:type?', (c) => c.text('Animal!'))
```

## Regexp

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/post/:date{[0-9]+}/:title{[a-z]+}', async (c) => {
  const { date, title } = c.req.param()
  //       ^?
  // ...
})
```

## Including slashes

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/posts/:filename{.+\\.png}', async (c) => {
  //...
})
```

## Chained route

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app
  .get('/endpoint', (c) => {
    return c.text('GET /endpoint')
  })
  .post((c) => {
    return c.text('POST /endpoint')
  })
  .delete((c) => {
    return c.text('DELETE /endpoint')
  })
```

## Grouping

You can group the routes with the Hono instance and add them to the main app with the route method.

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const book = new Hono()

book.get('/', (c) => c.text('List Books')) // GET /book
book.get('/:id', (c) => {
  // GET /book/:id
  const id = c.req.param('id')
  return c.text('Get Book: ' + id)
})
book.post('/', (c) => c.text('Create Book')) // POST /book

const app = new Hono()
app.route('/book', book)
```

## Grouping without changing base

You can also group multiple instances while keeping base.

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const book = new Hono()
book.get('/book', (c) => c.text('List Books')) // GET /book
book.post('/book', (c) => c.text('Create Book')) // POST /book

const user = new Hono().basePath('/user')
user.get('/', (c) => c.text('List Users')) // GET /user
user.post('/', (c) => c.text('Create User')) // POST /user

const app = new Hono()
app.route('/', book) // Handle /book
app.route('/', user) // Handle /user
```

## Base path

You can specify the base path.

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const api = new Hono().basePath('/api')
api.get('/book', (c) => c.text('List Books')) // GET /api/book
```

## Routing with hostname

It works fine if it includes a hostname.

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const app = new Hono({
  getPath: (req) => req.url.replace(/^https?:\/([^?]+).*$/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))
app.get('/www2.example.com/hello', (c) => c.text('hello www2'))
```

## Routing with `host` Header value

Hono can handle the `host` header value if you set the `getPath()` function in the Hono constructor.

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const app = new Hono({
  getPath: (req) =>
    '/' +
    req.headers.get('host') +
    req.url.replace(/^https?:\/\/[^/]+(\/[^?]*).*/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))

// A following request will match the route:
// new Request('http://www1.example.com/hello', {
//  headers: { host: 'www1.example.com' },
// })
```

By applying this, for example, you can change the routing by `User-Agent` header.

## Grouping ordering

Note that the mistake of grouping routings is hard to notice.
The `route()` function takes the stored routing from the second argument (such as `three` or `two`) and adds it to its own (`two` or `app`) routing.

```ts
three.get('/hi', (c) => c.text('hi'))
two.route('/three', three)
app.route('/two', two)

export default app
```

It will return 200 response.

```
GET /two/three/hi ---> `hi`
```

However, if they are in the wrong order, it will return a 404.

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
const two = new Hono()
const three = new Hono()
// ---cut---
three.get('/hi', (c) => c.text('hi'))
app.route('/two', two) // `two` does not have routes yet when it's added to `app`
two.route('/three', three) // Routes are added to `two` *after* `two` was already processed by `app.route`

export default app
```

```
GET /two/three/hi ---> 404 Not Found
```

This happens because when `app.route('/two', two)` is called, the routes from `two` (which are none at that moment) are copied into `app`'s routing table under the `/two` prefix. Later, when `two.route('/three', three)` is called, it modifies the `two` instance, but `app`'s routing table is not updated retroactively. Ensure parent routes are defined *after* their children have been fully configured.
```
