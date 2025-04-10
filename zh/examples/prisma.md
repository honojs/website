---
title: 在 Cloudflare Workers 上使用 Prisma
description: 在 Cloudflare Workers 上使用 Prisma 有两种方式：使用 Prisma Accelerate 或使用驱动适配器。
---

# 在 Cloudflare Workers 上使用 Prisma

[Prisma ORM](https://www.prisma.io/docs?utm_source=hono&utm_medium=website&utm_campaign=workers) 是一个现代化的数据库工具包，用于与数据库交互。当与 Hono 和 Cloudflare Workers 结合使用时，它能让你在边缘部署高性能的无服务器应用。

本指南将介绍在 Hono 中使用 Prisma ORM 的两种方法：

- [**Prisma Postgres**](#使用-prisma-postgres)：
  一个与 Prisma 集成的托管无服务器 PostgreSQL 数据库。这种方法适合生产环境，因为 Prisma Postgres 内置了零冷启动的连接池，可以解决[无服务器和边缘环境中的扩展问题](https://www.prisma.io/docs/orm/prisma-client/setup-and-configuration/databases-connections?utm_source=hono&utm_medium=website&utm_campaign=workers#the-serverless-challenge)。

- [**驱动适配器**](#使用-prisma-驱动适配器)：
  另一种方法是使用 Prisma 的灵活驱动适配器，让你可以连接到 Prisma ORM 支持的任何数据库。

这两种方法各有优势，你可以选择最适合你项目需求的方案。

## 使用 Prisma Postgres

[Prisma Postgres](https://www.prisma.io/postgres?utm_source=hono&utm_medium=website&utm_campaign=workers) 是一个基于 unikernels 构建的托管无服务器 PostgreSQL 数据库。它支持连接池、缓存和查询优化建议等功能。对于初期开发、测试和个人项目，有一个慷慨的免费套餐可供使用。

### 1. 安装 Prisma 和必需的依赖

在你的 Hono 项目中安装 Prisma：

```bash
npm i prisma --save-dev
```

安装 Prisma Postgres 所需的 [Prisma 客户端扩展](https://www.npmjs.com/package/@prisma/extension-accelerate)：

```sh
npm i @prisma/extension-accelerate
```

使用 Prisma Postgres 实例初始化 Prisma：

```bash
npx prisma@latest init --db
```

如果你还没有 [Prisma Data Platform](https://console.prisma.io/?utm_source=hono&utm_medium=website&utm_campaign=workers) 账号，或者尚未登录，命令行会提示你使用可用的认证方式登录。系统会打开浏览器窗口让你登录或创建账号。完成这一步后返回命令行。

登录后（或如果你已经登录），命令行会提示你选择项目名称和数据库区域。

命令执行完成后，会创建：

- 在你的 [Platform Console](https://console.prisma.io/?utm_source=hono&utm_medium=website&utm_campaign=workers) 中创建一个包含 Prisma Postgres 数据库实例的项目
- 一个 `prisma` 文件夹，其中包含 `schema.prisma` 文件，你将在这里定义数据库架构
- 项目根目录中的 `.env` 文件，其中包含 Prisma Postgres 数据库 URL：`DATABASE_URL=<你的-prisma-postgres-数据库-url>`

创建一个 `.dev.vars` 文件并在其中存储 `DATABASE_URL`：

::: code-group
```bash [.dev.vars]
DATABASE_URL="你的_prisma_postgres_url"
```
:::

保留 `.env` 文件，以便 Prisma CLI 后续可以访问它来执行迁移、生成 [Prisma Client](https://www.prisma.io/docs/orm/prisma-client?utm_source=hono&utm_medium=website&utm_campaign=workers) 或打开 [Prisma Studio](https://www.prisma.io/docs/orm/tools/prisma-studio?utm_source=hono&utm_medium=website&utm_campaign=workers)。

### 2. 在项目中设置 Prisma

现在，打开你的 `schema.prisma` 文件，为你的数据库架构定义模型。例如，你可以添加一个 `User` 模型：

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
  id    Int    @id @default(autoincrement())
  email String
  name  String
}
```
:::

使用 [Prisma Migrate](https://www.prisma.io/docs/orm/prisma-migrate) 将更改应用到数据库：

```bash
npx prisma migrate dev
```

创建一个这样的函数，你可以在项目中后续使用：

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

这是在项目中使用这个函数的示例：

::: code-group
```ts [index.ts]
import { Hono } from 'hono'
import { sign, verify } from 'hono/jwt'
import { getPrisma } from '../usefulFun/prismaFun'

// 创建主 Hono 应用
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
  // 现在你可以在任何地方使用它
  const prisma = getPrisma(c.env.DATABASE_URL)
})
```
:::

如果你想**使用自己的数据库和 Prisma ORM**，并且想要获得连接池和边缘缓存的好处，你可以启用 Prisma Accelerate。了解更多关于为你的项目设置 [Prisma Accelerate](https://www.prisma.io/docs/accelerate/getting-started?utm_source=hono&utm_medium=website&utm_campaign=workers) 的信息。

## 使用 Prisma 驱动适配器

Prisma 可以通过 `driverAdapters` 与 D1 数据库一起使用。前提条件是安装 Prisma 并将 Wrangler 集成到你的 Hono 项目中。这是一个示例项目，因为 Hono、Prisma 和 D1 Cloudflare 的所有文档都是分开的，没有确切的逐步说明。

### 设置 Prisma

Prisma 和 D1 使用 Wrangler 中的绑定来通过适配器建立安全连接。

```bash
npm install prisma --save-dev
npx prisma init
npm install @prisma/client
npm install @prisma/adapter-d1
```

之后，Prisma 将为你的数据库生成架构；在 `prisma/schema.prisma` 中定义一个简单的模型。别忘了更改适配器。

```ts [prisma/schema.prisma]
generator client {
  provider        = "prisma-client-js"
  previewFeatures = ["driverAdapters"] // 从默认值更改
}

datasource db {
  provider = "sqlite" // d1 是基于 sql 的数据库
  url      = env("DATABASE_URL")
}

// 创建一个简单的数据库模型
model User {
  id    String @id  @default(uuid())
  email String  @unique
  name  String?
}
```

### D1 数据库

如果你已经有 D1 数据库就跳过这步。如果没有，创建一个资源，可以在[这里](https://developers.cloudflare.com/d1/get-started/)找到。

```bash
npx wrangler d1 create __数据库名称__ // 换成你的数据库名称
```

确保你的数据库在 `wrangler.toml` 中绑定。

```toml [wrangler.toml]
[[d1_databases]]
binding = "DB" # 即在你的 Worker 中通过 env.DB 访问
database_name = "__数据库名称__"
database_id = "数据库ID"
```

### Prisma 迁移

这个命令用于迁移 Prisma 并更改到 D1 数据库，可以是本地或远程的。

```bash
npx wrangler d1 migrations create __数据库名称__ create_user_table # 将生成迁移文件夹和 sql 文件

// 生成 sql 语句
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/0001_create_user_table.sql
```

将数据库模型迁移到 D1。

```bash
npx wrangler d1 migrations apply __数据库名称__ --local
npx wrangler d1 migrations apply __数据库名称__ --remote
npx prisma generate
```

### 配置 Prisma Client

为了使用 Prisma 从 D1 数据库查询，你需要添加类型：

```bash
npx wrangler types
```

这将生成一个 `worker-configuration.d.ts` 文件。

#### Prisma Clients

要全局使用 Prisma，创建一个 `lib/prismaClient.ts` 文件，代码如下：

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

将 Hono 与 wrangler 环境值绑定：

::: code-group
```ts [src/index.ts]
import { Hono } from 'hono'
import prismaClients from '../lib/prismaClient'

type Bindings = {
  MY_KV: KVNamespace
  DB: D1Database
}

const app = new Hono<{ Bindings: Bindings }>() // 绑定环境值
```
:::

在 Hono 路由中使用的示例：

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

这将在 `/` 路由返回所有用户，使用 Postman 或 Thunder Client 可以查看结果。

## 相关资源

你可以使用以下资源来进一步增强你的应用：

- 为你的查询添加[缓存](https://www.prisma.io/docs/postgres/caching?utm_source=hono&utm_medium=website&utm_campaign=workers)
- 探索 [Prisma Postgres 文档](https://www.prisma.io/docs/postgres/getting-started?utm_source=hono&utm_medium=website&utm_campaign=workers)
