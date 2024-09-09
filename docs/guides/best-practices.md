# Best Practices

Hono is very flexible. You can write your app as you like. However, there are best practices that are better to follow.

## Use Controllers with Proper Type Inference

TypeScript can infer types correctly when using route parameters. Here’s an example of how you can define a controller and verify that type inference is working with a `number` type by using `typeof`:

```ts
interface RouteParams extends Env {
  Params: { id: number };
}

const bookHandler = (c: Context<RouteParams>) => {
  const id = Number(c.req.param('id')); // Ensure 'id' is converted to a number
  
  // Log the type of 'id' to demonstrate that type inference is working
  console.log('Type of id:', typeof id); // Should output 'number'
  
  return c.json(`Book ID: ${id}`);
};

// Route with controller function
app.get('/books/:id', bookHandler);
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

app.route('/authors', authors)
app.route('/books', books)

export default app
```
