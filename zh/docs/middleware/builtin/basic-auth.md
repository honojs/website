---
title: Basic Auth 中间件
description: hono 内置的 Basic Auth 中间件。
---

# Basic Auth 中间件

此中间件可以为指定路径应用 Basic 认证。
在 Cloudflare Workers 或其他平台上实现 Basic 认证比表面看起来要复杂得多，但使用这个中间件，就能轻松搞定。

关于 Basic 认证方案的底层工作原理，请参阅 [MDN 文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#basic_authentication_scheme)。

## 导入

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

## 使用方法

```ts
const app = new Hono()

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/auth/page', (c) => {
  return c.text('认证成功')
})
```

如需限制特定路由和方法：

```ts
const app = new Hono()

app.get('/auth/page', (c) => {
  return c.text('查看页面')
})

app.delete(
  '/auth/page',
  basicAuth({ username: 'hono', password: 'acoolproject' }),
  (c) => {
    return c.text('页面已删除')
  }
)
```

如果你想自行验证用户，可以指定 `verifyUser` 选项；返回 `true` 表示验证通过。

```ts
const app = new Hono()

app.use(
  basicAuth({
    verifyUser: (username, password, c) => {
      return (
        username === 'dynamic-user' && password === 'hono-password'
      )
    },
  })
)
```

## 选项

### <Badge type="danger" text="必填" /> username: `string`

进行认证的用户名。

### <Badge type="danger" text="必填" /> password: `string`

用于认证指定用户名的密码值。

### <Badge type="info" text="可选" /> realm: `string`

作为返回的 WWW-Authenticate 质询头部的域名。默认值为 `"Secure Area"`。  
详见：https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives

### <Badge type="info" text="可选" /> hashFunction: `Function`

用于安全比较密码的哈希处理函数。

### <Badge type="info" text="可选" /> verifyUser: `(username: string, password: string, c: Context) => boolean | Promise<boolean>`

用于验证用户的函数。

### <Badge type="info" text="可选" /> invalidUserMessage: `string | object | MessageFunction`

`MessageFunction` 是 `(c: Context) => string | object | Promise<string | object>`。用户验证失败时的自定义消息。

## 更多选项

### <Badge type="info" text="可选" /> ...users: `{ username: string, password: string }[]`

## 使用示例

### 定义多个用户

此中间件还允许你传入包含更多 `username` 和 `password` 键值对的任意参数对象。

```ts
app.use(
  '/auth/*',
  basicAuth(
    {
      username: 'hono',
      password: 'acoolproject',
      // 在第一个对象中定义其他参数
      realm: 'www.example.com',
    },
    {
      username: 'hono-admin',
      password: 'super-secure',
      // 这里不能重新定义其他参数
    },
    {
      username: 'hono-user-1',
      password: 'a-secret',
      // 这里也不能
    }
  )
)
```

或者使用更灵活的方式：

```ts
import { users } from '../config/users'

app.use(
  '/auth/*',
  basicAuth(
    {
      realm: 'www.example.com',
      ...users[0],
    },
    ...users.slice(1)
  )
)
```