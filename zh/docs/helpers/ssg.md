---
title: SSG
description: 此工具类提供了用于从 Hono 应用程序生成静态站点的功能。它会获取已注册路由的内容并将其保存为静态文件。
---

# SSG

SSG工具可以从你的 Hono 应用程序生成静态站点。它会获取已注册路由的内容并将其保存为静态文件。

## 使用方法

### 手动方式

如果你有一个像下面这样的简单 Hono 应用：

```tsx
// index.tsx
const app = new Hono()

app.get('/', (c) => c.html('Hello, World!'))
app.use('/about', async (c, next) => {
  c.setRenderer((content, head) => {
    return c.html(
      <html>
        <head>
          <title>{head.title ?? ''}</title>
        </head>
        <body>
          <p>{content}</p>
        </body>
      </html>
    )
  })
  await next()
})
app.get('/about', (c) => {
  return c.render('Hello!', { title: 'Hono SSG Page' })
})

export default app
```

对于 Node.js，创建一个这样的构建脚本：

```ts
// build.ts
import app from './index'
import { toSSG } from 'hono/ssg'
import fs from 'fs/promises'

toSSG(app, fs)
```

执行脚本后，文件将按如下方式输出：

```bash
ls ./static
about.html  index.html
```

### Vite 插件

使用 `@hono/vite-ssg` Vite 插件，你可以轻松处理这个过程。

详细信息请参见：

https://github.com/honojs/vite-plugins/tree/main/packages/ssg

## toSSG

`toSSG` 是生成静态站点的主要函数，它接收应用程序和文件系统模块作为参数。具体说明如下：

### 输入

toSSG 的参数在 ToSSGInterface 中指定。

```ts
export interface ToSSGInterface {
  (
    app: Hono,
    fsModule: FileSystemModule,
    options?: ToSSGOptions
  ): Promise<ToSSGResult>
}
```

- `app` 指定带有已注册路由的 `new Hono()`。
- `fs` 指定以下对象，假定使用 `node:fs/promise`。

```ts
export interface FileSystemModule {
  writeFile(path: string, data: string | Uint8Array): Promise<void>
  mkdir(
    path: string,
    options: { recursive: boolean }
  ): Promise<void | string>
}
```

### 使用 Deno 和 Bun 的适配器

如果你想在 Deno 或 Bun 上使用 SSG，每个文件系统都提供了对应的 `toSSG` 函数。

对于 Deno：

```ts
import { toSSG } from 'hono/deno'

toSSG(app) // 第二个参数是类型为 `ToSSGOptions` 的选项
```

对于 Bun：

```ts
import { toSSG } from 'hono/bun'

toSSG(app) // 第二个参数是类型为 `ToSSGOptions` 的选项
```

### 选项

选项在 ToSSGOptions 接口中指定。

```ts
export interface ToSSGOptions {
  dir?: string
  concurrency?: number
  beforeRequestHook?: BeforeRequestHook
  afterResponseHook?: AfterResponseHook
  afterGenerateHook?: AfterGenerateHook
  extensionMap?: Record<string, string>
}
```

- `dir` 是静态文件的输出目标目录。默认值为 `./static`。
- `concurrency` 是同时生成文件的并发数。默认值为 `2`。
- `extensionMap` 是一个映射，包含以 `Content-Type` 为键，以扩展名字符串为值的映射。用于确定输出文件的扩展名。

各个钩子函数将在后面描述。

### 输出

`toSSG` 以下列 Result 类型返回结果。

```ts
export interface ToSSGResult {
  success: boolean
  files: string[]
  error?: Error
}
```

## 钩子函数

你可以通过在选项中指定以下自定义钩子来自定义 `toSSG` 的处理过程。

```ts
export type BeforeRequestHook = (req: Request) => Request | false
export type AfterResponseHook = (res: Response) => Response | false
export type AfterGenerateHook = (
  result: ToSSGResult
) => void | Promise<void>
```

### BeforeRequestHook/AfterResponseHook

`toSSG` 针对 app 中注册的所有路由，但如果有想要排除的路由，可以通过指定钩子来过滤。

例如，如果只想输出 GET 请求，可以在 `beforeRequestHook` 中过滤 `req.method`：

```ts
toSSG(app, fs, {
  beforeRequestHook: (req) => {
    if (req.method === 'GET') {
      return req
    }
    return false
  },
})
```

例如，如果只想在状态码为 200 或 500 时输出，可以在 `afterResponseHook` 中过滤 `res.status`：

```ts
toSSG(app, fs, {
  afterResponseHook: (res) => {
    if (res.status === 200 || res.status === 500) {
      return res
    }
    return false
  },
})
```

### AfterGenerateHook

如果你想对 `toSSG` 的结果进行处理，可以使用 `afterGenerateHook`：

```ts
toSSG(app, fs, {
  afterGenerateHook: (result) => {
    if (result.files) {
      result.files.forEach((file) => console.log(file))
    }
  })
})
```

## 生成文件

### 路由和文件名

已注册的路由信息和生成的文件名遵循以下规则。默认的 `./static` 行为如下：

- `/` -> `./static/index.html`
- `/path` -> `./static/path.html`
- `/path/` -> `./static/path/index.html`

### 文件扩展名

文件扩展名取决于每个路由返回的 `Content-Type`。例如，来自 `c.html` 的响应保存为 `.html`。

如果你想自定义文件扩展名，可以设置 `extensionMap` 选项：

```ts
import { toSSG, defaultExtensionMap } from 'hono/ssg'

// 将 `application/x-html` 内容保存为 `.html`
toSSG(app, fs, {
  extensionMap: {
    'application/x-html': 'html',
    ...defaultExtensionMap,
  },
})
```

注意，以斜杠结尾的路径将始终保存为 index.ext，无论扩展名如何。

```ts
// 保存为 ./static/html/index.html
app.get('/html/', (c) => c.html('html'))

// 保存为 ./static/text/index.txt
app.get('/text/', (c) => c.text('text'))
```

## 中间件

介绍支持 SSG 的内置中间件。

### ssgParams

你可以使用类似 Next.js 的 `generateStaticParams` API。

示例：

```ts
app.get(
  '/shops/:id',
  ssgParams(async () => {
    const shops = await getShops()
    return shops.map((shop) => ({ id: shop.id }))
  }),
  async (c) => {
    const shop = await getShop(c.req.param('id'))
    if (!shop) {
      return c.notFound()
    }
    return c.render(
      <div>
        <h1>{shop.name}</h1>
      </div>
    )
  }
)
```

### disableSSG

设置了 `disableSSG` 中间件的路由将在 `toSSG` 生成静态文件时被排除。

```ts
app.get('/api', disableSSG(), (c) => c.text('an-api'))
```

### onlySSG

设置了 `onlySSG` 中间件的路由将在 `toSSG` 执行后被 `c.notFound()` 覆盖。

```ts
app.get('/static-page', onlySSG(), (c) => c.html(<h1>Welcome to my site</h1>))
```