---
title: Context Storage 中间件
description: hono 内置的 Context Storage 中间件。
---

# Context Storage 中间件

Context Storage 中间件将 Hono 的 `Context` 存储在 `AsyncLocalStorage` 中，使其可以在全局范围内访问。

::: info
**注意** 此中间件使用 `AsyncLocalStorage`，运行时环境需要支持该特性。

**Cloudflare Workers**: 要启用 `AsyncLocalStorage`，需要在 `wrangler.toml` 文件中添加 [`nodejs_compat` 或 `nodejs_als` 标志](https://developers.cloudflare.com/workers/configuration/compatibility-dates/#nodejs-compatibility-flag)。
:::

## 导入

```ts
import { Hono } from 'hono'
import { contextStorage, getContext } from 'hono/context-storage'
```

## 使用方法

当应用 `contextStorage()` 作为中间件时，可以通过 `getContext()` 获取当前的 Context 对象。

```ts
type Env = {
  Variables: {
    message: string
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

app.use(async (c, next) => {
  c.set('message', '你好！')
  await next()
})

// 你可以在处理程序之外访问变量
const getMessage = () => {
  return getContext<Env>().var.message
}

app.get('/', (c) => {
  return c.text(getMessage())
})
```

在 Cloudflare Workers 中，你可以在处理程序之外访问绑定。

```ts
type Env = {
  Bindings: {
    KV: KVNamespace
  }
}

const app = new Hono<Env>()

app.use(contextStorage())

const setKV = (value: string) => {
  return getContext<Env>().env.KV.put('key', value)
}
```
