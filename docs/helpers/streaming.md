# Streaming ヘルパー

Streaming ヘルパーは、SSE（Server-Sent Events）などのストリーミングレスポンスのためのメソッドを提供します。

## Import

```ts
import { Hono } from 'hono'
import { stream, streamText, streamSSE } from 'hono/streaming'
```

## `stream()`

`stream()`は簡素なストリーミングレスポンスを `Response` オブジェクトとして返します。

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

`Content-Type:text/plain`, `Transfer-Encoding:chunked`, and `X-Content-Type-Options:nosniff` をヘッダーにもつストリーミングレスポンスを返します。

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

サーバー送信イベント（SSE：Server-Sent Events）をシームレスにストリーミングできます。

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

## Error Handling

Streaming ヘルパーの第3引数はエラー・ハンドラです。この引数はオプションで、指定しなければエラーはコンソールエラーとして出力されます。

```ts
app.get('/stream', (c) => {
  return stream(
    c,
    async (stream) => {
      // Write a process to be executed when aborted.
      stream.onAbort(() => {
        console.log('Aborted!')
      })
      // Write a Uint8Array.
      await stream.write(
        new Uint8Array([0x48, 0x65, 0x6c, 0x6c, 0x6f])
      )
      // Pipe a readable stream.
      await stream.pipe(anotherReadableStream)
    },
    (err, stream) => {
      stream.writeln('An error occurred!')
      console.error(err)
    }
  )
})
```

コールバックが実行された後、ストリームは自動的に閉じられます。

::: warning

Streaming ヘルパーのコールバック関数内でエラーが発生した場合, `onError` イベントは発火しません。

`onError` はレスポンスが送信される前にエラーをハンドルし、レスポンスを上書きするためのフックです。しかしながら、コールバック関数が実行された時点でストリームは既に開始されているので、上書きすることはできません。

:::
