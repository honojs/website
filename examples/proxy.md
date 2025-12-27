# Proxy

::: tip
**Update:** We've introduced the new Proxy Helper for easier proxy functionality. Check out the [Proxy Helper documentation](https://hono.dev/docs/helpers/proxy) for more details.
:::

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
If you can see `Can't modify immutable headers.` error with a similar code, you need to clone the response object.

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
