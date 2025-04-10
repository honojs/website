---
title: Hono OpenAPI
description: Use the Hono OpenAPI middleware to provide automatic OpenAPI documentation generation for your Hono API.
---
# Hono OpenAPI

[hono-openapi](https://github.com/rhinobase/hono-openapi) is a _middleware_ which enables automatic OpenAPI documentation generation for your Hono API by integrating with validation libraries like Zod, Valibot, ArkType, and TypeBox.

## 🛠️ Installation

Install the package along with your preferred validation library and its dependencies:

```bash
# For Zod
pnpm add hono-openapi @hono/zod-validator zod zod-openapi

# For Valibot
pnpm add hono-openapi @hono/valibot-validator valibot @valibot/to-json-schema

# For ArkType
pnpm add hono-openapi @hono/arktype-validator arktype

# For TypeBox
pnpm add hono-openapi @hono/typebox-validator @sinclair/typebox
```

---

## 🚀 Getting Started

### 1. Define Your Schemas

Define your request and response schemas using your preferred validation library. Here's an example using Valibot:

```ts
import * as v from 'valibot'

const querySchema = v.object({
  name: v.optional(v.string()),
})

const responseSchema = v.string()
```

---

### 2. Create Routes

Use `describeRoute` for route documentation and validation:

```ts
import { Hono } from 'hono'
import { describeRoute } from 'hono-openapi'
// You can import these for your preferred validation library
import {
  resolver,
  validator as vValidator,
} from 'hono-openapi/valibot'

const app = new Hono()

app.get(
  '/',
  describeRoute({
    description: 'Say hello to the user',
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'text/plain': { schema: resolver(responseSchema) },
        },
      },
    },
  }),
  vValidator('query', querySchema),
  (c) => {
    const query = c.req.valid('query')
    return c.text(`Hello ${query?.name ?? 'Hono'}!`)
  }
)
```

---

### 3. Generate OpenAPI Spec

Add an endpoint for your OpenAPI document:

```ts
import { openAPISpecs } from 'hono-openapi'

app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      info: {
        title: 'Hono API',
        version: '1.0.0',
        description: 'Greeting API',
      },
      servers: [
        { url: 'http://localhost:3000', description: 'Local Server' },
      ],
    },
  })
)
```

---

### 🌐 Serve API Docs

Use tools like Swagger UI or Scalar to visualize your OpenAPI specs. Here's an example using Scalar:

```ts
import { apiReference } from '@scalar/hono-api-reference'

app.get(
  '/docs',
  apiReference({
    theme: 'saturn',
    spec: { url: '/openapi' },
  })
)
```

---

## 🔍 Advanced Features

### Add Security Definitions

```ts
app.get(
  '/openapi',
  openAPISpecs(app, {
    documentation: {
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  })
)
```

### Conditionally Hide Routes

```ts
app.get(
  '/',
  describeRoute({
    // ...
    hide: process.env.NODE_ENV === 'production',
  }),
  (c) => c.text('Hidden Route')
)
```

### Validate Responses

```ts
app.get(
  '/',
  describeRoute({
    // ...
    validateResponse: true,
  }),
  (c) => c.text('Validated Response')
)
```

---

You can find more examples and detailed documentation in the [hono-openapi repository](https://github.com/rhinobase/hono-openapi).