---
title: Netlify
description: 使用 Hono 在 Netlify 边缘计算平台上进行开发和部署，利用 Netlify CLI 实现无服务器功能。
---
# Netlify

Netlify 提供静态网站托管和无服务器后端服务。通过 [Edge Functions](https://docs.netlify.com/edge-functions/overview/)，我们可以让网页变得动态。

Edge Functions 支持使用 Deno 和 TypeScript 进行开发，并可通过 [Netlify CLI](https://docs.netlify.com/cli/get-started/) 轻松部署。使用 Hono，你可以为 Netlify Edge Functions 创建应用程序。

## 1. 环境搭建

我们提供了一个 Netlify 启动模板。
使用 "create-hono" 命令启动你的项目。
在本示例中选择 `netlify` 模板。

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

进入 `my-app` 目录。

## 2. Hello World

编辑 `netlify/edge-functions/index.ts`：

```ts
import { Hono } from 'jsr:@hono/hono'
import { handle } from 'jsr:@hono/hono/netlify'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default handle(app)
```

## 3. 运行

使用 Netlify CLI 运行开发服务器。然后在浏览器中访问 `http://localhost:8888`。

```sh
netlify dev
```

## 4. 部署

你可以使用 `netlify deploy` 命令进行部署。

```sh
netlify deploy --prod
```

## `Context`

你可以通过 `c.env` 访问 Netlify 的 `Context`：

```ts
import { Hono } from 'jsr:@hono/hono'
import { handle } from 'jsr:@hono/hono/netlify'

// 导入类型定义
import type { Context } from 'https://edge.netlify.com/'

export type Env = {
  Bindings: {
    context: Context
  }
}

const app = new Hono<Env>()

app.get('/country', (c) =>
  c.json({
    '你所在的国家': c.env.context.geo.country?.name,
  })
)

export default handle(app)
```
