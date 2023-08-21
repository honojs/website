# Adapter Helper

The Adapter Helper provides a seamless way to interact with various platforms through a unified interface.

## `env`

The `env` function facilitates retrieving environment variables across different runtimes, extending beyond just Cloudflare Workers' Bindings.

### Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { env } from 'hono/adapter'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { env } from 'https://deno.land/x/hono/helper.ts'
```

:::

```ts
import { env } from 'hono/adapter'

app.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c)
  return c.text(NAME)
})
```

Supported Runtimes:

- Cloudflare Workers
- Deno
- Bun
- Lagon
- Node.js
- Vercel
- AWS Lambda
- Lambda@Edge

## `getRuntimeKey`

The `getRuntimeKey` function returns the identifier of the current runtime.

### Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { getRuntimeKey } from 'hono/adapter'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { getRuntimeKey } from 'https://deno.land/x/hono/helper.ts'
```

:::

```ts
app.get('/', (c) => {
  if (getRuntimeKey() === 'workerd') {
    return c.text('You are on Cloudflare')
  } else if (getRuntimeKey() === 'bun') {
    return c.text('You are on Bun')
  }
  ...
})
```

### Available Runtimes

Here are the supported runtimes, with some being inspired by [WinterCG's Runtime Keys](https://runtime-keys.proposal.wintercg.org/):

- `node`
- `deno`
- `bun`
- `workerd` - Cloudflare Workers
- `fastly`
- `edge-light` - Vercel Edge Functions
- `lagon`
- `other`
