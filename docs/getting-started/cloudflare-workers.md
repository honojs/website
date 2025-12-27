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

### Change port number

If you need to change the port number you can follow the instructions here to update `wrangler.toml` / `wrangler.json` / `wrangler.jsonc` files:
[Wrangler Configuration](https://developers.cloudflare.com/workers/wrangler/configuration/#local-development-settings)

Or, you can follow the instructions here to set CLI options:
[Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/commands/#dev)

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

If you want to serve static files, you can use [the Static Assets feature](https://developers.cloudflare.com/workers/static-assets/) of Cloudflare Workers. Specify the directory for the files in `wrangler.toml`:

```toml
assets = { directory = "public" }
```

Then create the `public` directory and place the files there. For instance, `./public/static/hello.txt` will be served as `/static/hello.txt`.

```
.
├── package.json
├── public
│   ├── favicon.ico
│   └── static
│       └── hello.txt
├── src
│   └── index.ts
└── wrangler.toml
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

For testing, we recommend using `@cloudflare/vitest-pool-workers`.
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

type Bindings = {
  USERNAME: string
  PASSWORD: string
}

const app = new Hono<{ Bindings: Bindings }>()

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

## Deploy from GitHub Actions

Before deploying code to Cloudflare via CI, you need a Cloudflare token. You can manage it from [User API Tokens](https://dash.cloudflare.com/profile/api-tokens).

If it's a newly created token, select the **Edit Cloudflare Workers** template, if you already have another token, make sure the token has the corresponding permissions(No, token permissions are not shared between Cloudflare Pages and Cloudflare Workers).

then go to your GitHub repository settings dashboard: `Settings->Secrets and variables->Actions->Repository secrets`, and add a new secret with the name `CLOUDFLARE_API_TOKEN`.

then create `.github/workflows/deploy.yml` in your Hono project root folder, paste the following code:

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

## Load env when local development

To configure the environment variables for local development, create a `.dev.vars` file or a `.env` file in the root directory of the project.
These files should be formatted using the [dotenv](https://hexdocs.pm/dotenvy/dotenv-file-format.html) syntax. For example:

```
SECRET_KEY=value
API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
```

> For more about this section you can find in the Cloudflare documentation:
> https://developers.cloudflare.com/workers/wrangler/configuration/#secrets

Then we use the `c.env.*` to get the environment variables in our code.

::: info
By default, `process.env` is not available in Cloudflare Workers, so it is recommended to get environment variables from `c.env`. If you want to use it, you need to enable [`nodejs_compat_populate_process_env`](https://developers.cloudflare.com/workers/configuration/compatibility-flags/#enable-auto-populating-processenv) flag. You can also import `env` from `cloudflare:workers`. For details, please see [How to access `env` on Cloudflare docs](https://developers.cloudflare.com/workers/runtime-apis/bindings/#how-to-access-env)
:::

```ts
type Bindings = {
  SECRET_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/env', (c) => {
  const SECRET_KEY = c.env.SECRET_KEY
  return c.text(SECRET_KEY)
})
```

Before you deploy your project to Cloudflare, remember to set the environment variable/secrets in the Cloudflare Workers project's configuration.

> For more about this section you can find in the Cloudflare documentation:
> https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-the-dashboard
