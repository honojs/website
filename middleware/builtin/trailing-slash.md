# Tailing Slash Middleware

This middleware resolves the handling of Trailing Slashes in GET requests.

`appendTrailingSlash` redirects to the URL to which it added the Tailing Slash if the content was not found. Also, `trimTrailingSlash` will remove the Tailing Slash.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { appendTrailingSlash, trimTrailingSlash } from 'hono/trailing-slash'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { appendTrailingSlash, trimTrailingSlash } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

Example of redirecting a GET request to `/about/me` to `/about/me/`.

```ts
import { Hono } from 'hono'
import { appendTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(appendTrailingSlash())
app.get('/about/me/', (c) => c.text('With Trailing Slash'))
```

Example of redirecting a GET request to `/about/me/` to `/about/me`.

```ts
import { Hono } from 'hono'
import { trimTrailingSlash } from 'hono/trailing-slash'

const app = new Hono({ strict: true })

app.use(trimTrailingSlash())
app.get('/about/me', (c) => c.text('Without Trailing Slash'))
```

## Note

It will be enabled when the request method is `GET` and the response status is `404`.
