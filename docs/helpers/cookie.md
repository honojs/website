# Cookie Helper

The Cookie Helper provides an easy interface to manage cookies, enabling developers to set, parse, and delete cookies seamlessly.

## Import

```ts
import { Hono } from 'hono'
import {
  getCookie,
  getSignedCookie,
  setCookie,
  setSignedCookie,
  deleteCookie,
} from 'hono/cookie'
```

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
  const fortuneCookie = await getSignedCookie(
    c,
    secret,
    'fortune_cookie'
  )
  // ...
  const anotherSecret = 'secret chocolate chips'
  await setSignedCookie(c, 'great_cookie', 'blueberry', anotherSecret)
  deleteCookie(c, 'great_cookie')
  //
})
```

## Options

### `setCookie` & `setSignedCookie`

- domain: `string`
- expires: `Date`
- httpOnly: `boolean`
- maxAge: `number`
- path: `string`
- secure: `boolean`
- sameSite: `'Strict'` | `'Lax'` | `'None'`
- prefix: `secure` | `'host'`
- partitioned: `boolean`

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
await setSignedCookie(
  c,
  'fortune_cookie',
  'lots-of-money',
  'secret ingredient',
  {
    path: '/',
    secure: true,
    domain: 'example.com',
    httpOnly: true,
    maxAge: 1000,
    expires: new Date(Date.UTC(2000, 11, 24, 10, 30, 59, 900)),
    sameSite: 'Strict',
  }
)
```

### `deleteCookie`

- path: `string`
- secure: `boolean`
- domain: `string`

Example:

```ts
deleteCookie(c, 'banana', {
  path: '/',
  secure: true,
  domain: 'example.com',
})
```

`deleteCookie` returns the deleted value:

```ts
const deletedCookie = deleteCookie(c, 'delicious_cookie')
```

## `__Secure-` and `__Host-` prefix

The Cookie helper supports `__Secure-` and `__Host-` prefix for cookies names.

If you want to verify if the cookie name has a prefix, specify the prefix option.

```ts
const securePrefixCookie = getCookie(c, 'yummy_cookie', 'secure')
const hostPrefixCookie = getCookie(c, 'yummy_cookie', 'host')

const securePrefixSignedCookie = await getSignedCookie(
  c,
  secret,
  'fortune_cookie',
  'secure'
)
const hostPrefixSignedCookie = await getSignedCookie(
  c,
  secret,
  'fortune_cookie',
  'host'
)
```

Also, if you wish to specify a prefix when setting the cookie, specify a value for the prefix option.

```ts
setCookie(c, 'delicious_cookie', 'macha', {
  prefix: 'secure', // or `host`
})

await setSignedCookie(
  c,
  'delicious_cookie',
  'macha',
  'secret choco chips',
  {
    prefix: 'secure', // or `host`
  }
)
```

## Following the best practices

A New Cookie RFC (a.k.a cookie-bis) and CHIPS include some best practices for Cookie settings that developers should follow.

- [RFC6265bis-13](https://datatracker.ietf.org/doc/html/draft-ietf-httpbis-rfc6265bis-13)
  - `Max-Age`/`Expires` limitation
  - `__Host-`/`__Secure-` prefix limitation
- [CHIPS-01](https://www.ietf.org/archive/id/draft-cutler-httpbis-partitioned-cookies-01.html)
  - `Partitioned` limitation

Hono is following the best practices.
The cookie helper will throw an `Error` when parsing cookies under the following conditions:

- The cookie name starts with `__Secure-`, but `secure` option is not set.
- The cookie name starts with `__Host-`, but `secure` option is not set.
- The cookie name starts with `__Host-`, but `path` is not `/`.
- The cookie name starts with `__Host-`, but `domain` is not set.
- The `maxAge` option value is greater than 400 days.
- The `expires` option value is 400 days later than the current time.
