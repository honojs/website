# Logger Middleware

It's a simple logger.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { logger } from 'hono/logger'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { logger } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

app.use('*', logger())
app.get('/', (c) => c.text('Hello Hono!'))
```
