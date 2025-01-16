---
title: JWT 认证中间件
description: hono 内置的 JWT 认证中间件，提供基于 JWT 的认证功能。
---

# JWT 认证中间件

JWT 认证中间件通过验证 JWT token 来提供身份认证功能。
如果未设置 `cookie` 选项，中间件将检查请求头中的 `Authorization` 字段。

:::info
客户端发送的 Authorization 请求头必须指定认证方案。

示例：`Bearer my.token.value` 或 `Basic my.token.value`
:::

## 导入

```ts
import { Hono } from 'hono'
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
```

## 使用方法

```ts
// 指定变量类型以推断 `c.get('jwtPayload')` 的类型：
type Variables = JwtVariables

const app = new Hono<{ Variables: Variables }>()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  return c.text('认证成功')
})
```

获取载荷：

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwt({
    secret: 'it-is-very-secret',
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // 例如：{ "sub": "1234567890", "name": "John Doe", "iat": 1516239022 }
})
```

::: tip

`jwt()` 只是一个中间件函数。如果你想使用环境变量（例如：`c.env.JWT_SECRET`），可以按照以下方式使用：

```js
app.use('/auth/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: c.env.JWT_SECRET,
  })
  return jwtMiddleware(c, next)
})
```

:::

## 配置选项

### <Badge type="danger" text="必填" /> secret: `string`

密钥值。

### <Badge type="info" text="可选" /> cookie: `string`

如果设置了此值，则会使用该值作为键名从 cookie 请求头中获取 token 值进行验证。

### <Badge type="info" text="可选" /> alg: `string`

用于验证的算法类型。
默认值为 `HS256`。

可用的算法类型包括：`HS256` | `HS384` | `HS512` | `RS256` | `RS384` | `RS512` | `PS256` | `PS384` | `PS512` | `ES256` | `ES384` | `ES512` | `EdDSA`。
