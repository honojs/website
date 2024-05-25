# RPC

The RPC feature allows sharing of the API specifications between the server and the client.

You can export the types of input type specified by the Validator and the output type emitted by `json()`. And Hono Client will be able to import it.

## Server

All you need to do on the server side is to write a validator and create a variable `route`. The following example uses [Zod Validator](https://github.com/honojs/middleware/tree/main/packages/zod-validator).

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

Then, export the type to share the API spec with the Client.

```ts
export type AppType = typeof route
```

## Client

On the Client side, import `hc` and `AppType` first.

```ts
import { AppType } from '.'
import { hc } from 'hono/client'
```

`hc` is a function to create a client. Pass `AppType` as Generics and specify the server URL as an argument.

```ts
const client = hc<AppType>('http://localhost:8787/')
```

Call `client.{path}.{method}` and pass the data you wish to send to the server as an argument.

```ts
const res = await client.posts.$post({
  form: {
    title: 'Hello',
    body: 'Hono is a cool project',
  },
})
```

The `res` is compatible with the "fetch" Response. You can retrieve data from the server with `res.json()`.

```ts
if (res.ok) {
  const data = await res.json()
  console.log(data.message)
}
```

## Status code

If you explicitly specify the status code, such as `200` or `404`, in `c.json()`. It will be added as a type for passing to the client.

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
      return c.json({ error: 'not found' }, 404) // Specify 404
    }

    return c.json({ post }, 200) // Specify 200
  }
)

export type AppType = typeof app
```

You can get the data by the status code.

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
type ResponseType200 = InferResponseType<typeof client.posts.$get, 200>
```

## Path parameters

You can also handle routes that include path parameters.

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

Specify the string you want to include in the path with `param`.

```ts
const res = await client.posts[':id'].$get({
  param: {
    id: '123',
  },
  query: {},
})
```

## Headers

You can append the headers to the request.

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

To add a common header to all requests, specify it as an argument to the `hc` function.

```ts
const client = hc<AppType>('/api', {
  headers: {
    Authorization: 'Bearer TOKEN',
  },
})
```

## `init` option

You can pass the fetch's `RequestInit` object to the request as the `init` option. Below is an example of aborting a Request.

```ts
import { hc } from 'hono/client'

const client = hc<AppType>('http://localhost:8787/')

const abortController = new AbortController()
const res = await client.api.posts.$post(
  {
    json: {
      // Request body
    },
  },
  {
    // RequestInit object
    init: {
      signal: abortController.signal,
    },
  }
)

// ...

abortController.abort()
```

::: info
A `RequestInit` object defined by `init` takes the highest priority. It could be used to overwrite things set by other options like `body | method | headers`.
:::

## `$url()`

You can get a `URL` object for accessing the endpoint by using `$url()`.

::: warning
You have to pass in an absolute URL for this to work. Passing in a relative URL `/` will result in the following error.

`Uncaught TypeError: Failed to construct 'URL': Invalid URL`

```ts
// ❌ Will throw error
const client = hc<AppType>('/')
client.api.post.$url()

// ✅ Will work as expected
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

## Custom `fetch` method

You can set the custom `fetch` method.

In the following example script for Cloudflare Worker, the Service Bindings' `fetch` method is used instead of the default `fetch`.

```toml
# wrangler.toml
services = [
  { binding = "AUTH", service = "auth-service" },
]
```

```ts
// src/client.ts
const client = hc<CreateProfileType>('/', { fetch: c.env.AUTH.fetch.bind(c.env.AUTH) })
```

## Infer

Use `InferRequestType` and `InferResponseType` to know the type of object to be requested and the type of object to be returned.

```ts
import type { InferRequestType, InferResponseType } from 'hono/client'

// InferRequestType
const $post = client.todo.$post
type ReqType = InferRequestType<typeof $post>['form']

// InferResponseType
type ResType = InferResponseType<typeof $post>
```

## Using SWR

You can also use a React Hook library such as [SWR](https://swr.vercel.app).

```tsx
import useSWR from 'swr'
import { hc } from 'hono/client'
import type { InferRequestType } from 'hono/client'
import { AppType } from '../functions/api/[[route]]'

const App = () => {
  const client = hc<AppType>('/api')
  const $get = client.hello.$get

  const fetcher = (arg: InferRequestType<typeof $get>) => async () => {
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

  if (error) return <div>failed to load</div>
  if (isLoading) return <div>loading...</div>

  return <h1>{data?.message}</h1>
}

export default App
```

## Using RPC with larger applications

In the case of a larger application, such as the example mentioned in [Building a larger application](/docs/guides/best-practices#building-a-larger-application), you need to be careful about the type of inference.
A simple way to do this is to chain the handlers so that the types are always inferred.

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

You can then import the sub-routers as you usually would, and make sure you chain their handlers as well, since this is the top level of the app in this case, this is the type we'll want to export.

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

You can now create a new client using the registered AppType and use it as you would normally.
