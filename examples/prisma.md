# Using Prisma on Cloudflare Workers

There are two ways to use Prisma with Cloudflare Workers, we will be using Prisma Accelerate, but you can also use the Prisma [Driver Adapter](https://www.prisma.io/docs/orm/overview/databases/database-drivers).

### Install Prisma

Install Prisma on your Hono Cloudflare Workers. Here, I am using neon.tech free tier as my PostgreSQL database, but you can use whichever database suits your project.

Go to [neon.tech](https://neon.tech/) and create a free PostgreSQL database.

```bash
npm i prisma --save-dev
npx prisma init
```

## Setup Prisma Accelerate

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

## Set Up Prisma in Your Project

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
