---
title: 开发调试工具类
description: 使用hono的开发调试工具类，可以方便地获取当前使用的路由器名称，并展示已注册的路由。
---

# 开发调试工具类

开发调试工具类提供了一些在开发过程中非常有用的方法。

```ts
import { Hono } from 'hono'
import { getRouterName, showRoutes } from 'hono/dev'
```

## `getRouterName()`

你可以通过 `getRouterName()` 获取当前使用的路由器名称。

```ts
const app = new Hono()

// ...

console.log(getRouterName(app))
```

## `showRoutes()`

`showRoutes()` 函数用于在控制台中展示已注册的路由。

以下面这个应用为例：

```ts
const app = new Hono().basePath('/v1')

app.get('/posts', (c) => {
  // ...
})

app.get('/posts/:id', (c) => {
  // ...
})

app.post('/posts', (c) => {
  // ...
})

showRoutes(app, {
  verbose: true,
})
```

当应用启动时，路由信息将在控制台中以如下方式显示：

```txt
GET   /v1/posts
GET   /v1/posts/:id
POST  /v1/posts
```

## 配置选项

### <Badge type="info" text="可选" /> verbose: `boolean`

当设置为 `true` 时，将显示详细信息。

### <Badge type="info" text="可选" /> colorize: `boolean`

当设置为 `false` 时，输出内容将不会带有颜色。
