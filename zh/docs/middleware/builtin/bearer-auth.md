---
title: Bearer Auth 中间件
description: hono 内置的 Bearer Auth 中间件。
---

# Bearer Auth 中间件

Bearer Auth 中间件通过验证请求头中的 API 令牌来提供身份认证功能。
访问端点的 HTTP 客户端需要添加值为 `Bearer {token}` 的 `Authorization` 请求头。

在终端中使用 `curl` 时，示例如下：

```sh
curl -H 'Authorization: Bearer honoiscool' http://localhost:8787/auth/page
```

## 导入

```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
```

## 使用方法

> [!NOTE]
> 你的 `token` 必须匹配正则表达式 `/[A-Za-z0-9._~+/-]+=*/`，否则将返回 400 错误。值得注意的是，此正则表达式同时支持 URL 安全的 Base64 和标准 Base64 编码的 JWT。此中间件并不要求 bearer token 必须是 JWT，只需要符合上述正则表达式即可。

```ts
const app = new Hono()

const token = 'honoiscool'

app.use('/api/*', bearerAuth({ token }))

app.get('/api/page', (c) => {
  return c.json({ message: 'You are authorized' })
})
```

限制特定路由和方法的示例：

```ts
const app = new Hono()

const token = 'honoiscool'

app.get('/api/page', (c) => {
  return c.json({ message: 'Read posts' })
})

app.post('/api/page', bearerAuth({ token }), (c) => {
  return c.json({ message: 'Created post!' }, 201)
})
```

实现多令牌支持的示例（例如，任何有效令牌都可以读取，但创建/更新/删除操作仅限于特权令牌）：

```ts
const app = new Hono()

const readToken = 'read'
const privilegedToken = 'read+write'
const privilegedMethods = ['POST', 'PUT', 'PATCH', 'DELETE']

app.on('GET', '/api/page/*', async (c, next) => {
  // 有效令牌列表
  const bearer = bearerAuth({ token: [readToken, privilegedToken] })
  return bearer(c, next)
})
app.on(privilegedMethods, '/api/page/*', async (c, next) => {
  // 单个有效特权令牌
  const bearer = bearerAuth({ token: privilegedToken })
  return bearer(c, next)
})

// 定义 GET、POST 等处理器
```

如果你想自行验证令牌的值，可以指定 `verifyToken` 选项；返回 `true` 表示令牌被接受。

```ts
const app = new Hono()

app.use(
  '/auth-verify-token/*',
  bearerAuth({
    verifyToken: async (token, c) => {
      return token === 'dynamic-token'
    },
  })
)
```

## 配置选项

### <Badge type="danger" text="必填" /> token: `string` | `string[]`

用于验证传入 bearer 令牌的字符串。

### <Badge type="info" text="可选" /> realm: `string`

作为返回的 WWW-Authenticate 质询头部一部分的域名。默认值为 `""`。
更多信息：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives

### <Badge type="info" text="可选" /> prefix: `string`

Authorization 头部值的前缀（也称为 `schema`）。默认值为 `"Bearer"`。

### <Badge type="info" text="可选" /> headerName: `string`

头部名称。默认值为 `Authorization`。

### <Badge type="info" text="可选" /> hashFunction: `Function`

用于安全比较认证令牌的哈希函数。

### <Badge type="info" text="可选" /> verifyToken: `(token: string, c: Context) => boolean | Promise<boolean>`

用于验证令牌的函数。

### <Badge type="info" text="可选" /> noAuthenticationHeaderMessage: `string | object | MessageFunction`

`MessageFunction` 是 `(c: Context) => string | object | Promise<string | object>`。当请求没有认证头部时的自定义消息。

### <Badge type="info" text="可选" /> invalidAuthenticationHeaderMessage: `string | object | MessageFunction`

当认证头部无效时的自定义消息。

### <Badge type="info" text="可选" /> invalidTokenMessage: `string | object | MessageFunction`

当令牌无效时的自定义消息。
