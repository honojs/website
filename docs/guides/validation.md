# Validation

Hono provides only a very thin Validator.
But, it can be powerful when combined with a third-party Validator.
In addition, the RPC feature allows you to share API specifications with your clients through types.

## Manual validator

First, introduce a way to validate incoming values without using the third-party Validator.

Import `validator` from `hono/validator`.

```ts
import { validator } from 'hono/validator'
```

To validate form data, specify `form` as the first argument and a callback as the second argument.
In the callback, validates the value and return the validated values at the end.
The `validator` can be used as middleware.

```ts
app.post(
  '/posts',
  validator('form', (value, c) => {
    const body = value['body']
    if (!body || typeof body !== 'string') {
      return c.text('Invalid!', 400)
    }
    return {
      body: body,
    }
  }),
  //...
```

Within the handler you can get the validated value with `c.req.valid('form')`.

```ts
, (c) => {
  const { body } = c.req.valid('form')
  // ... do something
  return c.json(
    {
      message: 'Created!',
    },
    201
  )
}
```

Validation targets include `json`, `query`, `header`, `param` and `cookie` in addition to `form`.

::: warning
When you validate `json`, the request _must_ contain a `Content-Type: application/json` header
otherwise the request body will not be parsed and you will receive a warning.

It is important to set the `content-type` header when testing using
[`app.request()`](../api/request.md).

Given an application like this.

```ts
const app = new Hono()
app.post(
  '/testing',
  validator('json', (value, c) => {
    // pass-through validator
    return value
  }),
  (c) => {
    const body = c.req.valid('json')
    return c.json(body)
  }
)
```

Your tests can be written like this.

```ts
// ❌ this will not work
const res = await app.request('/testing', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
})
const data = await res.json()
console.log(data) // undefined

// ✅ this will work
const res = await app.request('/testing', {
  method: 'POST',
  body: JSON.stringify({ key: 'value' }),
  headers: new Headers({ 'Content-Type': 'application/json' }),
})
const data = await res.json()
console.log(data) // { key: 'value' }
```

:::

::: warning
When you validate `header`, you need to use **lowercase** name as the key.

If you want to validate the `Idempotency-Key` header, you need to use `idempotency-key` as the key.

```ts
// ❌ this will not work
app.post(
  '/api',
  validator('header', (value, c) => {
    // idempotencyKey is always undefined
    // so this middleware always return 400 as not expected
    const idempotencyKey = value['Idempotency-Key']

    if (idempotencyKey == undefined || idempotencyKey === '') {
      throw HTTPException(400, {
        message: 'Idempotency-Key is required',
      })
    }
    return { idempotencyKey }
  }),
  (c) => {
    const { idempotencyKey } = c.req.valid('header')
    // ...
  }
)

// ✅ this will work
app.post(
  '/api',
  validator('header', (value, c) => {
    // can retrieve the value of the header as expected
    const idempotencyKey = value['idempotency-key']

    if (idempotencyKey == undefined || idempotencyKey === '') {
      throw HTTPException(400, {
        message: 'Idempotency-Key is required',
      })
    }
    return { idempotencyKey }
  }),
  (c) => {
    const { idempotencyKey } = c.req.valid('header')
    // ...
  }
)
```

:::

## Multiple validators

You can also include multiple validators to validate different parts of request:

```ts
app.post(
  '/posts/:id',
  validator('param', ...),
  validator('query', ...),
  validator('json', ...),
  (c) => {
    //...
  }
```

## With Zod

You can use [Zod](https://zod.dev), one of third-party validators.
We recommend using a third-party validator.

Install from the Npm registry.

::: code-group

```sh [npm]
npm i zod
```

```sh [yarn]
yarn add zod
```

```sh [pnpm]
pnpm add zod
```

```sh [bun]
bun add zod
```

:::

Import `z` from `zod`.

```ts
import { z } from 'zod'
```

Write your schema.

```ts
const schema = z.object({
  body: z.string(),
})
```

You can use the schema in the callback function for validation and return the validated value.

```ts
const route = app.post(
  '/posts',
  validator('form', (value, c) => {
    const parsed = schema.safeParse(value)
    if (!parsed.success) {
      return c.text('Invalid!', 401)
    }
    return parsed.data
  }),
  (c) => {
    const { body } = c.req.valid('form')
    // ... do something
    return c.json(
      {
        message: 'Created!',
      },
      201
    )
  }
)
```

## Zod Validator Middleware

You can use the [Zod Validator Middleware](https://github.com/honojs/middleware/tree/main/packages/zod-validator) to make it even easier.

::: code-group

```sh [npm]
npm i @hono/zod-validator
```

```sh [yarn]
yarn add @hono/zod-validator
```

```sh [pnpm]
pnpm add @hono/zod-validator
```

```sh [bun]
bun add @hono/zod-validator
```

:::

And import `zValidator`.

```ts
import { zValidator } from '@hono/zod-validator'
```

And write as follows.

```ts
const route = app.post(
  '/posts',
  zValidator(
    'form',
    z.object({
      body: z.string(),
    })
  ),
  (c) => {
    const validated = c.req.valid('form')
    // ... use your validated data
  }
)
```
