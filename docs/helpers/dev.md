# Dev ヘルパー

Dev ヘルパーは開発中に使用することができる便利なメソッドを提供します。

```ts
import { Hono } from 'hono'
import { getRouterName, showRoutes } from 'hono/dev'
```

## `getRouterName()`

現在使用しているルーターの名前を `getRouterName()` で取得できます。

```ts
const app = new Hono()

// ...

console.log(getRouterName(app))
```

## `showRoutes()`

`showRoutes()` 関数はコンソールに登録されているルートを表示します。

次のようなアプリケーションを考えてみましょう:

```ts
const app = new Hono().basePath('/v1')

app.get('/posts', (c) => {
  // ...
})

app.get('/posts/:id', (c) => {
  // ...
})

app.post('/posts', (c) => {
  // ...
})

showRoutes(app, {
  verbose: true,
})
```

アプリケーションが起動する時、このようにルートがコンソールに表示されます:

```txt
GET   /v1/posts
GET   /v1/posts/:id
POST  /v1/posts
```

## オプション

### <Badge type="info" text="optional" /> verbose: `boolean`

`true` に設定すると、詳細な情報を表示します。

### <Badge type="info" text="optional" /> colorize: `boolean`

`false` に設定すると、出力に色が付きません。
