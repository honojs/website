---
title: Accepts Helper
---

# Accepts Helper

Accepts Helper helps to handle Accept headers in the Requests.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { accepts } from 'hono/accepts'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { accepts } from 'https://deno.land/x/hono/helper.ts'
```

:::

## `accepts()`

The `accepts()` function looks at the Accept header, such as Accept-Encoding and Accept-Language, and returns the proper value.

```ts
import { accepts } from 'hono/accepts'

app.get('/', (c) => {
  const accept = accepts(c, {
    header: 'Accept-Language',
    supports: ['en', 'ja', 'zh'],
    default: 'en',
  })
  return c.json({ lang: accept })
})
```

### `AcceptHeader` type

The definition of the `AcceptHeader` type is as follows.

```ts
export type AcceptHeader =
  | 'Accept'
  | 'Accept-Charset'
  | 'Accept-Encoding'
  | 'Accept-Language'
  | 'Accept-Patch'
  | 'Accept-Post'
  | 'Accept-Ranges'
```

### Options

- `header`: `AcceptHeader` - required
  - The target accept header.
- `supports`: string[] - required
  - The header values which your application supports.
- `default`: string - required
  - The default values.
- `match`?: `(accepts: Accept[], config: acceptsConfig) => string`
  - The custom match function.
