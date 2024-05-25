# CSRF Protection

CSRF Protection Middleware prevents CSRF attacks by checking request headers.

This middleware protects against CSRF attacks such as submitting with a form element by comparing the value of the `Origin` header with the requested URL.

Old browsers that do not send `Origin` headers, or environments that use reverse proxies to remove `Origin` headers, may not work well. In such environments, use the other CSRF token methods.

## Import

```ts
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
```

## Usage

```ts
const app = new Hono()

app.use(csrf())

// Specifying origins with using `origin` option
// string
app.use(csrf({ origin: 'myapp.example.com' }))

// string[]
app.use(
  csrf({
    origin: ['myapp.example.com', 'development.myapp.example.com'],
  })
)

// Function
// It is strongly recommended that the protocol be verified to ensure a match to `$`.
// You should *never* do a forward match.
app.use(
  '*',
  csrf({
    origin: (origin) => /https:\/\/(\w+\.)?myapp\.example\.com$/.test(origin),
  })
)
```

## Options

- `origin`: string | string[] | Function
  - Specify origins.
