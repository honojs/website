---
title: Serve Static Middleware
---

# Serve Static Middleware

This middleware distributes asset files that are put in directory specified `root` or `path` option.

Serve Static Middleware is available only on Cloudflare Workers, Deno, and Bun.

{{< hint info >}}
Note: Lagon serves your static files using the `public` directory by default, so there is no need to use this middleware.
{{< /hint >}}

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
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('This is Home! You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
```

## Directory structure

### Deno and Bun

On Deno and Bun, the directory where you execute the command will be the root directory.
For the above code, it will work well with the following directory structure.

```
./
├── favicon.ico
├── index.ts
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### Cloudflare Workers

On Cloudflare Workers, you need to setup.
Static files are distributed by using [Workers Sites](https://developers.cloudflare.com/workers/platform/sites/). To enable this feature, edit `wrangler.toml` and specify the directory where the static files will be placed.

`wrangler.toml`:

```toml
[site]
bucket = "./assets"
```

Then create the `assets` directory and place the files there.

```
./
├── assets
│   ├── favicon.ico
│   └── static
│       ├── demo
│       │   └── index.html
│       ├── fallback.txt
│       └── images
│           └── dinotocat.png
├── package.json
├── src
│   └── index.ts
└── wrangler.toml
```

## Example

<https://github.com/honojs/examples/tree/main/serve-static>
