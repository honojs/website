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

```
npm create hono@latest my-app
```

Move to `my-app` and install the dependencies.

```
cd my-app
npm i
```

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

```
npm run dev
```

## 4. Deploy

```
npm run deploy
```

That's all!!
