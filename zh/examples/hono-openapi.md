---
title: Hono OpenAPI
description: 使用 Hono OpenAPI 中间件为您的 Hono API 提供自动化的 OpenAPI 文档生成功能。
---

[hono-openapi](https://github.com/rhinobase/hono-openapi) 是一个中间件，通过与 Zod、Valibot、ArkType 和 TypeBox 等验证库的集成，为您的 Hono API 提供自动化的 OpenAPI 文档生成功能。

## 🛠️ 安装

根据您选择的验证库安装相应的包及其依赖：

```bash
# 使用 Zod
pnpm add hono-openapi @hono/zod-validator zod zod-openapi

# 使用 Valibot
pnpm add hono-openapi @hono/valibot-validator valibot @valibot/to-json-schema

# 使用 ArkType
pnpm add hono-openapi @hono/arktype-validator arktype

# 使用 TypeBox
pnpm add hono-openapi @hono/typebox-validator @sinclair/typebox
```

---

## 🚀 快速开始

### 1. 定义模式

使用您选择的验证库定义请求和响应模式。以下是使用 Valibot 的示例：

```ts
import * as v from 'valibot';

const querySchema = v.object({
  name: v.optional(v.string()),
});

const responseSchema = v.string();
```

---

### 2. 创建路由

使用 `describeRoute` 进行路由文档编写和验证：

```ts
import { Hono } from 'hono';
import { describeRoute } from 'hono-openapi';
// 根据您选择的验证库导入相应模块
import { resolver, validator as vValidator } from 'hono-openapi/valibot';

const app = new Hono();

app.get(
  '/',
  describeRoute({
    description: '向用户问好',
    responses: {
      200: {
        description: '成功响应',
        content: {
          'text/plain': { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  vValidator('query', querySchema),
  (c) => {
    const query = c.req.valid('query');
    return c.text(`Hello ${query?.name ?? 'Hono'}!`);
  }
);
```

---

### 3. 生成 OpenAPI 规范

添加一个用于提供 OpenAPI 文档的端点：

```ts
import { openAPISpecs } from 'hono-openapi';

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: { title: 'Hono API', version: '1.0.0', description: '问候 API' },
      servers: [{ url: 'http://localhost:3000', description: '本地服务器' }],
    },
  })
);
```

---

### 🌐 提供 API 文档

使用 Swagger UI 或 Scalar 等工具可视化您的 OpenAPI 规范。以下是使用 Scalar 的示例：

```ts
import { apiReference } from "@scalar/hono-api-reference";

app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  })
);
```

---

## 🔍 高级特性

### 添加安全定义

```ts
app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      components: {
        securitySchemes: {
          bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  })
);
```

### 条件性隐藏路由

```ts
app.get(
  '/',
  describeRoute({ 
    // ...
    hide: process.env.NODE_ENV === 'production'
  }),
  (c) => c.text('隐藏路由')
);
```

### 验证响应

```ts
app.get(
  '/',
  describeRoute({
    // ...
    validateResponse: true
  }),
  (c) => c.text('已验证的响应')
);
```

---

您可以在 [hono-openapi 代码仓库](https://github.com/rhinobase/hono-openapi) 中找到更多示例和详细文档。
