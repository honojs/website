# Remix

[Remix](https://remix.run/) は Web 標準に基づいたフルスタックフレームワークです。

Remix と Hono は fetch API を通じて一緒に使えるようになりました。

## Remix + Hono

Remix を Hono のミドルウェアとして使うためには [Remix + Hono](https://github.com/sergiodxa/remix-hono) 、 このようにします:

```ts
import * as build from '@remix-run/dev/server-build'
import { remix } from 'remix-hono/handler'

app.use('*', remix({ build, mode: process.env.NODE_ENV }))
```

## See also

- [Remix](https://remix.run/)
- [Remix Hono](https://github.com/sergiodxa/remix-hono)
