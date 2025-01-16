---
title: Azure Functions
description: 使用 Azure Functions 运行 Hono，包括环境搭建、适配器配置和示例代码。
---
# Azure Functions

[Azure Functions](https://azure.microsoft.com/en-us/products/functions) 是微软 Azure 提供的一个无服务器平台。您可以编写代码响应各种事件，而平台会自动管理底层的计算资源。

虽然 Hono 最初并非为 Azure Functions 设计，但通过 [Azure Functions 适配器](https://github.com/Marplex/hono-azurefunc-adapter)，它现在也能在该平台上运行。

该适配器支持运行在 Node.js 18 或更高版本的 Azure Functions **V4**。

## 1. 安装命令行工具

要创建 Azure Function，您需要先安装 [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools)。

在 macOS 上安装：

```sh
brew tap azure/functions
brew install azure-functions-core-tools@4
```

其他操作系统请参考以下链接：

- [安装 Azure Functions Core Tools | Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools)

## 2. 项目设置

在当前文件夹中创建一个 TypeScript Node.js V4 项目。

```sh
func init --typescript
```

修改主机的默认路由前缀。在 `host.json` 的根 JSON 对象中添加以下属性：

```json
"extensions": {
    "http": {
        "routePrefix": ""
    }
}
```

::: info
Azure Functions 的默认路由前缀是 `/api`。如果您没有按上述方式更改，请确保所有 Hono 路由都以 `/api` 开头
:::

现在，您可以使用以下命令安装 Hono 和 Azure Functions 适配器：

::: code-group

```sh [npm]
npm i @marplex/hono-azurefunc-adapter hono
```

```sh [yarn]
yarn add @marplex/hono-azurefunc-adapter hono
```

```sh [pnpm]
pnpm add @marplex/hono-azurefunc-adapter hono
```

```sh [bun]
bun add @marplex/hono-azurefunc-adapter hono
```

:::

## 3. Hello World 示例

创建 `src/app.ts`：

```ts
// src/app.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Azure Functions!'))

export default app
```

创建 `src/functions/httpTrigger.ts`：

```ts
// src/functions/httpTrigger.ts
import { app } from '@azure/functions'
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter'
import honoApp from '../app'

app.http('httpTrigger', {
  methods: [
    //在此添加所有支持的 HTTP 方法
    'GET',
    'POST',
    'DELETE',
    'PUT',
  ],
  authLevel: 'anonymous',
  route: '{*proxy}',
  handler: azureHonoHandler(honoApp.fetch),
})
```

## 4. 运行

在本地运行开发服务器。然后在浏览器中访问 `http://localhost:7071`。

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm start
```

```sh [bun]
bun run start
```

:::

## 5. 部署

::: info
在部署到 Azure 之前，您需要在云基础设施中创建一些资源。请参阅微软文档中的 [为函数创建 Azure 支持资源](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4&tabs=windows%2Cazure-cli%2Cbrowser#create-supporting-azure-resources-for-your-function)
:::

构建项目以准备部署：

::: code-group

```sh [npm]
npm run build
```

```sh [yarn]
yarn build
```

```sh [pnpm]
pnpm build
```

```sh [bun]
bun run build
```

:::

将项目部署到 Azure 云中的函数应用。请将 `<YourFunctionAppName>` 替换为您的应用名称。

```sh
func azure functionapp publish <YourFunctionAppName>
```
