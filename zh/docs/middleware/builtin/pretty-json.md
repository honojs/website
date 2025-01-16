---
title: Pretty JSON 中间件
description: hono 内置的 Pretty JSON 中间件，为 JSON 响应体提供美化输出功能。
---

# Pretty JSON 中间件

Pretty JSON 中间件为 JSON 响应体提供了"JSON 美化输出"功能。
只需在 URL 查询参数中添加 `?pretty`，JSON 字符串就会被格式化美化。

```js
// GET /
{"project":{"name":"Hono","repository":"https://github.com/honojs/hono"}}
```

美化后：

```js
// GET /?pretty
{
  "project": {
    "name": "Hono",
    "repository": "https://github.com/honojs/hono"
  }
}
```

## 导入

```ts
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
```

## 使用方法

```ts
const app = new Hono()

app.use(prettyJSON()) // 使用配置选项：prettyJSON({ space: 4 })
app.get('/', (c) => {
  return c.json({ message: 'Hono!' })
})
```

## 配置选项

### <Badge type="info" text="可选" /> space: `number`

缩进空格数。默认值为 `2`。

### <Badge type="info" text="可选" /> query: `string`

用于触发美化功能的查询参数名。默认值为 `pretty`。
