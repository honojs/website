---
title: 辅助函数
description: hono辅助函数用于协助开发应用程序。与中间件不同，它们不作为处理器使用，而是提供实用的功能函数。
---

# 辅助函数

辅助函数用于协助开发应用程序。与中间件不同，它们不作为处理器使用，而是提供实用的功能函数。

例如，以下是如何使用 [Cookie 辅助函数](/zh/docs/helpers/cookie)：

```ts
import { getCookie, setCookie } from 'hono/cookie'

const app = new Hono()

app.get('/cookie', (c) => {
  const yummyCookie = getCookie(c, 'yummy_cookie')
  // ...
  setCookie(c, 'delicious_cookie', 'macha')
  //
})
```

## 可用的辅助函数

- [内容协商](/zh/docs/helpers/accepts)
- [适配器](/zh/docs/helpers/adapter)
- [Cookie](/zh/docs/helpers/cookie)
- [CSS](/zh/docs/helpers/css)
- [开发工具](/zh/docs/helpers/dev)
- [工厂函数](/zh/docs/helpers/factory)
- [HTML](/zh/docs/helpers/html)
- [JWT](/zh/docs/helpers/jwt)
- [静态站点生成](/zh/docs/helpers/ssg)
- [流式传输](/zh/docs/helpers/streaming)
- [测试](/zh/docs/helpers/testing)
- [WebSocket](/zh/docs/helpers/websocket)
