# Using Prisma on Cloudflare Workers

[Prisma ORM](https://www.prisma.io/docs/orm?utm_source=hono&utm_medium=website&utm_campaign=workers) provides a modern, robust toolkit for interacting with databases. When paired with Hono and Cloudflare Workers, it enables you to deploy high-performance, serverless applications at the edge.

In this guide, we’ll cover two distinct approaches for using Prisma ORM in Hono:

- [**Prisma Postgres**](#using-prisma-postgres):
  Connect to a managed PostgreSQL database with Prisma ORM 8 and the `@prisma/orm-postgres` package. This approach is good for a production-ready setup as Prisma Postgres has built-in connection pooling that mitigates [scaling issues in serverless and edge environments](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections?utm_source=hono&utm_medium=website&utm_campaign=workers#the-serverless-challenge).

- [**Cloudflare D1**](#using-prisma-driver-adapters):
  Connect to a D1 database with Prisma ORM 7 and the `@prisma/adapter-d1` driver adapter.

Both approaches have their own advantages, allowing you to choose the one that best fits your project's needs.

::: tip
The two sections use different Prisma ORM versions on purpose. Prisma ORM 8 is a [release candidate](https://www.prisma.io/docs/orm/release-status?utm_source=hono&utm_medium=website&utm_campaign=workers) and `npx prisma` now installs it, but it has no D1 package yet, so the D1 section pins `prisma@7` and `@prisma/client@7`.
:::

## Using Prisma Postgres

[Prisma Postgres](https://www.prisma.io/postgres?utm_source=hono&utm_medium=website&utm_campaign=workers) is a managed PostgreSQL database with built-in connection pooling and a free plan. It is a regular PostgreSQL database behind a connection string, so the steps below also work with any other PostgreSQL server that accepts TLS connections.

### 1. Add Prisma ORM to your project

Prisma ORM 8 has no `prisma generate` step, no driver adapter package, and no query engine binary. One command installs the Prisma CLI and the `@prisma/orm-postgres` package and creates the files the Worker needs:

```bash
npx prisma@latest orm init --yes --target postgres --authoring psl
```

::: warning
The `cloudflare-workers` template ships a `pnpm-workspace.yaml`, and `orm init` reads it as a sign that the project uses pnpm. If you use npm, delete that file before running the command; otherwise the packages are installed with pnpm.
:::

This creates:

- `src/prisma/contract.prisma`, where you define your models.
- `src/prisma/contract.json` and `src/prisma/contract.d.ts`, emitted from the contract. The Worker imports both.
- `prisma.config.ts`, which tells the Prisma CLI where the contract is and reads `DATABASE_URL` from `.env`.
- `src/prisma/db.ts`, a module-level client for Node.js scripts. The Worker does not import it; see step 3.

It also adds a `contract:emit` script to `package.json` and updates `tsconfig.json` so the Worker can import the JSON contract. Run the script whenever you edit the contract.

### 2. Connect a database

Create a Prisma Postgres database:

```bash
npx create-db@latest
```

The command prints a connection string and a claim URL. Open the claim URL to keep the database in your [Prisma Console](https://console.prisma.io/?utm_source=hono&utm_medium=website&utm_campaign=workers) account. Store the connection string in a `.env` file:

::: code-group

```bash [.env]
DATABASE_URL="postgres://..."
```

:::

Both tools read this one file: the Prisma CLI through `prisma.config.ts`, and `wrangler dev` directly, which exposes the value to the Worker as `env.DATABASE_URL`.

Prisma ORM connects to PostgreSQL over TCP, so enable Node.js compatibility in your Wrangler config:

::: code-group

```jsonc [wrangler.jsonc]
{
  "compatibility_flags": ["nodejs_compat"],
}
```

```toml [wrangler.toml]
compatibility_flags = ["nodejs_compat"]
```

:::

### 3. Define your models and create the tables

Replace the starter models in `src/prisma/contract.prisma` with your own. For example, a `User` model:

::: code-group

```prisma [src/prisma/contract.prisma]
// use prisma-8

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

:::

Emit the contract, then create the tables in your database:

```bash
npm run contract:emit
npx prisma db init
```

`db init` creates the `User` table and signs the database so it is known to match the emitted contract. For later schema changes during development, use `npx prisma db update`.

### 4. Query the database from Hono

Create one Prisma client per request and close it after the response. Cloudflare Workers do not let a connection opened during one request be used by another, so a client shared at module level works for the first request and hangs the next one. A Hono middleware keeps this in one place:

::: code-group

```ts [src/index.ts]
import { Hono } from 'hono'
import postgres from '@prisma/orm-postgres/runtime'
import type { Contract } from './prisma/contract.d'
import contractJson from './prisma/contract.json' with { type: 'json' }

type Env = {
  Bindings: CloudflareBindings
  Variables: { db: ReturnType<typeof postgres<Contract>> }
}

const app = new Hono<Env>()

app.use(async (c, next) => {
  const db = postgres<Contract>({
    contractJson,
    url: c.env.DATABASE_URL,
  })
  c.set('db', db)
  await next()
  c.executionCtx.waitUntil(db.close())
})

app.get('/users', async (c) => {
  const users = await c.var.db.orm.public.User.all()
  return c.json(users)
})

app.post('/users', async (c) => {
  const body = await c.req.json<{ email: string; name?: string }>()
  const user = await c.var.db.orm.public.User.create({
    email: body.email,
    name: body.name ?? null,
  })
  return c.json(user, 201)
})

export default app
```

:::

Models are namespace-qualified on PostgreSQL, so the `User` model is `db.orm.public.User`. `.create(...)` returns the inserted row, database defaults included.

Generate the `CloudflareBindings` type so it includes `DATABASE_URL`, then start the dev server:

```bash
npm run cf-typegen
npm run dev
```

Create a user and read it back:

```bash
curl -X POST http://localhost:8787/users \
  -H "content-type: application/json" \
  -d '{"email":"alice@prisma.io","name":"Alice"}'
curl http://localhost:8787/users
```

Before deploying, store the connection string as a secret with `npx wrangler secret put DATABASE_URL`, then run `npm run deploy`.

## Using Prisma Driver Adapters

Prisma can be used with the D1 Database via the `@prisma/adapter-d1` driver adapter. The prerequisites are to install Prisma and integrate Wrangler to bind with your Hono project. This is an example project since all documentation for Hono, Prisma, and D1 Cloudflare is separated and doesn't have exact, precise step-by-step instructions.

### Setup Prisma

Prisma and D1 are using a binding in Wrangler to secure a connection with an adapter. This section uses Prisma ORM 7, so the commands pin the major version.

```bash
npm install prisma@7 --save-dev
npx prisma init --datasource-provider sqlite
npm install @prisma/client@7 @prisma/adapter-d1 dotenv
```

After this, Prisma will generate schema for your database; define a simple model in `prisma/schema.prisma`. Driver adapters are generally available, so no preview feature flag is needed. Use the `prisma-client` generator with the `cloudflare` runtime.

```prisma [prisma/schema.prisma]
generator client {
  provider = "prisma-client"
  runtime  = "cloudflare"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "sqlite" // d1 is sql base database
}

// Create a simple model database
model User {
  id    String @id  @default(uuid())
  email String  @unique
  name  String?
}
```

### D1 Database

If you already have D1 database ready skip this. But if not, create one resources, which can be found in [here](https://developers.cloudflare.com/d1/get-started/).

```bash
npx wrangler d1 create __DATABASE_NAME__ # change it with yours
```

Make sure your DB is bound in your Wrangler config.

::: code-group

```jsonc [wrangler.jsonc]
{
  "d1_databases": [
    {
      "binding": "DB", // i.e. available in your Worker on env.DB
      "database_name": "__DATABASE_NAME__",
      "database_id": "DATABASE ID",
    },
  ],
}
```

```toml [wrangler.toml]
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "__DATABASE_NAME__"
database_id = "DATABASE ID"
```

:::

### Prisma Migrate

This command makes to migrate Prisma and change to the D1 database, either local or remote.

```bash
npx wrangler d1 migrations create __DATABASE_NAME__ create_user_table # will generate migration folder and sql file

# generate the SQL statement

npx prisma migrate diff \
  --from-empty \
  --to-schema ./prisma/schema.prisma \
  --script \
  --output migrations/0001_create_user_table.sql

```

Migrate the database model to D1.

```bash
npx wrangler d1 migrations apply __DATABASE_NAME__ --local
npx wrangler d1 migrations apply __DATABASE_NAME__ --remote
npx prisma generate

```

### Config Prisma Client

In order to query your database from the D1 database using Prisma, you need to add types with:

```bash
npx wrangler types
```

will generate a `worker-configuration.d.ts` file.

#### Prisma Clients

For using Prisma globally make a file `lib/prismaClient.ts` with code like this.

::: code-group

```ts [lib/prismaClient.ts]
import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaD1 } from '@prisma/adapter-d1'

const prismaClients = {
  async fetch(db: D1Database) {
    const adapter = new PrismaD1(db)
    const prisma = new PrismaClient({ adapter })
    return prisma
  },
}

export default prismaClients
```

:::

Binding Hono with wrangler environment values:

::: code-group

```ts [src/index.ts]
import { Hono } from 'hono'
import prismaClients from '../lib/prismaClient'

type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>() // binding env value
```

:::

Example of use in Hono route:

::: code-group

```ts [src/index.ts]
import { Hono } from 'hono'
import prismaClients from '../lib/prismaClient'

type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
}
const app = new Hono<{ Bindings: Bindings }>()

app.get('/', async (c) => {
  const prisma = await prismaClients.fetch(c.env.DB)
  const users = await prisma.user.findMany()
  console.log('users', users)
  return c.json(users)
})

export default app
```

:::

This will return all users in the `/` route, using Postman or Thunder Client to see the result.

## Running Hono on Prisma Compute

Hono also runs on [Prisma Compute](https://www.prisma.io/docs/compute?utm_source=hono&utm_medium=website&utm_campaign=workers), which hosts Node.js and Bun services next to Prisma Postgres. Because that is a long-running Node.js process rather than a Worker, the app uses `@hono/node-server` and a single shared Prisma client instead of one client per request. The [Hono guide in the Prisma docs](https://www.prisma.io/docs/guides/frameworks/hono?utm_source=hono&utm_medium=website&utm_campaign=workers) walks through it, and the [Hono example it is based on](https://github.com/prisma/prisma-examples/tree/latest/compute/hono) is open source.

## Resources

You can use the following resources to enhance your application further:

- Explore the [Prisma Postgres documentation](https://www.prisma.io/docs/postgres?utm_source=hono&utm_medium=website&utm_campaign=workers).
- Follow the full [Cloudflare Workers](https://www.prisma.io/docs/guides/deployment/cloudflare-workers?utm_source=hono&utm_medium=website&utm_campaign=workers) guide for Prisma ORM 8 and the [Cloudflare D1](https://www.prisma.io/docs/guides/v7/deployment/cloudflare-d1?utm_source=hono&utm_medium=website&utm_campaign=workers) guide for Prisma ORM 7 in the Prisma docs.
