---
title: Validator 中的错误处理
description: 通过使用 Hono 验证器，你可以更轻松地处理无效输入。本示例展示了如何利用回调结果来实现自定义错误处理。
---

通过使用验证器，你可以更轻松地处理无效输入。本示例展示了如何利用回调结果来实现自定义错误处理。

虽然此示例使用了 [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)，但你可以将类似的方法应用于任何支持的验证器库。

```ts
import { z } from 'zod'
import { zValidator } from '@hono/zod-validator'

const app = new Hono()

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
})

app.post(
  '/users/new',
  zValidator('json', userSchema, (result, c) => {
    if (!result.success) {
      return c.text('Invalid!', 400)
    }
  }),
  async (c) => {
    const user = c.req.valid('json')
    console.log(user.name) // 字符串
    console.log(user.age)  // 数字
  }
)
```

## 相关参考

- [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)
- [Valibot Validator](https://github.com/honojs/middleware/tree/main/packages/valibot-validator)
- [Typebox Validator](https://github.com/honojs/middleware/tree/main/packages/typebox-validator)
- [Typia Validator](https://github.com/honojs/middleware/tree/main/packages/typia-validator)
