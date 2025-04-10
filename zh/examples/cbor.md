---
title: CBOR
description: hono 内置的 CBOR 中间件，提供处理 CBOR 数据的功能。
---
# CBOR

[CBOR](https://cbor.io/) 是一种二进制格式，用于序列化对象，在 [RFC 8949](https://www.rfc-editor.org/rfc/rfc8949.html) 中定义。它与 JSON 格式兼容，特别适合需要高效数据交换的网络通信，以及在物联网设备等资源受限的环境中使用。

下面是一个使用 [cbor2](https://www.npmjs.com/package/cbor2) 包来返回 CBOR 格式响应的例子：

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

你可以用下面的命令来查看响应内容：

```plaintext
$ curl -s http://localhost:3000/ | hexdump -C
00000000  a1 67 6d 65 73 73 61 67  65 6b 68 65 6c 6c 6f 20  |.gmessagekhello |
00000010  43 42 4f 52 21                                    |CBOR!|
00000015
```

另外，你可以在 [CBOR 在线工具](https://cbor.me/) 中验证它是否能正确解码为 JSON 对象。

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

## 相关链接

- [CBOR — 简明二进制对象表示 | 概述](https://cbor.io/)
- [CBOR 在线工具](https://cbor.me/)
