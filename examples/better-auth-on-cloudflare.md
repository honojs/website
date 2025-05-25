# Better Auth on Cloudflare

A TypeScript-based lightweight authentication service optimized for Cloudflare Workers

## Stack Summary

**🔥 [Hono](https://hono.dev)**  
A fast, lightweight web framework built on web standards.

**🔒 [Better Auth](https://www.better-auth.com)**  
A comprehensive authentication framework for TypeScript.

**🧩 [Drizzle ORM](https://orm.drizzle.team)**  
A lightweight, high-performance ORM for TypeScript, built with DX in mind.

**🐘 [Postgres with Neon](https://neon.tech)**  
A serverless Postgres optimized for the cloud.

## Preparation

### 1. Installation

```sh [pnpm]
# Hono
# > Select cloudflare-workers template
pnpm create hono

# Better Auth
pnpm add better-auth

# Drizzle ORM
pnpm add drizzle-orm
pnpm add -D drizzle-kit

# Neon
pnpm add @neondatabase/serverless
```

### 2. Environment Variables

Set the following environment variables to connect your application to Better Auth and Neon.

Refer to official guides:

- [Better Auth – Guide](https://www.better-auth.com/docs/installation#set-environment-variables)
- [Neon – Guide](https://neon.tech/docs/connect/connect-from-any-app)

**Required Files:**

::: code-group

```Plain Text[.dev.vars]
# Used by Wrangler in local development
# In production, these should be set as Cloudflare Worker Secrets.

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
DATABASE_URL=
```

```Plain Text[.env]
# Used for local development and CLI tools such as:
#
# - Drizzle CLI
# - Better Auth CLI

BETTER_AUTH_URL=
BETTER_AUTH_SECRET=
DATABASE_URL=
```

:::

### 3. Wrangler

After setting your environment variables, run the following script to generate types for your Cloudflare Workers configuration:

```sh
pnpm cf-typegen

# or

pnpm wrangler types --env-interface CloudflareBindings

```

Then, make sure your tsconfig.json includes the generated types.

```json[tsconfig.json]
{
  "compilerOptions": {
    "types": ["worker-configuration.d.ts"]
  }
}
```

### 4. Drizzle

To use the Drizzle Kit CLI, add the following Drizzle configuration file to the root of your project.

```ts[drizzle.config.ts]
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

## Application

### 1. Better Auth Instance

Create a Better Auth instance using Cloudflare Workers bindings.

There are many available configuration options, far more than can be covered in this example.
Please refer to the official documentation and configure it according to your project’s needs:

(Docs: [Better Auth - Options](https://www.better-auth.com/docs/reference/options))

::: code-group

```ts[src/lib/better-auth/index.ts]
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { betterAuthOptions } from './options';

/**
 * Better Auth Instance
 */
export const auth = (env: CloudflareBindings): ReturnType<typeof betterAuth> => {
  const sql = neon(env.DATABASE_URL);
  const db = drizzle(sql);

  return betterAuth({
    ...betterAuthOptions,
    database: drizzleAdapter(db, { provider: 'pg' }),
    baseURL: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,

    // Additional options that depend on env ...
  });
};
```

```ts[src/lib/better-auth/options.ts]
import { BetterAuthOptions } from 'better-auth';

/**
 * Custom options for Better Auth
 *
 * Docs: https://www.better-auth.com/docs/reference/options
 */
export const betterAuthOptions: BetterAuthOptions = {
  /**
   * The name of the application.
   */
  appName: 'YOUR_APP_NAME',
  /**
   * Base path for Better Auth.
   * @default "/api/auth"
   */
  basePath: '/api',

  // .... More options
};
```

:::

### 2. Better Auth Schema

To create the required tables for Better Auth, first add the following file to the root directory:

```ts[better-auth.config.ts]
/**
 * Better Auth CLI configuration file
 *
 * Docs: https://www.better-auth.com/docs/concepts/cli
 */
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth';
import { betterAuthOptions } from './src/lib/better-auth/options';

const { DATABASE_URL, BETTER_AUTH_URL, BETTER_AUTH_SECRET } = process.env;

const sql = neon(DATABASE_URL!);
const db = drizzle(sql);

export const auth: ReturnType<typeof betterAuth> = betterAuth({
  ...betterAuthOptions,
  database: drizzleAdapter(db, { provider: 'pg' }),
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
});
```

Then, execute the following script:

```sh
pnpm dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

### 3. Apply Schema to Database

After generating the schema file, run the following commands to create and apply the database migration:

```sh
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### 4. Mount the handler

Mount the Better Auth handler to a Hono endpoint, ensuring that the mount path matches the `basePath` setting in your Better Auth instance.

```ts[src/index.ts]
import { Hono } from 'hono';
import { auth } from './lib/better-auth';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.on(['GET', 'POST'], '/api/**', (c) => {
  return auth(c.env).handler(c.req.raw);
});

export default app;
```

## In Closing

You now have a lightweight, fast, and comprehensive authentication service running on Cloudflare Workers. By leveraging Service Bindings, this setup allows you to build microservice-based architectures with minimal latency.

This guide demonstrates only a **basic example**, so for advanced use cases like OAuth or rate limiting, refer to the official documentation and tailor the configuration to your service’s needs.

You can find the full example source code here:  
[GitHub Repository](https://github.com/bytaesu/cloudflare-auth-worker)
