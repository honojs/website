---
title: Serve Static Middleware
---

# Serve Static Middleware

This middleware distributes asset files that are put on the project statically.

Serve Static Middleware is available only on Cloudflare Workers, Deno, and Bun.

## Import

{{< tabs "import" >}}
{{< tab "Cloudflare Service Worker" >}}
```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static'
```
{{< /tab >}}
{{< tab "Cloudflare Module Worker" >}}
```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.module'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< tab "Bun" >}}
```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/serve-static.bun'
```
{{< /tab >}}
{{< /tabs >}}

## Usage

```ts
const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.get('/', (c) => c.text('This is Home! You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
```

## For Cloudflare Workers

wrangler.toml:

```toml
[site]
bucket = "./assets"
```

Asset files:

```
./assets
└── static
    ├── demo
    │   └── index.html
    ├── hello.txt
    ├── fallback.txt
    └── images
        └── dinotocat.png
```

## Example

<https://github.com/honojs/examples/tree/master/serve-static>
