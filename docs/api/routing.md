# ルーティング

Hono のルーティングは柔軟で直感的です。
では見てみましょう。

## 基本

```ts
// HTTP Methods
app.get('/', (c) => c.text('GET /'))
app.post('/', (c) => c.text('POST /'))
app.put('/', (c) => c.text('PUT /'))
app.delete('/', (c) => c.text('DELETE /'))

// Wildcard
app.get('/wild/*/card', (c) => {
  return c.text('GET /wild/*/card')
})

// Any HTTP methods
app.all('/hello', (c) => c.text('Any Method /hello'))

// Custom HTTP method
app.on('PURGE', '/cache', (c) => c.text('PURGE Method /cache'))

// Multiple Method
app.on(['PUT', 'DELETE'], '/post', (c) =>
  c.text('PUT or DELETE /post')
)

// Multiple Paths
app.on('GET', ['/hello', '/ja/hello', '/en/hello'], (c) =>
  c.text('Hello')
)
```

## パスパラメータ

```ts
app.get('/user/:name', (c) => {
  const name = c.req.param('name')
  ...
})
```

または一度に多くのパラメータを使用できます:

```ts
app.get('/posts/:id/comment/:comment_id', (c) => {
  const { id, comment_id } = c.req.param()
  ...
})
```

## オプションのパラメータ

```ts
// Will match `/api/animal` and `/api/animal/:type`
app.get('/api/animal/:type?', (c) => c.text('Animal!'))
```

## 正規表現

```ts
app.get('/post/:date{[0-9]+}/:title{[a-z]+}', (c) => {
  const { date, title } = c.req.param()
  ...
})
```

## スラッシュを含む

```ts
app.get('/posts/:filename{.+\\.png$}', (c) => {
  //...
})
```

## 連鎖的なルート

```ts
app
  .get('/endpoint', (c) => {
    return c.text('GET /endpoint')
  })
  .post((c) => {
    return c.text('POST /endpoint')
  })
  .delete((c) => {
    return c.text('DELETE /endpoint')
  })
```

## グループ化

Hono インスタンスを使用してルートをグループ化し、メインのアプリケーションで route メソッドを使用して追加します。

```ts
const book = new Hono()

book.get('/', (c) => c.text('List Books')) // GET /book
book.get('/:id', (c) => {
  // GET /book/:id
  const id = c.req.param('id')
  return c.text('Get Book: ' + id)
})
book.post('/', (c) => c.text('Create Book')) // POST /book

const app = new Hono()
app.route('/book', book)
```

## Grouping without changing base

You can also group multiple instances while keeping base.

```ts
const book = new Hono()
book.get('/book', (c) => c.text('List Books')) // GET /book
book.post('/book', (c) => c.text('Create Book')) // POST /book

const user = new Hono().basePath('/user')
user.get('/', (c) => c.text('List Users')) // GET /user
user.post('/', (c) => c.text('Create User')) // POST /user

const app = new Hono()
app.route('/', book) // Handle /book
app.route('/', user) // Handle /user
```

## 基底パス

基底パスを指定できます。

```ts
const api = new Hono().basePath('/api')
api.get('/book', (c) => c.text('List Books')) // GET /api/book
```

## ホスト名でルーティングする

ホスト名をルートに含めても動作します。

```ts
const app = new Hono({
  getPath: (req) => req.url.replace(/^https?:\/([^?]+).*$/, '$1'),
})

app.get('/www1.example.com/hello', (c) => c.text('hello www1'))
app.get('/www2.example.com/hello', (c) => c.text('hello www2'))
```

## `host` ヘッダを使用したルーティング

Hono コンストラクタに `getPath()` 関数を実装すると `host` ヘッダの値を処理できます。

```ts
const app = new Hono({
  getPath: (req) =>
    '/' +
    req.headers.get('host') +
    req.url.replace(/^https?:\/\/[^/]+(\/[^?]*)/, '$1'),
})

app.get('/www1.example.com/hello', () => c.text('hello www1'))

// A following request will match the route:
// new Request('http://www1.example.com/hello', {
//  headers: { host: 'www1.example.com' },
// })
```

これを応用すれば、 `User-Agent` ヘッダでルーティングを変更するようなことも出来ます。

## ルーティングの優先順序

ハンドラ、ミドルウェアは登録順に実行されます。

```ts
app.get('/book/a', (c) => c.text('a')) // a
app.get('/book/:slug', (c) => c.text('common')) // common
```

```
GET /book/a ---> `a`
GET /book/b ---> `common`
```

ハンドラが実行されると処理が停止します。

```ts
app.get('*', (c) => c.text('common')) // common
app.get('/foo', (c) => c.text('foo')) // foo
```

```
GET /foo ---> `common` // foo will not be dispatched
```

実行したいミドルウェアがある場合は、ハンドラよりも前に記述します。

```ts
app.use(logger())
app.get('/foo', (c) => c.text('foo'))
```

If you want to have a "_fallback_" handler, write the code below the other handler.

```ts
app.get('/bar', (c) => c.text('bar')) // bar
app.get('*', (c) => c.text('fallback')) // fallback
```

```
GET /bar ---> `fallback`
```

## グループの順序

ルーティングのグループ化の間違いは気が付きにくいので気をつけてください。
The `route()` function takes the stored routing from the second argument (such as `three` or `two`) and adds it to its own (`two` or `app`) routing.
`route()` 関数は、 2番目の引数から保存されたルーティング( `three` `two` など)を取得し、自分自身( `two` `app` )のルーティングに追加します。

```ts
three.get('/hi', (c) => c.text('hi'))
two.route('/three', three)
app.route('/two', two)

export default app
```

これは 200 レスポンスを返しますが、

```
GET /two/three/hi ---> `hi`
```

順序が間違っている場合は 404 を返します。

```ts
three.get('/hi', (c) => c.text('hi'))
app.route('/two', two) // `two` does not have routes
two.route('/three', three)

export default app
```

```
GET /two/three/hi ---> 404 Not Found
```
