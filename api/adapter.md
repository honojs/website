# Adapter

Hono provides an adapter that makes it easy to handle several platforms with a common interface.

## `env`

`env` is a function to get environment variables for any runtimes, not only variables of Cloudflare Workers' Bindings.

```ts
import { env } from 'hono/adapter'

app.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c)
  return c.text(NAME)
})
```

Supported runtimes:

- Cloudflare Workers
- Deno
- Bun
- Lagon
- Node.js
- Vercel
- AWS Lambda
- Lambda@Edge