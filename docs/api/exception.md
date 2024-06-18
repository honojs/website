# Exception

When a fatal error occurs, such as authentication failure, an HTTPException must be thrown.

## throw HTTPException

This example throws an HTTPException from the middleware.

```ts
import { HTTPException } from 'hono/http-exception'

// ...

app.post('/auth', async (c, next) => {
  // authentication
  if (authorized === false) {
    throw new HTTPException(401, { message: 'Custom error message' })
  }
  await next()
})
```

You can specify the response to be returned back to the user.

```ts
const errorResponse = new Response('Unauthorized', {
  status: 401,
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})
throw new HTTPException(401, { res: errorResponse })
```

## Handling HTTPException

You can handle the thrown HTTPException with `app.onError`.

```ts
import { HTTPException } from 'hono/http-exception'

// ...

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
})
```

## `cause`

The `cause` option is available to add a [`cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause) data.

```ts
app.post('/auth', async (c, next) => {
  try {
    authorize(c)
  } catch (e) {
    throw new HTTPException(401, { message, cause: e })
  }
  await next()
})
```
