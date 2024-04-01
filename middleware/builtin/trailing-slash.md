# Trailing Slash Middleware

These middlewares resolve the trailing slash of URL on a GET request.

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

```ts
const app = new Hono()

app.get('*', appendTrailingSlash())
// or
app.get('*', trimTrailingSlash())
```
