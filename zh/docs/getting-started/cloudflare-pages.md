---
title: Cloudflare Pages
description: 使用 Cloudflare Pages 运行 Hono，包括环境搭建、适配器配置和示例代码。
---
# Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) 是一个面向全栈 Web 应用的边缘平台。
它用于提供静态文件服务，并通过 Cloudflare Workers 提供动态内容。

Hono 完全支持 Cloudflare Pages。
它带来了愉悦的开发体验。Vite 的开发服务器运行迅速，使用 Wrangler 部署也非常快捷。

## 1. 设置

我们提供了一个 Cloudflare Pages 的启动模板。
使用 "create-hono" 命令启动你的项目。
在本例中选择 `cloudflare-pages` 模板。

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

以下是基本的目录结构。

```text
./
├── package.json
├── public
│   └── static // 放置你的静态文件
│       └── style.css // 你可以通过 `/static/style.css` 引用它
├── src
│   ├── index.tsx // 服务端的入口点
│   └── renderer.tsx
├── tsconfig.json
└── vite.config.ts
```

## 2. Hello World

按如下方式编辑 `src/index.tsx`：

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Pages!</h1>)
})

export default app
```

## 3. 运行

在本地运行开发服务器。然后在浏览器中访问 `http://localhost:5173`。

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

## 4. 部署

如果你有 Cloudflare 账户，你可以部署到 Cloudflare。在 `package.json` 中，需要将 `$npm_execpath` 更改为你选择的包管理器。

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm run deploy
```

```sh [bun]
bun run deploy
```

:::

### 通过 GitHub 在 Cloudflare 控制台部署

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com) 并选择你的账户。
2. 在账户主页，选择 Workers & Pages > Create application > Pages > Connect to Git。
3. 授权你的 GitHub 账户，并选择仓库。在设置构建和部署时，提供以下信息：

| 配置选项 | 值 |
| -------------------- | --------------- |
| Production branch    | `main`          |
| Build command        | `npm run build` |
| Build directory      | `dist`          |

## 绑定

你可以使用 Cloudflare 的绑定功能，如变量、KV、D1 等。
在本节中，我们将使用变量和 KV。

### 创建 `wrangler.toml`

首先，为本地绑定创建 `wrangler.toml`：

```sh
touch wrangler.toml
```

编辑 `wrangler.toml`。指定名为 `MY_NAME` 的变量。

```toml
[vars]
MY_NAME = "Hono"
```

### 创建 KV

接下来，创建 KV。运行以下 `wrangler` 命令：

```sh
wrangler kv namespace create MY_KV --preview
```

记下输出中的 `preview_id`：

```
{ binding = "MY_KV", preview_id = "abcdef" }
```

使用绑定名称 `MY_KV` 指定 `preview_id`：

```toml
[[kv_namespaces]]
binding = "MY_KV"
id = "abcdef"
```

### 编辑 `vite.config.ts`

编辑 `vite.config.ts`：

```ts
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import build from '@hono/vite-cloudflare-pages'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    devServer({
      entry: 'src/index.tsx',
      adapter, // Cloudflare 适配器
    }),
    build(),
  ],
})
```

### 在应用中使用绑定

在应用中使用变量和 KV。设置类型：

```ts
type Bindings = {
  MY_NAME: string
  MY_KV: KVNamespace
}

const app = new Hono<{ Bindings: Bindings }>()
```

使用它们：

```tsx
app.get('/', async (c) => {
  await c.env.MY_KV.put('name', c.env.MY_NAME)
  const name = await c.env.MY_KV.get('name')
  return c.render(<h1>Hello! {name}</h1>)
})
```

### 生产环境

对于 Cloudflare Pages，你将在本地开发时使用 `wrangler.toml`，但在生产环境中，你需要在控制台中设置绑定。

## 客户端

你可以编写客户端脚本并使用 Vite 的功能将其导入到应用中。
如果 `/src/client.ts` 是客户端的入口点，只需在 script 标签中写入即可。
此外，`import.meta.env.PROD` 可用于检测是否在开发服务器上运行或处于构建阶段。

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        {import.meta.env.PROD ? (
          <script type='module' src='/static/client.js'></script>
        ) : (
          <script type='module' src='/src/client.ts'></script>
        )}
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
  )
})
```

为了正确构建脚本，你可以使用如下示例配置文件 `vite.config.ts`：

```ts
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.ts',
          output: {
            entryFileNames: 'static/client.js',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx',
        }),
      ],
    }
  }
})
```

你可以运行以下命令来构建服务端和客户端脚本：

```sh
vite build --mode client && vite build
```

## Cloudflare Pages 中间件

Cloudflare Pages 使用自己的[中间件](https://developers.cloudflare.com/pages/functions/middleware/)系统，这与 Hono 的中间件不同。你可以通过在名为 `_middleware.ts` 的文件中导出 `onRequest` 来启用它：

```ts
// functions/_middleware.ts
export async function onRequest(pagesContext) {
  console.log(`You are accessing ${pagesContext.request.url}`)
  return await pagesContext.next()
}
```

使用 `handleMiddleware`，你可以将 Hono 的中间件用作 Cloudflare Pages 中间件：

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'

export const onRequest = handleMiddleware(async (c, next) => {
  console.log(`You are accessing ${c.req.url}`)
  await next()
})
```

你还可以使用 Hono 的内置和第三方中间件。例如，要添加基本身份验证，你可以使用 [Hono 的基本身份验证中间件](/docs/middleware/builtin/basic-auth)：

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'
import { basicAuth } from 'hono/basic-auth'

export const onRequest = handleMiddleware(
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)
```

如果你想应用多个中间件，可以这样写：

```ts
import { handleMiddleware } from 'hono/cloudflare-pages'

// ...

export const onRequest = [
  handleMiddleware(middleware1),
  handleMiddleware(middleware2),
  handleMiddleware(middleware3),
]
```

### 访问 `EventContext`

你可以在 `handleMiddleware` 中通过 `c.env` 访问 [`EventContext`](https://developers.cloudflare.com/pages/functions/api-reference/#eventcontext) 对象。

```ts
// functions/_middleware.ts
import { handleMiddleware } from 'hono/cloudflare-pages'

export const onRequest = [
  handleMiddleware(async (c, next) => {
    c.env.eventContext.data.user = 'Joe'
    await next()
  }),
]
```

然后，你可以在处理程序中通过 `c.env.eventContext` 访问数据值：

```ts
// functions/api/[[route]].ts
import type { EventContext } from 'hono/cloudflare-pages'
import { handle } from 'hono/cloudflare-pages'

// ...

type Env = {
  Bindings: {
    eventContext: EventContext
  }
}

const app = new Hono<Env>()

app.get('/hello', (c) => {
  return c.json({
    message: `Hello, ${c.env.eventContext.data.user}!`, // 'Joe'
  })
})

export const onRequest = handle(app)
```
