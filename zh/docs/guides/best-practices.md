---
title: 最佳实践
description: 遵循最佳实践，编写高效、可维护的 Hono应用程序。
---
# 最佳实践

Hono 框架非常灵活，你可以按照自己喜欢的方式编写应用。
不过，这里有一些值得遵循的最佳实践。

## 尽可能避免创建"控制器"

在可能的情况下，应该避免创建"Ruby on Rails 风格的控制器"。

```ts
// 🙁
// Rails 风格的控制器
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

这个问题与类型有关。例如，在不编写复杂泛型的情况下，控制器中无法推断路径参数的类型。

```ts
// 🙁
// Rails 风格的控制器
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // 无法推断路径参数
  return c.json(`get ${id}`)
}
```

因此，你不需要创建 Rails 风格的控制器，而应该直接在路径定义后编写处理函数。

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // 可以推断路径参数
  return c.json(`get ${id}`)
})
```

## 使用 `hono/factory` 中的 `factory.createHandlers()`

如果你仍然想要创建 Rails 风格的控制器，可以使用 [`hono/factory`](/docs/helpers/factory) 中的 `factory.createHandlers()`。使用这种方式，类型推断将正常工作。

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

## 构建大型应用

使用 `app.route()` 来构建大型应用，而不是创建"Ruby on Rails 风格的控制器"。

如果你的应用有 `/authors` 和 `/books` 端点，并且你想要将文件从 `index.ts` 中分离出来，可以创建 `authors.ts` 和 `books.ts`。

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

然后，导入这些模块并使用 `app.route()` 将它们挂载到 `/authors` 和 `/books` 路径上。

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

上述代码可以正常工作。但是，这样做会失去类型安全。
如果你想要使用 `RPC` 功能，更好的解决方案是像下面这样链式调用方法。

```ts
// authors.ts
import { Hono } from "hono";

const app = new Hono()
  .get("/", (c) => c.json("list authors"))
  .post("/", (c) => c.json("create an author", 201))
  .get("/:id", (c) => c.json(`get ${c.req.param("id")}`));

export default app;
```

这样，当你使用这个路由时，类型可以被正确推断。
