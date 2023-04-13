# Exception

When a fatal error occurs, such as authentication failure, a HTTPException must be thrown.

## throw HTTPException

This example throws an HTTPException from the middleware.

```ts
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
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
})
```
