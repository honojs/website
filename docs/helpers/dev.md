# Dev Helper

Dev Helper provides useful methods you can use in development.

```ts
import { Hono } from 'hono'
import { getRouterName, showRoutes } from 'hono/dev'
```

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

showRoutes(app, {
  verbose: true,
})
```

When this application starts running, the routes will be shown in your console as follows:

```txt
GET   /v1/posts
GET   /v1/posts/:id
POST  /v1/posts
```

## Options

### <Badge type="info" text="optional" /> verbose: `boolean`

When set to `true`, it displays verbose information.

### <Badge type="info" text="optional" /> colorize: `boolean`

When set to `false`, the output will not be colored.
