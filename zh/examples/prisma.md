---
title: 在 Cloudflare Workers 上使用 Prisma
description: 在 Cloudflare Workers 上使用 Prisma 有两种方式：使用 Prisma Accelerate 或使用驱动适配器。
---

在 Cloudflare Workers 上使用 Prisma 有两种方式：使用 Prisma Accelerate 或使用驱动适配器。

## 使用 Prisma Accelerate

### 安装 Prisma

在 Hono Cloudflare Workers 上安装 Prisma。本例中使用 neon.tech 免费版作为 PostgreSQL 数据库，但你可以根据项目需求选择其他数据库。

前往 [neon.tech](https://neon.tech/) 创建一个免费的 PostgreSQL 数据库。

```bash
npm i prisma --save-dev
npx prisma init
```

### 配置 Prisma Accelerate

要配置 Accelerate，请访问 [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate?via=start&gad_source=1&gclid=CjwKCAjwvIWzBhAlEiwAHHWgvX8l8e7xQtqurVYanQ6LmbNheNvCB-4FL0G6BFEfPrUdGyH3qSllqxoCXDoQAvD_BwE) 并登录或免费注册。

登录后，你将进入一个可以创建新 Accelerate 项目的页面。

![Accelerate 页面](/images/prismaAcceleratePage.png)

点击 `New project` 按钮创建新项目，并为其命名。

![Accelerate 页面](/images/accelerateCreateProject.png)

然后你将看到如下页面：

![Accelerate 编辑页面](/images/accelerateProjectPage.png)

点击 `Enable Accelerate` 按钮，你将进入以下页面：

![启用页面](/images/EnableAccelerate.png)

将你的 neon.tech 数据库连接字符串粘贴到 `database connection string` 字段中，选择你的地区，然后点击 `Enable Accelerate` 按钮。

你将看到如下内容：

![API 密钥](/images/generateApiKey.png)

点击 `Generate API Key`，你将获得一个类似下面的新 API 密钥：

```bash
DATABASE_URL="prisma://accelerate...."
```

复制这个 `DATABASE_URL` 并将其存储在 `.dev.vars` 和 `.env` 中，以便 prisma cli 后续使用。

### 在项目中设置 Prisma

你收到的 neon.tech URL 也可以作为替代方案使用，并为 Prisma 提供更多选项，所以请保存以供后用：

::: code-group

```bash [.dev.vars]
DATABASE_URL="your_prisma_accelerate_url"
DIRECT_URL="your_neon_tech_url
```

:::

现在，转到你的 `schema.prisma` 文件并按如下方式设置 URL：

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

创建一个如下所示的函数，你可以在项目中后续使用：

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

以下是在项目中使用此函数的示例：

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
  // 现在你可以在任何需要的地方使用它
  const prisma = getPrisma(c.env.DATABASE_URL)
})
```

:::

## 使用 Prisma 驱动适配器

Prisma 可以通过 `driverAdapters` 与 D1 数据库一起使用。前提条件是安装 Prisma 并集成 Wrangler 以与你的 Hono 项目绑定。这是一个示例项目，因为 Hono、Prisma 和 D1 Cloudflare 的所有文档都是分开的，且没有确切的逐步说明。

### 设置 Prisma

Prisma 和 D1 使用 Wrangler 中的绑定来通过适配器确保连接安全。

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

如果你已经准备好 D1 数据库，可以跳过这一步。如果没有，创建一个资源，可以在[这里](https://developers.cloudflare.com/d1/get-started/)找到。

```bash
npx wrangler d1 create __DATABASE_NAME__ // 更改为你的数据库名
```

确保你的数据库在 `wrangler.toml` 中绑定。

```toml [wrangler.toml]
[[d1_databases]]
binding = "DB" # 即在你的 Worker 中通过 env.DB 访问
database_name = "__DATABASE_NAME__"
database_id = "DATABASE ID"
```

### Prisma 迁移

此命令用于迁移 Prisma 并更改到 D1 数据库，可以是本地或远程。

```bash
npx wrangler d1 migrations create __DATABASE_NAME__ create_user_table # 将生成迁移文件夹和 sql 文件

// 用于生成 sql 语句
npx prisma migrate diff \
  --from-empty \
  --to-schema-datamodel ./prisma/schema.prisma \
  --script \
  --output migrations/0001_create_user_table.sql
```

将数据库模型迁移到 D1。

```bash
npx wrangler d1 migrations apply __DATABASE_NAME__ --local
npx wrangler d1 migrations apply __DATABASE_NAME__ --remote
npx prisma generate
```

### 配置 Prisma 客户端

为了使用 Prisma 从 D1 数据库查询数据，你需要添加类型：

```bash
npx wrangler types
```

这将生成一个 `worker-configuration.d.ts` 文件。

#### Prisma 客户端

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

这将在 `/` 路由中返回所有用户，可以使用 Postman 或 Thunder Client 查看结果。
