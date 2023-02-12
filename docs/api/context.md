# Context

To handle Request and Response, you can use `Context` object.

## c.req

`c.req` is the instance of HonoRequest.

```ts
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## Shortcuts for Response

```ts
app.get('/welcome', (c) => {
  // Set headers
  c.header('X-Message', 'Hello!')
  c.header('Content-Type', 'text/plain')

  // Set HTTP status code
  c.status(201)

  // Return the response body
  return c.body('Thank you for comming')
})
```

The Response is the same as below.

```ts
new Response('Thank you for comming', {
  status: 201,
  headers: {
    'X-Message': 'Hello',
    'Content-Type': 'text/plain',
  },
})
```

## c.text()

Render text as `Content-Type:text/plain`.

```ts
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

## c.json()

Render JSON as `Content-Type:application/json`.

```ts
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

## c.jsonT()

Return `TypeResponse` that is used for RPC.

```ts
app.get('/api', (c) => {
  return c.jsonT({ message: 'Hello!' })
})
```

## c.html()

Render HTML as `Content-Type:text/html`.

```ts
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

## c.cookie()

Set cookie for Response.

```ts
app.get('/', (c) => {
  c.cookie('delicious_cookie', 'choco')
  return c.text('Do you like cookie?')
})
```

## c.notFound()

Return the `Not Found` Response.

```ts
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## c.redirect()

Redirect, default status code is `302`.

```ts
app.get('/redirect', (c) => c.redirect('/'))
app.get('/redirect-permanently', (c) => c.redirect('/', 301))
```

## c.res

```ts
// Response object
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', 'Debug message')
})
```

## c.set/c.get

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

## c.executionCtx

```ts
// ExecutionContext object
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(
    c.env.KV.put(key, data)
  )
  ...
})
```

## c.event

```ts
// FetchEvent object (only set when using Service Worker syntax)
app.get('/foo', async (c) => {
  c.event.waitUntil(
    c.env.KV.put(key, data)
  )
  ...
})
```

## c.env

Environment variables, secrets, and KV namespaces are known as bindings. Regardless of type, bindings are always available as global variables and can be accessed via the context `c.env.BINDING_KEY`.

```ts
// Environment object for Cloudflare Workers
app.get('*', async c => {
  const counter = c.env.COUNTER
  ...
})
```

## c.runtime

The key of the runtime on which the application is running.

```ts
app.get('/', (c) => {
  if (c.runtime === 'workerd') {
    return c.text('You are on Cloduflare')
  } else if (c.runtime === 'bun') {
    return c.text('You are on Bun')
  }
  ...
})
```

## c.error

If the Handler throws an error, the error object is placed in `c.error`.
You can check it in your middleware.

```ts
app.use('*', async (c, next) => {
  await next()
  if (c.error) {
    // do something...
  }
})
```
