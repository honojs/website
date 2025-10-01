# HTTPException

When a fatal error occurs, Hono (and many ecosystem middleware) may throw an `HTTPException`. This is a custom Hono `Error` that simplifies [returning error responses](#handling-httpexceptions).

## Throwing HTTPExceptions

You can throw your own HTTPExceptions by specifying a status code, and either a message or a custom response.

### Custom Message

For basic `text` responses, just set a the error `message`.

```ts twoslash
import { HTTPException } from 'hono/http-exception'

throw new HTTPException(401, { message: 'Unauthorized' })
```

### Custom Response

For other response types, or to set response headers, use the `res` option. _Note that the status passed to the constructor is the one used to create responses._

```ts twoslash
import { HTTPException } from 'hono/http-exception'

const errorResponse = new Response('Unauthorized', {
  status: 401, // this gets ignored
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})

throw new HTTPException(401, { res: errorResponse })
```

### Cause

In either case, you can use the [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) option to add arbitrary data to the HTTPException.

```ts twoslash
import { Hono, Context } from 'hono'
import { HTTPException } from 'hono/http-exception'
const app = new Hono()
declare const message: string
declare const authorize: (c: Context) => Promise<void>
// ---cut---
app.post('/login', async (c) => {
  try {
    await authorize(c)
  } catch (cause) {
    throw new HTTPException(401, { message, cause })
  }
  return c.redirect('/')
})
```

## Handling HTTPExceptions

You can handle uncaught HTTPExceptions with [`app.onError`](/docs/api/hono#error-handling). They include a `getResponse` method that returns a new `Response` created from the error `status`, and either the error `message`, or the [custom response](#custom-response) set when the error was thrown.

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((error, c) => {
  if (error instanceof HTTPException) {
    console.error(error.cause)
    // Get the custom response
    return error.getResponse()
  }
  // ...
  // ---cut-start---
  return c.text('Unexpected error')
  // ---cut-end---
})
```

::: warning
**`HTTPException.getResponse` is not aware of `Context`**. To include headers already set in `Context`, you must apply them to a new `Response`.
:::
