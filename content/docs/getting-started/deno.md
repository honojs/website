# Deno

Deno is a JavaScript runtime built on V8. It's not Node.js.
Hono also works on Deno.

You can import Hono from the HTTP URL, write the code with TypeScript, run the application with the `deno` command, and deploy it to "*Deno Deploy*".

## 1. Install

First, install `deno` command. Please refer to [the official document](https://deno.land/manual/getting_started/installation).

Next, you don't have to install Hono explicitly. It will be installed just import the Hono module.

## 2. Hello World

Write your first application. It's enabled to write the code by TypeScript.

```ts
import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'https://deno.land/x/hono/mod.ts'

const app = new Hono()

app.get('/', (c) => c.text('Hello! Hono!'))

serve(app.fetch)
```

## 3. Run

Just this command:

```
deno run --allow-net hello.ts
```

## Deno Deploy

*Deno Deploy* is an edge runtime platform for Deno. We can publish the application world widely on Deno Deploy.

Hono also support Deno Deploy. Please refer to [the official document](https://deno.com).

## Advanced

### Testing

Testing the application on Deno is easy.
You can write with `Deno.test` and use `assert` or `assertEquals` from the standard library.

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts'

Deno.test('Hello World', async () => {
  const app = new Hono()
  app.get('/:foo', (c) => c.text('Please test me'))

  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})
```

### JSX Pragma

Hono on Deno also supports *JSX middleware*.
When you use it, write JSX Pragma on the top to specify the JSX function.


```tsx
/** @jsx jsx */
import { serve } from 'https://deno.land/std/http/server.ts'
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jsx } from 'https://deno.land/x/hono/middleware.ts'

const app = new Hono()

app.get('/', (c) => {
  return c.html(<h1>Hello Deno!</h1>)
})

serve(app.fetch)
```

