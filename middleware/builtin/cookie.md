# Cookie Middleware

This middleware for setting, parsing and deleting Cookies.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { getCookie, setCookie, deleteCookie } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

app.get('/cookie', (c) => {
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  deleteCookie(c, 'delicious_cookie')
  //
})
```

## Options

### `setCookie`

- `domain`: string
- `expires`: Date
- `httpOnly`: boolean
- `maxAge`: number
- `path`: string
- `secure`: boolean
- `signed`: boolean
- `sameSite`: `'Strict'` | `'Lax'` | `'None'`

Example:

```ts
setCookie('great_cookie', 'banana', {
  path: '/',
  secure: true,
  domain: 'example.com',
  httpOnly: true,
  maxAge: 1000,
  expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
  sameSite: 'Strict',
})
```

### `deleteCookie`

- `path`: string
- `secure`: boolean
- `domain`: string

Example:

```ts
deleteCookie(c, 'banana', {
  path: '/',
  secure: true,
  domain: 'example.com',
})
```
