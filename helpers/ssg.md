# SSG Helper

This document describes the functionality for generating static sites using the Hono. The goal is to retrieve the contents of registered routes and save them as static files.

## Usage

### Manual

A simple usage example with Node.js is as follows:

```ts
app = new Hono()
app.get('/', (c) => c.html('Hello, World!'))
app.use('/about', async (c, next) => {
    c.setRenderer((content, head) => {
    return c.html(
        <html>
        <head>
            <title>{head.title || ''}</title>
        </head>
        <body>
            <p>{content}</p>
        </body>
        </html>
    )
    })
    await next()
})
app.get('/about', (c) => {
    return c.render('Hello!', { title: 'Hono SSG Page' })
})
export app
```

```ts
import app from "./index"
import { toSSG } from "hono/ssg"
import fs from "fs/promises"

toSSG(app, fs)
```

By doing this, the files will be output as follows:

```bash
ls ./static
about.html  index.html
```

### Vite Plugin

Using the `@hono/vite-ssg` Vite Plugin, you can easily handle the process.

For more details, see here:

https://github.com/honojs/vite-plugins/tree/main/packages/ssg

## toSSG

`toSSG` is the main function for generating static sites, taking an application and a filesystem module as arguments. It is based on the following:

### Input

The arguments for toSSG are specified in ToSSGInterface.

```ts
export interface ToSSGInterface<
  E extends Env = Env,
  S extends Schema = {},
  BasePath extends string = '/'
> {
  (
    app: Hono<E, S, BasePath>,
    fsModule: FileSystemModule,
    options?: ToSSGOptions
  ): Promise<ToSSGResult>
}
```

- `app` specifies `new Hono()` with registered routes.
- `fs` specifies the following object, assuming `node:fs/promise`.

```ts
export interface FileSystemModule {
  writeFile(path: string, data: string | Uint8Array): Promise<void>
  mkdir(path: string, options: { recursive: boolean }): Promise<void | string>
}
```

Built-in FileSystemModules are available for `Adaptor/deno` and `Adaptor/bun`.

### Options

Options are specified in the ToSSGOptions interface.

```ts
export interface ToSSGOptions {
  dir?: string
  beforeRequestHook?: BeforeRequestHook
  afterResponseHook?: AfterResponseHook
  afterGenerateHook?: AfterGenerateHook
}
```

`dir` is the output destination for Static files. The default value is `./static`.

Each Hook will be described later.

### Output

`toSSG` returns the result in the following Result type.

```ts
export interface ToSSGResult {
  success: boolean
  files: string[]
  error?: Error
}
```

## Hook

You can customize the process of `toSSG` by specifying the following custom hooks in options.

```ts
export type BeforeRequestHook = (req: Request) => Request | false
export type AfterResponseHook = (res: Response) => Response | false
export type AfterGenerateHook = (result: ToSSGResult) => void | Promise<void>
```

### BeforeRequestHook/AfterResponseHook

`toSSG` targets all routes registered in app, but if there are routes you want to exclude, you can filter them by specifying a Hook.

For example, if you want to output only GET requests, filter `req.method` in `beforeRequestHook`.

```ts
toSSG(app, fs, {
  beforeRequestHook: (req) => {
    if (req.method === 'GET') {
      return req
    }
    return false
  }
})
```

For example, if you want to output only when StatusCode is 200 or 500, filter `res.status` in `afterResponseHook`.

```ts
toSSG(app, fs, {
  afterResponseHook: (res) => {
    if (res.status === 200 || res.status === 500) {
      return res
    }
    return false
  },
})
```

### AfterGenerateHook

Use `afterGenerateHook` if you want to hook the result of `toSSG`.

```ts
toSSG(app, fs, {
  afterGenerateHook: (result) => {
    if (result.files) {
      result.files.forEach((file) => console.log(file))
    }
  })
})
```

## Generate File

### Route and Filename

The following rules apply to the registered route information and the generated file name. The default `./static` behaves as follows:

- `/` -> `./static/index.html`
- `/path` -> `./static/path.html`
- `/path/` -> `./static/path/index.html`


### File Extension

The file extension depends on the content returned by each route. For example, `c.html` or `c.render` is saved as `.html`.

Note that paths ending with a slash are saved as index.ext regardless of the extension.

```ts
# save to ./static/html/index.html
app.get('/html/', (c) => c.html('html'))

# save to ./static/text/index.txt
app.get('/text/', (c) => c.text('text'))
```

## Middleware

Introducing built-in middleware that supports SSG.

### ssgParams

You can use an API like generateStaticPaths.

Example:

```ts
app.get(
  '/shops/:id',
  ssgParams(async () => {
    const shops = await getShops()
    return shops.map((shop) => ({ id: shop.id }))
  }),
  async (c) => {
    const shop = await getShop(c.req.param('id'))
    if (!shop) {
      return c.notFound()
    }
    return c.render(
      <div>
        <h1>{shop.name}</h1>
      </div>
    )
  }
)
```

### disableSSG

Routes with the `disableSSG` middleware set are excluded from static file generation by `toSSG`.

```ts
app.get('/api', disableSSG(), (c) => c.text('an-api'))
```

### onlySSG

Routes with the `onlySSG` middleware set will be overridden by `c.notFound()` after `toSSG` execution.

```ts
app.get('/static-page', onlySSG(), (c) => c.html(<h1>Welcome to my site</h1>))
```
