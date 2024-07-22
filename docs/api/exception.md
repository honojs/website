# 例外

認証に失敗するなど、致命的なエラーが発生した場合は HTTPException を投げる必要があります。

## throw HTTPException

HTTPException をミドルウェアから投げる例。

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

ユーザーに返すレスポンスを指定できます。

```ts
const errorResponse = new Response('Unauthorized', {
  status: 401,
  headers: {
    Authenticate: 'error="invalid_token"',
  },
})
throw new HTTPException(401, { res: errorResponse })
```

## HTTPException のハンドル

投げられた HTTPException には `app.onError` で処理できます。

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
