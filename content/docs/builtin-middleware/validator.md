---
title: Validator Middleware
---

# Validator Middleware

The Hono Validator middleware allows you to validate query parameters, request headers, form bodies, and JSON bodies of your incoming requests.
You can do this by identifying "keys" which you will receive from the validation results.

Other values not made explicit in the validation schema are ignored, preventing unexpected values from slipping past validations.
Validated values also have explicit types, and incoming values having types that don't match declared types will be invalidated as well. See [Usage](#usage) below for more info.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}

```ts
import { Hono } from 'hono'
import { validator } from 'hono/validator'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { validator } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

## Usage

```ts
app.post(
  '/posts',
  validator((v) => ({
    // Validate header values specified with the key.
    // You can get validated value as `customHeader`.
    customHeader: v.header('x-custom').isAlpha(),
    // Validate JSON body.
    // You can get the values as structured data.
    post: {
      id: v.json('post.id').isRequired().asNumber(),
      title: v.json('post.title').isRequired().isLength({ max: 100 }),
      body: v.json('post.body').isOptional(),
    },
  })),
  (c) => {
    // Get validated data.
    const res = c.req.valid()
    const post = res.post
    return c.text(`Post: ${post.id} is ${post.title}`)
  }
)
```

You can validate queries, headers, body data, and JSON.

```ts
app.post(
  '/posts',
  validator((v) => ({
    page: v.query('page').isNumeric(),
    tags: v.queries('tag').isOptional(),
    customHeader: v.header('x-custom').isRequired(),
    name: v.body('name').isOptional(),
    title: v.json('post.title').isLength({ max: 100 }),
  })),
  (c) => c.text('Valid')
)
```

Using `asNumber()` or `asBoolean()`, you can specify "type" for the value.

```ts
app.post(
  '/posts',
  validator((v) => ({
    id: v.json('post.id').asNumber().isRequired(),
    flag: v.json('post.flag').asBoolean().isRequired(),
  })),
  (c) => {
    const post = c.req.valid()
    const id = post.id // number
    const flag = post.flag // boolean
    return c.text(`${id} is ${flag}`)
  }
)
```

Using `asArray()`, you can also validate arrays and paths nested in arrays by using [JSONPath](https://jsonpath.com) syntax.

```ts
app.post(
  '/posts',
  validator((v) => ({
    title: v.json('posts[*].title').asArray().isRequired(),
    flag: v.json('posts[*].flags[1]').asArray().asBoolean().isRequired(),
  })),
  (c) => c.text('Valid too!')
)
```

Using `v.array()` and `v.object()`, you can validate structured data.

```ts
app.post(
  '/posts',
  validator((v) => ({
    posts: v.array('posts', (v) => ({
      id: v.json('id').asNumber(),
      title: v.json('title').isRequired(),
      tags: v.array('tags', (v) => ({
        name: v.json('name'),
      })),
    })),
    meta: v.object('meta', (v) => ({
      pager: v.json('pager'),
    })),
  })),
  (c) => {
    const res = c.req.valid()
    return c.json({ posts: res.posts })
  }
)
```

You can customize the errors with `message()`.

```ts
app.get(
  '/search',
  validator((v) => ({
    q: v.query('q').isRequired().message('q is required!!!'),
    page: v.query('page').isNumeric().message('page must be numeric!!!'),
  })),
  (c) => c.text('Valid!')
)
```

You can also return the error response as JSON format using `done` option.
And there are other things you can do with `done` option.

```ts
app.post(
  '/posts',
  validator(
    //...
    {
      done: (resultSet, c) => {
        if (resultSet.hasError) {
          return c.json(
            {
              messages: resultSet.messages,
            },
            400
          )
        }
      },
    }
  ),
  (c) => c.text('Valid!')
)
```

## Rules

General rules:

- `isRequired`
- `isOptional`

For string:

- `isEmpty()`
- `isLength( options?: { max?: number, min?: number } )`
- `isAlpha()`
- `isNumeric()`
- `contains( elem, options?: { ignoreCase?: boolean, minOccurrences?: number })`
- `isIn( options?: string[] )`
- `match( regExp: RegExp )`

For number:

- `isGte( value: number, min: number )`
- `isLte( value: number, max: number )`

For boolean:

- `isTrue()`
- `isFalse()`
