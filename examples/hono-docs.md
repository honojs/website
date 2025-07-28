# Hono Docs

> Auto-generate OpenAPI 3.0 spec and TypeScript type snapshots from Hono route type definitions

[Hono Docs](https://github.com/Rcmade/hono-docs) provides auto generated OpenApi Docs for Hono.

## **Create a config file** at the root of your project (`hono-docs.ts`)

```ts
import { defineConfig } from '@rcmade/hono-docs'

export default defineConfig({
  tsConfigPath: './tsconfig.json',
  openApi: {
    openapi: '3.0.0',
    info: { title: 'My API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  outputs: {
    openApiJson: './openapi/openapi.json',
  },
  apis: [
    {
      name: 'Auth Routes',
      apiPrefix: '/auth', // This will be prepended to all `api` values below
      appTypePath: 'src/routes/authRoutes.ts', // Path to your AppType export

      api: [
        // ✅ Custom OpenAPI metadata for the GET /auth/u/{id} endpoint
        {
          api: '/u/{id}', // Final route = /auth/u/{id}
          method: 'get',
          summary: 'Fetch user by ID', // Optional: title shown in docs
          description:
            'Returns a user object based on the provided ID.',
          tag: ['User'],
        },

        // ✅ Another example with metadata for GET /auth
        {
          api: '/', // Final route = /auth/
          method: 'get',
          summary: 'Get current user',
          description:
            "Returns the currently authenticated user's information.",
          tag: ['User Info'],
        },
      ],
    },
  ],
})
```

### **Route Definitions & AppType**

This library supports **only change routes** via a single AppType export in your routes file. You **must** export:

```ts
export type AppType = typeof yourRoutesVariable
```

**Example:**

```ts
// src/routes/userRoutes.ts
import { Hono } from 'hono'
import { z } from 'zod'

export const userRoutes = new Hono()
  .get('/u/:id', (c) => {
    /* … */
  })
  .post('/', async (c) => {
    /* … */
  })
// Must add AppType
export type AppType = typeof userRoutes
export default userRoutes
```

Mount in your Hono app:

```ts
// src/routes/docs.ts
import { Hono } from 'hono'
import { Scalar } from '@scalar/hono-api-reference'
import fs from 'node:fs/promises'
import path from 'node:path'

const docs = new Hono()
  .get(
    '/',
    Scalar({
      url: '/api/docs/open-api',
      theme: 'kepler',
      layout: 'modern',
      defaultHttpClient: { targetKey: 'js', clientKey: 'axios' },
    })
  )
  .get('/open-api', async (c) => {
    const raw = await fs.readFile(
      path.join(process.cwd(), './openapi/openapi.json'),
      'utf-8'
    )
    return c.json(JSON.parse(raw))
  })

export type AppType = typeof docs
export default docs
```

Visiting `/api/docs` shows the UI; `/api/docs/open-api` serves the JSON.

After you’ve **created** your **config**, generate the spec with:

```bash
npx @rcmade/hono-docs generate --config ./hono-docs.ts
```

## CLI Usage

```text
Usage: @rcmade/hono-docs generate --config <your hono-docs.ts path (default root/hono-docs.ts)>

Options:
  -c, --config   Path to your config file (TS or JS)        [string] [required]
  -h, --help     Show help                                 [boolean]
```

## Examples

Check out [`examples/basic-app/`](https://github.com/rcmade/hono-docs/tree/main/examples/basic-app) for a minimal setup.
