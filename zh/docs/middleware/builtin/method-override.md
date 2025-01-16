---
title: Method Override 中间件
description: hono 内置的 Method Override 中间件，提供在处理请求时覆盖请求方法的功能。
---

# Method Override 中间件

此中间件可以根据表单、请求头或查询参数中的值，执行与实际请求方法不同的指定方法的处理程序，并返回其响应。

## 导入

```ts
import { Hono } from 'hono'
import { methodOverride } from 'hono/method-override'
```

## 使用方法

```ts
const app = new Hono()

// 如果未指定选项，将使用表单中 `_method` 的值（如 DELETE）作为请求方法
app.use('/posts', methodOverride({ app }))

app.delete('/posts', (c) => {
  // ....
})
```

## 示例

由于 HTML 表单无法直接发送 DELETE 方法的请求，你可以在名为 `_method` 的属性中设置值为 `DELETE` 并发送。这样就会执行 `app.delete()` 对应的处理程序。

HTML 表单示例：

```html
<form action="/posts" method="POST">
  <input type="hidden" name="_method" value="DELETE" />
  <input type="text" name="id" />
</form>
```

应用程序代码：

```ts
import { methodOverride } from 'hono/method-override'

const app = new Hono()
app.use('/posts', methodOverride({ app }))

app.delete('/posts', () => {
  // ...
})
```

你可以更改默认值，或使用请求头和查询参数的值：

```ts
app.use('/posts', methodOverride({ app, form: '_custom_name' }))
app.use(
  '/posts',
  methodOverride({ app, header: 'X-METHOD-OVERRIDE' })
)
app.use('/posts', methodOverride({ app, query: '_method' }))
```

## 配置选项

### <Badge type="danger" text="必填" /> app: `Hono`

应用程序中使用的 `Hono` 实例。

### <Badge type="info" text="可选" /> form: `string`

包含方法名称值的表单字段名。
默认值为 `_method`。

### <Badge type="info" text="可选" /> header: `boolean`

包含方法名称值的请求头名称。

### <Badge type="info" text="可选" /> query: `boolean`

包含方法名称值的查询参数字段名。
