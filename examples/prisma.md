# Using Prisma on Cloudflare Workers

[Prisma ORM](https://www.prisma.io/docs) provides a modern, robust toolkit for interacting with databases, and when paired with Hono and Cloudflare Workers, it enables you to deploy high-performance, serverless applications at the edge.

In this guide, we’ll walk you through integrating Prisma using both [Prisma Postgres](https://www.prisma.io/postgres)—a managed, serverless PostgreSQL database—and [Driver adapters](https://www.prisma.io/docs/orm/overview/databases/database-drivers#driver-adapters), giving you the flexibility to choose the best approach for your project.

## Using Prisma Postgres

[Prisma Postgres](https://www.prisma.io/postgres) is a managed, serverless PostgreSQL database built on unikernels. It supports features like connection pooling, caching, real-time subscriptions, and query optimization recommendations. A free tier is available for initial development and testing.

### Install Prisma and required dependencies

Install Prisma on your Hono Cloudflare Workers.

```bash
npm i prisma --save-dev
```

Install the [Prisma client extension](https://www.npmjs.com/package/@prisma/extension-accelerate) that's required for Prisma Postgres:

```sh
npm i @prisma/extension-accelerate
```

Initialize Prisma with an instance of Prisma Postgres:

```bash
npx prisma@latest init --db
```

If you don't have a [Prisma Data Platform](https://console.prisma.io/) account yet, or if you are not logged in, the command will prompt you to log in using one of the available authentication providers. A browser window will open so you can log in or create an account. Return to the CLI after you have completed this step.

Once logged in (or if you were already logged in), the CLI will prompt you to select a project name and a database region.

After the command runs successfully, it will create:

- A project in your [Platform Console](https://console.prisma.io/) containing a Prisma Postgres database instance.
- A `prisma` folder containing `schema.prisma`, where you will define your database schema.
- An `.env` file in the project root, which will contain the Prisma Postgres database url `DATABASE_URL=<your-prisma-postgres-database-url>`.

Create a `.dev.vars` file and store the `DATABASE_URL` in it:
::: code-group

```bash [.dev.vars]
DATABASE_URL="your_prisma_postgres_url"
```

:::

Keep the `.env` file so that Prisma CLI can access it later on to perform migrations, generate [Prisma Client](https://www.prisma.io/docs/orm/prisma-client) or to open [Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio).

### Set Up Prisma in Your Project

Now, open your `schema.prisma` file and define the models for your database schema. For example, you might add an `User` model:

::: code-group

```ts [schema.prisma]
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id  Int @id @default(autoincrement())
  email String
	name 	String
}
```

:::

Use [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) to apply changes to the database:

```bash
npx prisma migrate dev
```

Create a function like this, which you can use in your project later:

::: code-group

```ts [prismaFunction.ts]
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'

export const getPrisma = (database_url: string) => {
  const prisma = new PrismaClient({
    datasourceUrl: database_url,
  }).$extends(withAccelerate())
  return prisma
}
```

:::

Here is an example of how you can use this function in your project:

::: code-group

```ts [index.ts]
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getPrisma } from '../usefulFun/prismaFun'

// Create the main Hono app
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string
    JWT_SECRET: string
  }
  Variables: {
    userId: string
  }
}>()

app.post('/', async (c) => {
  // Now you can use it wherever you want
  const prisma = getPrisma(c.env.DATABASE_URL)
})
```

:::

If you want to **use your own database with Prisma ORM** and benefit from connection pooling and edge caching, you can enable Prisma Accelerate. Learn more about setting up [Prisma Accelerate](https://www.prisma.io/docs/accelerate/getting-started) for your project.

## Using Prisma Driver Adapter

Prisma can be used with the D1 Database via `driverAdapters`. The prerequisites are to install Prisma and integrate Wrangler to bind with your Hono project. This is an example project since all documentation for Hono, Prisma, and D1 Cloudflare is separated and doesn't have exact, precise step-by-step instructions.

### Setup Prisma

Prisma and D1 are using a binding in Wrangler to secure a connection with an adapter.

```bash
npm install prisma --save-dev
npx prisma init
npm install @prisma/client
npm install @prisma/adapter-d1
```

After this, Prisma will generate schema for your database; define a simple model in `prisma/schema.prisma`. Don't forget to change the adapter.

```ts [prisma/schema.prisma]
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"] // change from default
}

datasource db {
  provider = "sqlite" // d1 is sql base database
  url      = env("DATABASE_URL")
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
npx wrangler d1 create __DATABASE_NAME__ // change it with yours
```

Make sure your DB is binding in `wrangler.toml`.

```toml [wrangler.toml]
[[d1_databases]]
binding = "DB" # i.e. available in your Worker on env.DB
database_name = "__DATABASE_NAME__"
database_id = "DATABASE ID"

```

### Prisma Migrate

This command makes to migrate Prisma and change to the D1 database, either local or remote.

```bash
npx wrangler d1 migrations create __DATABASE_NAME__ create_user_table # will generate migration folder and sql file

// for generate sql statement

npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
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

```ts [lib/prisma.ts]
import { PrismaClient } from '@prisma/client'
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
