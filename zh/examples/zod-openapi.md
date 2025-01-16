---
title: Zod OpenAPI
description: 使用 Zod OpenAPI Hono 支持 OpenAPI 的 Hono 扩展类。通过它，你可以使用 Zod 进行值和类型的验证，并生成 OpenAPI Swagger 文档。
---

[Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) 是一个支持 OpenAPI 的 Hono 扩展类。
通过它，你可以使用 [Zod](https://zod.dev/) 进行值和类型的验证，并生成 OpenAPI Swagger 文档。本网站仅展示基本用法。

首先，使用 Zod 定义你的模式（Schema）。`z` 对象需要从 `@hono/zod-openapi` 导入：

```ts
import { z } from '@hono/zod-openapi'

const ParamsSchema = z.object({
  id: z
    .string()
    .min(3)
    .openapi({
      param: {
        name: 'id',
        in: 'path',
      },
      example: '1212121',
    }),
})

const UserSchema = z
  .object({
    id: z.string().openapi({
      example: '123',
    }),
    name: z.string().openapi({
      example: 'John Doe',
    }),
    age: z.number().openapi({
      example: 42,
    }),
  })
  .openapi('User')
```

接下来，创建路由：

```ts
import { createRoute } from '@hono/zod-openapi'

const route = createRoute({
  method: 'get',
  path: '/users/{id}',
  request: {
    params: ParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: UserSchema,
        },
      },
      description: '获取用户信息',
    },
  },
})
```

最后，设置应用：

```ts
import { OpenAPIHono } from '@hono/zod-openapi'

const app = new OpenAPIHono()

app.openapi(route, (c) => {
  const { id } = c.req.valid('param')
  return c.json({
    id,
    age: 20,
    name: 'Ultra-man',
  })
})

// OpenAPI 文档将在 /doc 路径下可用
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: '我的 API',
  },
})
```

你可以像启动普通的 Hono 应用一样启动你的应用。对于 Cloudflare Workers 和 Bun，使用以下入口点：

```ts
export default app
```

## 参见

- [Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
