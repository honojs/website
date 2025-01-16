---
title: RPC
description: 使用Hono的RPC功能，可以在服务器和客户端之间共享API规范。
---

# RPC

RPC 功能允许在服务器和客户端之间共享 API 规范。

你可以导出由 Validator 指定的输入类型和由 `json()` 输出的类型。Hono Client 可以导入这些类型。

> [!NOTE]  
> 为了让 RPC 类型在 monorepo 中正常工作，需要在客户端和服务器端的 tsconfig.json 文件中设置 `"strict": true` 在 `compilerOptions` 中。[了解更多](https://github.com/honojs/hono/issues/2270#issuecomment-2143745118)

## 服务器端

在服务器端，你只需要编写验证器并创建一个 `route` 变量。以下示例使用了 [Zod Validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator)。

```ts{1}
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      title: z.string(),
      body: z.string(),
    })
  ),
  (c) => {
    // ...
    return c.json(
      {
        ok: true,
        message: 'Created!',
      },
      201
    )
  }
)
```

然后，导出类型以与客户端共享 API 规范。

```ts
export type AppType = typeof route
```

## 客户端

在客户端，首先导入 `hc` 和 `AppType`。

```ts
import { AppType } from '.'
import { hc } from 'hono/client'
```

`hc` 是用于创建客户端的函数。将 `AppType` 作为泛型传入，并指定服务器 URL 作为参数。

```ts
const client = hc<AppType>('http://localhost:8787/')
```

调用 `client.{path}.{method}` 并传入你想发送到服务器的数据作为参数。

```ts
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

`res` 与 "fetch" Response 兼容。你可以通过 `res.json()` 获取服务器返回的数据。

```ts
if (res.ok) {
  const data = await res.json()
  console.log(data.message)
}
```

::: warning 文件上传

目前，客户端不支持文件上传。

:::

## 状态码

如果你在 `c.json()` 中明确指定状态码，如 `200` 或 `404`，它将作为类型添加到客户端。

```ts
// server.ts
const app = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.json({ error: 'not found' }, 404) // 指定 404
    }

    return c.json({ post }, 200) // 指定 200
  }
)

export type AppType = typeof app
```

你可以通过状态码获取数据。

```ts
// client.ts
const client = hc<AppType>('http://localhost:8787/')

const res = await client.posts.$get({
  query: {
    id: '123',
  },
})

if (res.status === 404) {
  const data: { error: string } = await res.json()
  console.log(data.error)
}

if (res.ok) {
  const data: { post: Post } = await res.json()
  console.log(data.post)
}

// { post: Post } | { error: string }
type ResponseType = InferResponseType<typeof client.posts.$get>

// { post: Post }
type ResponseType200 = InferResponseType<
  typeof client.posts.$get,
  200
>
```

## Not Found

如果你想使用客户端，不应该使用 `c.notFound()` 作为 Not Found 响应。客户端从服务器获取的数据类型将无法被正确推断。

```ts
// server.ts
export const routes = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.notFound() // ❌️
    }

    return c.json({ post })
  }
)

// client.ts
import { hc } from 'hono/client'

const client = hc<typeof routes>('/')

const res = await client.posts[':id'].$get({
  param: {
    id: '123',
  },
})

const data = await res.json() // 🙁 data 类型为 unknown
```

请使用 `c.json()` 并为 Not Found 响应指定状态码。

```ts
export const routes = new Hono().get(
  '/posts',
  zValidator(
    'query',
    z.object({
      id: z.string(),
    })
  ),
  async (c) => {
    const { id } = c.req.valid('query')
    const post: Post | undefined = await getPost(id)

    if (post === undefined) {
      return c.json({ error: 'not found' }, 404) // 指定 404
    }

    return c.json({ post }, 200) // 指定 200
  }
)
```

## 路径参数

你也可以处理包含路径参数的路由。

```ts
const route = app.get(
  '/posts/:id',
  zValidator(
    'query',
    z.object({
      page: z.string().optional(),
    })
  ),
  (c) => {
    // ...
    return c.json({
      title: 'Night',
      body: 'Time to sleep',
    })
  }
)
```

使用 `param` 指定要包含在路径中的字符串。

```ts
const res = await client.posts[':id'].$get({
  param: {
    id: '123',
  },
  query: {},
})
```

## Headers

你可以向请求添加头部信息。

```ts
const res = await client.search.$get(
  {
    //...
  },
  {
    headers: {
      'X-Custom-Header': 'Here is Hono Client',
      'X-User-Agent': 'hc',
    },
  }
)
```

要为所有请求添加通用头部，可以将其作为参数传递给 `hc` 函数。

```ts
const client = hc<AppType>('/api', {
  headers: {
    Authorization: 'Bearer TOKEN',
  },
})
```

## `init` 选项

你可以将 fetch 的 `RequestInit` 对象作为 `init` 选项传递给请求。以下是中止请求的示例。

```ts
import { hc } from 'hono/client'

const client = hc<AppType>('http://localhost:8787/')

const abortController = new AbortController()
const res = await client.api.posts.$post(
  {
    json: {
      // 请求体
    },
  },
  {
    // RequestInit 对象
    init: {
      signal: abortController.signal,
    },
  }
)

// ...

abortController.abort()
```

::: info
通过 `init` 定义的 `RequestInit` 对象具有最高优先级。它可以用来覆盖其他选项（如 `body | method | headers`）设置的内容。
:::

## `$url()`

你可以使用 `$url()` 获取访问端点的 `URL` 对象。

::: warning
你必须传入一个绝对 URL 才能使其正常工作。传入相对 URL `/` 将导致以下错误。

`Uncaught TypeError: Failed to construct 'URL': Invalid URL`

```ts
// ❌ 将抛出错误
const client = hc<AppType>('/')
client.api.post.$url()

// ✅ 将正常工作
const client = hc<AppType>('http://localhost:8787/')
client.api.post.$url()
```

:::

```ts
const route = app
  .get('/api/posts', (c) => c.json({ posts }))
  .get('/api/posts/:id', (c) => c.json({ post }))

const client = hc<typeof route>('http://localhost:8787/')

let url = client.api.posts.$url()
console.log(url.pathname) // `/api/posts`

url = client.api.posts[':id'].$url({
  param: {
    id: '123',
  },
})
console.log(url.pathname) // `/api/posts/123`
```

## 自定义 `fetch` 方法

你可以设置自定义的 `fetch` 方法。

在以下 Cloudflare Worker 示例脚本中，使用了 Service Bindings 的 `fetch` 方法而不是默认的 `fetch`。

```toml
# wrangler.toml
services = [
  { binding = "AUTH", service = "auth-service" },
]
```

```ts
// src/client.ts
const client = hc<CreateProfileType>('/', {
  fetch: c.env.AUTH.fetch.bind(c.env.AUTH),
})
```

## 类型推断

使用 `InferRequestType` 和 `InferResponseType` 来获知要请求的对象类型和要返回的对象类型。

```ts
import type { InferRequestType, InferResponseType } from 'hono/client'

// InferRequestType
const $post = client.todo.$post
type ReqType = InferRequestType<typeof $post>['form']

// InferResponseType
type ResType = InferResponseType<typeof $post>
```

## 使用 SWR

你也可以使用 React Hook 库，如 [SWR](https://swr.vercel.app)。

```tsx
import useSWR from 'swr'
import { hc } from 'hono/client'
import type { InferRequestType } from 'hono/client'
import { AppType } from '../functions/api/[[route]]'

const App = () => {
  const client = hc<AppType>('/api')
  const $get = client.hello.$get

  const fetcher =
    (arg: InferRequestType<typeof $get>) => async () => {
      const res = await $get(arg)
      return await res.json()
    }

  const { data, error, isLoading } = useSWR(
    'api-hello',
    fetcher({
      query: {
        name: 'SWR',
      },
    })
  )

  if (error) return <div>加载失败</div>
  if (isLoading) return <div>加载中...</div>

  return <h1>{data?.message}</h1>
}

export default App
```

## 在大型应用中使用 RPC

在大型应用中，比如在[构建大型应用](/docs/guides/best-practices#building-a-larger-application)中提到的示例，你需要注意类型推断。
一个简单的方法是将处理程序链接起来，这样类型就始终能被推断出来。

```ts
// authors.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list authors'))
  .post('/', (c) => c.json('create an author', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

```ts
// books.ts
import { Hono } from 'hono'

const app = new Hono()
  .get('/', (c) => c.json('list books'))
  .post('/', (c) => c.json('create a book', 201))
  .get('/:id', (c) => c.json(`get ${c.req.param('id')}`))

export default app
```

然后你可以像往常一样导入子路由，并确保也链接它们的处理程序。由于这是应用的顶层，这就是我们要导出的类型。

```ts
// index.ts
import { Hono } from 'hono'
import authors from './authors'
import books from './books'

const app = new Hono()

const routes = app.route('/authors', authors).route('/books', books)

export default app
export type AppType = typeof routes
```

现在你可以使用注册的 AppType 创建一个新的客户端，并像往常一样使用它。

## 已知问题

### IDE 性能

使用 RPC 时，路由越多，IDE 就会变得越慢。这主要是因为为了推断应用的类型，需要执行大量的类型实例化。

例如，假设你的应用有这样一个路由：

```ts
// app.ts
export const app = new Hono().get('foo/:id', (c) =>
  c.json({ ok: true }, 200)
)
```

Hono 会这样推断类型：

```ts
export const app = Hono<BlankEnv, BlankSchema, '/'>().get<
  'foo/:id',
  'foo/:id',
  JSONRespondReturn<{ ok: boolean }, 200>,
  BlankInput,
  BlankEnv
>('foo/:id', (c) => c.json({ ok: true }, 200))
```

这是单个路由的类型实例化。虽然用户不需要手动编写这些类型参数（这是好事），但众所周知类型实例化需要很长时间。你的 IDE 中使用的 `tsserver` 每次使用应用时都会执行这个耗时的任务。如果你有很多路由，这可能会显著降低 IDE 的速度。

不过，我们有一些技巧可以缓解这个问题。

#### Hono 版本不匹配

如果你的后端与前端是分开的，并且位于不同的目录中，你需要确保 Hono 版本匹配。如果后端使用一个版本的 Hono，前端使用另一个版本，你会遇到诸如 "_Type instantiation is excessively deep and possibly infinite_" 之类的问题。

![hono-version-mismatch](https://github.com/user-attachments/assets/e4393c80-29dd-408d-93ab-d55c11ccca05)

#### TypeScript 项目引用

与 [Hono 版本不匹配](#hono-version-mismatch) 的情况类似，如果你的后端和前端是分开的，你会遇到问题。如果你想在前端访问后端的代码（例如 `AppType`），你需要使用[项目引用](https://www.typescriptlang.org/docs/handbook/project-references.html)。TypeScript 的项目引用允许一个 TypeScript 代码库访问和使用另一个 TypeScript 代码库的代码。*(来源：[Hono RPC And TypeScript Project References](https://catalins.tech/hono-rpc-in-monorepos/))*。

#### 在使用前编译代码（推荐）

`tsc` 可以在编译时完成类型实例化等重任！这样，`tsserver` 就不需要每次使用时都实例化所有类型参数。这将大大提高你的 IDE 速度！

编译包含服务器应用的客户端可以获得最佳性能。在你的项目中放入以下代码：

```ts
import { app } from './app'
import { hc } from 'hono/client'

// 这是一个在编译时计算类型的技巧
const client = hc<typeof app>('')
export type Client = typeof client

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<typeof app>(...args)
```

编译后，你可以使用 `hcWithType` 而不是 `hc` 来获取已经计算好类型的客户端。

```ts
const client = hcWithType('http://localhost:8787/')
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

如果你的项目是 monorepo，这个解决方案很适合。使用像 [`turborepo`](https://turbo.build/repo/docs) 这样的工具，你可以轻松地分离服务器项目和客户端项目，并更好地管理它们之间的依赖关系。这里有[一个可用的示例](https://github.com/m-shaka/hono-rpc-perf-tips-example)。

你也可以使用像 `concurrently` 或 `npm-run-all` 这样的工具手动协调你的构建过程。

#### 手动指定类型参数

这有点麻烦，但你可以手动指定类型参数来避免类型实例化。

```ts
const app = new Hono().get<'foo/:id'>('foo/:id', (c) =>
  c.json({ ok: true }, 200)
)
```

仅指定单个类型参数就能在性能上产生差异，但如果你有很多路由，这可能会花费你大量时间和精力。

#### 将应用和客户端拆分成多个文件

如[在大型应用中使用 RPC](#在大型应用中使用-rpc)中所述，你可以将应用拆分成多个应用。你也可以为每个应用创建一个客户端：

```ts
// authors-cli.ts
import { app as authorsApp } from './authors'
import { hc } from 'hono/client'

const authorsClient = hc<typeof authorsApp>('/authors')

// books-cli.ts
import { app as booksApp } from './books'
import { hc } from 'hono/client'

const booksClient = hc<typeof booksApp>('/books')
```

这样，`tsserver` 就不需要一次性实例化所有路由的类型。
