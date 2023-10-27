# Adapter Helper

The Adapter Helper provides a seamless way to interact with various platforms through a unified interface.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { env, getRuntimeKey } from 'hono/adapter'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { env, getRuntimeKey } from 'https://deno.land/x/hono/helper.ts'
```

:::

## `env()`

The `env()` function facilitates retrieving environment variables across different runtimes, extending beyond just Cloudflare Workers' Bindings.

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

### Specify the runtime

You can specify the runtime to get environment variables by passing the runtime key as the second argument.

```ts
app.get('/env', (c) => {
  const { NAME } = env<{ NAME: string }>(c, 'workerd')
  return c.text(NAME)
})
```

## `getRuntimeKey()`

The `getRuntimeKey()` function returns the identifier of the current runtime.

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
