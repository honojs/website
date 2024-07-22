# WebSocket Helper

WebSocket Helperは、HonoアプリケーションのサーバーサイドWebSocketのヘルパーです。
現在、Cloudflare Workers / Pages、Deno、およびBunアダプターが利用可能です。

## Import

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

const { upgradeWebSocket, websocket } = createBunWebSocket()

// ...

Bun.serve({
  fetch: app.fetch,
  websocket,
})
```

:::

Node.js なら: [@hono/node-ws](https://github.com/honojs/middleware/tree/main/packages/node-ws).

## `upgradeWebSocket()`

`upgradeWebSocket()` は WebSocket をハンドルするためのハンドラーを返します。

```ts
const app = new Hono()

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        console.log(`Message from client: ${event.data}`)
        ws.send('Hello from server!')
      },
      onClose: () => {
        console.log('Connection closed')
      },
    }
  })
)
```

使えるイベント一覧:

- `onOpen` - Cloudflare Workers では現在動きません
- `onMessage`
- `onClose`
- `onError`

::: warning

WebSocket Helper を使用するルートでヘッダーを変更するミドルウェア( CORS など)を使用している場合、イミュータブルなヘッドを変更できないというエラーが発生する可能性があります。これは、`upgradeWebSocket()`が内部的にヘッダーを変更するためです。
なので、WebSocketヘルパーとミドルウェアを同時に使用している場合は注意してください。

:::

## RPC-mode

WebSocketヘルパーで定義されたハンドラーは、RPCモードをサポートしています。

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
const socket = client.ws.$ws() // A WebSocket object for a client
```

## Examples

WebSocket を使った例:

### Server and Client

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

### Bun with JSX

```tsx
import { Hono } from 'hono'
import { createBunWebSocket } from 'hono/bun'

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
        const ws = new WebSocket('ws://localhost:3000/ws')
        const $nowTime = document.getElementById('now-time')
        ws.onmessage = (event) => {
          $nowTime.textContent = event.data
        }
        `,
          }}
        ></script>
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

Bun.serve({
  fetch: app.fetch,
  websocket,
})
```
