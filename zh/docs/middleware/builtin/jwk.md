---
title: JWK 认证中间件
description: JWK 认证中间件通过使用 JWK（JSON Web Key）验证令牌来进行请求认证。
---
# JWK 认证中间件

JWK 认证中间件通过使用 JWK（JSON Web Key）验证令牌来进行请求认证。它会检查 `Authorization` 头部和其他配置的来源（如果指定了的话，比如 cookie）。具体来说，它使用提供的 `keys` 验证令牌，如果指定了 `jwks_uri` 则从该地址获取密钥，并且如果设置了 `cookie` 选项则支持从 cookie 中提取令牌。

:::info
从客户端发送的 Authorization 头部必须有指定的方案。

示例：`Bearer my.token.value` 或 `Basic my.token.value`
:::

## 导入

```ts
import { Hono } from 'hono'
import { jwk } from 'hono/jwk'
```

## 使用方法

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
  })
)

app.get('/auth/page', (c) => {
  return c.text('你已通过认证')
})
```

获取载荷：

```ts
const app = new Hono()

app.use(
  '/auth/*',
  jwk({
    jwks_uri: `https://${backendServer}/.well-known/jwks.json`,
  })
)

app.get('/auth/page', (c) => {
  const payload = c.get('jwtPayload')
  return c.json(payload) // 例如：{ "sub": "1234567890", "name": "张三", "iat": 1516239022 }
})
```

## 选项

### <Badge type="info" text="可选" /> keys: `HonoJsonWebKey[] | (() => Promise<HonoJsonWebKey[]>)`

你的公钥值，或返回公钥的函数。

### <Badge type="info" text="可选" /> jwks_uri: `string`

如果设置了此值，将尝试从该 URI 获取 JWK，期望得到一个包含 `keys` 的 JSON 响应，这些密钥会被添加到提供的 `keys` 选项中。

### <Badge type="info" text="可选" /> cookie: `string`

如果设置了此值，则会使用该值作为键从 cookie 头部中获取值，然后将其作为令牌进行验证。
