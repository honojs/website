# Context

`Context` オブジェクトはリクエストごとにインスタンス化され、レスポンスを返すまで使用されます。 ここにデータを置いたり、レスポンスのヘッダやステータスコードを設定したり、 HonoRequest や Response オブジェクトにアクセスしたりします。

## req

`req` は HonoRequest のインスタンスです。 詳しくは [HonoRequest](/docs/api/request) をご覧ください。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/hello', (c) => {
  const userAgent = c.req.header('User-Agent')
  // ...
  // ---cut-start---
  return c.text(`Hello, ${userAgent}`)
  // ---cut-end---
})
```

## status()

HTTP ステータスコードを `c.status()` で設定できます。 デフォルトは 200 です。 ステータスコードを 200 に設定する場合、 `c.status()` を使用する必要はありません。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.post('/posts', (c) => {
  // Set HTTP status code
  c.status(201)
  return c.text('Your post is created!')
})
```

## header()

レスポンスに HTTP ヘッダを設定できます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  // Set headers
  c.header('X-Message', 'My custom message')
  return c.text('HellO!')
})
```

## body()

HTTP レスポンスを返します。

::: info
**Note**: テキストや HTML を返す場合は、 `c.text()` や `c.html()` を使ってください。
:::

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/welcome', (c) => {
  c.header('Content-Type', 'text/plain')
  // Return the response body
  return c.body('Thank you for coming')
})
```

このように書くこともできます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/welcome', (c) => {
  return c.body('Thank you for coming', 201, {
    'X-Message': 'Hello!',
    'Content-Type': 'text/plain',
  })
})
```

このレスポンスは以下の `Response` オブジェクトと同じです。

```ts twoslash
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

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/say', (c) => {
  return c.text('Hello!')
})
```

## json()

`Content-Type:application/json` で JSON をレンダリングします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/api', (c) => {
  return c.json({ message: 'Hello!' })
})
```

## html()

`Content-Type:text/html` で HTML をレンダリングします。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  return c.html('<h1>Hello! Hono!</h1>')
})
```

## notFound()

`Not Found` レスポンスを返します。 [`app.notFound()`](/docs/api/hono#not-found) でカスタマイズできます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/notfound', (c) => {
  return c.notFound()
})
```

## redirect()

リダイレクトします。 デフォルトのステータスコードは `302` です。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/redirect', (c) => {
  return c.redirect('/')
})
app.get('/redirect-permanently', (c) => {
  return c.redirect('/', 301)
})
```

## res

送信される [Response] オブジェクトにアクセスできます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
// Response object
app.use('/', async (c, next) => {
  await next()
  c.res.headers.append('X-Debug', 'Debug message')
})
```

[Response]: https://developer.mozilla.org/en-US/docs/Web/API/Response

## set() / get()

リクエストの間の寿命を持つ任意のキーバリューのペアを設定、取得できます。 これにより、ミドルウェア間やミドルウェア、ルートハンドラ間でデータを渡すことができます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{ Variables: { message: string } }>()
// ---cut---
app.use(async (c, next) => {
  c.set('message', 'Hono is cool!!')
  await next()
})

app.get('/', (c) => {
  const message = c.get('message')
  return c.text(`The message is "${message}"`)
})
```

`Variables` ジェネリクスを `Hono` に渡すと型安全になります。

```ts twoslash
import { Hono } from 'hono'
// ---cut---
type Variables = {
  message: string
}

const app = new Hono<{ Variables: Variables }>()
```

`c.set` / `c.get` は同じリクエスト内でのみ保持されます。 違うリクエストの間では共有されません。

## var

`c.var` を使用しても変数の値にアクセスできます。

```ts twoslash
import type { Context } from 'hono'
declare const c: Context
// ---cut---
const result = c.var.client.oneMethod()
```

カスタムメソッドを提供するミドルウェアを作成したい場合は、
このように書きます:

```ts twoslash
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
// ---cut---
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}

const app = new Hono()

const echoMiddleware = createMiddleware<Env>(async (c, next) => {
  c.set('echo', (str) => str)
  await next()
})

app.get('/echo', echoMiddleware, (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

複数のハンドラでミドルウェアを使いたい場合、 `app.use()` を使います。
次に、 `Env` ジェネリクスを `Hono` コンストラクタに渡して型安全にするべきです。

```ts twoslash
import { Hono } from 'hono'
import type { MiddlewareHandler } from 'hono/types'
declare const echoMiddleware: MiddlewareHandler
type Env = {
  Variables: {
    echo: (str: string) => string
  }
}
// ---cut---
const app = new Hono<Env>()

app.use(echoMiddleware)

app.get('/echo', (c) => {
  return c.text(c.var.echo('Hello!'))
})
```

## render() / setRenderer()

カスタムミドルウェア内で `c.setRenderer()` を使用してレイアウトを設定できます。

```tsx twoslash
/** @jsx jsx */
/** @jsxImportSource hono/jsx */
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
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

次に、 `c.render()` を使用してそのレイアウトでレスポンスを作成します。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.get('/', (c) => {
  return c.render('Hello!')
})
```

このような出力になります:

```html
<html>
  <body>
    <p>Hello!</p>
  </body>
</html>
```

また、この機能は柔軟に引数を設定することもできます。
型安全のために、型を次のように設定できます:

```ts
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      head: { title: string }
    ): Response | Promise<Response>
  }
}
```

使用例を以下に示します:

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

Cloudflare Workers の [ExecutionContext](https://developers.cloudflare.com/workers/runtime-apis/context/) にアクセスできます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{
  Bindings: {
    KV: any
  }
}>()
declare const key: string
declare const data: string
// ---cut---
// ExecutionContext object
app.get('/foo', async (c) => {
  c.executionCtx.waitUntil(c.env.KV.put(key, data))
  // ...
})
```

The `ExecutionContext` also has an [`exports`](https://developers.cloudflare.com/workers/runtime-apis/context/#exports) field. To get autocomplete with Wrangler's generated types, you can use module augmentation:

```ts
import 'hono'

declare module 'hono' {
  interface ExecutionContext {
    readonly exports: Cloudflare.Exports
  }
}
```

## event

Cloudflare Workers の `FetchEvent` にアクセスできます。 これは "Service Worker" 構文で使用されていましたが、現在は非推奨です。

```ts twoslash
import { Hono } from 'hono'
declare const key: string
declare const data: string
type KVNamespace = any
// ---cut---
// Type definition to make type inference
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// FetchEvent object (only set when using Service Worker syntax)
app.get('/foo', async (c) => {
  c.event.waitUntil(c.env.MY_KV.put(key, data))
  // ...
})
```

## env

Cloudflare Workers の環境変数、シークレット、 KV ネームスペース、 D1 データベース、 R2 バケット等... をバインディングと呼びます。
種類に関係なく、バインディングは常にグローバル変数として利用でき、 `c.env.BINDING_KEY` からアクセスできます。

```ts twoslash
import { Hono } from 'hono'
type KVNamespace = any
// ---cut---
// Type definition to make type inference
type Bindings = {
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()

// Environment object for Cloudflare Workers
app.get('/', async (c) => {
  c.env.MY_KV.get('my-key')
  // ...
})
```

## error

ハンドラでエラーが発生した場合、エラーオブジェクトは `c.error` に格納されます。
ミドルウェアからアクセスできます。

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  await next()
  if (c.error) {
    // do something...
  }
})
```

## ContextVariableMap

例えば、特定のミドルウェアを使うときに変数へ型定義を追加したい場合、このように `ContextVariableMap` を使用できます:

```ts
declare module 'hono' {
  interface ContextVariableMap {
    result: string
  }
}
```

これをミドルウェアで利用できます:

```ts twoslash
import { createMiddleware } from 'hono/factory'
// ---cut---
const mw = createMiddleware(async (c, next) => {
  c.set('result', 'some values') // result is a string
  await next()
})
```

ハンドラで、変数は適切な型を推論されます:

```ts twoslash
import { Hono } from 'hono'
const app = new Hono<{ Variables: { result: string } }>()
// ---cut---
app.get('/', (c) => {
  const val = c.get('result') // val is a string
  // ...
  return c.json({ result: val })
})
```
