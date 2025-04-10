---
title: Fastly Compute
description: 在 Fastly Compute 边缘计算平台上运行 Hono，通过 Fastly CLI 进行开发和部署。
---
# Fastly Compute

[Fastly Compute](https://www.fastly.com/products/edge-compute) 是一个先进的边缘计算系统，可以让你使用你喜欢的编程语言在其全球边缘网络上运行代码。Hono 同样可以在 Fastly Compute 上运行。

你可以在本地开发应用程序，并使用 [Fastly CLI](https://www.fastly.com/documentation/reference/tools/cli/) 通过几个简单的命令进行发布。

## 1. 环境搭建

我们提供了 Fastly Compute 的启动模板。
使用 "create-hono" 命令启动你的项目。
在本例中选择 `fastly` 模板。

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
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

app.fire()
```

## 3. 运行

在本地运行开发服务器。然后在浏览器中访问 `http://localhost:7676`。

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm run start
```

```sh [bun]
bun run start
```

:::

## 4. 部署

要将应用程序构建并部署到你的 Fastly 账户，请运行以下命令。首次部署应用程序时，系统会提示你在账户中创建一个新服务。

如果你还没有账户，你需要先[创建一个 Fastly 账户](https://www.fastly.com/signup/)。

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
