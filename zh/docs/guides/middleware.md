---
title: 中间件
description: 中间件在处理程序（Handler）之前和之后执行，允许我们在请求处理前访问 Request 对象，或在响应处理后修改 Response 对象。
---

# 中间件

中间件在处理程序（Handler）之前和之后执行。我们可以在分发请求之前获取 `Request` 对象，或在分发之后操作 `Response` 对象。

## 中间件的定义

- 处理程序（Handler）- 必须返回 `Response` 对象。只有一个处理程序会被调用。
- 中间件（Middleware）- 不需要返回任何内容，通过 `await next()` 继续执行下一个中间件。

用户可以使用 `app.use` 或像处理程序一样使用 `app.HTTP_METHOD` 来注册中间件。通过这个特性，可以轻松指定路径和方法。

```ts
// 匹配任何方法和所有路由
app.use(logger())

// 指定路径
app.use('/posts/*', cors())

// 指定方法和路径
app.post('/posts/*', basicAuth())
```

如果处理程序返回 `Response`，该响应将被用于最终用户，并停止后续处理。

```ts
app.post('/posts', (c) => c.text('Created!', 201))
```

在这种情况下，四个中间件会按以下顺序在分发之前处理：

```ts
logger() -> cors() -> basicAuth() -> *handler*
```

## 执行顺序

中间件的执行顺序由其注册顺序决定。
首个注册的中间件中 `next` 之前的处理最先执行，
而 `next` 之后的处理最后执行。
请看下面的示例：

```ts
app.use(async (_, next) => {
  console.log('middleware 1 start')
  await next()
  console.log('middleware 1 end')
})
app.use(async (_, next) => {
  console.log('middleware 2 start')
  await next()
  console.log('middleware 2 end')
})
app.use(async (_, next) => {
  console.log('middleware 3 start')
  await next()
  console.log('middleware 3 end')
})

app.get('/', (c) => {
  console.log('handler')
  return c.text('Hello!')
})
```

执行结果如下：

```
middleware 1 start
  middleware 2 start
    middleware 3 start
      handler
    middleware 3 end
  middleware 2 end
middleware 1 end
```

## 内置中间件

Hono 提供了内置的中间件。

```ts
import { Hono } from 'hono'
import { poweredBy } from 'hono/powered-by'
import { logger } from 'hono/logger'
import { basicAuth } from 'hono/basic-auth'

const app = new Hono()

app.use(poweredBy())
app.use(logger())

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

::: warning
在 Deno 中，如果使用的中间件版本与 Hono 版本不同，可能会导致错误。
例如，以下代码由于版本不同而无法正常工作：

```ts
import { Hono } from 'jsr:@hono/hono@4.4.0'
import { upgradeWebSocket } from 'jsr:@hono/hono@4.4.5/deno'

const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket(() => ({
    // ...
  }))
)
```

:::

## 自定义中间件

你可以直接在 `app.use()` 中编写自己的中间件：

```ts
// 自定义日志中间件
app.use(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})

// 添加自定义响应头
app.use('/message/*', async (c, next) => {
  await next()
  c.header('x-message', 'This is middleware!')
})

app.get('/message/hello', (c) => c.text('Hello Middleware!'))
```

然而，直接在 `app.use()` 中嵌入中间件可能会限制其复用性。因此，我们可以将中间件分离到不同的文件中。

为了确保在分离中间件时不丢失 `context` 和 `next` 的类型定义，我们可以使用 Hono 的 factory 中的 [`createMiddleware()`](/docs/helpers/factory#createmiddleware)。这也允许我们安全地从下游处理程序[访问在 `Context` 中 `set` 的数据](https://hono.dev/docs/api/context#set-get)。

```ts
import { createMiddleware } from 'hono/factory'

const logger = createMiddleware(async (c, next) => {
  console.log(`[${c.req.method}] ${c.req.url}`)
  await next()
})
```

:::info
`createMiddleware` 可以使用类型泛型：

```ts
createMiddleware<{Bindings: Bindings}>(async (c, next) =>
```

:::

### 在 Next 之后修改响应

此外，中间件可以在必要时修改响应：

```ts
const stripRes = createMiddleware(async (c, next) => {
  await next()
  c.res = undefined
  c.res = new Response('New Response')
})
```

## 在中间件参数中访问上下文

要在中间件参数中访问上下文，直接使用 `app.use` 提供的上下文参数。请看下面的示例：

```ts
import { cors } from 'hono/cors'

app.use('*', async (c, next) => {
  const middleware = cors({
    origin: c.env.CORS_ORIGIN,
  })
  return middleware(c, next)
})
```

### 在中间件中扩展上下文

要在中间件中扩展上下文，使用 `c.set`。你可以通过向 `createMiddleware` 函数传递 `{ Variables: { yourVariable: YourVariableType } }` 泛型参数来使其类型安全。

```ts
import { createMiddleware } from 'hono/factory'

const echoMiddleware = createMiddleware<{
  Variables: {
    echo: (str: string) => string
  }
}>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

## 第三方中间件

内置中间件不依赖外部模块，但第三方中间件可以依赖第三方库。
因此，使用它们可以构建更复杂的应用。

我们可以探索各种[第三方中间件](https://hono.dev/docs/middleware/third-party)。
例如，我们有 GraphQL 服务器中间件、Sentry 中间件、Firebase Auth 中间件等。
