# Cloudflare Workers + Vite

You can build a full-stack application on [Cloudflare Workers](https://workers.cloudflare.com) with [Vite](https://vite.dev) using the [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/).
This setup gives you a fast Vite dev server, server-side rendering with Hono's JSX renderer, and client-side scripts bundled by Vite — all running on Cloudflare Workers.

This is the recommended way to start a new full-stack project on Cloudflare. If you were previously using [Cloudflare Pages](/docs/getting-started/cloudflare-pages), this is its successor.

## 1. Setup

A starter for Cloudflare Workers with Vite is available.
Start your project with the "create-hono" command.
Select the `cloudflare-workers+vite` template for this example.

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono my-app
```

:::

Move into `my-app` and install the dependencies.

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

Below is a basic directory structure.

```text
./
├── package.json
├── public // Put your static files here.
├── src
│   ├── index.tsx // The entry point for server-side.
│   ├── renderer.tsx
│   └── style.css
├── tsconfig.json
├── vite.config.ts
└── wrangler.jsonc
```

The `vite.config.ts` combines the Cloudflare plugin with `vite-ssr-components` for SSR:

```ts
import { cloudflare } from '@cloudflare/vite-plugin'
import { defineConfig } from 'vite'
import ssrPlugin from 'vite-ssr-components/plugin'

export default defineConfig({
  plugins: [cloudflare(), ssrPlugin()],
})
```

## 2. Hello World

Edit `src/index.tsx` like the following:

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.use(renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Workers!</h1>)
})

export default app
```

The `renderer` is defined in `src/renderer.tsx` using Hono's [JSX renderer middleware](/docs/middleware/builtin/jsx-renderer) together with `vite-ssr-components`, which wires up Vite's client and assets:

```tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Link, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Link href='/src/style.css' rel='stylesheet' />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

## 3. Run

Run the development server locally. Then, access `http://localhost:5173` in your web browser.

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## 4. Deploy

If you have a Cloudflare account, you can deploy to Cloudflare. The `deploy` script builds with Vite and then publishes with Wrangler.

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm run deploy
```

```sh [bun]
bun run deploy
```

:::

## Bindings

You can use Cloudflare Bindings like Variables, KV, D1, and others.
Configure them in `wrangler.jsonc`. For example, to add a Variable named `MY_NAME`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "compatibility_date": "2025-08-03",
  "main": "./src/index.tsx",
  "vars": {
    "MY_NAME": "Hono",
  },
}
```

To generate the types for your Bindings, run the `cf-typegen` script:

::: code-group

```sh [npm]
npm run cf-typegen
```

```sh [yarn]
yarn cf-typegen
```

```sh [pnpm]
pnpm run cf-typegen
```

```sh [bun]
bun run cf-typegen
```

:::

This generates a `CloudflareBindings` interface. Pass it to `Hono` as generics:

```ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```

Then access the Bindings via `c.env`:

```tsx
app.get('/', (c) => {
  return c.render(<h1>Hello! {c.env.MY_NAME}</h1>)
})
```

## Client-side

`vite-ssr-components` lets you load client-side scripts through Vite.
Add a `Script` component pointing to your client entry point, and Vite handles bundling for both dev and production:

```tsx
import { jsxRenderer } from 'hono/jsx-renderer'
import { Script, ViteClient } from 'vite-ssr-components/hono'

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html>
      <head>
        <ViteClient />
        <Script src='/src/client.ts' />
      </head>
      <body>{children}</body>
    </html>
  )
})
```

For more details, see the [`@cloudflare/vite-plugin` documentation](https://developers.cloudflare.com/workers/vite-plugin/) and [`vite-ssr-components`](https://github.com/yusukebe/vite-ssr-components).
