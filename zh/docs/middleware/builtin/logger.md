---
title: 日志中间件
description: hono 内置的日志中间件，提供简单的日志记录功能。
---

# 日志中间件

这是一个简单的日志记录器。

## 导入

```ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
```

## 使用方法

```ts
const app = new Hono()

app.use(logger())
app.get('/', (c) => c.text('Hello Hono!'))
```

## 日志详情

日志中间件会记录每个请求的以下详细信息：

- **传入请求**：记录 HTTP 方法、请求路径和传入请求。
- **传出响应**：记录 HTTP 方法、请求路径、响应状态码以及请求/响应时间。
- **状态码着色**：响应状态码会以不同颜色显示，便于直观识别不同状态类别。不同状态码类别以不同颜色表示。
- **耗时统计**：请求/响应周期的耗时会以人类可读的格式记录，单位为毫秒（ms）或秒（s）。

通过使用日志中间件，你可以轻松监控 Hono 应用中的请求和响应流，快速发现任何问题或性能瓶颈。

你还可以通过提供自定义的 `PrintFunc` 函数来扩展中间件，实现定制化的日志记录行为。

## PrintFunc 打印函数

日志中间件接受一个可选的 `PrintFunc` 函数作为参数。通过这个函数，你可以自定义日志记录器并添加额外的日志信息。

## 选项

### <Badge type="info" text="可选" /> fn: `PrintFunc(str: string, ...rest: string[])`

- `str`：由日志记录器传入的字符串。
- `...rest`：要打印到控制台的其他字符串参数。

### 示例

为日志中间件设置自定义 `PrintFunc` 函数：

```ts
export const customLogger = (message: string, ...rest: string[]) => {
  console.log(message, ...rest)
}

app.use(logger(customLogger))
```

在路由中使用自定义日志记录器：

```ts
app.post('/blog', (c) => {
  // 路由逻辑

  customLogger('博客已保存:', `路径: ${blog.url},`, `ID: ${blog.id}`)
  // 输出
  // <-- POST /blog
  // 博客已保存: 路径: /blog/example, ID: 1
  // --> POST /blog 201 93ms

  // 返回上下文
})
```
