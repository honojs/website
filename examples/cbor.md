# CBOR

[CBOR](https://cbor.io/) is a binary format for serializing objects defined in [RFC 8949](https://www.rfc-editor.org/rfc/rfc8949.html). It is JSON-compatible and suitable for network communications that require efficient data exchange, as well as for use in resource-constrained environments such as IoT devices.

Here's an example of using [cbor2](https://www.npmjs.com/package/cbor2) package to respond with CBOR:

```ts
import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { encode } from 'cbor2'

const app = new Hono()

declare module 'hono' {
  interface ContextRenderer {
    (content: any): Response | Promise<Response>
  }
}

const cborRenderer = createMiddleware(async (c, next) => {
  c.header('Content-Type', 'application/cbor')
  c.setRenderer((content) => {
    return c.body(encode(content))
  })
  await next()
})

app.use(cborRenderer)

app.get('/', (c) => {
  return c.render({ message: 'hello CBOR!' })
})

export default app
```

You can check the response using the following command.

```plaintext
$ curl -s http://localhost:3000/ | hexdump -C
00000000  a1 67 6d 65 73 73 61 67  65 6b 68 65 6c 6c 6f 20  |.gmessagekhello |
00000010  43 42 4f 52 21                                    |CBOR!|
00000015
```

Additionally, you can verify that it decodes to a JSON object in the [CBOR playground](https://cbor.me/).

```plaintext
A1                           # map(1)
   67                        # text(7)
      6D657373616765         # "message"
   6B                        # text(11)
      68656C6C6F2043424F5221 # "hello CBOR!"
```

```json
{ "message": "hello CBOR!" }
```

## See also

- [CBOR — Concise Binary Object Representation | Overview](https://cbor.io/)
- [CBOR playground](https://cbor.me/)
