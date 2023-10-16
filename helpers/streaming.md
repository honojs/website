# streaming Helper

The streaming Helper provides a method to extend [`c.stream`](/api/context#stream). 

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { streamSSE } from 'hono/streaming'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { streamSSE } from 'https://deno.land/x/hono/helper.ts'
```

:::

## Usage

### streamSSE

It allows you to stream Server-Sent Events (SSE) seamlessly.

```ts
const app = new Hono()
let id = 0

app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `It is ${new Date().toISOString()}`
      await stream.writeSSE({ data: message, event: 'time-update', id: String(id++) })
      await stream.sleep(1000)
    }
  })
})
```