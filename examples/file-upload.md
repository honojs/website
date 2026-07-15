# File Upload

You can upload files with `multipart/form-data`. Uploaded fields are available via `c.req.parseBody()`.

## Basic example

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  const file = body['file']

  if (!(file instanceof File)) {
    return c.text('File is required', 400)
  }

  return c.json({
    name: file.name,
    size: file.size,
    type: file.type,
  })
})
```

## Limit upload size

```ts
import { Hono } from 'hono'
import { bodyLimit } from 'hono/body-limit'

const app = new Hono()

app.post(
  '/upload',
  bodyLimit({
    maxSize: 5 * 1024 * 1024, // 5 MiB
    onError: (c) => {
      return c.text('File too large', 413)
    },
  }),
  async (c) => {
    const body = await c.req.parseBody()
    const file = body['file']

    if (!(file instanceof File)) {
      return c.text('File is required', 400)
    }

    return c.text(`Uploaded ${file.name}`)
  }
)
```

## Multiple files

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody({ all: true })
  const value = body['file']

  const files = Array.isArray(value)
    ? value.filter((item): item is File => item instanceof File)
    : value instanceof File
      ? [value]
      : []

  if (files.length === 0) {
    return c.text('At least one file is required', 400)
  }

  return c.json({
    count: files.length,
    files: files.map((file) => ({
      name: file.name,
      size: file.size,
      type: file.type,
    })),
  })
})
```

## Validate before persisting

Before writing uploaded files to disk or forwarding them to another service, validate that the expected fields exist and check metadata such as filename, MIME type, and size.

## See also

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)
- [Body Limit Middleware](/docs/middleware/builtin/body-limit)
- [Validation](/docs/guides/validation)
