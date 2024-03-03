# Context

Request / Response を処理するには、 `Context` オブジェクトを使用します。

## req

`req` は HonoRequest のインスタンスです。

```ts
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## body()

HTTP レスポンスを返します。

`c.header()` でヘッダをセットし、 `c.status` で HTTP ステータスコードを指定します。

::: info
**Note**: テキストや HTML を返す場合は、 `c.text()` や `c.html()` を使ってください。
:::

```ts
app.get('/welcome', (c) => {
  // Set headers
  c.header('X-Message', 'Hello!')
  c.header('Content-Type', 'text/plain')

  // Set HTTP status code
  c.status(201)

  // Return the response body
  return c.body('Thank you for coming')
})
```

このように書くこともできます。

```ts
app.get('/welcome', (c) => {
  return c.body('Thank you for coming', 201, {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  })
})
```

以下と同じです。

```ts
new Response('Thank you for coming', {
  status: 201,
  headers: {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  },
})
```

## text()

`Content-Type:text/plain` でテキストをレンダリングします。

```ts
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

## json()

`Content-Type:application/json` で JSON をレンダリングします。

```ts
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

## html()

`Content-Type:text/html` で HTML をレンダリングします。

```ts
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

## notFound()

`Not Found` レスポンスを返します。

```ts
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## redirect()

リダイレクトします。 デフォルトのステータスコードは `302` です。

```ts
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

## res

```ts
// Response object
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', 'Debug message')
})
```

## set() / get()

キーで指定した値を `set` し、後で `get` で取り出します。

```ts
app.use(async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

Pass the `Variables` as Generics to the constructor of `Hono` to make it type-safe.
`Variables` ジェネリクスを `Hono` に渡すと型安全になります。

```ts
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

## var

`c.var` を使用しても変数の値にアクセスできます。

```ts
const result = c.var.client.oneMethod()
```

カスタムメソッドを提供するミドルウェアを作成したい場合は、
このように書きます:

```ts
const app = new Hono()

const echoMiddleware: MiddlewareHandler<{
  Variables: {
    echo: (str: string) => string
  }
}> = async (c, next) => {
  c.set('echo', (str) => str)
  await next()
}

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

## render() / setRenderer()

You can set a layout using `c.setRenderer()` within a custom middleware.

```tsx
app.use(async (c, next) => {
  c.setRenderer((content) => {
    return c.html(
      <html>
        <body>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})
```

Then, you can utilize `c.render()` to create responses within this layout.

```ts
app.get('/', (c) => {
  return c.render('Hello!')
})
```

The output of which will be:

```html
<html>
  <body>
    <p>Hello!</p>
  </body>
</html>
```

Additionally, this feature offers the flexibility to customize arguments.
To ensure type safety, types can be defined as:

```ts
declare module 'hono' {
  interface ContextRenderer {
    (content: string | Promise<string>, head: { title: string }): Response | Promise<Response>
  }
}
```

Here's an example of how you can use this:

```ts
app.use('/pages/*', async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <title>{head.title}</title>
        </head>
        <body>
          <header>{head.title}</header>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})

app.get('/pages/my-favorite', (c) => {
  return c.render(<p>Ramen and Sushi</p>, {
    title: 'My favorite',
  })
})

app.get('/pages/my-hobbies', (c) => {
  return c.render(<p>Watching baseball</p>, {
    title: 'My hobbies',
  })
})
```

## executionCtx

```ts
// ExecutionContext object
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(
    c.env.KV.put(key, data)
  )
  ...
})
```

## event

```ts
// FetchEvent object (only set when using Service Worker syntax)
app.get('/foo', async (c) => {
  c.event.waitUntil(
    c.env.KV.put(key, data)
  )
  ...
})
```

## env

In Cloudflare Workers Environment variables, secrets, KV namespaces, D1 database, R2 bucket etc. that are bound to a worker are known as bindings.
Regardless of type, bindings are always available as global variables and can be accessed via the context `c.env.BINDING_KEY`.

```ts
// Environment object for Cloudflare Workers
app.get('*', async c => {
  const counter = c.env.COUNTER
  ...
})
```

## error

If the Handler throws an error, the error object is placed in `c.error`.
You can access it in your middleware.

```ts
app.use(async (c, next) => {
  await next()
  if (c.error) {
    // do something...
  }
})
```

## ContextVariableMap

For instance, if you wish to add type definitions to variables when a specific middleware is used, you can extend `ContextVariableMap`. For example:

```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}
```

You can then utilize this in your middleware:

```ts
const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values') // result is a string
  await next()
})
```

In a handler, the variable is inferred as the proper type:

```ts
app.get('/', (c) => {
  const val = c.get('result') // val is a string
  //...
})
```
