---
title: 测试工具类
description: 此工具类提供了用于测试 Hono 应用程序的函数。
---
# 测试工具类

测试工具类提供了一些函数，使 Hono 应用程序的测试变得更加简单。

## 导入

```ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
```

## `testClient()`

`testClient()` 函数接收一个 Hono 实例作为第一个参数，并返回一个根据你的 Hono 应用程序路由类型化的对象，类似于 [Hono 客户端](/docs/guides/rpc#client)。这允许你在测试中以类型安全的方式调用你定义的路由，并获得编辑器的自动完成功能。

**类型推断的重要说明：**

为了让 `testClient` 正确推断你的路由类型并提供自动完成功能，**你必须直接在 `Hono` 实例上使用链式方法定义路由**。

类型推断依赖于通过链式调用 `.get()`、`.post()` 等方法传递的类型。如果你在创建 Hono 实例后单独定义路由（比如在"Hello World"示例中常见的模式：`const app = new Hono(); app.get(...)`），`testClient` 将无法获得特定路由所需的类型信息，你也就无法获得类型安全的客户端功能。

**示例：**

这个示例可以正常工作，因为 `.get()` 方法直接链接在 `new Hono()` 调用上：

```ts
// index.ts
const app = new Hono().get('/search', (c) => {
  const query = c.req.query('q')
  return c.json({ query: query, results: ['结果1', '结果2'] })
})

export default app
```

```ts
// index.test.ts
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
import { describe, test, expect } from 'vitest' // 或你选择的测试运行器
import app from './app'

describe('搜索接口', () => {
  // 从应用实例创建测试客户端
  const client = testClient(app)

  it('应该返回搜索结果', async () => {
    // 使用类型安全的客户端调用接口
    // 注意查询参数的类型安全（如果在路由中定义）
    // 以及通过 .$get() 直接访问
    const res = await client.search.$get({
      query: { q: 'hono' },
    })

    // 断言
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      query: 'hono',
      results: ['结果1', '结果2'],
    })
  })
})
```
