---
title: Streaming Helper
description: Streaming Helper提供了用于处理流式响应的方法。
---

# Streaming Helper

Streaming Helper提供了用于处理流式响应的方法。

## 导入

```ts
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'
```

## `stream()`

返回一个简单的流式响应，类型为 `Response` 对象。

```ts
app.get('/stream', (c) => {
  return stream(c, async (stream) => {
    // 编写中止时要执行的处理逻辑
    stream.onAbort(() => {
      console.log('已中止！')
    })
    // 写入 Uint8Array
    await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]))
    // 传输另一个可读流
    await stream.pipe(anotherReadableStream)
  })
})
```

## `streamText()`

返回一个流式响应，包含 `Content-Type:text/plain`、`Transfer-Encoding:chunked` 和 `X-Content-Type-Options:nosniff` 头部。

```ts
app.get('/streamText', (c) => {
  return streamText(c, async (stream) => {
    // 写入带换行符('\n')的文本
    await stream.writeln('Hello')
    // 等待 1 秒
    await stream.sleep(1000)
    // 写入不带换行符的文本
    await stream.write(`Hono!`)
  })
})
```

::: warning

如果你正在为 Cloudflare Workers 开发应用，流式处理在 Wrangler 上可能无法正常工作。这种情况下，请为 `Content-Encoding` 头部添加 `Identity`。

```ts
app.get('/streamText', (c) => {
  c.header('Content-Encoding', 'Identity')
  return streamText(c, async (stream) => {
    // ...
  })
})
```

:::

## `streamSSE()`

允许你无缝地流式传输服务器发送事件（SSE）。

```ts
const app = new Hono()
let id = 0

app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `现在是 ${new Date().toISOString()}`
      await stream.writeSSE({
        data: message,
        event: 'time-update',
        id: String(id++),
      })
      await stream.sleep(1000)
    }
  })
})
```

## 错误处理

流式处理助手的第三个参数是错误处理器。
这个参数是可选的，如果不指定，错误将作为控制台错误输出。

```ts
app.get('/stream', (c) => {
  return stream(
    c,
    async (stream) => {
      // 编写中止时要执行的处理逻辑
      stream.onAbort(() => {
        console.log('已中止！')
      })
      // 写入 Uint8Array
      await stream.write(
        new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])
      )
      // 传输另一个可读流
      await stream.pipe(anotherReadableStream)
    },
    (err, stream) => {
      stream.writeln('发生错误！')
      console.error(err)
    }
  )
})
```

在回调函数执行完成后，流将自动关闭。

::: warning

如果流式处理助手的回调函数抛出错误，Hono 的 `onError` 事件将不会被触发。

`onError` 是一个用于在响应发送前处理错误并覆写响应的钩子。然而，当回调函数执行时，流已经开始，因此无法覆写。

:::
