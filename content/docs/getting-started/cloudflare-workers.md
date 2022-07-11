# Cloudflare Workers

A Cloudflare Workers is a JavaScript edge runtime on Cloudflare CDN.

You can develop the application locally and publish it with a few commands using [Wrangler](https://developers.cloudflare.com/workers/wrangler/), a CLI developed by Cloudflare.
Wrangler includes trans compiler, so we can write the code with TypeScript.

Let’s make your first application for Cloudflare Workers with Hono.

## 1. Install

### `wrangler init`

Initialize the project with Wrangler.

```
mkdir hono-example
cd hono-example
npx wrangler init -y
```

### `npm install hono`

Install `hono` from the npm registry.

```
npm init -y
npm i hono
```

## 2. Hello World

Edit `src/index.ts`:

```ts
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello! Hono!'))

export default app
```

## 3. Run

Run the development server locally. Then, access `http://localhost:8787` in your Web browser.

```
npx wrangler dev
```

## 4. Publish

If you have the Cloudflare account, you can deploy to Cloudflare.

```
npx wrangler publish ./src/index.ts
```

That's all!

## Starter template

You can start making your Cloudflare Workers application with [the starter template](https://github.com/honojs/hono-minimal). It is really minimal using TypeScript, esbuild, Miniflare, and Jest.

To generate a project skeleton, run this command.

```
npx create-cloudflare my-app https://github.com/honojs/hono-minimal
```

## Advanced

### Service Worker mode or Module Worker mode

There are two syntax for writing the Cloudflare Workers. *Service Worker mode* and *Module Worker mode*. Using Hono, you can write with both syntax:

```ts
// Service Worker
app.fire()
```

```ts
// Module Worker
export default app
```

Now, we recommend using Module Worker mode because the binding variables are localized.

### Types

You have to install `@cloudflare/workers-types` if you want to have *types*.

```
npm i --save-dev @cloudflare/workers-types
```

### Testing

For testing, we recommend using `jest-environment-miniflare`. Refer to [the starter template](https://github.com/honojs/hono-minimal) for setting it up.

If there is the application below:

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Please test me!'))
```

We can test that it is returning "*200 OK*" Response with this code:


```ts
describe('Test the application', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('http://localhost/')
    expect(res.status).toBe(200)
  })
})
```

### Bindings

In the Cloudflare Workers, we can bind the environment values, KV namespace, R2 bucket, or Durable Object. You can access them in `c.req.env`. It will have the types if you pass the "*type struct*" for the bindings to the `Hono` as generics.

```ts
interface Env {
  BUCKET: R2Bucket
  USER: string
  PASS: string
}

const app = new Hono<Env>()

// Access to environment values
app.put('/upload', async (c, next) => {
  const auth = basicAuth({ username: c.env.USER, password: c.env.PASS })
  await auth(c, next)
})
```
