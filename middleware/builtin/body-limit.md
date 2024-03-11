# Body Limit Middleware

The Body Limit Middleware can limit the file size of the request body.

This middleware first uses the value of the `Content-Length` header in the request, if present.
If it is not set, it reads the body in the stream and executes an error handler if it is larger than the specified file size.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { bodyLimit } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```ts
const app = new Hono()

app.post(
  '/upload',
  bodyLimit({
    maxSize: 50 * 1024, // 50kb
    onError: (c) => {
      return c.text('overflow :(', 413)
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()
    if (body['file'] instanceof File) {
      console.log(`Got file sized: ${body['file'].size}`)
    }
    return c.text('pass :)')
  }
)
```

## Options

- `maxSize`: number - _required_
  - The maximum file size of the file you want to limit. The default is `100 * 1024` - `100kb`.
- `onError`: `OnError`
  - The error handler to be invoked if the specified file size is exceeded.
