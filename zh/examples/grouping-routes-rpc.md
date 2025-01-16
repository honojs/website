---
title: RPC 路由分组
description: 使用 Hono 分组 RPC 路由。
---

如果你想要正确地为多个 `app` 启用类型推断，可以按照以下方式使用 `app.route()`。

将 `app.get()` 或 `app.post()` 等方法返回的值传递给 `app.route()` 的第二个参数。

```ts
import { Hono } from 'hono'
import { hc } from 'hono/client'

const authorsApp = new Hono()
  .get('/', (c) => c.json({ result: 'list authors' }))
  .post('/', (c) => c.json({ result: 'create an author' }, 201))
  .get('/:id', (c) => c.json({ result: `get ${c.req.param('id')}` }))

const booksApp = new Hono()
  .get('/', (c) => c.json({ result: 'list books' }))
  .post('/', (c) => c.json({ result: 'create a book' }, 201))
  .get('/:id', (c) => c.json({ result: `get ${c.req.param('id')}` }))

const app = new Hono()
  .route('/authors', authorsApp)
  .route('/books', booksApp)

type AppType = typeof app
```

## 另请参阅

- [指南 - RPC - 客户端](/docs/guides/rpc#client)
