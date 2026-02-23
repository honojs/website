# ベストプラクティス

Hono はとても柔軟です。 あなたの好きなようにアプリを書くことが出来ます。
しかし、従ったほうが良いベストプラクティスもあります。

## できるだけ "コントローラー" を作らないでください

極力、 "Ruby on Rails のようなコントローラー" は作るべきではありません。

```ts
// 🙁
// A RoR-like Controller
const booksList = (c: Context) => {
  return c.json('list books')
}

app.get('/books', booksList)
```

問題は型に関係しています。 例えば、複雑なジェネリクスを書かない限り、コントローラーではパスパラメータを推論できません。

```ts
// 🙁
// A RoR-like Controller
const bookPermalink = (c: Context) => {
  const id = c.req.param('id') // Can't infer the path param
  return c.json(`get ${id}`)
}
```

そのため、 RoR-like なコントローラーを作る必要はなく、パス定義の直後にハンドラを書くべきです。

```ts
// 😃
app.get('/books/:id', (c) => {
  const id = c.req.param('id') // Can infer the path param
  return c.json(`get ${id}`)
})
```

## `hono/factory` の `factory.createHandlers()`

それでも RoR-like なコントローラーを作りたい場合、 [`hono/factory`](/docs/helpers/factory) の `factory.createHandlers()` を使ってください。 これを使う場合、型推論は正しく動作します。

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

// 😃
const factory = createFactory()

const middleware = factory.createMiddleware(async (c, next) => {
  c.set('foo', 'bar')
  await next()
})

const handlers = factory.createHandlers(logger(), middleware, (c) => {
  return c.json(c.var.foo)
})

app.get('/api', ...handlers)
```

## 大きなアプリケーションを作る

"Ruby on Rails のようなコントローラー" を作ること無く大きなアプリケーションを作るには `app.route()` を使います。

アプリケーションに `/authors` と `/books` というエンドポイントがあって `index.ts` を分割したい場合は `authors.ts` と `books.ts` を作成します。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list authors'))
app.post('/', (c) => c.json('create an author', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.json('list books'))
app.post('/', (c) => c.json('create a book', 201))
app.get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

次に、それらをインポートし `app.route()` で `/authors` と `/books` をマウントします。

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

// 😃
app.route('/authors', authors)
app.route('/books', books)

export default app
```

### RPC 機能を使いたい場合

上のコードは普通の使い方ではうまく動きます。
しかし、 `RPC` 機能を使いたい場合は以下のように変更することで正しい型にすることができます。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
export type AppType = typeof app
```

`app` の型を `hc` に渡すことで、正しい型になります。

```ts
import type { AppType } from './authors'
import { hc } from 'hono/client'

// 😃
const client = hc<AppType>('http://localhost') // Typed correctly
```

詳しくは、 [RPC のページ](/docs/guides/rpc#using-rpc-with-larger-applications) を御覧ください。
