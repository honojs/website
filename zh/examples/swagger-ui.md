---
title: Swagger UI
description: 使用 Swagger UI 中间件将 Swagger UI 集成到 Hono 应用程序中。
---

[Swagger UI 中间件](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)提供了一个中间件和一个组件，用于将 [Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/) 集成到 Hono 应用程序中。

```ts
import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'

const app = new Hono()

// 使用中间件在 /ui 路径下提供 Swagger UI 服务
app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
```

## 参见

- [Swagger UI 中间件](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)
