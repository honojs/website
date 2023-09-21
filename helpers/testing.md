# Testing Helper

The Testing Helper provides functions to make testing of Hono applications easier.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { testClient } from 'hono/testing'
```

:::

## `testClient`

The `testingClient` takes an instance of Hono as its first argument and returns an object of the [Hono Client](http://localhost:5173/guides/rpc#client). By using this, you can define your request with the editor completion.

```ts
import { testClient } from 'hono/testing'

it('test', async () => {
  const app = new Hono().get('/search', (c) => c.jsonT({ hello: 'world' }))
  const res = await testClient(app).search.$get()

  expect(await res.json()).toEqual({ hello: 'world' })
})
```
