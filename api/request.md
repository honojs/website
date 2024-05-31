# HonoRequest

The `HonoRequest` is an object that can be taken from `c.req` which wraps a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.

## param()

Get the values of path parameters.

```ts
// Captured params
app.get('/entry/:id', (c) => {
  const id = c.req.param('id')
  ...
})

// Get all params at once
app.get('/entry/:id/comment/:commentId', (c) => {
  const { id, commentId } = c.req.param()
})
```

## query()

Get querystring parameters.

```ts
// Query params
app.get('/search', (c) => {
  const query = c.req.query('q')
  ...
})

// Get all params at once
app.get('/search', (c) => {
  const { q, limit, offset } = c.req.query()
  ...
})
```

## queries()

Get multiple querystring parameter values, e.g. `/search?tags=A&tags=B`

```ts
app.get('/search', (c) => {
  // tags will be string[]
  const tags = c.req.queries('tags')
  ...
})
```

## header()

Get the request header value.

```ts
app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## parseBody()

Parse Request body of type `multipart/form-data` or `application/x-www-form-urlencoded`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.parseBody()
  ...
})
```

`parseBody()` supports the following behaviors.

**Single file**

```ts
const body = await c.req.parseBody()
body['foo']
```

`body['foo']` is `(string | File)`.

If multiple files are uploaded, the last one will be used.

### Multiple files

```ts
const body = await c.req.parseBody()
body['foo[]']
```

`body['foo[]']` is always `(string | File)[]`.

`[]` postfix is required.

### Multiple files with same name

```ts
const body = await c.req.parseBody({ all: true })
body['foo']
```

`all` option is disabled by default.

- If `body['foo']` is multiple files, it will be parsed to `(string | File)[]`.
- If `body['foo']` is single file, it will be parsed to `(string | File)`.

### Dot notation

If you set the `dot` option `true`, the return value is structured based on the dot notation.

Imagine receiving the following data:

```ts
const data = new FormData()
data.append('obj.key1', 'value1')
data.append('obj.key2', 'value2')
```

You can get the structured value by setting the `dot` option `true`:

```ts
const body = await c.req.parseBody({ dot: true })
// body is `{ obj: { key1: 'value1', key2: 'value2' } }`
```

## json()

Parses the request body of type `application/json`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.json()
  ...
})
```

## text()

Parses the request body of type `text/plain`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.text()
  ...
})
```

## arrayBuffer()

Parses the request body as an `ArrayBuffer`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.arrayBuffer()
  ...
})
```

## blob()

Parses the request body as a `Blob`.

```ts
app.post('/entry', async (c) => {
  const body = await c.req.blob()
  ...
})
```

## formData()

Parses the request body as a `FormData`.

```ts
app.post('/entry', async (c) => {
  const body = await c.req.formData()
  ...
})
```

## valid()

Get the validated data.

```ts
app.post('/posts', (c) => {
  const { title, body } = c.req.valid('form')
  ...
})
```

Available targets are below.

- `form`
- `json`
- `query`
- `header`
- `cookie`
- `param`

See the [Validation section](/guides/validation) for usage examples.

## routePath()

You can retrieve the registered path within the handler like this:

```ts
app.get('/posts/:id', (c) => {
  return c.json({ path: c.req.routePath })
})
```

If you access `/posts/123`, it will return `/posts/:id`:

```json
{ "path": "/posts/:id" }
```

## matchedRoutes()

It returns matched routes within the handler, which is useful for debugging.

```ts
app.use(async function logger(c, next) {
  await next()
  c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
    const name = handler.name || (handler.length < 2 ? '[handler]' : '[middleware]')
    console.log(
      method,
      ' ',
      path,
      ' '.repeat(Math.max(10 - path.length, 0)),
      name,
      i === c.req.routeIndex ? '<- respond from here' : ''
    )
  })
})
```

## path

The request pathname.

```ts
app.get('/about/me', (c) => {
  const pathname = c.req.path // `/about/me`
  ...
})
```

## url

The request url strings.

```ts
app.get('/about/me', (c) => {
  const url = c.req.url // `http://localhost:8787/about/me`
  ...
})
```

## method

The method name of the request.

```ts
app.get('/about/me', (c) => {
  const method = c.req.method // `GET`
  ...
})
```

## raw

The raw [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.

```ts
// For Cloudflare Workers
app.post('/', async (c) => {
  const metadata = c.req.raw.cf?.hostMetadata?
  ...
})
```
