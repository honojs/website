# Testing

[Vitest]: https://vitest.dev/

Testing is important.
In actuality, it is easy to test Hono's applications.
The way to create a test environment differs from each runtime, but the basic steps are the same.
In this section, let's test with Cloudflare Workers and [Vitest].

::: tip
Cloudflare recommends using [Vitest] with [@cloudflare/vitest-pool-workers](https://www.npmjs.com/package/@cloudflare/vitest-pool-workers). For more details, please refer to [Vitest integration](https://developers.cloudflare.com/workers/testing/vitest-integration/) in the Cloudflare Workers docs.
:::

## Request and Response

All you do is create a Request and pass it to the Hono application to validate the Response.
And, you can use `app.request` the useful method.

::: tip
For a typed test client see the [testing helper](/docs/helpers/testing).
:::

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

To make a request to `POST /posts` with `JSON` data, do the following.

```ts
test('POST /posts', async () => {
  const res = await app.request('/posts', {
    method: 'POST',
    body: JSON.stringify({ message: 'hello hono' }),
    headers: new Headers({ 'Content-Type': 'application/json' }),
  })
  expect(res.status).toBe(201)
  expect(res.headers.get('X-Custom')).toBe('Thank you')
  expect(await res.json()).toEqual({
    message: 'Created',
  })
})
```

To make a request to `POST /posts` with `multipart/form-data` data, do the following.

```ts
test('POST /posts', async () => {
  const formData = new FormData()
  formData.append('message', 'hello')
  const res = await app.request('/posts', {
    method: 'POST',
    body: formData,
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

## Env

To set `c.env` for testing, you can pass it as the 3rd parameter to `app.request`. This is useful for mocking values like [Cloudflare Workers Bindings](https://hono.dev/getting-started/cloudflare-workers#bindings):

```ts
const MOCK_ENV = {
  API_HOST: 'example.com',
  DB: {
    prepare: () => {
      /* mocked D1 */
    },
  },
}

test('GET /posts', async () => {
  const res = await app.request('/posts', {}, MOCK_ENV)
})
```
