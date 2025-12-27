# Hono OpenAPI

[hono-openapi](https://github.com/rhinobase/hono-openapi) is a _middleware_ which enables automatic OpenAPI documentation generation for your Hono API by integrating with validation libraries like Zod, Valibot, ArkType, and TypeBox and all libs supporting [Standard Schema](https://standardschema.dev/).

## 🛠️ Installation

Install the package along with your preferred validation library and its dependencies:

```bash
npm install hono-openapi @hono/standard-validator
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
import { describeRoute, resolver, validator } from 'hono-openapi'

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
  validator('query', querySchema),
  (c) => {
    const query = c.req.valid('query')
    return c.text(`Hello ${query?.name ?? 'Hono'}!`)
  }
)
```

> **Note:**  
> When using `validator()` from `hono-openapi`, any validation added for `query`, `json`, `param` or `form` is automatically included in the OpenAPI request schema.  
> There’s no need to manually define request parameters inside `describeRoute()`.

---

### 3. Generate OpenAPI Spec

Add an endpoint for your OpenAPI document:

```ts
import { openAPIRouteHandler } from 'hono-openapi'

app.get(
  '/openapi',
  openAPIRouteHandler(app, {
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

Wanna explore more, check out our docs - <https://honohub.dev/docs/openapi>
