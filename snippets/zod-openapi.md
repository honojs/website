# Zod OpenAPI

[Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) is an extended Hono class that supports OpenAPI.
With it, you can validate values and types using [Zod](https://zod.dev/) and generate OpenAPI Swagger documentation.

## Snippets

On this website, only basic usage is shown.

First, define your schemas with Zod. The `z` object should be imported from `@hono/zod-openapi`:

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

Next, create a route:

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
      description: 'Retrieve the user',
    },
  },
})
```

Finally, set up the app:

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

// The OpenAPI documentation will be available at /doc
app.doc('/doc', {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'My API',
  },
})
```

You can start your app just like you would with Hono. For Cloudflare Workers and Bun, use this entry point:

```ts
export default app
```

## View more

- [Zod OpenAPI Hono](https://github.com/honojs/middleware/tree/main/packages/zod-openapi)
