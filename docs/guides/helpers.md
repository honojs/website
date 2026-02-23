# ヘルパー

アプリケーションの開発を手助けするヘルパーがあります。 ミドルウェアと違って、ハンドラとして機能するのではなく、便利な関数を提供します。

例えば、 [Cookie helper](/docs/helpers/cookie) の使い方は以下のとおりです。

```ts
import { getCookie, setCookie } from 'hono/cookie'

const app = new Hono()

app.get('/cookie', (c) => {
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  //
})
```

## 利用可能なヘルパー

- [Accepts](/docs/helpers/accepts)
- [Adapter](/docs/helpers/adapter)
- [Cookie](/docs/helpers/cookie)
- [css](/docs/helpers/css)
- [Dev](/docs/helpers/dev)
- [Factory](/docs/helpers/factory)
- [html](/docs/helpers/html)
- [JWT](/docs/helpers/jwt)
- [SSG](/docs/helpers/ssg)
- [Streaming](/docs/helpers/streaming)
- [Testing](/docs/helpers/testing)
- [WebSocket](/docs/helpers/websocket)
