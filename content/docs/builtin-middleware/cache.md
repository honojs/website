---
title: Cache Middleware
---

# Cache Middleware

The Cache middleware uses the Web Standard's [Cache API](https://developer.mozilla.org/en-US/docs/Web/API/Cache). It caches a given response according to the `Cache-Control` headers.

The Cache middleware currently supports Cloudflare Workers projects using custom domains and Deno projects using [Deno 1.26+](https://github.com/denoland/deno/releases/tag/v1.26.0). See [Usage](#usage) below for instructions on each platform.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}

```ts
import { Hono } from 'hono'
import { cache } from 'hono/cache'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { cache } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

## Usage

{{< tabs "Platforms" >}}
{{< tab "Cloudflare Workers" >}}

```ts
app.get('*', cache({ cacheName: 'my-app', cacheControl: 'max-age=3600' }))
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
// Must use `wait: true` for the Deno runtime
app.get('*', cache({ cacheName: 'my-app', cacheControl: 'max-age=3600', wait: true }))
```

{{< /tab >}}

{{< /tabs >}}

## Options

- `cacheName`: string - _required_
  - The name of the cache. Can be used to store multiple caches with different identifiers.
- `wait`: boolean
  - A boolean indicating if Hono should wait for the Promise of the `cache.put` function to resolve before continuing with the request. _Required to be true for the Deno environment_. Default is `false`.
- `cacheControl`: string
  - A string of directives for the `Cache-Control` header. See the [MDN docs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control) for more information. When this option is not provided, no `Cache-Control` header is added to requests.
