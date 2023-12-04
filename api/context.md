# Context

To handle Request and Response, you can use `Context` object.

## req

`req` is the instance of HonoRequest.

```ts
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## Shortcuts for the Response

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

The Response is the same as below.

```ts
new Response('Thank you for coming', {
  status: 201,
  headers: {
    'X-Message': 'Hello',
    'Content-Type': 'text/plain',
  },
})
```

## text()

Render text as `Content-Type:text/plain`.

```ts
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

Specify the status code and add headers.

```ts
app.post('/posts', (c) => {
  return c.text('Created!', 201, {
    'X-Custom': 'Thank you!',
  })
})
```

## json()

Render JSON as `Content-Type:application/json`.

```ts
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

## html()

Render HTML as `Content-Type:text/html`.

```ts
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

## notFound()

Return the `Not Found` Response.

```ts
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## redirect()

Redirect, default status code is `302`.

```ts
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

## stream()

Response with simple stream.
(Argument `stream` is the same interface as `streamText`)

```ts
app.get('/', (c) => {
  return c.stream(async (stream) => {
    await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])) // Write a Uint8Array
  })
})
```

## streamText()

Response as `Content-Type:text/plain` with `Transfer-Encoding:chunked` and `X-Content-Type-Options:nosniff`.

If you want to use **vanilla** stream, use `stream()` instead.

```ts
app.get('/', (c) => {
  return c.streamText(async (stream) => {
    await stream.writeln('Hello') // Write a text with a new line ('\n')
    await stream.sleep(1000) // Wait 1 second
    await stream.write(`Hono!`) // Write a text without a new line
    await stream.pipe(hogeReadableStream) // Pipe a readable stream
  })
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

Set the value specified by the key with `set` and use it later with `get`.

```ts
app.use('*', async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

Pass the `Variables` as Generics to the constructor of `Hono` to make it type-safe.

```ts
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

## var

You can also access the value of a variable with `c.var`.

```ts
const result = c.var.client.oneMethod()
```

If you want to create the middleware which provides a custom method,
write like the following:

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

```ts
app.use('*', async (c, next) => {
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
    (content: string, head: { title: string }): Response
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

Environment variables, secrets, and KV namespaces are known as bindings. Regardless of type, bindings are always available as global variables and can be accessed via the context `c.env.BINDING_KEY`.

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
app.use('*', async (c, next) => {
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
