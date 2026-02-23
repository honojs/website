# Basic 認証ミドルウェア

このミドルウェアは、特定のパスに Basic 認証を設定することができます。
Cloudflare Workers や他のプラットフォームで Basic 認証を実装することは思ったよりも複雑ですが、このミドルウェアを使えば簡単にできます。

Basic 認証方式が内部でどのように動くか知りたい場合は、 [MDN のドキュメント](https://developer.mozilla.org/ja/docs/Web/HTTP/Guides/Authentication#basic_%E8%AA%8D%E8%A8%BC%E6%96%B9%E5%BC%8F) をご覧ください。

## Import

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

## 使い方

```ts
const app = new Hono()

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

特定のルート + メソッドを制限します:

```ts
const app = new Hono()

app.get('/auth/page', (c) => {
  return c.text('Viewing page')
})

app.delete(
  '/auth/page',
  basicAuth({ username: 'hono', password: 'acoolproject' }),
  (c) => {
    return c.text('Page deleted')
  }
)
```

ユーザーを自分で検証したい場合は、 `verifyUser` オプションを指定してください。 `true` を返すことで、資格情報が受け入れられたことを示します。

```ts
const app = new Hono()

app.use(
  basicAuth({
    verifyUser: (username, password, c) => {
      return (
        username === 'dynamic-user' && password === 'hono-password'
      )
    },
  })
)
```

## オプション

### <Badge type="danger" text="required" /> username: `string`

認証されている人のユーザー名。

### <Badge type="danger" text="required" /> password: `string`

そのユーザーのパスワード。

### <Badge type="info" text="optional" /> realm: `string`

The domain name of the realm, as part of the returned WWW-Authenticate challenge header. The default is `"Secure Area"`.
詳しくは: https://developer.mozilla.org/ja/docs/Web/HTTP/Reference/Headers/WWW-Authenticate#digest

### <Badge type="info" text="optional" /> hashFunction: `Function`

パスワードを安全に比較するためのハッシュ関数。

### <Badge type="info" text="optional" /> verifyUser: `(username: string, password: string, c: Context) => boolean | Promise<boolean>`

ユーザーを検証する関数。

### <Badge type="info" text="optional" /> invalidUserMessage: `string | object | MessageFunction`

`MessageFunction` は `(c: Context) => string | object | Promise<string | object>` 。 ユーザーが無効だったときのメッセージ。

### <Badge type="info" text="optional" /> onAuthSuccess: `(c: Context, username: string) => void | Promise<void>`

A callback function invoked after successful authentication. This allows you to set context variables or perform side effects without re-parsing the Authorization header.

```ts
app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
    onAuthSuccess: (c, username) => {
      c.set('username', username)
    },
  })
)

app.get('/auth/page', (c) => {
  const username = c.get('username')
  return c.text(`Hello, ${username}!`)
})
```

## More Options

### <Badge type="info" text="optional" /> ...users: `{ username: string, password: string }[]`

## レシピ

### 複数ユーザーの設定

このミドルウェアでは、 `username` と `password` のペアを含む任意の数のオブジェクトをパラメータとして渡すこともできます。

```ts
app.use(
  '/auth/*',
  basicAuth(
    {
      username: 'hono',
      password: 'acoolproject',
      // Define other params in the first object
      realm: 'www.example.com',
    },
    {
      username: 'hono-admin',
      password: 'super-secure',
      // Cannot redefine other params here
    },
    {
      username: 'hono-user-1',
      password: 'a-secret',
      // Or here
    }
  )
)
```

Or less hardcoded:

```ts
import { users } from '../config/users'

app.use(
  '/auth/*',
  basicAuth(
    {
      realm: 'www.example.com',
      ...users[0],
    },
    ...users.slice(1)
  )
)
```
