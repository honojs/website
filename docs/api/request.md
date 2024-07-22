# HonoRequest

`HonoRequest` は [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) をラップするオブジェクトで、 `c.req` からアクセスできます。

## param()

パスパラメータの値を取得します。
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

クエリパラメータを取得します。

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

複数のクエリパラメータを取得します。 例: `/search?tags=A&tags=B`

```ts
app.get('/search', (c) => {
  // tags will be string[]
  const tags = c.req.queries('tags')
  ...
})
```

## header()

リクエストのヘッダを取得します。

```ts
app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent')
  ...
})
```

## parseBody()

`multipart/form-data` または `application/x-www-form-urlencoded` のリクエストボディをパースします。

```ts
app.post('/entry', async (c) => {
  const body = await c.req.parseBody()
  ...
})
```

`parseBody()` は次の動作をサポートします。

**単一ファイル**

```ts
const body = await c.req.parseBody()
body['foo']
```

`body['foo']` is `(string | File)`.

複数のファイルがアップロードされた場合、最後のファイルが取得されます。

### 複数ファイル

```ts
const body = await c.req.parseBody()
body['foo[]']
```

`body['foo[]']` は常に `(string | File)[]` です。

`[]` ポストフィックスが必要です。

### 同じ名前の複数ファイル

```ts
const body = await c.req.parseBody({ all: true })
body['foo']
```

`all` オプションはデフォルトで無効です。

- `body['foo']` が複数ファイルだった場合、 `(string | File)[]` にパースされます。
- `body['foo']` が単一ファイルだった場合、 `(string | File)` にパースされます。

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

`text/plain` のリクエストボディをパースします。

```ts
app.post('/entry', async (c) => {
  const body = await c.req.text()
  ...
})
```

## arrayBuffer()

リクエストボディを `ArrayBuffer` としてパースします。

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

バリデーションされたデータを取得します。
```ts
app.post('/posts', (c) => {
  const { title, body } = c.req.valid('form')
  ...
})
```

これらのデータに対して利用可能です。

- `form`
- `json`
- `query`
- `header`
- `cookie`
- `param`

[バリデーションセクション](/docs/guides/validation)で利用例を見てください。

## routePath()

ハンドラ内で定義されたパスをこのように取得できます:

```ts
app.get('/posts/:id', (c) => {
  return c.json({ path: c.req.routePath })
})
```

`/posts/123` にアクセスしたとき、 `/posts/:id` が返されます:

```json
{ "path": "/posts/:id" }
```

## matchedRoutes()

ハンドラで一致したルートを返します、デバッグに適しています。

```ts
app.use(async function logger(c, next) {
  await next()
  c.req.matchedRoutes.forEach(({ handler, method, path }, i) => {
    const name =
      handler.name ||
      (handler.length < 2 ? '[handler]' : '[middleware]')
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

リクエストのパス。

```ts
app.get('/about/me', (c) => {
  const pathname = c.req.path // `/about/me`
  ...
})
```

## url

リクエストの URL 文字列。

```ts
app.get('/about/me', (c) => {
  const url = c.req.url // `http://localhost:8787/about/me`
  ...
})
```

## method

リクエストの HTTP メソッド名。

```ts
app.get('/about/me', (c) => {
  const method = c.req.method // `GET`
  ...
})
```

## raw

RAWな [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) オブジェクト。

```ts
// For Cloudflare Workers
app.post('/', async (c) => {
  const metadata = c.req.raw.cf?.hostMetadata?
  ...
})
```
