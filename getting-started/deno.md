# Deno

[Deno](https://deno.land/) is a JavaScript runtime built on V8. It's not Node.js.
Hono also works on Deno.

You can use Hono, write the code with TypeScript, run the application with the `deno` command, and deploy it to "Deno Deploy".

## 1. Install Deno

First, install `deno` command.
Please refer to [the official document](https://deno.land/manual/getting_started/installation).

## 2. Setup

A starter for Deno is available.
Start your project with "create-hono" command.

```
npm create hono@latest my-app
```

Move into `my-app`. For Deno, you don't have to install Hono explicitly.

## 3. Hello World

Write your first application.

```ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'npm:hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

serve(app.fetch)
```

## 4. Run

Just this command:

```
deno run --allow-net hello.ts
```

## `deno.land/x/hono`

[deno.land/x/hono](https://deno.land/x/hono) is also available.

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { basicAuth } from 'https://deno.land/x/hono/middleware.ts'
```

You can use either `npm:hono` or `deno.land/x/hono`. `deno.land/x/hono` works on Deno Deploy. But, using it with Third-party Middleware may cause version mismatch.

## Serve static files

To server static files, use `serveStatic` imported from `hono/deno`.

```ts
import { serveStatic } from 'npm:hono/deno'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
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

## Deno Deploy

Deno Deploy is an edge runtime platform for Deno.
We can publish the application world widely on Deno Deploy.

Hono also supports Deno Deploy. Please refer to [the official document](https://deno.com).

## Testing

Testing the application on Deno is easy.
You can write with `Deno.test` and use `assert` or `assertEquals` from the standard library.

```ts
import { Hono } from 'npm:hono'
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'

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
import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'npm:hono'
import { jsx } from 'npm:hono/jsx'

const app = new Hono()

app.get('/', (c) => {
  return c.html(<h1>Hello Deno!</h1>)
})

serve(app.fetch)
```
