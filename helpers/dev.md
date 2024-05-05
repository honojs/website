# Dev Helper

Dev Helper provides useful methods you can use in development.

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { getRouterName, showRoutes } from 'hono/dev'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { getRouterName, showRoutes } from 'https://deno.land/x/hono/helper.ts'
```

:::

## `getRouterName()`

You can get the name of the currently used router with `getRouterName()`.

```ts
const app = new Hono()

// ...

console.log(getRouterName(app))
```

## `showRoutes()`

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
- `colorize`: boolean - optional
  - When set to `false`, the output will not be colored.
