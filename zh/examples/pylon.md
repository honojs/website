---
title: Pylon
description: 使用 Pylon 构建 GraphQL API 简单直观。Pylon 是一个基于 Hono 构建的后端框架，支持代码优先的 GraphQL API 开发方式。
---
# Pylon
使用 Pylon 构建 GraphQL API 简单直观。Pylon 是一个基于 Hono 构建的后端框架，支持代码优先的 GraphQL API 开发方式。

GraphQL schema 会根据你的 TypeScript 定义实时生成，使你能够专注于编写服务逻辑。这种方法显著提高了开发速度，增强了类型安全性，并减少了错误。

代码中的任何破坏性更改都会立即反映在你的 API 中，使你能够即时看到更改对其功能的影响。

查看 [Pylon](https://pylon.cronit.io) 获取更多信息。

## 设置新的 Pylon 服务

Pylon 允许你使用 `npm create pylon` 命令创建新服务。此命令会创建一个具有基本项目结构和配置的新 Pylon 项目。
在设置过程中，你可以选择首选的运行时，如 Bun、Node.js 或 Cloudflare Workers。

**本指南使用 Bun 运行时。**

### 创建新项目

要创建新的 Pylon 项目，运行以下命令：

```bash
npm create pylon my-pylon@latest
```

这将创建一个名为 `my-pylon` 的新目录，其中包含基本的 Pylon 项目结构。

### 项目结构

Pylon 项目的结构如下：

```
my-pylon/
├── .pylon/
├── src/
│   ├── index.ts
├── package.json
├── tsconfig.json
```

- `.pylon/`：包含项目的生产构建。
- `src/`：包含项目的源代码。
- `src/index.ts`：Pylon 服务的入口点。
- `package.json`：npm 包配置文件。
- `tsconfig.json`：TypeScript 配置文件。

### 基本示例

这是一个基本的 Pylon 服务示例：

```ts
import { app } from '@getcronit/pylon'

export const graphql = {
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
}

export default app
```

## 保护 API

Pylon 与 ZITADEL（一个云原生身份和访问管理解决方案）集成，为你的 API 提供安全的身份验证和授权。你可以按照 [ZITADEL 文档](https://zitadel.com/docs/examples/secure-api/pylon) 中的步骤轻松保护你的 Pylon API。

## 创建更复杂的 API

Pylon 允许你利用其实时 schema 生成功能创建更复杂的 API。有关支持的 TypeScript 类型和如何定义 API 的更多信息，请参阅 [Pylon 文档](https://pylon.cronit.io/docs/core-concepts/type-safety-and-type-integration)。

以下示例演示如何在 Pylon 中定义复杂类型和服务。通过利用 TypeScript 类和方法，你可以创建强大的 API，与数据库、外部服务和其他资源进行交互。

```ts
import { app } from '@getcronit/pylon'

class Post {
  id: string
  title: string

  constructor(id: string, title: string) {
    this.id = id
    this.title = title
  }
}

class User {
  id: string
  name: string

  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  static async getById(id: string): Promise<User> {
    // 从数据库获取用户数据
    return new User(id, 'John Doe')
  }

  async posts(): Promise<Post[]> {
    // 从数据库获取该用户的帖子
    return [new Post('1', 'Hello, world!')]
  }

  async $createPost(title: string, content: string): Promise<Post> {
    // 在数据库中为该用户创建新帖子
    return new Post('2', title)
  }
}

export const graphql = {
  Query: {
    user: User.getById,
  },
  Mutation: {
    createPost: (userId: string, title: string, content: string) => {
      const user = User.getById(userId)
      return user.$createPost(title, content)
    },
  },
}

export default app
```

## 调用 API

Pylon API 可以使用任何 GraphQL 客户端库进行调用。对于开发目的，建议使用 Pylon Playground，这是一个基于 Web 的 GraphQL IDE，允许你实时与 API 交互。

1. 在项目目录中运行 `bun run dev` 启动 Pylon 服务器。
2. 在浏览器中导航到 `http://localhost:3000/graphql` 打开 Pylon Playground。
3. 在左侧面板中编写你的 GraphQL 查询或变更。

![Pylon Playground](/images/pylon-example.png)

## 获取 Hono 上下文

你可以使用 `getContext` 函数在代码中的任何位置访问 Hono 上下文。此函数返回当前上下文对象，其中包含有关请求、响应和其他上下文特定数据的信息。

```ts
import { app, getContext } from '@getcronit/pylon'

export const graphql = {
  Query: {
    hello: () => {
      const context = getContext()
      return `Hello, ${context.req.headers.get('user-agent')}`
    },
  },
}

export default app
```

有关 Hono 上下文对象及其属性的更多信息，请参阅 [Hono 文档](https://hono.dev/docs/api/context) 和 [Pylon 文档](https://pylon.cronit.io/docs/core-concepts/context-management)。

## Hono 在其中扮演什么角色？

Pylon 构建在 Hono 之上，后者是一个用于构建 Web 应用程序和 API 的轻量级 Web 框架。Hono 提供了处理 HTTP 请求和响应的核心功能，而 Pylon 扩展了这些功能以支持 GraphQL API 开发。

除了 GraphQL 之外，Pylon 还允许你访问底层的 Hono 应用实例来添加自定义路由和中间件。这使你能够构建更复杂的 API 和服务，充分利用 Hono 的全部功能。

```ts
import { app } from '@getcronit/pylon'

export const graphql = {
  Query: {
    sum: (a: number, b: number) => a + b,
  },
  Mutation: {
    divide: (a: number, b: number) => a / b,
  },
}

// 向 Pylon 应用添加自定义路由
app.get('/hello', (ctx, next) => {
  return new Response('Hello, world!')
})
```

## 结论

Pylon 是一个强大的 Web 框架，简化了 GraphQL API 的开发。通过利用 TypeScript 类型定义，Pylon 提供实时 schema 生成，增强类型安全性并减少错误。使用 Pylon，你可以快速构建满足业务需求的安全和可扩展的 API。Pylon 与 Hono 的集成允许你使用 Hono 的所有功能，同时专注于 GraphQL API 开发。

有关 Pylon 的更多信息，请查看[官方文档](https://pylon.cronit.io)。

## 另请参阅

- [Pylon](https://github.com/getcronit/pylon)
- [Pylon 文档](https://pylon.cronit.io)
- [Hono 文档](https://hono.dev/docs)
- [ZITADEL 文档](https://zitadel.com/docs/examples/secure-api/pylon)
