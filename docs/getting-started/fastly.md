# Fastly Compute

[Fastly Compute](https://www.fastly.com/products/edge-compute) is an advanced edge computing system that runs your code, in your favorite language, on Fastly's global edge network. Hono also works on Fastly Compute.

You can develop the application locally and publish it with a few commands using [Fastly CLI](https://www.fastly.com/documentation/reference/tools/cli/), which is installed locally automatically as part of the template.

## 1. Setup

A starter for Fastly Compute is available.
Start your project with "create-hono" command.
Select `fastly` template for this example.

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

Move to `my-app` and install the dependencies.

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

## 2. Hello World

Edit `src/index.ts`:

```ts
// src/index.ts
import { Hono } from 'hono'
import { fire } from '@fastly/hono-fastly-compute'

const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

fire(app)
```

> [!NOTE]
> When using `fire` (or `buildFire()`) from `@fastly/hono-fastly-compute'` at the top level of your application, it is suitable to use `Hono` from `'hono'` rather than `'hono/quick'`, because `fire` causes its router to build its internal data during the application initialization phase.

## 3. Run

Run the development server locally. Then, access `http://localhost:7676` in your Web browser.

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm run start
```

```sh [bun]
bun run start
```

:::

## 4. Deploy

To build and deploy your application to your Fastly account, type the following command. The first time you deploy the application, you will be prompted to create a new service in your account.

If you don't have an account yet, you must [create your Fastly account](https://www.fastly.com/signup/).

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

In Fastly Compute, you can bind Fastly platform resources, such as KV Stores, Config Stores, Secret Stores, Backends, Access Control Lists, Named Log Streams, and Environment Variables. You can access them through `c.env`, and will have their individual SDK types.

To use these bindings, import `buildFire` instead of `fire` from `@fastly/hono-fastly-compute`. Define your [bindings](https://github.com/fastly/compute-js-context?tab=readme-ov-file#typed-bindings-with-buildcontextproxy) and pass them to [`buildFire()`](https://github.com/fastly/hono-fastly-compute?tab=readme-ov-file#basic-example) to obtain `fire`. Then use `fire.Bindings` to define your `Env` type as you construct `Hono`.

```ts
// src/index.ts
import { buildFire } from '@fastly/hono-fastly-compute'

const fire = buildFire({
  siteData: 'KVStore:site-data', // I have a KV Store named "site-data"
})

const app = new Hono<{ Bindings: typeof fire.Bindings }>()

app.put('/upload/:key', async (c, next) => {
  // e.g., Access the KV Store
  const key = c.req.param('key')
  await c.env.siteData.put(key, c.req.body)
  return c.text(`Put ${key} successfully!`)
})

fire(app)
```
