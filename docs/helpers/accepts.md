# Accepts Helper

Accepts Helper helps to handle Accept headers in the Requests.

## Import

```ts
import { Hono } from 'hono'
import { accepts } from 'hono/accepts'
```

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

## Options
### <Badge type="danger" text="required" /> header: `AcceptHeader`
The target accept header.
### <Badge type="danger" text="required" /> supports: `string[]`
The header values which your application supports.
### <Badge type="danger" text="required" /> default: `string`
The default values.
### <Badge type="info" text="optional" /> match: `(accepts: Accept[], config: acceptsConfig) => string`
The custom match function.
