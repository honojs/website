# Vike

[Vike](https://vike.dev/why) is a flexible full-stack framework that replaces Next/Nuxt/etc. It lets you combine Hono with popular UI frameworks, while providing QOL features like SSR, file-based routing, data loaders.

::: warning
Vike does **not** support file-based routing for API endpoints by design. For more, see [API Routes and Middleware](/docs/getting-started/vike#api-routes-and-middleware)
:::

## Quick Start

Use the `create vike` CLI to quickly set up a new Vike project with Hono. The following example uses [Solid](https://docs.solidjs.com/). Check out [Vike's scaffolder](https://vike.dev/new) for a full list of supported UI frameworks (and other tooling).

::: code-group

```sh [npm]
npm create vike@latest --- --solid --hono
```

```sh [yarn]
yarn create vike@latest --solid --hono
```

```sh [pnpm]
pnpm create vike@latest --solid --hono
```

```sh [bun]
bun create vike@latest --solid --hono
```

```sh [deno]
deno run -A npm:create-vike@latest --solid --hono
```

:::

## API Routes and Middleware

Vike has file-based data loaders to server-render pages, but API tooling is outside the project's scope. API routes can be added using an [integrated Hono app](https://vike.dev/api-routes#api-routes), but currently only `GET` and `POST` requests are supported.

To add API routes or middleware, use the Vike CLI to set up a Vike project with Hono, or [add it manually](https://vike.dev/vike-photon). Then, just add to your Hono app as you would normally.

```ts
// /server/entry.ts

import { Hono } from 'hono'
import { apply, serve } from '@photonjs/hono'
import { routes } from './routes'

function startServer() {
  const app = new Hono()
  app.route('/api', routes) // [!code ++]

  apply(app)
  return serve(app)
}

export default startServer()
```
