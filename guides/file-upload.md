# File Upload

How about file upload? Is it possible?

## Basic File Upload

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/upload', async (c) => {
  const { image } = await c.req.parseBody()

  if (image instanceof File) {
    const buffer = await image.arrayBuffer()
  }

  return c.text('Uploaded!')
})
```

## File Upload and Save to Disk

```ts
import { Hono } from 'hono'

const app = new Hono()

app.post('/upload', async (c) => {
  const { image } = await c.req.parseBody()

  if (image instanceof File) {
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    fs.writeFile(path.resolve(__dirname, image.name), buffer)
  }

  return c.text('Uploaded!')
})
```
