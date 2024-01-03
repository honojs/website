# Streaming Helper

The Streaming Helper provides methods for streaming responses.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { stream, streamText, streamSSE } from 'https://deno.land/x/hono/helper.ts'
```

:::

## `stream()`

It returns a simple streaming response as `Response` object.

```ts
app.get('/stream', (c) => {
  return stream(c, async (stream) => {
    // Write a process to be executed when aborted.
    stream.onAbort(() => {
      console.log('Aborted!')
    })
    // Write a Uint8Array.
    await stream.write(new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f]))
    // Pipe a readable stream.
    await stream.pipe(anotherReadableStream)
  })
})
```

## `streamText()`

It returns a streaming response with `Content-Type:text/plain`, ` Transfer-Encoding:chunked`, and `X-Content-Type-Options:nosniff` headers.

```ts
app.get('/streamText', (c) => {
  return streamText(c, async (stream) => {
    // Write a text with a new line ('\n').
    await stream.writeln('Hello')
    // Wait 1 second.
    await stream.sleep(1000)
    // Write a text without a new line.
    await stream.write(`Hono!`)
  })
})
```

## `streamSSE()`

It allows you to stream Server-Sent Events (SSE) seamlessly.

```ts
const app = new Hono()
let id = 0

app.get('/sse', async (c) => {
  return streamSSE(c, async (stream) => {
    while (true) {
      const message = `It is ${new Date().toISOString()}`
      await stream.writeSSE({
        data: message,
        event: 'time-update',
        id: String(id++),
      })
      await stream.sleep(1000)
    }
  })
})
```
