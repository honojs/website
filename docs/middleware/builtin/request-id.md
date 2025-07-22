# Request ID Middleware

Request ID Middleware generates a unique ID for each request, which you can use in your handlers.

::: info
**Node.js**: This middleware uses `crypto.randomUUID()` to generate IDs. The global `crypto` was introduced in Node.js version 20 or later. Therefore, errors may occur in versions earlier than that. In that case, please specify `generator`. However, if you are using [the Node.js adapter](https://github.com/honojs/node-server), it automatically sets `crypto` globally, so this is not necessary.
:::

## Import

```ts
import { Hono } from 'hono'
import { requestId } from 'hono/request-id'
```

## Usage

You can access the Request ID through the `requestId` variable in the handlers and middleware to which the Request ID Middleware is applied.

```ts
const app = new Hono()

app.use('*', requestId())

app.get('/', (c) => {
  return c.text(`Your request id is ${c.get('requestId')}`)
})
```

If you want to explicitly specify the type, import `RequestIdVariables` and pass it in the generics of `new Hono()`.

```ts
import type { RequestIdVariables } from 'hono/request-id'

const app = new Hono<{
  Variables: RequestIdVariables
}>()
```

### Set Request ID

You set a custom request ID in the header (default: `X-Request-Id`), the middleware will use that value instead of generating a new one:

```ts
const app = new Hono()

app.use('*', requestId())

app.get('/', (c) => {
  return c.text(`${c.get('requestId')}`)
})

const res = await app.request('/', {
  headers: {
    'X-Request-Id': 'your-custom-id',
  },
})
console.log(await res.text()) // your-custom-id
```

If you want to disable this feature, set [`headerName` option](#headername-string) to an empty string.

## Options

### <Badge type="info" text="optional" /> limitLength: `number`

The maximum length of the request ID. The default is `255`.

### <Badge type="info" text="optional" /> headerName: `string`

The header name used for the request ID. The default is `X-Request-Id`.

### <Badge type="info" text="optional" /> generator: `(c: Context) => string`

The request ID generation function. By default, it uses `crypto.randomUUID()`.
