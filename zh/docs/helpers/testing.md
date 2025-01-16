---
title: Testing Helper
description: 此工具类提供了用于测试 Hono 应用程序的函数。
---

# Testing Helper

Testing Helper提供了一些函数，使 Hono 应用程序的测试变得更加简单。

## 导入

```ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
```

## `testClient()`

`testClient()` 函数接收一个 Hono 实例作为其第一个参数，并返回一个 [Hono 客户端](/docs/guides/rpc#client) 对象。通过使用它，你可以利用编辑器的自动完成功能来定义你的请求。

```ts
import { testClient } from 'hono/testing'

it('test', async () => {
  const app = new Hono().get('/search', (c) =>
    c.json({ hello: 'world' })
  )
  const res = await testClient(app).search.$get()

  expect(await res.json()).toEqual({ hello: 'world' })
})
```
