# Factory ヘルパー

Factory ヘルパーはミドルウェアのような Hono のコンポーネントを作るときに有用な機能を提供します。 時々、適切な TypeScript の型を設定することが難しい場合もありますが、このヘルパーはそれを簡単にします。

## インポート

```ts
import { Hono } from 'hono'
import { createFactory, createMiddleware } from 'hono/factory'
```

## `createFactory()`

`createFactory()` は Factory クラスのインスタンスを作ります。

```ts
import { createFactory } from 'hono/factory'

const factory = createFactory()
```

`Env` (バインディングや `c.var.*` など) の型をジェネリクスとして渡すことが出来ます:

```ts
type Env = {
  Variables: {
    foo: string
  }
}

const factory = createFactory<Env>()
```

### Options

### <Badge type="info" text="optional" /> defaultAppOptions: `HonoOptions`

The default options to pass to the Hono application created by `createApp()`.

```ts
const factory = createFactory({
  defaultAppOptions: { strict: false },
})

const app = factory.createApp() // `strict: false` is applied
```

## `createMiddleware()`

`createMiddleware()` は `factory.createMiddleware()` のショートカットです。
この関数は、カスタムミドルウェアを作成します。

```ts
const messageMiddleware = createMiddleware(async (c, next) => {
  await next()
  c.res.headers.set('X-Message', 'Good morning!')
})
```

ヒント: `message` のような引数を受け取りたい場合、次のような関数を作ることが出来ます。

```ts
const messageMiddleware = (message: string) => {
  return createMiddleware(async (c, next) => {
    await next()
    c.res.headers.set('X-Message', message)
  })
}

app.use(messageMiddleware('Good evening!'))
```

## `factory.createHandlers()`

`createHandlers()` は `app.get('/')` とは別の場所でハンドラを定義するのに役立ちます。

```ts
import { createFactory } from 'hono/factory'
import { logger } from 'hono/logger'

// ...

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

## `factory.createApp()`

`createApp()` は適切な型で Hono のインスタンスを作ることを助けてくれます。 このメソッドを `createFactory()` と一緒に使うと、 `Env` の型定義の重複を避けることが出来ます。

次のようなアプリケーションは、 `Env` を二箇所で設定する必要があります:

```ts
import { createMiddleware } from 'hono/factory'

type Env = {
  Variables: {
    myVar: string
  }
}

// 1. Set the `Env` to `new Hono()`
const app = new Hono<Env>()

// 2. Set the `Env` to `createMiddleware()`
const mw = createMiddleware<Env>(async (c, next) => {
  await next()
})

app.use(mw)
```

`createFactory()` と `createApp()` を使うことで、 `Env` を一箇所だけセットするだけで良くなります。

```ts
import { createFactory } from 'hono/factory'

// ...

// Set the `Env` to `createFactory()`
const factory = createFactory<Env>()

const app = factory.createApp()

// factory also has `createMiddleware()`
const mw = factory.createMiddleware(async (c, next) => {
  await next()
})
```

`createFactory()` には `createApp()` で作られた `app` を初期化するための `initApp` オプションを渡すことが出来ます。 このようにオプションを使います。

```ts
// factory-with-db.ts
type Env = {
  Bindings: {
    MY_DB: D1Database
  }
  Variables: {
    db: DrizzleD1Database
  }
}

export default createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = drizzle(c.env.MY_DB)
      c.set('db', db)
      await next()
    })
  },
})
```

```ts
// crud.ts
import factoryWithDB from './factory-with-db'

const app = factoryWithDB.createApp()

app.post('/posts', (c) => {
  c.var.db.insert()
  // ...
})
```
