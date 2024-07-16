# Request ID Middleware

Request ID Middleware generates a unique ID for each request, which you can use in your handlers.

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

## Options

- `limitLength`: number
  - The maximum length of the request ID. The default is `255`.
- `headerName`: string
  - The header name used for the request ID. The default is `X-Request-Id`.
- `generator`: `(c: Context) => string`
  - The request ID generation function. By default, it uses `crypto.randomUUID()`.
