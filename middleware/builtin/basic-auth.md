# Basic Auth Middleware

This middleware can apply Basic authentication to a specified path.
Implementing Basic authentication with Cloudflare Workers or other platforms is more complicated than it seems, but with this middleware, it's a breeze.

For more information about how the Basic auth scheme works under the hood, see the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme).

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { basicAuth } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

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

To restrict to a specific route + method:

```ts
const app = new Hono()

app.get('/auth/page', (c) => {
  return c.text('Viewing page')
})

app.delete('/auth/page', basicAuth({ username: 'hono', password: 'acoolproject' }), (c) => {
  return c.text('Page deleted')
})
```

## Options

- `username`: string - _required_
  - The username of the user who is authenticating
- `password`: string - _required_
  - The password value for the provided username to authenticate against
- `realm`: string
  - The domain name of the realm, as part of the returned WWW-Authenticate challenge header. Default is `"Secure Area"`
  - See: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives>
- `hashFunction`: Function
  - A function to handle hashing for safe comparison of passwords

## More Options

`...users`: { `username`: string, `password`: string }[]

## Recipes

### Defining Multiple Users

This middleware also allows you to pass arbitrary parameters containing objects defining more `username` and `password` pairs.

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

### Using on Fastly Compute@Edge

To use this middleware on Compute@Edge, you need to do one of two things:

1. Polyfill the `crypto` module
2. Install the `crypto-js` package, and provide a `hashFunction` to the middleware. (recommended)

Here's how to use this middleware with the `crypto-js` method:

1. Install `crypto-js` via npm:

```
yarn add crypto-js
```

2. Provide a `hashFunction`, using the SHA-256 implementation from `crypto-js`, to the middleware:

```ts
import { SHA256 } from 'crypto-js'

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
    hashFunction: (d: string) => SHA256(d).toString(),
  })
)
```
