---
title: Cloudflare Workers
description: 使用 Cloudflare Workers 运行 Hono，包括环境搭建、适配器配置和示例代码。
---
# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) 是运行在 Cloudflare CDN 上的 JavaScript 边缘运行时。

你可以在本地开发应用程序，然后使用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) 通过几个命令就能发布。
Wrangler 包含转译器，因此我们可以使用 TypeScript 编写代码。

让我们用 Hono 创建你的第一个 Cloudflare Workers 应用程序。

## 1. 环境搭建

我们提供了 Cloudflare Workers 的启动模板。
使用 "create-hono" 命令启动你的项目。
在本例中选择 `cloudflare-workers` 模板。

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

按如下方式编辑 `src/index.ts`：

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default app
```

## 3. 运行

在本地运行开发服务器。然后在浏览器中访问 `http://localhost:8787`。

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

如果你有 Cloudflare 账号，就可以部署到 Cloudflare。在 `package.json` 中，需要将 `$npm_execpath` 更改为你选择的包管理器。

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

就是这样！

## Service Worker 模式和 Module Worker 模式

编写 Cloudflare Workers 有两种语法：_Module Worker 模式_ 和 _Service Worker 模式_。使用 Hono 时，这两种语法都可以使用，但我们推荐使用 Module Worker 模式，因为它可以使绑定变量局部化。

```ts
// Module Worker
export default app
```

```ts
// Service Worker
app.fire()
```

## 将 Hono 与其他事件处理程序一起使用

在 _Module Worker 模式_ 下，你可以将 Hono 与其他事件处理程序（如 `scheduled`）集成。

要实现这一点，将 `app.fetch` 导出为模块的 `fetch` 处理程序，然后根据需要实现其他处理程序：

```ts
const app = new Hono()

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {},
}
```

## 提供静态文件

如果你想提供静态文件服务，可以使用 Cloudflare Workers 的[静态资源功能](https://developers.cloudflare.com/workers/static-assets/)。在 `wrangler.toml` 中指定文件目录：

```toml
assets = { directory = "public" }
```

然后创建 `public` 目录并在其中放置文件。例如，`./public/static/hello.txt` 将以 `/static/hello.txt` 的路径提供服务。

```
.
├── package.json
├── public
│   ├── favicon.ico
│   └── static
│       └── hello.txt
├── src
│   └── index.ts
└── wrangler.toml
```

## 类型

如果你需要 workers 类型定义，需要安装 `@cloudflare/workers-types`。

::: code-group

```sh [npm]
npm i --save-dev @cloudflare/workers-types
```

```sh [yarn]
yarn add -D @cloudflare/workers-types
```

```sh [pnpm]
pnpm add -D @cloudflare/workers-types
```

```sh [bun]
bun add --dev @cloudflare/workers-types
```

:::

## 测试

对于测试，我们推荐使用 `@cloudflare/vitest-pool-workers`。
参考[示例](https://github.com/honojs/examples)了解如何设置。

如果有以下应用程序：

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Please test me!'))
```

我们可以用这段代码测试它是否返回 "_200 OK_" 响应：

```ts
describe('Test the application', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
  })
})
```

## 绑定

在 Cloudflare Workers 中，我们可以绑定环境值、KV 命名空间、R2 存储桶或 Durable Object。你可以通过 `c.env` 访问它们。如果你将绑定的"_类型结构_"作为泛型传递给 `Hono`，它们将具有类型定义。

```ts
type Bindings = {
  MY_BUCKET: R2Bucket
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 访问环境值
app.put('/upload/:key', async (c, next) => {
  const key = c.req.param('key')
  await c.env.MY_BUCKET.put(key, c.req.body)
  return c.text(`Put ${key} successfully!`)
})
```

## 在中间件中使用变量

这种情况仅适用于 Module Worker 模式。
如果你想在中间件中使用变量或密钥变量，例如在基本认证中间件中使用"用户名"或"密码"，需要按以下方式编写：

```ts
import { basicAuth } from 'hono/basic-auth'

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

//...

app.use('/auth/*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
})
```

这同样适用于 Bearer 认证中间件、JWT 认证或其他认证方式。

## 通过 Github Action 部署

在通过 CI 部署代码到 Cloudflare 之前，你需要一个 Cloudflare token。你可以在这里管理：https://dash.cloudflare.com/profile/api-tokens

如果是新创建的 token，选择 **Edit Cloudflare Workers** 模板；如果你已经有其他 token，确保该 token 具有相应的权限（注意，token 权限不会在 Cloudflare Pages 和 Cloudflare Worker 之间共享）。

然后进入你的 Github 仓库设置面板：`Settings->Secrets and variables->Actions->Repository secrets`，添加一个名为 `CLOUDFLARE_API_TOKEN` 的新密钥。

接着在你的 hono 项目根目录创建 `.github/workflows/deploy.yml`，粘贴以下代码：

```yml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

然后编辑 `wrangler.toml`，在 `compatibility_date` 行后添加以下代码：

```toml
main = "src/index.ts"
minify = true
```

一切就绪！现在推送代码就可以了。

## 本地开发时加载环境变量

要配置本地开发的环境变量，在项目根目录创建 `.dev.vars` 文件。
然后像配置普通环境变量文件一样配置你的环境变量。

```
SECRET_KEY=value
API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

> 关于此部分的更多信息，可以在 Cloudflare 文档中找到：
> https://developers.cloudflare.com/workers/wrangler/configuration/#secrets

然后我们在代码中使用 `c.env.*` 来获取环境变量。  
**对于 Cloudflare Workers，环境变量必须通过 `c` 获取，而不是通过 `process.env`。**

```ts
type Bindings = {
  SECRET_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/env', (c) => {
  const SECRET_KEY = c.env.SECRET_KEY
  return c.text(SECRET_KEY)
})
```

在将项目部署到 Cloudflare 之前，记得在 Cloudflare Worker 项目的配置中设置环境变量/密钥。

> 关于此部分的更多信息，可以在 Cloudflare 文档中找到：
> https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard
