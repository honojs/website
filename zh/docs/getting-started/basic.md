---
title: 入门指南
description: Hono 是一个简单易用的 Web 框架。它支持多种运行时环境，提供统一的开发体验，让你可以快速搭建和部署 Web 应用。本文将介绍 Hono 的基本使用方法。
---
# 入门指南

使用 Hono 非常简单。我们可以快速完成项目设置、代码编写、本地开发和部署。相同的代码可以在任何运行时环境中运行，只需使用不同的入口点即可。让我们来了解 Hono 的基本用法。

## 快速开始

每个平台都提供了启动模板。使用以下 "create-hono" 命令：

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono@latest my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono@latest my-app
```

:::

接下来，系统会询问你想使用哪个模板。
在这个例子中，让我们选择 Cloudflare Workers。

```
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
❯   cloudflare-workers
    deno
    fastly
    nextjs
    nodejs
    vercel
```

模板将被下载到 `my-app` 目录中，进入该目录并安装依赖：

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

依赖安装完成后，运行以下命令启动本地服务器：

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

## Hello World

你可以使用 Cloudflare Workers 的开发工具 "Wrangler"、Deno、Bun 或其他工具，直接用 TypeScript 编写代码，无需关心转译过程。

让我们在 `src/index.ts` 中编写第一个 Hono 应用。以下是一个基础的 Hono 应用示例。

虽然 `import` 语句和最终的 `export default` 可能因运行时环境而异，但应用代码的核心部分在所有环境中都是相同的。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
```

启动开发服务器，并在浏览器中访问 `http://localhost:8787`。

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

## 返回 JSON

返回 JSON 数据也很简单。以下示例展示了如何处理对 `/api/hello` 的 GET 请求，并返回 `application/json` 响应。

```ts
app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})
```

## 请求和响应

下面展示如何获取路径参数、URL 查询值，以及添加响应头：

```ts
app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want see ${page} of ${id}`)
})
```

除了 GET 请求，我们也可以轻松处理 POST、PUT 和 DELETE 请求。

```ts
app.post('/posts', (c) => c.text('Created!', 201))
app.delete('/posts/:id', (c) =>
  c.text(`${c.req.param('id')} is deleted!`)
)
```

## 返回 HTML

你可以使用 [html 辅助函数](/docs/helpers/html) 或 [JSX](/docs/guides/jsx) 语法编写 HTML。如果要使用 JSX，需要将文件重命名为 `src/index.tsx` 并进行相应配置（具体配置因运行时环境而异）。以下是使用 JSX 的示例：

```tsx
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  )
}

app.get('/page', (c) => {
  return c.html(<View />)
})
```

## 返回原始响应

你也可以直接返回原始的 [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) 对象。

```ts
app.get('/', () => {
  return new Response('Good morning!')
})
```

## 使用中间件

中间件可以帮你处理复杂的工作。
例如，添加基本身份验证：

```ts
import { basicAuth } from 'hono/basic-auth'

// ...

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => {
  return c.text('You are authorized!')
})
```

Hono 提供了多个实用的内置中间件，包括 Bearer 认证、JWT 认证、CORS 和 ETag 等。
此外，Hono 还提供了使用外部库的第三方中间件，如 GraphQL 服务器和 Firebase Auth。
你也可以创建自己的中间件。

## 适配器

Hono 为平台特定功能提供了适配器，例如处理静态文件或 WebSocket。
比如，要在 Cloudflare Workers 中处理 WebSocket，可以导入 `hono/cloudflare-workers`：

```ts
import { upgradeWebSocket } from 'hono/cloudflare-workers'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    // ...
  })
)
```

## 下一步

虽然大多数代码可以在任何平台上运行，但每个平台都有其特定的指南，
例如如何设置项目或如何部署。
请查看你想要使用的具体平台的页面来创建你的应用！
