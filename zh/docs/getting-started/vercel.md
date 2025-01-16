---
title: Vercel
description: 使用 Vercel 边缘函数在 Vercel 中运行 Hono，包括环境搭建、适配器配置和示例代码的概述。
---
# Vercel

Vercel 是一个面向前端开发者的平台，为创新者提供了实现灵感时所需的速度和可靠性。本节将介绍在 Vercel 上运行 Next.js。

Next.js 是一个灵活的 React 框架，为构建快速的 Web 应用程序提供了基础构建模块。

在 Next.js 中，[Edge Functions](https://vercel.com/docs/concepts/functions/edge-functions) 允许你在 Vercel 等 Edge Runtime 上创建动态 API。
使用 Hono，你可以用与其他运行时相同的语法编写 API，并使用众多中间件。

## 1. 设置

我们提供了一个 Next.js 的起始模板。
使用 "create-hono" 命令启动你的项目。
在本示例中选择 `nextjs` 模板。

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono my-app
```

:::

进入 `my-app` 目录并安装依赖。

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

## 2. Hello World

如果你使用 App Router，编辑 `app/api/[[...route]]/route.ts`。更多选项请参考 [支持的 HTTP 方法](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods)。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'edge'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
```

如果你使用 Pages Router，编辑 `pages/api/[[...route]].ts`。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import type { PageConfig } from 'next'

export const config: PageConfig = {
  runtime: 'edge',
}

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello Next.js!',
  })
})

export default handle(app)
```

## 3. 运行

在本地运行开发服务器。然后在浏览器中访问 `http://localhost:3000`。

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

现在，`/api/hello` 仅返回 JSON，但如果你构建 React UI，你可以使用 Hono 创建一个全栈应用。

## 4. 部署

如果你有 Vercel 账户，可以通过链接 Git 仓库进行部署。

## Node.js

你也可以在 Node.js 运行时的 Next.js 上运行 Hono。

### App Router

对于 App Router，你只需要在路由处理程序中将运行时设置为 `nodejs`：

```ts
import { Hono } from 'hono'
import { handle } from 'hono/vercel'

export const runtime = 'nodejs'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

export const GET = handle(app)
export const POST = handle(app)
```

### Pages Router

对于 Pages Router，你需要先安装 Node.js 适配器：

::: code-group

```sh [npm]
npm i @hono/node-server
```

```sh [yarn]
yarn add @hono/node-server
```

```sh [pnpm]
pnpm add @hono/node-server
```

```sh [bun]
bun add @hono/node-server
```

:::

然后，你可以使用从 `@hono/node-server/vercel` 导入的 `handle` 函数：

```ts
import { Hono } from 'hono'
import { handle } from '@hono/node-server/vercel'
import type { PageConfig } from 'next'

export const config: PageConfig = {
  api: {
    bodyParser: false,
  },
}

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello from Hono!',
  })
})

export default handle(app)
```

为了使其在 Pages Router 中正常工作，需要通过在项目仪表板或 `.env` 文件中设置环境变量来禁用 Vercel node.js 辅助程序：

```text
NODEJS_HELPERS=0
```
