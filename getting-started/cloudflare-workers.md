# Cloudflare Workers

[Cloudflare Workers](https://workers.cloudflare.com) is a JavaScript edge runtime on Cloudflare CDN.

You can develop the application locally and publish it with a few commands using [Wrangler](https://developers.cloudflare.com/workers/wrangler/).
Wrangler includes trans compiler, so we can write the code with TypeScript.

Let’s make your first application for Cloudflare Workers with Hono.

## 1. Setup

A starter for Cloudflare Workers is available.
Start your project with "create-hono" command.

```
npm create hono@latest my-app
```

Move to `my-app` and install the dependencies.

```
cd my-app
npm i
```

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

```
npm run dev
```

## 4. Deploy

If you have a Cloudflare account, you can deploy to Cloudflare.

```
npm run deploy
```

That's all!

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

const app = new Hono()

app.get('/static/*', serveStatic({ root: './' }))
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

## Types

You have to install `@cloudflare/workers-types` if you want to have workers types.

```
npm i --save-dev @cloudflare/workers-types
```

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
app.use('/auth/*', async (c, next) => {
  const auth = basicAuth({
    username: c.env.USERNAME,
    password: c.env.PASSWORD,
  })
  return auth(c, next)
})
```

The same is applied to Bearer Authentication Middleware, JWT Authentication, or others.
