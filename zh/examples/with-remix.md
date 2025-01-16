---
title: Remix 整合
description: 通过 Remix + Hono 将 Remix 作为 Hono 的中间件使用。
---

[Remix](https://remix.run/) 是一个基于 Web 标准的全栈框架。

现在，通过 fetch API，Remix 和 Hono 可以一起使用。

## Remix + Hono

你可以通过 [Remix + Hono](https://github.com/sergiodxa/remix-hono) 将 Remix 作为 Hono 的中间件使用，示例如下：

```ts
import * as build from '@remix-run/dev/server-build'
import { remix } from 'remix-hono/handler'

app.use('*', remix({ build, mode: process.env.NODE_ENV }))
```

## 参见

- [Remix](https://remix.run/)
- [Remix Hono](https://github.com/sergiodxa/remix-hono)
