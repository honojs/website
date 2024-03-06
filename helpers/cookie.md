# Cookie Helper

The Cookie Helper provides an easy interface to manage cookies, enabling developers to set, parse, and delete cookies seamlessly.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { getCookie, getSignedCookie, setCookie, setSignedCookie, deleteCookie } from 'hono/cookie'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'https://deno.land/x/hono/helper.ts'
```

:::

## Usage

**NOTE**: Setting and retrieving signed cookies returns a Promise due to the async nature of the WebCrypto API, which is used to create HMAC SHA-256 signatures.

```ts
const app = new Hono()

app.get('/cookie', (c) => {
  const allCookies = getCookie(c)
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  deleteCookie(c, 'delicious_cookie')
  //
})

app.get('/signed-cookie', async (c) => {
  const secret = 'secret ingredient'
  // `getSignedCookie` will return `false` for a specified cookie if the signature was tampered with or is invalid
  const allSignedCookies = await getSignedCookie(c, secret)
  const fortuneCookie = await getSignedCookie(c, secret, 'fortune_cookie')
  // ...
  const anotherSecret = 'secret chocolate chips'
  await setSignedCookie(c, 'great_cookie', 'blueberry', anotherSecret)
  deleteCookie(c, 'great_cookie')
  //
})
```

## Options

### `setCookie` & `setSignedCookie`

- `domain`: string
- `expires`: Date
- `httpOnly`: boolean
- `maxAge`: number
- `path`: string
- `secure`: boolean
- `sameSite`: `'Strict'` | `'Lax'` | `'None'`
- `partitioned`: boolean

Example:

```ts
// Regular cookies
setCookie(c, 'great_cookie', 'banana', {
  path: '/',
  secure: true,
  domain: 'example.com',
  httpOnly: true,
  maxAge: 1000,
  expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
  sameSite: 'Strict',
})

// Signed cookies
await setSignedCookie(c, 'fortune_cookie', 'lots-of-money', 'secret ingredient', {
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
