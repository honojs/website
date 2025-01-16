---
title: Context API
description: Context API 提供了处理请求和响应的方法，是 Hono 框架的核心组件之一。
---
# Context (上下文)

你可以使用 `Context` 对象来处理请求（Request）和响应（Response）。

## req

`req` 是 HonoRequest 的实例。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  // ...
  // ---cut-start---
  return c.text(`Hello, ${userAgent}`)
  // ---cut-end---
})
```

## body()

返回 HTTP 响应。

你可以通过 `c.header()` 设置响应头，通过 `c.status` 设置 HTTP 状态码。
这些设置也可以在 `c.text()`、`c.json()` 等方法中完成。

::: info
**注意**：当返回文本或 HTML 时，建议使用 `c.text()` 或 `c.html()`。
:::

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/welcome', (c) => {
  // 设置响应头
  c.header('X-Message', 'Hello!')
  c.header('Content-Type', 'text/plain')

  // 设置 HTTP 状态码
  c.status(201)

  // 返回响应体
  return c.body('Thank you for coming')
})
```

你也可以使用以下写法：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/welcome', (c) => {
  return c.body('Thank you for coming', 201, {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  })
})
```

这与以下响应是等效的：

```ts twoslash
new Response('Thank you for coming', {
  status: 201,
  headers: {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  },
})
```

## text()

以 `Content-Type:text/plain` 渲染文本。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

## json()

以 `Content-Type:application/json` 渲染 JSON。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

## html()

以 `Content-Type:text/html` 渲染 HTML。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

## notFound()

返回 `Not Found` 响应。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## redirect()

重定向，默认状态码为 `302`。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

## res

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Response 对象
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', 'Debug message')
})
```

## set() / get()

获取和设置任意键值对，生命周期仅限于当前请求。这允许在中间件之间或从中间件到路由处理程序传递特定值。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{ Variables: { message: string } }>()
// ---cut---
app.use(async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

将 `Variables` 作为泛型传递给 `Hono` 的构造函数以实现类型安全。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

`c.set` / `c.get` 的值仅在同一请求内保留。它们不能在不同请求之间共享或持久化。

## var

你也可以通过 `c.var` 访问变量值。

```ts twoslash
import type { Context } from 'hono'
declare const c: Context
// ---cut---
const result = c.var.client.oneMethod()
```

如果你想创建提供自定义方法的中间件，可以这样写：

```ts twoslash
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
// ---cut---
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}

const app = new Hono()

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

如果你想在多个处理程序中使用中间件，可以使用 `app.use()`。
这时，你需要将 `Env` 作为泛型传递给 `Hono` 的构造函数以实现类型安全。

```ts twoslash
import { Hono } from 'hono'
import type { MiddlewareHandler } from 'hono/types'
declare const echoMiddleware: MiddlewareHandler
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}
// ---cut---
const app = new Hono<Env>()

app.use(echoMiddleware)

app.get('/echo', (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

## render() / setRenderer()

你可以在自定义中间件中使用 `c.setRenderer()` 设置布局。

```tsx twoslash
/** @jsx jsx */
/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <html>
        <body>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})
```

然后，你可以在这个布局中使用 `c.render()` 创建响应。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  return c.render('Hello!')
})
```

输出将是：

```html
<html>
  <body>
    <p>Hello!</p>
  </body>
</html>
```

此外，这个功能还提供了自定义参数的灵活性。
为确保类型安全，可以定义类型如下：

```ts
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head: { title: string }
    ): Response | Promise<Response>
  }
}
```

以下是使用示例：

```ts
app.use('/pages/*', async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <title>{head.title}</title>
        </head>
        <body>
          <header>{head.title}</header>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})

app.get('/pages/my-favorite', (c) => {
  return c.render(<p>Ramen and Sushi</p>, {
    title: 'My favorite',
  })
})

app.get('/pages/my-hobbies', (c) => {
  return c.render(<p>Watching baseball</p>, {
    title: 'My hobbies',
  })
})
```

## executionCtx

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{
  Bindings: {
    KV: any
  }
}>()
declare const key: string
declare const data: string
// ---cut---
// ExecutionContext 对象
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(c.env.KV.put(key, data))
  // ...
})
```

## event

```ts twoslash
import { Hono } from 'hono'
declare const key: string
declare const data: string
type KVNamespace = any
// ---cut---
// 类型定义以实现类型推断
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// FetchEvent 对象（仅在使用 Service Worker 语法时设置）
app.get('/foo', async (c) => {
  c.event.waitUntil(c.env.MY_KV.put(key, data))
  // ...
})
```

## env

在 Cloudflare Workers 中，环境变量、密钥、KV 命名空间、D1 数据库、R2 存储桶等绑定到 worker 的资源统称为绑定（bindings）。
无论类型如何，绑定始终作为全局变量可用，可以通过上下文 `c.env.BINDING_KEY` 访问。

```ts twoslash
import { Hono } from 'hono'
type KVNamespace = any
// ---cut---
// 类型定义以实现类型推断
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Cloudflare Workers 的环境对象
app.get('/', async (c) => {
  c.env.MY_KV.get('my-key')
  // ...
})
```

## error

如果处理程序抛出错误，错误对象会被放置在 `c.error` 中。
你可以在中间件中访问它。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  await next()
  if (c.error) {
    // 执行某些操作...
  }
})
```

## ContextVariableMap

例如，如果你想在使用特定中间件时为变量添加类型定义，可以扩展 `ContextVariableMap`。示例：

```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}
```

然后你可以在中间件中使用它：

```ts twoslash
import { createMiddleware } from 'hono/factory'
// ---cut---
const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values') // result 是字符串类型
  await next()
})
```

在处理程序中，变量会被推断为正确的类型：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{ Variables: { result: string } }>()
// ---cut---
app.get('/', (c) => {
  const val = c.get('result') // val 是字符串类型
  // ...
  return c.json({ result: val })
})
```