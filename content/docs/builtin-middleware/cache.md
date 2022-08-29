---
title: Cache Middleware
---

# Cache Middleware

Cache middleware uses Web Standard's [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache). Cache the response according to `Cache-Control` headers.
Cache API is supported only on Cloudflare Workers which is deployed on the custom domain. Deno will support it in the future: https://deno.com/deploy/docs/runtime-api.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
```
{{< /tab >}}
{{< /tabs >}}

## Usage

```ts
app.use('*', cache({ cacheName: 'my-app', cacheControl: 'max-age=3600' }))
```
