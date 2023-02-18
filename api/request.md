# HonoRequest

The `HonoRequest` is an object that can be taken from `c.req` and is a wrapped [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) object.

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

Get query parameters.

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

Get multiple parameter values, e.g. `/search?tag=A&tag=B`

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

## cookie()

Parse cookie.

```ts
app.get('/', (c) => {
  const value = c.req.cookie('name')
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

## json()

Parse Request body of type `application/json`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.json()
  ...
})
```

## text()

Parse Request body of type `text/plain`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.text()
  ...
})
```

## arrayBuffer()

Parse Request body as an `ArrayBuffer`

```ts
app.post('/entry', async (c) => {
  const body = await c.req.arrayBuffer()
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
- `queries`

See [Validation section](/guides/validation) for usage.

## raw

The raw `Request` object.

```ts
// For Cloudflare Workers
app.post('/', async (c) => {
  const metadata = c.req.raw.cf?.hostMetadata?
  ...
})
```

## Other properties

These are compatible with [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request).

- url
- method
- headers
- redirect
- body
- bodyUsed
- cache
- credentials
- integrity
- keepalive
- mode
- referrer
- refererPolicy
- signal
