# Fastly Compute@Edge

[Fastly's Compute@Edge](https://www.fastly.com/products/edge-compute) offering allows us to build high scale, globally distributed applications and execute code at the edge of Fastly CDN.

Hono also works on Fastly Compute@Edge.

## 1. Install CLI

To use Compute@Edge, you must [create a Fastly account](https://www.fastly.com/jp/signup/) if you don't already have one.
Then, install [Fastly CLI](https://github.com/fastly/cli).

macOS

```
brew install fastly/tap/fastly
```

Follow this link for other OS:

- [Compute@Edge services | Fastly Developer Hub](https://developer.fastly.com/learning/compute/#download-and-install-the-fastly-cli)

## 2. Setup

A starter for Fastly Compute@Edge is available.
Start your project with "create-hono" command.

::: code-group

```txt [npm]
npm create hono@latest my-app
```

```txt [yarn]
yarn create hono@latest my-app
```

```txt [pnpm]
pnpm create hono@latest my-app
```

```txt [bun]
bun create hono@latest my-app
```

:::

Move to `my-app` and install the dependencies.

::: code-group

```txt [npm]
cd my-app
npm i
```

```txt [yarn]
cd my-app
yarn
```

```txt [pnpm]
cd my-app
pnpm i
```

```txt [bun]
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

```txt [npm]
npm run dev
```

```txt [yarn]
yarn dev
```

```txt [pnpm]
pnpm dev
```

```txt [bun]
bun run dev
```

:::

## 4. Deploy

::: code-group

```txt [npm]
npm run deploy
```

```txt [yarn]
yarn deploy
```

```txt [pnpm]
pnpm deploy
```

```txt [bun]
bun run deploy
```

:::

That's all!!
