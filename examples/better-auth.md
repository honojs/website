# Better Auth

Using Hono with [Better Auth](http://better-auth.com/) for authentication.

Better Auth is a framework-agnostic authentication and authorization framework for TypeScript. It provides a comprehensive set of features out of the box and includes a plugin ecosystem that simplifies adding advanced functionalities.

## Configuration

1. Install the framework:

```sh
# npm
npm install better-auth

# bun
bun add better-auth

# pnpm
pnpm add better-auth

# yarn
yarn add better-auth
```

2. Add the required environment variables in the `.env` file:

```sh
BETTER_AUTH_SECRET=<generate-a-secret-key> (e.g. D27gijdvth3Ul3DjGcexjcFfgCHc8jWd)
BETTER_AUTH_URL=<url-of-your-server> (e.g. http://localhost:1234)
```

3. Create the Better Auth instance

```ts
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'

import prisma from '@/db/index'
import env from '@/env'

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  // Allow requests from the frontend development server
  trustedOrigins: ['http://localhost:5173'],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
})

export type AuthType = {
  user: typeof auth.$Infer.Session.user | null
  session: typeof auth.$Infer.Session.session | null
}
```

The above code:

- Sets up the database to use Prisma ORM and PostgreSQL
- Specifies the trusted origins
  - A trusted origin is the app that's allowed to make requests to the auth API. Normally, that's your client (frontend)
  - All the other origins are automatically blocked
- It enables email/password authentication and configures social login providers.

4. Generate all the required models, fields, and relationships to the Prisma schema file:

```sh
bunx @better-auth/cli generate
```

5. Create the API Handler for the auth API requests in `routes/auth.ts`

This route uses the handler provided by Better Auth to serve all `POST` and `GET` requests to the `/api/auth` endpoint.

```ts
import { Hono } from 'hono'
import { auth } from '../lib/auth'
import type { AuthType } from '../lib/auth'

const router = new Hono<{ Bindings: AuthType }>({
  strict: false,
})

router.on(['POST', 'GET'], '/auth/*', (c) => {
  return auth.handler(c.req.raw)
})

export default router
```

6. Mount the route

The code below mounts the route.

```ts
import { Hono } from "hono";
import type { AuthType } from "../lib/auth"
import auth from "@/routes/auth";

const app = new Hono<{ Variables: AuthType }>({
  strict: false,
});

const routes = [auth, ...other routes] as const;

routes.forEach((route) => {
  app.basePath("/api").route("/", route);
});

export default app;
```

## See also

- [Repository with the complete code](https://github.com/catalinpit/example-app/)
- [Better Auth with Hono, Bun, TypeScript, React and Vite](https://catalins.tech/better-auth-with-hono-bun-typescript-react-vite/)
