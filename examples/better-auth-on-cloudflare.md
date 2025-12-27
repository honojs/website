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

::: code-group

```sh [npm]
# Hono
# > Select cloudflare-workers template
npm create hono

# Better Auth
npm install better-auth

# Drizzle ORM
npm install drizzle-orm
npm install --save-dev drizzle-kit

# Neon
npm install @neondatabase/serverless
```

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

```sh [yarn]
# Hono
# > Select cloudflare-workers template
yarn create hono

# Better Auth
yarn add better-auth

# Drizzle ORM
yarn add drizzle-orm
yarn add --dev drizzle-kit

# Neon
yarn add @neondatabase/serverless
```

```sh [bun]
# Hono
# > Select cloudflare-workers template
bun create hono

# Better Auth
bun add better-auth

# Drizzle ORM
bun add drizzle-orm
bun add -d drizzle-kit

# Neon
bun add @neondatabase/serverless
```

:::

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

::: code-group

```sh[npm]
npx wrangler types --env-interface CloudflareBindings
# OR
npm run cf-typegen
```

```sh[pnpm]
pnpm wrangler types --env-interface CloudflareBindings
# OR
pnpm cf-typegen

```

```sh[yarn]
yarn wrangler types --env-interface CloudflareBindings
# OR
yarn cf-typegen
```

```sh[bun]
bunx wrangler types --env-interface CloudflareBindings
# OR
bun run cf-typegen
```

:::

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

import * as schema from "../db/schema"; // Ensure the schema is imported

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
  database: drizzleAdapter(db, { provider: 'pg', schema }),  // schema is required in order for bettter-auth to recognize
  baseURL: BETTER_AUTH_URL,
  secret: BETTER_AUTH_SECRET,
});
```

Then, execute the following script:

::: code-group

```sh[npm]
npx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

```sh[pnpm]
pnpm dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

```sh[yarn]
yarn dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

```sh[bun]
bunx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts
```

:::

### 3. Apply Schema to Database

After generating the schema file, run the following commands to create and apply the database migration:
Check your wrangler config to read the `process.env` correctly for the `wrangler dev` to work later. You need [`node_compatibility`](https://developers.cloudflare.com/workers/wrangler/configuration/#hyperdrive) setup.

::: code-group

```sh[npm]
npx drizzle-kit generate
npx drizzle-kit migrate
```

```sh[pnpm]
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

```sh[yarn]
yarn drizzle-kit generate
yarn drizzle-kit migrate
```

```sh[bun]
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

:::

### 4. Mount the handler

Mount the Better Auth handler to a Hono endpoint, ensuring that the mount path matches the `basePath` setting in your Better Auth instance.

```ts[src/index.ts]
import { Hono } from 'hono';
import { auth } from './lib/better-auth';

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.on(['GET', 'POST'], '/api/*', (c) => {
  return auth(c.env).handler(c.req.raw);
});

export default app;
```

## Advanced

This example is assembled based on the official documentation of Hono, Better Auth, and Drizzle. However, it goes beyond simple integration and offers the following benefits:

- Efficient development through integration of Cloudflare CLI, Better Auth CLI, and Drizzle CLI.
- Seamless transition between development and production environments.
- Apply changes consistently using a script.

You can extend this setup with custom scripts tailored to your workflow. For example:

```json[package.json]
{
  "scripts": {
    "dev": "wrangler dev",
    "deploy": "pnpm run cf-gen-types && wrangler secret bulk .dev.vars.production && wrangler deploy --minify",
    "cf-gen-types": "wrangler types --env-interface CloudflareBindings",
    "better-auth-gen-schema": "pnpm dlx @better-auth/cli@latest generate --config ./better-auth.config.ts --output ./src/db/schema.ts"
  },
}
```

> NOTE:  
> Refer to the official CLI documentation for each tool for advanced usage and the most up-to-date options:
>
> - [Cloudflare CLI](https://developers.cloudflare.com/workers/wrangler/)
> - [Better Auth CLI](https://www.better-auth.com/docs/concepts/cli)
> - [Drizzle ORM CLI](https://orm.drizzle.team/docs/kit-overview)

## In Closing

You now have a lightweight, fast, and comprehensive authentication service running on Cloudflare Workers. By leveraging Service Bindings, this setup allows you to build microservice-based architectures with minimal latency.

This guide demonstrates only a **basic example**, so for advanced use cases like OAuth or rate limiting, refer to the official documentation and tailor the configuration to your service’s needs.

You can find the full example source code here:  
[GitHub Repository](https://github.com/bytaesu/cloudflare-auth-worker)
