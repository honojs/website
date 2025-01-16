---
title: Fastly Compute
description: 在 Fastly Compute 边缘计算平台上运行 Hono，通过 Fastly CLI 进行开发和部署。
---
# Fastly Compute

[Fastly的Compute](https://www.fastly.com/products/edge-compute)服务允许我们构建高扩展性的全球分布式应用程序，并在Fastly CDN边缘执行代码。

Hono同样可以在Fastly Compute上运行。

## 1. 安装CLI

要使用Fastly Compute，如果您还没有账号，必须先[创建一个Fastly账号](https://www.fastly.com/signup/)。
然后，安装[Fastly CLI](https://github.com/fastly/cli)。

macOS系统

```sh
brew install fastly/tap/fastly
```

其他操作系统请参考以下链接：

- [Compute services | Fastly Developer Hub](https://developer.fastly.com/learning/compute/#download-and-install-the-fastly-cli)

## 2. 设置

我们提供了一个Fastly Compute的启动模板。
使用"create-hono"命令启动您的项目。
在本例中选择`fastly`模板。

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

进入`my-app`目录并安装依赖。

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

## 3. Hello World

编辑`src/index.ts`：

```ts
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

app.fire()
```

## 4. 运行

在本地运行开发服务器。然后在Web浏览器中访问`http://localhost:7676`。

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

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm deploy
```

```sh [bun]
bun run deploy
```

:::

就是这样！
