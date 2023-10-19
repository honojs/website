# Testing

Testing is important.
In actuality, it is easy to test Hono's applications.
The way to create a test environment differs from each runtime, but the basic steps are the same.
In this section, let's test with Cloudflare Workers and Jest.

## Request and Response

All you do is create a Request and pass it to the Hono application to validate the Response.
And, you can use `app.request` the useful method.

For example, consider an application that provides the following REST API.

```ts
app.get('/posts', (c) => {
  return c.text('Many posts')
})

app.post('/posts', (c) => {
  return c.json(
    {
      message: 'Created',
    },
    201,
    {
      'X-Custom': 'Thank you',
    }
  )
})
```

Make a request to `GET /posts` and test the response.

```ts
describe('Example', () => {
  test('GET /posts', async () => {
    const res = await app.request('/posts')
    expect(res.status).toBe(200)
    expect(await res.text()).toBe('Many posts')
  })
})
```

To make a request to `POST /posts`, do the following.

```ts
test('POST /posts', async () => {
  const res = await app.request('/posts', {
    method: 'POST',
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

You can also pass an instance of the Request class.

```ts
test('POST /posts', async () => {
  const req = new Request('http://localhost/posts', {
    method: 'POST',
  })
  const res = await app.request(req)
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

In this way, you can test it as like an End-to-End.
