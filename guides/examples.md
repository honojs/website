# Examples

How about using Hono to create an application like this?

## Web API

This is a practical example to make Web API on Cloudflare Workers.

```ts
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { basicAuth } from 'hono/basic-auth'
import { prettyJSON } from 'hono/pretty-json'
import { getPosts, getPost, createPost, Post } from './model'

const app = new Hono()
app.get('/', (c) => c.text('Pretty Blog API'))
app.use(prettyJSON())
app.notFound((c) => c.json({ message: 'Not Found', ok: false }, 404))

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const api = new Hono<{ Bindings: Bindings }>()
api.use('/posts/*', cors())

api.get('/posts', (c) => {
  const { limit, offset } = c.req.query()
  const posts = getPosts({ limit, offset })
  return c.json({ posts })
})

api.get('/posts/:id', (c) => {
  const id = c.req.param('id')
  const post = getPost({ id })
  return c.json({ post })
})

api.post(
  '/posts',
  async (c, next) => {
    const auth = basicAuth({ username: c.env.USERNAME, password: c.env.PASSWORD })
    return auth(c, next)
  },
  async (c) => {
    const post = await c.req.json<Post>()
    const ok = createPost({ post })
    return c.json({ ok })
  }
)

app.route('/api', api)

export default app
```

## Proxy

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/posts/:filename{.+.png$}', (c) => {
  const referer = c.req.header('Referer')
  if (referer && !/^https:\/\/example.com/.test(referer)) {
    return c.text('Forbidden', 403)
  }
  return fetch(c.req.url)
})

app.get('*', (c) => {
  return fetch(c.req.url)
})

export default app
```

::: tip
If you can see `Can't modify immutable headers.` error with similar code, you need to clone the response object.

```ts
app.get('/', async (_c) => {
  const response = await fetch('https://example.com')
  // clone the response to return a response with modifiable headers
  const newResponse = new Response(response.body, response)
  return newResponse
})
```

The headers of `Response` returned by `fetch` are immutable. So, an error will occur if you modify it.
:::

## More Examples

See: [Hono Examples](https://github.com/honojs/examples)
