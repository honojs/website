# Swagger UI

[Swagger UI Middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui) provides a middleware and a component for integrating [Swagger UI](https://swagger.io/docs/open-source-tools/swagger-ui/usage/installation/) with Hono applications.

## Snippets

```ts
import { Hono } from 'hono'
import { swaggerUI } from '@hono/swagger-ui'

const app = new Hono()

// Use the middleware to serve Swagger UI at /ui
app.get('/ui', swaggerUI({ url: '/doc' }))

export default app
```

## View more

- [Swagger UI Middleware](https://github.com/honojs/middleware/tree/main/packages/swagger-ui)
