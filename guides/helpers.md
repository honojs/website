# Helpers

Helpers are available to assist in developing your application. Unlike middleware, they don't act as handlers, but rather provide useful functions.

For instance, here's how to use the [Cookie helper](/helpers/cookie):

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

## Available Helpers

- [Accepts](/helpers/accepts)
- [Adapter](/helpers/adapter)
- [Cookie](/helpers/cookie)
- [css](/helpers/css)
- [Dev](/helpers/dev)
- [Factory](/helpers/factory)
- [html](/helpers/html)
- [JWT](/helpers/jwt)
- [SSG](/helpers/ssg)
- [Streaming](/helpers/streaming)
- [Testing](/helpers/testing)
- [WebSocket](/helpers/websocket)
