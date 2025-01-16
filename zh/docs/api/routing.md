---
title: 路由
description: Hono的路由系统灵活直观，支持多种路由方式。
---
# 路由

Hono 的路由系统灵活直观。
让我们来看看具体用法。

## 基础用法

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// HTTP 方法
app.get('/', (c) => c.text('GET /'))
app.post('/', (c) => c.text('POST /'))
app.put('/', (c) => c.text('PUT /'))
app.delete('/', (c) => c.text('DELETE /'))

// 通配符
app.get('/wild/*/card', (c) => {
  return c.text('GET /wild/*/card')
})

// 匹配任意 HTTP 方法
app.all('/hello', (c) => c.text('Any Method /hello'))

// 自定义 HTTP 方法
app.on('PURGE', '/cache', (c) => c.text('PURGE Method /cache'))

// 多个方法
app.on(['PUT', 'DELETE'], '/post', (c) =>
  c.text('PUT or DELETE /post')
)

// 多个路径
app.on('GET', ['/hello', '/ja/hello', '/en/hello'], (c) =>
  c.text('Hello')
)
```

## 路径参数

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

或者一次性获取所有参数：

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

## 可选参数

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// 将匹配 `/api/animal` 和 `/api/animal/:type`
app.get('/api/animal/:type?', (c) => c.text('Animal!'))
```

## 正则表达式

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

## 包含斜杠的路径

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/posts/:filename{.+\\.png}', async (c) => {
  //...
})
```

## 链式路由

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

## 路由分组

你可以使用 Hono 实例对路由进行分组，然后通过 route 方法将它们添加到主应用中。

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

## 不改变基础路径的分组

你也可以在保持基础路径的同时对多个实例进行分组。

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
app.route('/', book) // 处理 /book
app.route('/', user) // 处理 /user
```

## 基础路径

你可以指定基础路径。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const api = new Hono().basePath('/api')
api.get('/book', (c) => c.text('List Books')) // GET /api/book
```

## 带主机名的路由

如果包含主机名，路由也能正常工作。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const app = new Hono({
  getPath: (req) => req.url.replace(/^https?:\/([^?]+).*$/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))
app.get('/www2.example.com/hello', (c) => c.text('hello www2'))
```

## 使用 `host` 头部值的路由

如果在 Hono 构造函数中设置了 `getPath()` 函数，Hono 可以处理 `host` 头部值。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
const app = new Hono({
  getPath: (req) =>
    '/' +
    req.headers.get('host') +
    req.url.replace(/^https?:\/\/[^/]+(\/[^?]*)/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))

// 以下请求将匹配该路由：
// new Request('http://www1.example.com/hello', {
//  headers: { host: 'www1.example.com' },
// })
```

通过这种方式，你可以根据 `User-Agent` 头部来改变路由。

## 路由优先级

处理程序或中间件将按注册顺序执行。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/book/a', (c) => c.text('a')) // a
app.get('/book/:slug', (c) => c.text('common')) // common
```

```
GET /book/a ---> `a`
GET /book/b ---> `common`
```

当处理程序执行后，进程将停止。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('*', (c) => c.text('common')) // common
app.get('/foo', (c) => c.text('foo')) // foo
```

```
GET /foo ---> `common` // foo 将不会被执行
```

如果你想执行中间件，请将代码写在处理程序之前。

```ts twoslash
import { Hono } from 'hono'
import { logger } from 'hono/logger'
const app = new Hono()
// ---cut---
app.use(logger())
app.get('/foo', (c) => c.text('foo'))
```

如果你想要一个"后备"处理程序，请将代码写在其他处理程序之后。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/bar', (c) => c.text('bar')) // bar
app.get('*', (c) => c.text('fallback')) // fallback
```

```
GET /bar ---> `bar`
GET /foo ---> `fallback`
```

## 分组顺序

注意，路由分组的错误很难被发现。
`route()` 函数会从第二个参数（如 `three` 或 `two`）获取存储的路由，并将其添加到自己（`two` 或 `app`）的路由中。

```ts
three.get('/hi', (c) => c.text('hi'))
two.route('/three', three)
app.route('/two', two)

export default app
```

这将返回 200 响应。

```
GET /two/three/hi ---> `hi`
```

但是，如果顺序错误，将返回 404。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
const two = new Hono()
const three = new Hono()
// ---cut---
three.get('/hi', (c) => c.text('hi'))
app.route('/two', two) // `two` 没有路由
two.route('/three', three)

export default app
```

```
GET /two/three/hi ---> 404 Not Found
```