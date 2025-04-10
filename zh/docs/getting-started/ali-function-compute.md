---
title: 阿里云函数计算
description: 本指南介绍如何使用第三方适配器在阿里云函数计算上运行 Hono，包括环境搭建和示例代码。
---
# 阿里云函数计算

[阿里云函数计算](https://www.alibabacloud.com/en/product/function-compute) 是一个全托管的事件驱动计算服务。函数计算让你可以专注于编写和上传代码，而无需管理服务器等基础设施。

本指南使用第三方适配器 [rwv/hono-alibaba-cloud-fc3-adapter](https://github.com/rwv/hono-alibaba-cloud-fc3-adapter) 在阿里云函数计算上运行 Hono。

## 1. 环境搭建

::: code-group

```sh [npm]
mkdir my-app
cd my-app
npm i hono hono-alibaba-cloud-fc3-adapter
npm i -D @serverless-devs/s esbuild
mkdir src
touch src/index.ts
```

```sh [yarn]
mkdir my-app
cd my-app
yarn add hono hono-alibaba-cloud-fc3-adapter
yarn add -D @serverless-devs/s esbuild
mkdir src
touch src/index.ts
```

```sh [pnpm]
mkdir my-app
cd my-app
pnpm add hono hono-alibaba-cloud-fc3-adapter
pnpm add -D @serverless-devs/s esbuild
mkdir src
touch src/index.ts
```

```sh [bun]
mkdir my-app
cd my-app
bun add hono hono-alibaba-cloud-fc3-adapter
bun add -D esbuild @serverless-devs/s
mkdir src
touch src/index.ts
```

:::

## 2. Hello World

编辑 `src/index.ts`。

```ts
import { Hono } from 'hono'
import { handle } from 'hono-alibaba-cloud-fc3-adapter'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)
```

## 3. 配置 serverless-devs

> [serverless-devs](https://github.com/Serverless-Devs/Serverless-Devs) 是一个开源的 Serverless 开发者平台，致力于为开发者提供强大的工具链系统。通过这个平台，开发者不仅可以一键体验多云 Serverless 产品，快速部署 Serverless 项目，还可以对 Serverless 应用进行全生命周期管理，并且非常简单快速地将 Serverless Devs 与其他工具/平台进行结合，进一步提升研发运维效率。

添加阿里云 AccessKeyID 和 AccessKeySecret

```sh
npx s config add
# 请选择云厂商: 阿里云 (alibaba)
# 输入你的 AccessKeyID 和 AccessKeySecret
```

编辑 `s.yaml`

```yaml
edition: 3.0.0
name: my-app
access: 'default'

vars:
  region: 'us-west-1'

resources:
  my-app:
    component: fc3
    props:
      region: ${vars.region}
      functionName: 'my-app'
      description: 'Hello World by Hono'
      runtime: 'nodejs20'
      code: ./dist
      handler: index.handler
      memorySize: 1024
      timeout: 300
```

编辑 `package.json` 中的 `scripts` 部分：

```json
{
  "scripts": {
    "build": "esbuild --bundle --outfile=./dist/index.js --platform=node --target=node20 ./src/index.ts",
    "deploy": "s deploy -y"
  }
}
```

## 4. 部署

最后，运行以下命令进行部署：

```sh
npm run build # 编译 TypeScript 代码为 JavaScript
npm run deploy # 部署函数到阿里云函数计算
```
