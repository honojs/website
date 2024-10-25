# Using Prisma on Cloudflare Workers

There are two ways to use Prisma with Cloudflare Workers: using Prisma Accelerate or using the Driver Adapter.

## Using Prisma Accelerate

### Install Prisma

Install Prisma on your Hono Cloudflare Workers. Here, I am using neon.tech free tier as my PostgreSQL database, but you can use whichever database suits your project.

Go to [neon.tech](https://neon.tech/) and create a free PostgreSQL database.

```bash
npm i prisma --save-dev
npx prisma init
```

### Setup Prisma Accelerate

To setup Accelerate, go to [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate?via=start&gad_source=1&gclid=CjwKCAjwvIWzBhAlEiwAHHWgvX8l8e7xQtqurVYanQ6LmbNheNvCB-4FL0G6BFEfPrUdGyH3qSllqxoCXDoQAvD_BwE) and log in or register for free.

After logging in, you will be taken to a page where you can create a new Accelerate project.

![Accelerate Page](/images/prismaAcceleratePage.png)

Create a new project by clicking the `New project` button, and name your project.

![Accelerate Page](/images/accelerateCreateProject.png)

You will then be taken to a page like the one below:

![Accelerate Edit Page](/images/accelerateProjectPage.png)

Click the `Enable Accelerate` button, and you will be taken to the following page:

![Enable Page](/images/EnableAccelerate.png)

Paste your neon.tech database connection string into the `database connection string` field, choose your region, and click the `Enable Accelerate` button.

You will see something like this:

![API Key](/images/generateApiKey.png)

Click `Generate API Key` and you will receive a new API key similar to the one below:

```bash
DATABASE_URL="prisma://accelerate...."
```

Copy this `DATABASE_URL` and store it in `.dev.vars` and `.env` so that prisma cli can access it later on.

### Set Up Prisma in Your Project

The neon.tech URL you received can also be used as an alternative and provide Prisma with more options, so store it for later use:

::: code-group

```bash [.dev.vars]
DATABASE_URL="your_prisma_accelerate_url"
DIRECT_URL="your_neon_tech_url
```

:::

Now, go to your `schema.prisma` file and set the URLs like this:

::: code-group

```ts [schema.prisma]
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

:::

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

If you already have D1 database ready skip this. But if not, create one resources, which can be found in [here](ttps://developers.cloudflare.com/d1/get-started/).

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

**Example of use in Hono route**

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

This will return all users in route `/` using Postman or Client Thunder to see the result.
