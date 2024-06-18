# Remix

[Remix](https://remix.run/) is a Web Standards-based full-stack framework.

Now, Remix and Hono can be used together through the fetch API.

## Remix + Hono

You can use Remix as Hono middleware using [Remix + Hono](https://github.com/sergiodxa/remix-hono), like this:

```ts
import * as build from '@remix-run/dev/server-build'
import { remix } from 'remix-hono/handler'

app.use('*', remix({ build, mode: process.env.NODE_ENV }))
```

## See also

- [Remix](https://remix.run/)
- [Remix Hono](https://github.com/sergiodxa/remix-hono)
