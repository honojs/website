---
title: 中间件
description: 中间件是在处理器前后执行的函数，用于处理请求和响应，遵循洋葱模型结构。
---
# 中间件

我们将返回 `Response` 的原语称为"处理器（Handler）"。
"中间件（Middleware）"在处理器之前和之后执行，用于处理 `Request` 和 `Response`。
它的结构类似于洋葱模型。

![洋葱模型](/images/onion.png)

例如，我们可以编写一个中间件来添加 "X-Response-Time" 响应头，代码如下：

```ts twoslash
import { Hono } from 'hono'
const app = new Hono()
// ---cut---
app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})
```

通过这种简单的方法，我们既可以编写自定义中间件，也可以使用内置或第三方中间件。
