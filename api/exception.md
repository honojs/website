# Exception

When a fatal error occurs, such as authentication failure, HTTPException must be thrown.

## throw HTTPException

For example, it throws an HTTPException in the middleware.

```ts
app.post('/auth', async (c, next) => {
  // authentication
  if (authorized === false) {
    throw new HTTPException(401, { message: 'Custom error message' })
  }
  await next()
})
```

You can specify the response to be returned to the user.

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

You can handle the thrown HTTPException in `app.onError`.

```ts
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    // Get the custom response
    return err.getResponse()
  }
  //...
})
```
