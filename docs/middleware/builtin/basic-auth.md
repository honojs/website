# Basic Auth Middleware

This middleware can apply Basic authentication to a specified path.
Implementing Basic authentication with Cloudflare Workers or other platforms is more complicated than it seems, but with this middleware, it's a breeze.

For more information about how the Basic auth scheme works under the hood, see the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme).

## Import

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

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

app.delete(
  '/auth/page',
  basicAuth({ username: 'hono', password: 'acoolproject' }),
  (c) => {
    return c.text('Page deleted')
  }
)
```

If you want to verify the user by yourself, specify the `verifyUser` option; returning `true` means it is accepted.

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

## Options

- `username`: string - _required_
  - The username of the user who is authenticating
- `password`: string - _required_
  - The password value for the provided username to authenticate against
- `verifyUser`: `(username: string, password: string, c: Context) => boolean | Promise<boolean>`
  - The function to verify the user
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
