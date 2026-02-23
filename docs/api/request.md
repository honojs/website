# HonoRequest

`HonoRequest` は [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request) をラップするオブジェクトで、 `c.req` からアクセスできます。

## param()

パスパラメータの値を取得します。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Captured params
app.get('/entry/:id', async (c) => {
  const id = c.req.param('id')
  //    ^?
  // ...
})

// Get all params at once
app.get('/entry/:id/comment/:commentId', async (c) => {
  const { id, commentId } = c.req.param()
  //      ^?
})
```

## query()

クエリパラメータを取得します。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Query params
app.get('/search', async (c) => {
  const query = c.req.query('q')
  //     ^?
})

// Get all params at once
app.get('/search', async (c) => {
  const { q, limit, offset } = c.req.query()
  //      ^?
})
```

## queries()

複数のクエリパラメータを取得します。 例: `/search?tags=A&tags=B`

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/search', async (c) => {
  // tags will be string[]
  const tags = c.req.queries('tags')
  //     ^?
  // ...
})
```

## header()

リクエストのヘッダを取得します。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent')
  //      ^?
  return c.text(`Your user agent is ${userAgent}`)
})
```

::: warning
引数無しで `c.req.header()` が呼ばれた場合、すべてのレコードのキーは **小文字** になって返されます。

大文字を使ったヘッダ名で値を取得したい場合は
`c.req.header(“X-Foo”)` のように使います。

```ts
// ❌ Will not work
const headerRecord = c.req.header()
const foo = headerRecord['X-Foo']

// ✅ Will work
const foo = c.req.header('X-Foo')
```

:::

## parseBody()

`multipart/form-data` または `application/x-www-form-urlencoded` のリクエストボディをパースします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.parseBody()
  // ...
})
```

`parseBody()` は次の動作をサポートします。

**単一ファイル**

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody()
const data = body['foo']
//    ^?
```

`body['foo']` is `(string | File)`.

複数のファイルがアップロードされた場合、最後のファイルが取得されます。

### 複数ファイル

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody()
body['foo[]']
```

`body['foo[]']` は常に `(string | File)[]` です。

`[]` ポストフィックスが必要です。

### 同じ名前の複数ファイルやフィールド

If you have a input field that allows multiple `<input type="file" multiple />` or multiple checkboxes with the same name `<input type="checkbox" name="favorites" value="Hono"/>`.

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody({ all: true })
body['foo']
```

`all` オプションはデフォルトで無効です。

- `body['foo']` が複数ファイルだった場合、 `(string | File)[]` にパースされます。
- `body['foo']` が単一ファイルだった場合、 `(string | File)` にパースされます。

### ドット表記

`dot` オプションを `true` にした場合、戻り値はドット表記基づいて構造化されます。

このようなデータを受け取ることを考えてください:

```ts twoslash
const data = new FormData()
data.append('obj.key1', 'value1')
data.append('obj.key2', 'value2')
```

`dot` オプションを `true` にすることで構造化された値を取得することができます:

```ts twoslash
import { Context } from 'hono'
declare const c: Context
// ---cut---
const body = await c.req.parseBody({ dot: true })
// body is `{ obj: { key1: 'value1', key2: 'value2' } }`
```

## json()

`application/json` のリクエストボディをパースします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.json()
  // ...
})
```

## text()

`text/plain` のリクエストボディをパースします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.text()
  // ...
})
```

## arrayBuffer()

リクエストボディを `ArrayBuffer` としてパースします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.arrayBuffer()
  // ...
})
```

## blob()

リクエストボディを `Blob` としてパースします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.blob()
  // ...
})
```

## formData()

リクエストボディを `FormData` としてパースします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/entry', async (c) => {
  const body = await c.req.formData()
  // ...
})
```

## valid()

バリデーションされたデータを取得します。

```ts
app.post('/posts', async (c) => {
  const { title, body } = c.req.valid('form')
  // ...
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

## routePath

::: warning
**Deprecated in v4.8.0**: This property is deprecated. Use `routePath()` from [Route Helper](/docs/helpers/route) instead.
:::

ハンドラ内で定義されたパスをこのように取得できます:

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/posts/:id', (c) => {
  return c.json({ path: c.req.routePath })
})
```

`/posts/123` にアクセスしたとき、 `/posts/:id` が返されます:

```json
{ "path": "/posts/:id" }
```

## matchedRoutes

::: warning
**Deprecated in v4.8.0**: This property is deprecated. Use `matchedRoutes()` from [Route Helper](/docs/helpers/route) instead.
:::

ハンドラで一致したルートを返します、デバッグに適しています。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
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

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/about/me', async (c) => {
  const pathname = c.req.path // `/about/me`
  // ...
})
```

## url

リクエストの URL 文字列。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/about/me', async (c) => {
  const url = c.req.url // `http://localhost:8787/about/me`
  // ...
})
```

## method

リクエストの HTTP メソッド名。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/about/me', async (c) => {
  const method = c.req.method // `GET`
  // ...
})
```

## raw

生の [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) オブジェクト。

```ts
// For Cloudflare Workers
app.post('/', async (c) => {
  const metadata = c.req.raw.cf?.hostMetadata?
  // ...
})
```

## cloneRawRequest()

Clones the raw Request object from a HonoRequest. Works even after the request body has been consumed by validators or HonoRequest methods.

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()

import { cloneRawRequest } from 'hono/request'
import { validator } from 'hono/validator'

app.post(
  '/forward',
  validator('json', (data) => data),
  async (c) => {
    // Clone after validation
    const clonedReq = await cloneRawRequest(c.req)
    // Does not throw the error
    await clonedReq.json()
    // ...
  }
)
```
