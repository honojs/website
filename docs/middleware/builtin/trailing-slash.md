# Trailing Slash Middleware

This middleware handles Trailing Slash in the URL on a GET request.

`appendTrailingSlash` redirects the URL to which it added the Trailing Slash if the content was not found. Also, `trimTrailingSlash` will remove the Trailing Slash.

## Import

```ts
import { Hono } from 'hono'
import {
  appendTrailingSlash,
  trimTrailingSlash,
} from 'hono/trailing-slash'
```

## Usage

Example of redirecting a GET request of `/about/me` to `/about/me/`.

```ts
import { Hono } from 'hono'
import { appendTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(appendTrailingSlash())
app.get('/about/me/', (c) => c.text('With Trailing Slash'))
```

Example of redirecting a GET request of `/about/me/` to `/about/me`.

```ts
import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(trimTrailingSlash())
app.get('/about/me', (c) => c.text('Without Trailing Slash'))
```

## Options

### <Badge type="info" text="optional" /> alwaysRedirect: `boolean`

By default, trailing slash middleware only redirects when the response status is `404`. When `alwaysRedirect` is set to `true`, the middleware redirects before executing handlers. This is useful for wildcard routes (`*`) where the default behavior doesn't work.

```ts
const app = new Hono()

app.use(trimTrailingSlash({ alwaysRedirect: true }))
app.get('/my-path/*', (c) => c.text('Wildcard route'))
```

This option is available for both `trimTrailingSlash` and `appendTrailingSlash`.

## Note

It will be enabled when the request method is `GET` and the response status is `404`.
