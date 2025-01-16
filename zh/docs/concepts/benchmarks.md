---
title: 基准测试
description: 基准测试数据仅供参考，但它们对我们的开发和选择都很有帮助。
---
# 基准测试

虽然基准测试数据仅供参考，但它们对我们的开发和选择都很有帮助。

## 路由器

我们测量了一系列 JavaScript 路由器的性能。
例如，`find-my-way` 是 Fastify 内部使用的一个高性能路由器。

- @medley/router
- find-my-way
- koa-tree-router
- trek-router
- express (包含处理)
- koa-router

首先，我们在每个路由器中注册了以下路由。
这些路由类似于实际生产环境中使用的路由。

```ts twoslash
interface Route {
  method: string
  path: string
}
// ---cut---
export const routes: Route[] = [
  { method: 'GET', path: '/user' },
  { method: 'GET', path: '/user/comments' },
  { method: 'GET', path: '/user/avatar' },
  { method: 'GET', path: '/user/lookup/username/:username' },
  { method: 'GET', path: '/user/lookup/email/:address' },
  { method: 'GET', path: '/event/:id' },
  { method: 'GET', path: '/event/:id/comments' },
  { method: 'POST', path: '/event/:id/comment' },
  { method: 'GET', path: '/map/:location/events' },
  { method: 'GET', path: '/status' },
  { method: 'GET', path: '/very/deeply/nested/route/hello/there' },
  { method: 'GET', path: '/static/*' },
]
```

然后我们向以下端点发送请求。

```ts twoslash
interface Route {
  method: string
  path: string
}
// ---cut---
const routes: (Route & { name: string })[] = [
  {
    name: '短静态路由',
    method: 'GET',
    path: '/user',
  },
  {
    name: '相同前缀的静态路由',
    method: 'GET',
    path: '/user/comments',
  },
  {
    name: '动态路由',
    method: 'GET',
    path: '/user/lookup/username/hey',
  },
  {
    name: '混合静态动态路由',
    method: 'GET',
    path: '/event/abcd1234/comments',
  },
  {
    name: 'post请求',
    method: 'POST',
    path: '/event/abcd1234/comment',
  },
  {
    name: '长静态路由',
    method: 'GET',
    path: '/very/deeply/nested/route/hello/there',
  },
  {
    name: '通配符路由',
    method: 'GET',
    path: '/static/index.html',
  },
]
```

让我们看看测试结果。

### Node.js 环境下

以下截图展示了在 Node.js 环境下的测试结果。

![bench](/images/bench01.png)

![bench](/images/bench02.png)

![bench](/images/bench03.png)

![bench](/images/bench04.png)

![bench](/images/bench05.png)

![bench](/images/bench06.png)

![bench](/images/bench07.png)

![bench](/images/bench08.png)

### Bun 环境下

以下截图展示了在 Bun 环境下的测试结果。

![bench](/images/bench09.png)

![bench](/images/bench10.png)

![bench](/images/bench11.png)

![bench](/images/bench12.png)

![bench](/images/bench13.png)

![bench](/images/bench14.png)

![bench](/images/bench15.png)

![bench](/images/bench16.png)

## Cloudflare Workers

与其他 Cloudflare Workers 路由器相比，**Hono 是最快的**。

- 测试机器：Apple MacBook Pro，32 GiB，M1 Pro
- 测试脚本：[benchmarks/handle-event](https://github.com/honojs/hono/tree/main/benchmarks/handle-event)

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
最快的是 Hono
✨  Done in 28.06s.
```

## Deno

与其他 Deno 框架相比，**Hono 是最快的**。

- 测试机器：Apple MacBook Pro，32 GiB，M1 Pro，Deno v1.22.0
- 测试脚本：[benchmarks/deno](https://github.com/honojs/hono/tree/main/benchmarks/deno)
- 测试方法：`bombardier --fasthttp -d 10s -c 100 'http://localhost:8000/user/lookup/username/foo'`

| 框架      |    版本     |                  结果 |
| --------- | :----------: | -------------------: |
| **Hono**  |    3.0.0     | **每秒请求数: 136112** |
| Fast      | 4.0.0-beta.1 |     每秒请求数: 103214 |
| Megalo    |    0.3.0     |      每秒请求数: 64597 |
| Faster    |     5.7      |      每秒请求数: 54801 |
| oak       |    10.5.1    |      每秒请求数: 43326 |
| opine     |    2.2.0     |      每秒请求数: 30700 |

另一个基准测试结果：[denosaurs/bench](https://github.com/denosaurs/bench)

## Bun

Hono 是 Bun 最快的框架之一。
你可以在下面看到相关结果。

- [SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark)
