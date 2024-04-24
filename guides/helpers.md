# ヘルパー

ヘルパーはアプリケーション開発をサポートします。 ミドルウェアとは違って、ハンドラとして機能するのではなく、便利な機能を提供します。

例えば、 [Cookie ヘルパー](/helpers/cookie)の使用方法はこの通りです:

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

- [アダプタ](/helpers/adapter)
- [Cookie](/helpers/cookie)
- [css](/helpers/css)
- [Dev](/helpers/dev)
- [Factory](/helpers/factory)
- [html](/helpers/html)
- [JWT](/helpers/jwt)
- [ストリーミング](/helpers/streaming)
- [テスト](/helpers/testing)
