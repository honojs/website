---
title: Request
description: Request是 Hono 的请求对象，封装了 Web 标准的 Request 对象。
---
# HonoRequest

`HonoRequest` 是一个可以通过 `c.req` 获取的对象，它封装了 [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。

## param()

获取路径参数的值。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// 获取捕获的参数
app.get('/entry/:id', async (c) => {
  const id = c.req.param('id')
  //    ^?
  // ...
})

// 一次性获取所有参数
app.get('/entry/:id/comment/:commentId', async (c) => {
  const { id, commentId } = c.req.param()
  //      ^?
})
```

## query()

获取查询字符串参数。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// 查询参数
app.get('/search', async (c) => {
  const query = c.req.query('q')
  //     ^?
})

// 一次性获取所有参数
app.get('/search', async (c) => {
  const { q, limit, offset } = c.req.query()
  //      ^?
})
```

## queries()

获取多个查询字符串参数值，例如：`/search?tags=A&tags=B`

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/search', async (c) => {
  // tags 将是 string[] 类型
  const tags = c.req.queries('tags')
  //     ^?
  // ...
})
```

## header()

获取请求头的值。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent')
  //      ^?
  return c.text(`Your user agent is ${userAgent}`)
})
```

::: warning
当不带参数调用 `c.req.header()` 时，返回的记录中所有键名都是**小写**的。

如果你想获取大写名称的请求头值，
请使用 `c.req.header("X-Foo")`。

```ts
// ❌ 这样不行
const headerRecord = c.req.header()
const foo = headerRecord['X-Foo']

// ✅ 这样可以
const foo = c.req.header('X-Foo')
```

:::

## parseBody()

解析 `multipart/form-data` 或 `application/x-www-form-urlencoded` 类型的请求体

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.parseBody()
  // ...
})
```

`parseBody()` 支持以下行为。

**单个文件**

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody()
const data = body['foo']
//    ^?
```

`body['foo']` 的类型是 `(string | File)`。

如果上传了多个文件，将使用最后一个。

### 多个文件

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody()
body['foo[]']
```

`body['foo[]']` 始终是 `(string | File)[]` 类型。

必须使用 `[]` 后缀。

### 同名多文件

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody({ all: true })
body['foo']
```

`all` 选项默认是禁用的。

- 如果 `body['foo']` 是多个文件，它将被解析为 `(string | File)[]`。
- 如果 `body['foo']` 是单个文件，它将被解析为 `(string | File)`。

### 点号表示法

如果你将 `dot` 选项设置为 `true`，返回值将基于点号表示法进行结构化。

假设接收到以下数据：

```ts twoslash
const data = new FormData()
data.append('obj.key1', 'value1')
data.append('obj.key2', 'value2')
```

通过设置 `dot` 选项为 `true`，你可以获得结构化的值：

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody({ dot: true })
// body 的值为 `{ obj: { key1: 'value1', key2: 'value2' } }`
```

## json()

解析 `application/json` 类型的请求体

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.json()
  // ...
})
```

## text()

解析 `text/plain` 类型的请求体

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.text()
  // ...
})
```

## arrayBuffer()

将请求体解析为 `ArrayBuffer`

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.arrayBuffer()
  // ...
})
```

## blob()

将请求体解析为 `Blob`

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.blob()
  // ...
})
```

## formData()

将请求体解析为 `FormData`

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.formData()
  // ...
})
```

## valid()

获取经过验证的数据。

```ts
app.post('/posts', async (c) => {
  const { title, body } = c.req.valid('form')
  // ...
})
```

可用的验证目标如下：

- `form`
- `json`
- `query`
- `header`
- `cookie`
- `param`

使用示例请参见[验证章节](/docs/guides/validation)。

## routePath()

你可以在处理程序中获取注册的路径，如下所示：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/posts/:id', (c) => {
  return c.json({ path: c.req.routePath })
})
```

如果你访问 `/posts/123`，它将返回 `/posts/:id`：

```json
{ "path": "/posts/:id" }
```

## matchedRoutes()

它在处理程序中返回匹配的路由，这对调试很有用。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async function logger(c, next) {
  await next()
  c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
    const name =
      handler.name ||
      (handler.length < 2 ? '[handler]' : '[middleware]')
    console.log(
      method,
      ' ',
      path,
      ' '.repeat(Math.max(10 - path.length, 0)),
      name,
      i === c.req.routeIndex ? '<- respond from here' : ''
    )
  })
})
```

## path

请求的路径名。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/about/me', async (c) => {
  const pathname = c.req.path // `/about/me`
  // ...
})
```

## url

请求的 URL 字符串。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/about/me', async (c) => {
  const url = c.req.url // `http://localhost:8787/about/me`
  // ...
})
```

## method

请求的方法名。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/about/me', async (c) => {
  const method = c.req.method // `GET`
  // ...
})
```

## raw

原始的 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象。

```ts
// 用于 Cloudflare Workers
app.post('/', async (c) => {
  const metadata = c.req.raw.cf?.hostMetadata?
  // ...
})
```
