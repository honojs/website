# Benchmarks

## Routers

We measured the speeds of a bunch of JavaScript routers.
For example, `find-my-way` is a very fast router used inside Fastify.

- @medley/router
- find-my-way
- koa-tree-router
- trek-router
- express (includes handling)
- koa-router

First, we registered the following routing to each of our routers
These are similar to those used in the real world.

```ts
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

Then we sent the Request to the endpoints like below.

```ts
const routes: (Route & { name: string })[] = [
  {
    name: 'short static',
    method: 'GET',
    path: '/user',
  },
  {
    name: 'static with same radix',
    method: 'GET',
    path: '/user/comments',
  },
  {
    name: 'dynamic route',
    method: 'GET',
    path: '/user/lookup/username/hey',
  },
  {
    name: 'mixed static dynamic',
    method: 'GET',
    path: '/event/abcd1234/comments',
  },
  {
    name: 'post',
    method: 'POST',
    path: '/event/abcd1234/comment',
  },
  {
    name: 'long static',
    method: 'GET',
    path: '/very/deeply/nested/route/hello/there',
  },
  {
    name: 'wildcard',
    method: 'GET',
    path: '/static/index.html',
  },
]
```

### On Node.js

The following screenshots show the results on Node.js.

![bench](/images/bench01.png)

![bench](/images/bench02.png)

![bench](/images/bench03.png)

![bench](/images/bench04.png)

![bench](/images/bench05.png)

![bench](/images/bench06.png)

![bench](/images/bench07.png)

![bench](/images/bench08.png)

### On Bun

The followings show the results on Bun.

![bench](/images/bench09.png)

![bench](/images/bench10.png)

![bench](/images/bench11.png)

![bench](/images/bench12.png)

![bench](/images/bench13.png)

![bench](/images/bench14.png)

![bench](/images/bench15.png)

![bench](/images/bench16.png)

## Cloudflare Workers

- Machine: Apple MacBook Pro, 32 GiB, M1 Pro
- Scripts: [benchmarks/handle-event](https://github.com/honojs/hono/tree/main/benchmarks/handle-event)

**Hono is the fastest**, compared to other routers for Cloudflare Workers.

```
Hono x 385,807 ops/sec ±5.02% (76 runs sampled)
itty-router x 205,318 ops/sec ±3.63% (84 runs sampled)
sunder x 287,198 ops/sec ±4.90% (74 runs sampled)
worktop x 191,134 ops/sec ±3.06% (85 runs sampled)
Fastest is Hono
✨  Done in 27.51s.
```

## Deno

- Machine: Apple MacBook Pro, 32 GiB, M1 Pro, Deno v1.22.0
- Scripts: [benchmarks/deno](https://github.com/honojs/hono/tree/main/benchmarks/deno)
- Method: `bombardier --fasthttp -d 10s -c 100 'http://localhost:8000/user/lookup/username/foo'`

**Hono is the fastest**, compared to other frameworks for Deno.

| Framework |   Version    |                  Results |
| --------- | :----------: | -----------------------: |
| **Hono**  |    3.0.0     | **Requests/sec: 136112** |
| Fast      | 4.0.0-beta.1 |     Requests/sec: 103214 |
| Megalo    |    0.3.0     |      Requests/sec: 64597 |
| Faster    |     5.7      |      Requests/sec: 54801 |
| oak       |    10.5.1    |      Requests/sec: 43326 |
| opine     |    2.2.0     |      Requests/sec: 30700 |

Another benchmark result: [denosaurs/bench](https://github.com/denosaurs/bench)

## Bun

See: [SaltyAom/bun-http-framework-benchmark](https://github.com/SaltyAom/bun-http-framework-benchmark)
