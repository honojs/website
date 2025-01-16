---
title: Supabase
description: 使用 Supabase 边缘函数在 Supabase 中运行 Hono，包括环境搭建、适配器配置和示例代码的概述。
---
# Supabase 边缘函数

[Supabase](https://supabase.com/) 是 Firebase 的开源替代方案，提供了一套类似 Firebase 的工具，包括数据库、身份验证、存储，以及现在的无服务器函数。

Supabase 边缘函数是全球分布式的服务端 TypeScript 函数，它们在离用户更近的地方运行，从而提供更好的性能。这些函数基于 [Deno](https://deno.com/) 开发，带来了多项优势，包括更好的安全性和现代化的 JavaScript/TypeScript 运行时。

以下是 Supabase 边缘函数的入门指南：

## 1. 环境搭建

### 前置条件

在开始之前，请确保已安装 Supabase CLI。如果尚未安装，请按照[官方文档](https://supabase.com/docs/guides/cli/getting-started)的说明进行安装。

### 创建新项目

1. 打开终端或命令提示符。

2. 在本地机器的目录中创建一个新的 Supabase 项目，运行：

```bash
supabase init
```

该命令会在当前目录初始化一个新的 Supabase 项目。

### 添加边缘函数

3. 在您的 Supabase 项目中，创建一个名为 `hello-world` 的新边缘函数：

```bash
supabase functions new hello-world
```

此命令会在您的项目中创建一个具有指定名称的新边缘函数。

## 2. Hello World

编辑 `hello-world` 函数，修改文件 `supabase/functions/hello-world/index.ts`：

```ts
import { Hono } from 'jsr:@hono/hono'

// 将此处改为您的函数名
const functionName = 'hello-world'
const app = new Hono().basePath(`/${functionName}`)

app.get('/hello', (c) => c.text('Hello from hono-server!'))

Deno.serve(app.fetch)
```

## 3. 运行

要在本地运行函数，请使用以下命令：

1. 使用以下命令启动函数：

```bash
supabase start # 启动 supabase 服务栈
supabase functions serve --no-verify-jwt # 启动函数监视器
```

`--no-verify-jwt` 标志允许您在本地开发时绕过 JWT 验证。

2. 使用 cURL 或 Postman 向 `http://127.0.0.1:54321/functions/v1/hello-world/hello` 发送 GET 请求：

```bash
curl --location 'http://127.0.0.1:54321/functions/v1/hello-world/hello'
```

此请求应返回文本 "Hello from hono-server!"。

## 4. 部署

您可以使用单个命令部署 Supabase 中的所有边缘函数：

```bash
supabase functions deploy
```

或者，您可以通过在部署命令中指定函数名称来部署单个边缘函数：

```bash
supabase functions deploy hello-world
```

有关更多部署方法，请访问 Supabase 关于[生产环境部署](https://supabase.com/docs/guides/functions/deploy)的文档。
