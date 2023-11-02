# Deno

[Deno](https://deno.com/) is a JavaScript runtime built on V8. It's not Node.js.
Hono also works on Deno.

You can use Hono, write the code with TypeScript, run the application with the `deno` command, and deploy it to "Deno Deploy".

## 1. Install Deno

First, install `deno` command.
Please refer to [the official document](https://docs.deno.com/runtime/manual/getting_started/installation).

## 2. Setup

A starter for Deno is available.
Start your project with "create-hono" command.

```txt
deno run -A npm:create-hono my-app
```

Move into `my-app`. For Deno, you don't have to install Hono explicitly.

```
cd my-app
```

## 3. Hello World

Write your first application.

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

## 4. Run

Just this command:

```
deno run --allow-net hello.ts
```

## Change port number

You can specify the port number with the `port` option.

```ts
Deno.serve({ port: 8787 }, app.fetch)
```

## Serve static files

To server static files, use `serveStatic` imported from `hono/middleware.ts`.

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { serveStatic } from 'https://deno.land/x/hono/middleware.ts'

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
    rewriteRequestPath: (path) => path.replace(/^\/static/, '/statics'),
  })
)
```

## Deno Deploy

Deno Deploy is an edge runtime platform for Deno.
We can publish the application world widely on Deno Deploy.

Hono also supports Deno Deploy. Please refer to [the official document](https://docs.deno.com/deploy/manual/).

## Testing

Testing the application on Deno is easy.
You can write with `Deno.test` and use `assert` or `assertEquals` from the standard library.

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { assertEquals } from 'https://deno.land/std/assert/mod.ts'

Deno.test('Hello World', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))

  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})
```

Then run the command:

```
deno test hello.ts
```

## JSX Pragma

Hono on Deno also supports JSX middleware.
When you use it, write JSX Pragma on the top to specify the JSX function.

```tsx
/** @jsx jsx */
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jsx } from 'https://deno.land/x/hono/middleware.ts'

const app = new Hono()

app.get('/', (c) => {
  return c.html(<h1>Hello Deno!</h1>)
})

Deno.serve(app.fetch)
```

## `npm:` specifier

`npm:hono` is also available.

```ts
import { Hono } from 'npm:hono'
```

You can use either `npm:hono` or `deno.land/x/hono`.

If you want to use Third-party Middleware, you need to use the `npm:` specifier, such as `npm:@hono/zod-validator`, and you should avoid using both `npm:` and `deno.land/x/hono` together.

~~However, `npm:hono` doesn't work on Deno Deploy. So, if you want to deploy to Deno Deploy, use `deno.land/x/hono`.~~

As of September 6, 2023, Deno announced [native npm support on Deno Deploy](https://deno.com/blog/npm-on-deno-deploy). However, it has not been tested yet on the `hono` and `@hono` packages.

If you experience any problems, or want to run test, please open an issue/pr to the respective library.
