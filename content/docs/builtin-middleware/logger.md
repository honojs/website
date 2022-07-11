---
title: Logger Middleware
---

# Logger Middleware

It's a simple logger.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { logger } from 'hono/logger'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { logger } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< /tabs >}}


## Usage

```ts
const app = new Hono()

app.use('*', logger())
app.get('/', (c) => c.text('Hello Hono!'))
```
