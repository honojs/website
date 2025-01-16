---
title: Combine 中间件
description: hono 内置的 Combine 中间件。
---

# 组合中间件

组合中间件可以将多个中间件函数合并为单个中间件。它提供了三个功能：

- `some` - 仅运行给定中间件中的一个。
- `every` - 运行所有给定的中间件。
- `except` - 仅在不满足条件时运行所有给定的中间件。

## 导入

```ts
import { Hono } from 'hono'
import { some, every, except } from 'hono/combine'
```

## 使用方法

以下是使用组合中间件实现复杂访问控制规则的示例。

```ts
import { Hono } from 'hono'
import { bearerAuth } from 'hono/bearer-auth'
import { getConnInfo } from 'hono/cloudflare-workers'
import { every, some } from 'hono/combine'
import { ipRestriction } from 'hono/ip-restriction'
import { rateLimit } from '@/my-rate-limit'

const app = new Hono()

app.use(
  '*',
  some(
    every(
      ipRestriction(getConnInfo, { allowList: ['192.168.0.2'] }),
      bearerAuth({ token })
    ),
    // 如果上述两个条件都满足，则不会执行速率限制
    rateLimit()
  )
)

app.get('/', (c) => c.text('Hello Hono!'))
```

### some

按顺序运行中间件，直到某个中间件返回成功。一旦有中间件成功执行，后续的中间件将不会运行。

```ts
import { some } from 'hono/combine'
import { bearerAuth } from 'hono/bearer-auth'
import { myRateLimit } from '@/rate-limit'

// 如果客户端有有效令牌，则跳过速率限制
// 否则，应用速率限制
app.use(
  '/api/*',
  some(bearerAuth({ token }), myRateLimit({ limit: 100 }))
)
```

### every

按顺序运行所有中间件，如果任何一个失败则停止。如果某个中间件抛出错误，后续的中间件将不会运行。

```ts
import { some, every } from 'hono/combine'
import { bearerAuth } from 'hono/bearer-auth'
import { myCheckLocalNetwork } from '@/check-local-network'
import { myRateLimit } from '@/rate-limit'

// 如果客户端在本地网络中，则跳过身份验证和速率限制
// 否则，应用身份验证和速率限制
app.use(
  '/api/*',
  some(
    myCheckLocalNetwork(),
    every(bearerAuth({ token }), myRateLimit({ limit: 100 }))
  )
)
```

### except

在不满足条件时运行所有中间件。条件可以是字符串或函数。如果需要匹配多个目标，可以将它们作为数组传入。

```ts
import { except } from 'hono/combine'
import { bearerAuth } from 'hono/bearer-auth'

// 如果客户端访问公开 API，则跳过身份验证
// 否则，需要有效令牌
app.use('/api/*', except('/api/public/*', bearerAuth({ token })))
```