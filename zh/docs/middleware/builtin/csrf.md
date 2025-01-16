---
title: CSRF 防护中间件
description: hono 内置的 CSRF 防护中间件。
---

# CSRF 防护中间件

CSRF 防护中间件通过检查请求头来防止 CSRF 攻击。

该中间件通过比对 `Origin` 请求头与请求 URL 的值来防止表单提交等 CSRF 攻击。

对于不发送 `Origin` 头的旧版浏览器，或使用反向代理移除了 `Origin` 头的环境，此中间件可能无法正常工作。在这些环境中，建议使用其他 CSRF 令牌方法。

## 导入

```ts
import { Hono } from 'hono'
import { csrf } from 'hono/csrf'
```

## 使用方法

```ts
const app = new Hono()

app.use(csrf())

// 使用 `origin` 选项指定源
// 字符串形式
app.use(csrf({ origin: 'myapp.example.com' }))

// 字符串数组形式
app.use(
  csrf({
    origin: ['myapp.example.com', 'development.myapp.example.com'],
  })
)

// 函数形式
// 强烈建议验证协议以确保与 `$` 匹配
// 切勿使用前向匹配
app.use(
  '*',
  csrf({
    origin: (origin) =>
      /https:\/\/(\w+\.)?myapp\.example\.com$/.test(origin),
  })
)
```

## 选项

### <Badge type="info" text="可选" /> origin: `string` | `string[]` | `Function`

指定允许的源。
