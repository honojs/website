---
title: Node.js
description: 使用 Node.js 运行 Hono，包括环境搭建、适配器配置和示例代码的概述。
---
# Node.js

[Node.js](https://nodejs.org/) 是一个开源的、跨平台的 JavaScript 运行时环境。

Hono 最初并不是为 Node.js 设计的。但是通过 [Node.js 适配器](https://github.com/honojs/node-server)，它也可以在 Node.js 上运行。

::: info
它可以在 18.x 以上版本的 Node.js 上运行。具体所需的 Node.js 版本如下：

- 18.x => 18.14.1+
- 19.x => 19.7.0+
- 20.x => 20.0.0+

基本上，你可以直接使用每个主要版本的最新版本即可。
:::

## 1. 环境搭建

我们提供了 Node.js 的启动模板。
使用 "create-hono" 命令启动你的项目。
在本例中选择 `nodejs` 模板。

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

编辑 `src/index.ts`：

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Node.js!'))

serve(app)
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

:::

## 修改端口号

你可以通过 `port` 选项指定端口号。

```ts
serve({
  fetch: app.fetch,
  port: 8787,
})
```

## 访问原生 Node.js API

你可以通过 `c.env.incoming` 和 `c.env.outgoing` 访问 Node.js API。

```ts
import { Hono } from 'hono'
import { serve, type HttpBindings } from '@hono/node-server'
// 如果使用 HTTP2，则使用 `Http2Bindings`

type Bindings = HttpBindings & {
  /* ... */
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/', (c) => {
  return c.json({
    remoteAddress: c.env.incoming.socket.remoteAddress,
  })
})

serve(app)
```

## 提供静态文件

你可以使用 `serveStatic` 从本地文件系统提供静态文件。例如，假设目录结构如下：

```sh
./
├── favicon.ico
├── index.ts
└── static
    ├── hello.txt
    └── image.png
```

如果收到对路径 `/static/*` 的请求，想要返回 `./static` 下的文件，可以这样写：

```ts
import { serveStatic } from '@hono/node-server/serve-static'

app.use('/static/*', serveStatic({ root: './' }))
```

使用 `path` 选项来提供目录根目录下的 `favicon.ico`：

```ts
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
```

如果收到对路径 `/hello.txt` 或 `/image.png` 的请求，想要返回名为 `./static/hello.txt` 或 `./static/image.png` 的文件，可以使用以下方式：

```ts
app.use('*', serveStatic({ root: './static' }))
```

### `rewriteRequestPath`

如果你想将 `http://localhost:3000/static/*` 映射到 `./statics`，可以使用 `rewriteRequestPath` 选项：

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
  })
)
```

## http2

你可以在 [Node.js http2 服务器](https://nodejs.org/api/http2.html) 上运行 hono。

### 未加密的 http2

```ts
import { createServer } from 'node:http2'

const server = serve({
  fetch: app.fetch,
  createServer,
})
```

### 加密的 http2

```ts
import { createSecureServer } from 'node:http2'
import { readFileSync } from 'node:fs'

const server = serve({
  fetch: app.fetch,
  createServer: createSecureServer,
  serverOptions: {
    key: readFileSync('localhost-privkey.pem'),
    cert: readFileSync('localhost-cert.pem'),
  },
})
```

## 构建和部署

完成以下步骤来构建一个简单的 Hono 应用。带有前端框架的应用可能需要使用 [Hono 的 Vite 插件](https://github.com/honojs/vite-plugins)。

1. 在 `tsconfig.json` 的 `compilerOptions` 部分添加 `"outDir": "./dist"`。
2. 在 `tsconfig.json` 中添加 `"exclude": ["node_modules"]`。
3. 在 `package.json` 的 `script` 部分添加 `"build": "tsc"`。
4. 运行 `npm install typescript --save-dev`。
5. 在 `package.json` 中添加 `"type": "module"`。
6. 运行 `npm run build`！

### Dockerfile

这是一个 Dockerfile 示例。在此构建和部署过程能够正常工作之前，你必须完成上述步骤 1-5。

```Dockerfile
FROM node:20-alpine AS base

FROM base AS builder

RUN apk add --no-cache gcompat
WORKDIR /app

COPY package*json tsconfig.json src ./

RUN npm ci && \
    npm run build && \
    npm prune --production

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

USER hono
EXPOSE 3000

CMD ["node", "/app/dist/index.js"]
```
