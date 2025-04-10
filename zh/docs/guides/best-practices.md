---
title: 最佳实践
description: 遵循最佳实践，编写高效、可维护的 Hono应用程序。
---
# 最佳实践

Hono 非常灵活，你可以按照自己喜欢的方式编写应用。
但是，有一些最佳实践值得遵循。

## 尽可能不要创建"控制器"

在可能的情况下，你不应该创建"Ruby on Rails 风格的控制器"。

```ts
// 🙁
// Rails 风格的控制器
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

这个问题与类型有关。例如，在不编写复杂泛型的情况下，无法在控制器中推断路径参数。

```ts
// 🙁
// Rails 风格的控制器
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // 无法推断路径参数
  return c.json(`get ${id}`)
}
```

因此，你不需要创建 Rails 风格的控制器，应该直接在路径定义后编写处理程序。

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // 可以推断路径参数
  return c.json(`get ${id}`)
})
```

## 使用 `hono/factory` 中的 `factory.createHandlers()`

如果你仍然想创建 Rails 风格的控制器，可以使用 [`hono/factory`](/docs/helpers/factory) 中的 `factory.createHandlers()`。使用这个方法，类型推断将正常工作。

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

如果你的应用有 `/authors` 和 `/books` 端点，并且你希望将文件从 `index.ts` 分离出来，可以创建 `authors.ts` 和 `books.ts`。

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

然后，导入它们并使用 `app.route()` 将它们挂载到 `/authors` 和 `/books` 路径上。

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

### 如果你想使用 RPC 功能

上述代码对于普通用例来说运行良好。
但是，如果你想使用 `RPC` 功能，你可以通过以下方式链式调用来获得正确的类型。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

如果你将 `app` 的类型传递给 `hc`，它将获得正确的类型。

```ts
import app from './authors'
import { hc } from 'hono/client'

// 😃
const client = hc<typeof app>('http://localhost') // 类型正确
```

更详细的信息，请参阅 [RPC 页面](/docs/guides/rpc#using-rpc-with-larger-applications)。
