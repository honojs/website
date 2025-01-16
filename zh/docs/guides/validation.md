---
title: 数据验证
description: 使用Hono数据验证功能，可以方便地验证请求数据。
---

# 数据验证

Hono 提供了一个轻量级的验证器。
虽然简单，但当与第三方验证器结合使用时可以发挥强大的功能。
此外，RPC 功能允许你通过类型系统与客户端共享 API 规范。

## 手动验证器

首先，让我们介绍一种不使用第三方验证器来验证输入值的方法。

从 `hono/validator` 导入 `validator`。

```ts
import { validator } from 'hono/validator'
```

要验证表单数据，需要指定 `form` 作为第一个参数，回调函数作为第二个参数。
在回调函数中，验证输入值并在最后返回验证后的值。
`validator` 可以用作中间件。

```ts
app.post(
  '/posts',
  validator('form', (value, c) => {
    const body = value['body']
    if (!body || typeof body !== 'string') {
      return c.text('Invalid!', 400)
    }
    return {
      body: body,
    }
  }),
  //...
```

在处理程序中，你可以通过 `c.req.valid('form')` 获取验证后的值。

```ts
, (c) => {
  const { body } = c.req.valid('form')
  // ... 执行其他操作
  return c.json(
    {
      message: 'Created!',
    },
    201
  )
}
```

除了 `form` 之外，验证目标还包括 `json`、`query`、`header`、`param` 和 `cookie`。

::: warning
当验证 `json` 时，请求**必须**包含 `Content-Type: application/json` 头部，
否则请求体将不会被解析，并且你会收到一个警告。

在使用 [`app.request()`](../api/request.md) 进行测试时，设置 `content-type` 头部很重要。

假设有这样一个应用：

```ts
const app = new Hono()
app.post(
  '/testing',
  validator('json', (value, c) => {
    // 直接传递验证器
    return value
  }),
  (c) => {
    const body = c.req.valid('json')
    return c.json(body)
  }
)
```

你的测试可以这样编写：

```ts
// ❌ 这样不会生效
const res = await app.request('/testing', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
})
const data = await res.json()
console.log(data) // undefined

// ✅ 这样才是正确的
const res = await app.request('/testing', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
  headers: new Headers({ 'Content-Type': 'application/json' }),
})
const data = await res.json()
console.log(data) // { key: 'value' }
```

:::

::: warning
当验证 `header` 时，你需要使用**小写**名称作为键。

如果你想验证 `Idempotency-Key` 头部，你需要使用 `idempotency-key` 作为键。

```ts
// ❌ 这样不会生效
app.post(
  '/api',
  validator('header', (value, c) => {
    // idempotencyKey 始终是 undefined
    // 所以这个中间件总是意外地返回 400
    const idempotencyKey = value['Idempotency-Key']

    if (idempotencyKey == undefined || idempotencyKey === '') {
      throw HTTPException(400, {
        message: 'Idempotency-Key is required',
      })
    }
    return { idempotencyKey }
  }),
  (c) => {
    const { idempotencyKey } = c.req.valid('header')
    // ...
  }
)

// ✅ 这样才是正确的
app.post(
  '/api',
  validator('header', (value, c) => {
    // 可以按预期获取头部值
    const idempotencyKey = value['idempotency-key']

    if (idempotencyKey == undefined || idempotencyKey === '') {
      throw HTTPException(400, {
        message: 'Idempotency-Key is required',
      })
    }
    return { idempotencyKey }
  }),
  (c) => {
    const { idempotencyKey } = c.req.valid('header')
    // ...
  }
)
```

:::

## 多重验证器

你也可以包含多个验证器来验证请求的不同部分：

```ts
app.post(
  '/posts/:id',
  validator('param', ...),
  validator('query', ...),
  validator('json', ...),
  (c) => {
    //...
  }
```

## 使用 Zod

你可以使用第三方验证器 [Zod](https://zod.dev)。
我们推荐使用第三方验证器。

从 Npm 仓库安装：

::: code-group

```sh [npm]
npm i zod
```

```sh [yarn]
yarn add zod
```

```sh [pnpm]
pnpm add zod
```

```sh [bun]
bun add zod
```

:::

从 `zod` 导入 `z`。

```ts
import { z } from 'zod'
```

编写你的模式：

```ts
const schema = z.object({
  body: z.string(),
})
```

你可以在回调函数中使用该模式进行验证，并返回验证后的值。

```ts
const route = app.post(
  '/posts',
  validator('form', (value, c) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }
    return parsed.data
  }),
  (c) => {
    const { body } = c.req.valid('form')
    // ... 执行其他操作
    return c.json(
      {
        message: 'Created!',
      },
      201
    )
  }
)
```

## Zod 验证器中间件

你可以使用 [Zod 验证器中间件](https://github.com/honojs/middleware/tree/main/packages/zod-validator) 来使验证更加简单。

::: code-group

```sh [npm]
npm i @hono/zod-validator
```

```sh [yarn]
yarn add @hono/zod-validator
```

```sh [pnpm]
pnpm add @hono/zod-validator
```

```sh [bun]
bun add @hono/zod-validator
```

:::

然后导入 `zValidator`：

```ts
import { zValidator } from '@hono/zod-validator'
```

接着可以这样使用：

```ts
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      body: z.string(),
    })
  ),
  (c) => {
    const validated = c.req.valid('form')
    // ... 使用你的验证后的数据
  }
)
```
