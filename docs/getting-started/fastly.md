# Fastly Compute

[Fastly's Compute](https://www.fastly.com/products/edge-compute) offering allows us to build high scale, globally distributed applications and execute code at the edge of Fastly CDN.

Hono also works on Fastly Compute.

## 1. Install CLI

To use Fastly Compute, you must [create a Fastly account](https://www.fastly.com/signup/) if you don't already have one.
Then, install [Fastly CLI](https://github.com/fastly/cli).

macOS

```sh
brew install fastly/tap/fastly
```

Follow this link for other OS:

- [Compute services | Fastly Developer Hub](https://developer.fastly.com/learning/compute/#download-and-install-the-fastly-cli)

## 2. Setup

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

## 3. Hello World

Edit `src/index.ts`:

```ts
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

app.fire()
```

## 4. Run

Run the development server locally. Then, access `http://localhost:7676` in your Web browser.

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

::: code-group

```sh [npm]
npm run deploy
```

```sh [yarn]
yarn deploy
```

```sh [pnpm]
pnpm deploy
```

```sh [bun]
bun run deploy
```

:::

That's all!!
