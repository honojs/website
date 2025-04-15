---
title: WebSocket 工具类
description: WebSocket 工具类是一个用于 Hono 应用程序中服务端 WebSocket 的工具。
---

# WebSocket 工具类

WebSocket 工具类是一个用于 Hono 应用程序中服务端 WebSocket 的工具。
目前支持 Cloudflare Workers / Pages、Deno 和 Bun 适配器。

## 导入

::: code-group

```ts [Cloudflare Workers]
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'
```

```ts [Deno]
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/deno'
```

```ts [Bun]
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import type { ServerWebSocket } from 'bun'

const { upgradeWebSocket, websocket } =
  createBunWebSocket<ServerWebSocket>()

// ...

export default {
  fetch: app.fetch,
  websocket,
}
```

:::

如果你使用 Node.js，可以使用 [@hono/node-ws](https://github.com/honojs/middleware/tree/main/packages/node-ws)。

## `upgradeWebSocket()`

`upgradeWebSocket()` 返回一个用于处理 WebSocket 的处理器。

```ts
const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`来自客户端的消息: ${event.data}`)
        ws.send('来自服务器的问候！')
      },
      onClose: () => {
        console.log('连接已关闭')
      },
    }
  })
)
```

可用的事件：

- `onOpen` - 目前，Cloudflare Workers 不支持此事件
- `onMessage`
- `onClose`
- `onError`

::: warning

如果你在使用 WebSocket 工具类的路由上同时使用修改头部的中间件（例如应用 CORS），你可能会遇到无法修改不可变头部的错误。这是因为 `upgradeWebSocket()` 在内部也会修改头部。

因此，请注意在同时使用 WebSocket 工具类和中间件时要格外小心。

:::

## RPC 模式

使用 WebSocket 工具类定义的处理器支持 RPC 模式。

```ts
// server.ts
const wsApp = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    //...
  })
)

export type WebSocketApp = typeof wsApp

// client.ts
const client = hc<WebSocketApp>('http://localhost:8787')
const socket = client.ws.$ws() // 客户端的 WebSocket 对象
```

## 示例

以下是使用 WebSocket 工具类的示例。

### 服务端和客户端

```ts
// server.ts
import { Hono } from 'hono'
import { upgradeWebSocket } from 'hono/cloudflare-workers'

const app = new Hono().get(
  '/ws',
  upgradeWebSocket(() => {
    return {
      onMessage: (event) => {
        console.log(event.data)
      },
    }
  })
)

export default app
```

```ts
// client.ts
import { hc } from 'hono/client'
import type app from './server'

const client = hc<typeof app>('http://localhost:8787')
const ws = client.ws.$ws(0)

ws.addEventListener('open', () => {
  setInterval(() => {
    ws.send(new Date().toString())
  }, 1000)
})
```

### 使用 JSX 的 Bun 示例

```tsx
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'
import { html } from 'hono/html'

const { upgradeWebSocket, websocket } = createBunWebSocket()

const app = new Hono()

app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <meta charset='UTF-8' />
      </head>
      <body>
        <div id='now-time'></div>
        {html`
          <script>
            const ws = new WebSocket('ws://localhost:3000/ws')
            const $nowTime = document.getElementById('now-time')
            ws.onmessage = (event) => {
              $nowTime.textContent = event.data
            }
          </script>
        `}
      </body>
    </html>
  )
})

const ws = app.get(
  '/ws',
  upgradeWebSocket((c) => {
    let intervalId
    return {
      onOpen(_event, ws) {
        intervalId = setInterval(() => {
          ws.send(new Date().toString())
        }, 200)
      },
      onClose() {
        clearInterval(intervalId)
      },
    }
  })
)

export default {
  fetch: app.fetch,
  websocket,
}
```
