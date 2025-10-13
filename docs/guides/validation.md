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
  // ...
```

Within the handler you can get the validated value with `c.req.valid('form')`.

```ts
// after your middleware...
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
When you validate `json` or `form`, the request _must_ contain a matching `content-type` header (e.g. `Content-Type: application/json` for `json`). Otherwise, the request body will not be parsed and you will receive an empty object (`{}`) as value in the callback.

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
console.log(data) // {}

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
      throw new HTTPException(400, {
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
      throw new HTTPException(400, {
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

## Validator with Zod

You can use [Zod](https://zod.dev), or the (typed) validator you prefer, to simplify `validator` callback logic. In essence, this is what our [third-party validators](#with-a-third-party-validator) are doing internally.

Install from the NPM registry.

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
import * as z from 'zod'
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

## Third-party validator middleware
We recommend using one of our [supported third-party validators,](https://hono.dev/docs/middleware/third-party#validators) which internally call `hono/validator`. These libraries make for both a better developer and user experience by simplifying (typed) validation.

We do our best to support common TypeScript-enabled validators. If you don't see your validator of choice on the list, please [open an issue in the `honojs/middleware` repo.](https://github.com/honojs/middleware/issues)


### Zod Validator Middleware

The [Zod Validator Middleware](https://github.com/honojs/middleware/tree/main/packages/zod-validator) makes it even easier by handling the boilerplate for you!

Like most of our third-party validator middleware, it takes three parameters: the validation **target**, the validation **callback**, and an optional **hook** for manually handling errors or modifying data after validation. 

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

## How it works

Validator uses `HonoRequest.addValidatedData` to set valid data in `Context`, making it available in your handler through `c.req.valid`. While the JavaScript implementation might seem straightforward, [`hono/validator` relies on non-trivial generics](https://github.com/honojs/hono/blob/eb86162a9a4472ef86329efe27007caf0afb9284/src/validator/validator.ts) to share validated data types with your handler.

::: warning
While `c.req.addValidatedData` is a public method, it **must** be used in properly-typed middleware. When used on its own, you will get a type error.

```typescript
app.get(
  '/',
  async (c, next) => {
    c.req.addValidatedData('form', {
      timestamp: new Date(),
    })

    await next()
  },
  async (c) => {
    // Type Error: Argument of type 'string' is not 
    // assignable to parameter of type 'never'
    const body = c.req.valid('form')
    // ...
  },
)
```

Also note that the method **overwrites** the target data, if any. If you are validating data with `validator` or third-party validation middleware, you must spread in any of the original data you want to keep.
:::
