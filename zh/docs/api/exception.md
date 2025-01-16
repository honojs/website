---
title: 异常处理
description: 异常处理是 Hono 框架中处理错误和异常的重要机制。
---
# 异常处理

当发生致命错误（如身份验证失败）时，必须抛出 HTTPException。

## 抛出 HTTPException

以下示例展示了如何在中间件中抛出 HTTPException。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
declare const authorized: boolean
// ---cut---
import { HTTPException } from 'hono/http-exception'

// ...

app.post('/auth', async (c, next) => {
  // 身份验证
  if (authorized === false) {
    throw new HTTPException(401, { message: '自定义错误信息' })
  }
  await next()
})
```

你可以指定要返回给用户的响应内容。

```ts twoslash
import { HTTPException } from 'hono/http-exception'

const errorResponse = new Response('未经授权', {
  status: 401,
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})

throw new HTTPException(401, { res: errorResponse })
```

## 处理 HTTPException

你可以通过 `app.onError` 来处理抛出的 HTTPException。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // 获取自定义响应
    return err.getResponse()
  }
  // ...
  // ---cut-start---
  return c.text('Error')
  // ---cut-end---
})
```

## `cause` 属性

可以使用 `cause` 选项来添加 [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) 数据。

```ts twoslash
import { Hono, Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
const app = new Hono()
declare const message: string
declare const authorize: (c: Context) => void
// ---cut---
app.post('/auth', async (c, next) => {
  try {
    authorize(c)
  } catch (e) {
    throw new HTTPException(401, { message, cause: e })
  }
  await next()
})
```
