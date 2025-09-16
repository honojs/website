# Deno

[Deno](https://deno.com/) is a JavaScript runtime built on V8. It's not Node.js.
Hono also works on Deno.

You can use Hono, write the code with TypeScript, run the application with the `deno` command, and deploy it to "Deno Deploy".

## 1. Install Deno

First, install `deno` command.
Please refer to [the official document](https://docs.deno.com/runtime/getting_started/installation/).

## 2. Setup

A starter for Deno is available.
Start your project with the [`deno init`](https://docs.deno.com/runtime/reference/cli/init/) command.

```sh
deno init --npm hono my-app --template=deno
```

Move into `my-app`. For Deno, you don't have to install Hono explicitly.

```sh
cd my-app
```

## 3. Hello World

Edit `main.ts`:

```ts [main.ts]
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

## 4. Run

Run the development server locally. Then, access `http://localhost:8000` in your Web browser.

```sh
deno task start
```

## Change port number

You can specify the port number by updating the arguments of `Deno.serve` in `main.ts`:

```ts
Deno.serve(app.fetch) // [!code --]
Deno.serve({ port: 8787 }, app.fetch) // [!code ++]
```

## Serve static files

To serve static files, use `serveStatic` imported from `hono/deno`.

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))

Deno.serve(app.fetch)
```

For the above code, it will work well with the following directory structure.

```
./
├── favicon.ico
├── index.ts
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

If you want to map `http://localhost:8000/static/*` to `./statics`, you can use the `rewriteRequestPath` option:

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

You can add MIME types with `mimes`:

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
  })
)
```

### `onFound`

You can specify handling when the requested file is found with `onFound`:

```ts
app.get(
  '/static/*',
  serveStatic({
    // ...
    onFound: (_path, c) => {
      c.header('Cache-Control', `public, immutable, max-age=31536000`)
    },
  })
)
```

### `onNotFound`

You can specify handling when the requested file is not found with `onNotFound`:

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
  })
)
```

### `precompressed`

The `precompressed` option checks if files with extensions like `.br` or `.gz` are available and serves them based on the `Accept-Encoding` header. It prioritizes Brotli, then Zstd, and Gzip. If none are available, it serves the original file.

```ts
app.get(
  '/static/*',
  serveStatic({
    precompressed: true,
  })
)
```

## Deno Deploy

Deno Deploy is a serverless platform for running JavaScript and TypeScript applications in the cloud.
It provides a management plane for deploying and running applications through integrations like GitHub deployment.

Hono also works on Deno Deploy. Please refer to [the official document](https://docs.deno.com/deploy/manual/).

## Testing

Testing the application on Deno is easy.
You can write with `Deno.test` and use `assert` or `assertEquals` from [@std/assert](https://jsr.io/@std/assert).

```sh
deno add jsr:@std/assert
```

```ts [hello.ts]
import { Hono } from 'hono'
import { assertEquals } from '@std/assert'

Deno.test('Hello World', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))

  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})
```

Then run the command:

```sh
deno test hello.ts
```

## npm and JSR

Hono is available on both [npm](https://www.npmjs.com/package/hono) and [JSR](https://jsr.io/@hono/hono) (the JavaScript Registry). You can use either `npm:hono` or `jsr:@hono/hono` in your `deno.json`:

```json
{
  "imports": {
    "hono": "jsr:@hono/hono" // [!code --]
    "hono": "npm:hono" // [!code ++]
  }
}
```

When using third-party middleware, you may need to use Hono from the same registry as the middleware for proper TypeScript type inference. For example, if using the middleware from npm, you should also use Hono from npm:

```json
{
  "imports": {
    "hono": "npm:hono",
    "zod": "npm:zod",
    "@hono/zod-validator": "npm:@hono/zod-validator"
  }
}
```

We also provide many third-party middleware packages on [JSR](https://jsr.io/@hono). When using the middleware on JSR, use Hono from JSR:

```json
{
  "imports": {
    "hono": "jsr:@hono/hono",
    "zod": "npm:zod",
    "@hono/zod-validator": "jsr:@hono/zod-validator"
  }
}
```
