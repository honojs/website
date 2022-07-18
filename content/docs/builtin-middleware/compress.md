---
title: Compress Middleware
---

# Compress Middleware

Compress the response body, according to `Accept-Encoding` request header.

{{< hint info >}}
Note: On Cloudflare Workers, response body will be compressed automatically.
So, you don't have to use this middleware for Cloudflare Workers.
{{< /hint >}}

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { compress } from 'hono/compress'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { compress } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< /tabs >}}


## Usage

```ts
const app = new Hono()

app.use('*', compress())
```
