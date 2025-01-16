---
title: IP 限制中间件
description: hono 内置的IP限制中间件，提供基于I P来限制访问资源
---

# IP 限制中间件

IP 限制中间件是一个基于用户 IP 地址来限制资源访问的中间件。

## 导入

```ts
import { Hono } from 'hono'
import { ipRestriction } from 'hono/ip-restriction'
```

## 使用方法

如果你的应用运行在 Bun 环境下，想要仅允许本地访问，可以按照以下方式配置。通过 `denyList` 指定要拒绝的规则，通过 `allowList` 指定要允许的规则。

```ts
import { Hono } from 'hono'
import { getConnInfo } from 'hono/bun'
import { ipRestriction } from 'hono/ip-restriction'

const app = new Hono()

app.use(
  '*',
  ipRestriction(getConnInfo, {
    denyList: [],
    allowList: ['127.0.0.1', '::1'],
  })
)

app.get('/', (c) => c.text('Hello Hono!'))
```

需要将适用于你运行环境的 [ConnInfo 辅助函数](/docs/helpers/conninfo) 中的 `getConnInfo` 作为 `ipRestriction` 的第一个参数传入。例如，在 Deno 环境下，配置如下：

```ts
import { getConnInfo } from 'hono/deno'
import { ipRestriction } from 'hono/ip-restriction'

//...

app.use(
  '*',
  ipRestriction(getConnInfo, {
    // ...
  })
)
```

## 规则说明

编写规则时请遵循以下格式：

### IPv4

- `192.168.2.0` - 静态 IP 地址
- `192.168.2.0/24` - CIDR 表示法
- `*` - 所有地址

### IPv6

- `::1` - 静态 IP 地址
- `::1/10` - CIDR 表示法
- `*` - 所有地址

## 错误处理

如果要自定义错误响应，可以在第三个参数中返回一个 `Response` 对象。

```ts
app.use(
  '*',
  ipRestriction(
    getConnInfo,
    {
      denyList: ['192.168.2.0/24'],
    },
    async (remote, c) => {
      return c.text(`禁止来自 ${remote.addr} 的访问`, 403)
    }
  )
)
```
