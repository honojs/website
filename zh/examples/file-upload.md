---
title: 文件上传
description: 使用 Hono 上传文件。
---

你可以使用 `multipart/form-data` 内容类型来上传文件。上传的文件可以通过 `c.req.parseBody()` 获取。

```ts
const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
})
```

## 参见

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)
