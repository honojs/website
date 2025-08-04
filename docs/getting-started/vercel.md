# Vercel

Vercel is the AI cloud, providing the developer tools and cloud infrastructure to build, scale, and secure a faster, more personalized web.

Hono can be deployed to Vercel with zero-configuration.

## 1. Setup

A starter for Vercel is available.
Start your project with "create-hono" command.
Select `vercel` template for this example.

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

We will use Vercel CLI to work on the app locally in the next step. If you haven't already, install it globally following [the Vercel CLI documentation](https://vercel.com/docs/cli).

## 2. Hello World

In the `index.ts` or `src/index.ts` of your project, export the Hono application as a default export.

```ts
import { Hono } from 'hono'

const app = new Hono()

const welcomeStrings = [
  'Hello Hono!',
  'To learn more about Hono on Vercel, visit https://vercel.com/docs/frameworks/hono',
]

app.get('/', (c) => {
  return c.text(welcomeStrings.join('\n\n'))
})

export default app
```

If you started with the `vercel` template, this is already set up for you.

## 3. Run

To run the development server locally:

```sh
vercel dev
```

Visiting `localhost:3000` will respond with a text response.

## 4. Deploy

Deploy to Vercel using `vc deploy`.

```sh
vercel deploy
```

## Further reading

[Learn more about Hono in the Vercel documentation](https://vercel.com/docs/frameworks/backend/hono).
