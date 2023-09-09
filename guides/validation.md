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

Validation targets include `json`, `query`, `header`, and `cookie` in addition to `form`.

## With Zod

You can use [Zod](https://zod.dev), one of third-party validators.
We recommend using a third-party validator.

Install from the Npm registry.

```
npm i zod
```

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

```
npm i @hono/zod-validator
```

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
    // ...
  }
)
```
