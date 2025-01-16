---
title: Bun
description: 使用 Bun 运行 Hono，包括环境搭建、适配器配置和示例代码。
---
# Bun

[Bun](https://bun.sh) 是一个新的 JavaScript 运行时环境，它既不是 Node.js 也不是 Deno。Bun 内置了转译器，使我们可以直接使用 TypeScript 编写代码。
Hono 同样可以在 Bun 上运行。

## 1. 安装 Bun

要安装 `bun` 命令，请按照[官方网站](https://bun.sh)的说明进行操作。

## 2. 配置

### 2.1. 创建新项目

我们提供了一个 Bun 的启动模板。你可以使用 "bun create" 命令来开始你的项目。
在这个示例中，请选择 `bun` 模板。

```sh
bun create hono@latest my-app
```

进入 my-app 目录并安装依赖。

```sh
cd my-app
bun install
```

### 2.2. 在现有项目中配置

对于现有的 Bun 项目，只需要在项目根目录通过以下命令安装 `hono` 依赖：

```sh
bun add hono
```

## 3. Hello World

下面是 "Hello World" 示例代码。与其他平台的写法几乎相同。

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

## 4. 运行

执行以下命令：

```sh
bun run dev
```

然后在浏览器中访问 `http://localhost:3000`。

## 修改端口号

你可以通过导出 `port` 来指定端口号。

<!-- prettier-ignore -->
```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app // [!code --]
export default { // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## 提供静态文件服务

要提供静态文件服务，需要从 `hono/bun` 导入 `serveStatic`。

```ts
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
```

上述代码需要配合以下目录结构使用：

```
./
├── favicon.ico
├── src
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

如果你想将 `http://localhost:3000/static/*` 映射到 `./statics`，可以使用 `rewriteRequestPath` 选项：

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

你可以通过 `mimes` 添加 MIME 类型：

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

你可以通过 `onFound` 指定在找到请求文件时的处理逻辑：

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

你可以通过 `onNotFound` 指定在未找到请求文件时的处理逻辑：

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} 未找到，你访问的是 ${c.req.path}`)
    },
  })
)
```

### `precompressed`

`precompressed` 选项会检查是否存在 `.br` 或 `.gz` 等扩展名的文件，并根据 `Accept-Encoding` 头部来提供服务。它会优先使用 Brotli，然后是 Zstd，最后是 Gzip。如果这些都不可用，则会提供原始文件。

```ts
app.get(
  '/static/*',
  serveStatic({
    precompressed: true,
  })
)
```

## 测试

你可以使用 `bun:test` 在 Bun 上进行测试。

```ts
import { describe, expect, it } from 'bun:test'
import app from '.'

describe('My first test', () => {
  it('Should return 200 Response', async () => {
    const req = new Request('http://localhost/')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
  })
})
```

然后执行以下命令：

```sh
bun test index.test.ts
```