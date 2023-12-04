# Dev Helper

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { showRoutes } from 'hono/dev'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { showRoutes } from 'https://deno.land/x/hono/helper.ts'
```

:::

## showRoutes()

`showRoutes()` function displays the registered routes in your console.

Consider an application like the following:

```ts
const app = new Hono().basePath('/v1')

app.get('/posts', (c) => {
  // ...
})

app.get('/posts/:id', (c) => {
  // ...
})

app.post('/posts', (c) => {
  // ...
})

showRoutes(app)
```

When this application starts running, the routes will be shown in your console as follows:

```txt
GET   /v1/posts
GET   /v1/posts/:id
POST  /v1/posts
```

### Options

- `verbose`: boolean - optional
  - When set to `true`, it displays verbose information.
