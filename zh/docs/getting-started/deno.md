---
title: Deno
description: 使用 Deno 运行 Hono，包括环境搭建、适配器配置和示例代码。
---
# Deno

[Deno](https://deno.com/) 是一个基于 V8 引擎的 JavaScript 运行时环境，它与 Node.js 不同。
Hono 同样可以在 Deno 环境中运行。

您可以使用 Hono，用 TypeScript 编写代码，通过 `deno` 命令运行应用程序，并将其部署到 "Deno Deploy" 平台。

## 1. 安装 Deno

首先，安装 `deno` 命令行工具。
请参考[官方文档](https://docs.deno.com/runtime/manual/getting_started/installation)。

## 2. 项目设置

我们提供了一个 Deno 项目模板。
您可以使用 "create-hono" 命令来启动项目。

```sh
deno init --npm hono my-app
```

在本示例中，请选择 `deno` 模板。

进入 `my-app` 目录。对于 Deno 项目，您无需显式安装 Hono。

```sh
cd my-app
```

## 3. Hello World

编写您的第一个应用程序。

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello Deno!'))

Deno.serve(app.fetch)
```

## 4. 运行

只需执行以下命令：

```sh
deno task start
```

## 修改端口号

您可以通过更新 `main.ts` 中 `Deno.serve` 的参数来指定端口号：

```ts
Deno.serve(app.fetch) // [!code --]
Deno.serve({ port: 8787 }, app.fetch) // [!code ++]
```

## 提供静态文件服务

要提供静态文件服务，请使用从 `hono/middleware.ts` 导入的 `serveStatic`。

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/deno'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))

Deno.serve(app.fetch)
```

对于上述代码，以下目录结构将正常工作：

```
./
├── favicon.ico
├── index.ts
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

如果您想将 `http://localhost:8000/static/*` 映射到 `./statics`，可以使用 `rewriteRequestPath` 选项：

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) =>
      path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

您可以通过 `mimes` 添加 MIME 类型：

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
  })
)
```

### `onFound`

您可以通过 `onFound` 指定在找到请求文件时的处理方式：

```ts
app.get(
  '/static/*',
  serveStatic({
    // ...
    onFound: (_path, c) => {
      c.header('Cache-Control', `public, immutable, max-age=31536000`)
    },
  })
)
```

### `onNotFound`

您可以通过 `onNotFound` 指定在未找到请求文件时的处理方式：

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} 未找到，您访问的是 ${c.req.path}`)
    },
  })
)
```

### `precompressed`

`precompressed` 选项会检查是否存在 `.br` 或 `.gz` 等扩展名的文件，并根据 `Accept-Encoding` 头部提供服务。它优先使用 Brotli，然后是 Zstd，最后是 Gzip。如果都不可用，则提供原始文件。

```ts
app.get(
  '/static/*',
  serveStatic({
    precompressed: true,
  })
)
```

## Deno Deploy

Deno Deploy 是一个面向 Deno 的边缘运行时平台。
我们可以通过 Deno Deploy 将应用程序发布到全球。

Hono 也支持 Deno Deploy。请参考[官方文档](https://docs.deno.com/deploy/manual/)。

## 测试

在 Deno 上测试应用程序非常简单。
您可以使用 `Deno.test` 编写测试，并使用来自 [@std/assert](https://jsr.io/@std/assert) 的 `assert` 或 `assertEquals`。

```sh
deno add jsr:@std/assert
```

```ts
import { Hono } from 'hono'
import { assertEquals } from '@std/assert'

Deno.test('Hello World', async () => {
  const app = new Hono()
  app.get('/', (c) => c.text('Please test me'))

  const res = await app.request('http://localhost/')
  assertEquals(res.status, 200)
})
```

然后运行命令：

```sh
deno test hello.ts
```

## `npm:` 说明符

`npm:hono` 也是可用的。您可以通过修改 `deno.json` 来使用它：

```json
{
  "imports": {
    "hono": "jsr:@hono/hono" // [!code --]
    "hono": "npm:hono" // [!code ++]
  }
}
```

您可以使用 `npm:hono` 或 `jsr:@hono/hono`。

如果您想使用第三方中间件（如 `npm:@hono/zod-validator`）并获得 TypeScript 类型推断，您需要使用 `npm:` 说明符。

```json
{
  "imports": {
    "hono": "npm:hono",
    "zod": "npm:zod",
    "@hono/zod-validator": "npm:@hono/zod-validator"
  }
}
```