# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) is a JavaScript edge runtime on Cloudflare CDN.

You can develop the application locally and publish it with a few commands using [Wrangler](https://developers.cloudflare.com/workers/wrangler/).
Wrangler includes trans compiler, so we can write the code with TypeScript.

Let’s make your first application for Cloudflare Workers with Hono.

## 1. Setup

A starter for Cloudflare Workers is available.
Start your project with "create-hono" command.
Select `cloudflare-workers` template for this example.

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
bunx create-hono my-app
```

```sh [deno]
deno run -A npm:create-hono my-app
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

Edit `src/index.ts` like below.

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Cloudflare Workers!'))

export default app
```

## 3. Run

Run the development server locally. Then, access `http://localhost:8787` in your web browser.

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

If you have a Cloudflare account, you can deploy to Cloudflare. In `package.json`, `$npm_execpath` needs to be changed to your package manager of choice.

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

That's all!

### Deploy from Github Action

Before deploying code to Cloudflare via CI, you need a cloudflare token. you can manager from here: https://dash.cloudflare.com/profile/api-tokens

If it's a newly created token, select the **Edit Cloudflare Workers** template, if you have already another token, make sure the token has the corresponding permissions(No, token permissions are not shared between cloudflare page and cloudflare worker).

then go to your Github repository settings dashboard: `Settings->Secrets and variables->Actions->Repository secrets`, and add a new secret with the name `CLOUDFLARE_API_TOKEN`.

then create `.github/workflows/deploy.yml` in your hono project root foler,paste the following code:

```yml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - uses: actions/checkout@v4
      - name: Deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

then edit `wrangler.toml`, and add this code after `compatibility_date` line.

```toml
main = "src/index.ts"
minify = true
```
Everything is ready! Now push the code and enjoy it.

## Service Worker mode or Module Worker mode

There are two syntaxes for writing the Cloudflare Workers. _Service Worker mode_ and _Module Worker mode_. Using Hono, you can write with both syntax:

```ts
// Service Worker
app.fire()
```

```ts
// Module Worker
export default app
```

But now, we recommend using Module Worker mode because such as that the binding variables are localized.

## Using Hono with other event handlers

You can integrate Hono with other event handlers (such as `scheduled`) in _Module Worker mode_.

To do this, export `app.fetch` as the module's `fetch` handler, and then implement other handlers as needed:

```ts
const app = new Hono()

export default {
  fetch: app.fetch,
  scheduled: async (batch, env) => {},
}
```

## Serve static files

You need to set it up to serve static files.
Static files are distributed by using Workers Sites.
To enable this feature, edit `wrangler.toml` and specify the directory where the static files will be placed.

```toml
[site]
bucket = "./assets"
```

Then create the `assets` directory and place the files there.

```
./
├── assets
│   ├── favicon.ico
│   └── static
│       ├── demo
│       │   └── index.html
│       ├── fallback.txt
│       └── images
│           └── dinotocat.png
├── package.json
├── src
│   └── index.ts
└── wrangler.toml
```

Then use "Adapter".

```ts
import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import manifest from '__STATIC_CONTENT_MANIFEST'

const app = new Hono()

app.get('/static/*', serveStatic({ root: './', manifest }))
app.get('/favicon.ico', serveStatic({ path: './favicon.ico' }))
```

See [Example](https://github.com/honojs/examples/tree/main/serve-static).

### `rewriteRequestPath`

If you want to map `http://localhost:8787/static/*` to `./assets/statics`, you can use the `rewriteRequestPath` option:

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

You can add MIME types with `mimes`:

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    },
  })
)
```

### `onNotFound`

You can specify handling when the requested file is not found with `onNotFound`:

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
  })
)
```

## Types

You have to install `@cloudflare/workers-types` if you want to have workers types.

::: code-group

```sh [npm]
npm i --save-dev @cloudflare/workers-types
```

```sh [yarn]
yarn add -D @cloudflare/workers-types
```

```sh [pnpm]
pnpm add -D @cloudflare/workers-types
```

```sh [bun]
bun add --dev @cloudflare/workers-types
```

:::

## Testing

For testing, we recommend using `jest-environment-miniflare`.
Refer to [examples](https://github.com/honojs/examples) for setting it up.

If there is the application below.

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Please test me!'))
```

We can test if it returns "_200 OK_" Response with this code.

```ts
describe('Test the application', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
  })
})
```

## Bindings

In the Cloudflare Workers, we can bind the environment values, KV namespace, R2 bucket, or Durable Object. You can access them in `c.env`. It will have the types if you pass the "_type struct_" for the bindings to the `Hono` as generics.

```ts
type Bindings = {
  MY_BUCKET: R2Bucket
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

// Access to environment values
app.put('/upload/:key', async (c, next) => {
  const key = c.req.param('key')
  await c.env.MY_BUCKET.put(key, c.req.body)
  return c.text(`Put ${key} successfully!`)
})
```

## Using Variables in Middleware

This is the only case for Module Worker mode.
If you want to use Variables or Secret Variables in Middleware, for example, "username" or "password" in Basic Authentication Middleware, you need to write like the following.

```ts
import { basicAuth } from 'hono/basic-auth'

//...

app.use('/auth/*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
})
```

The same is applied to Bearer Authentication Middleware, JWT Authentication, or others.
