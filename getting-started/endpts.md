# endpts

[endpts](https://endpts.io/) is a platform to seamlessly build and deploy APIs powered by Node.js serverless functions. The endpts development environment supports TypeScript out of the box, hot reloading, and bundling.

You can run your Hono application with access to the entire NPM ecosystem and Node.js APIs.

## 1. Setup

A starter template for endpts is available. Start your project with "create-hono" command:

```
npm create hono@latest my-app
```

Move to `my-app` and install the dependencies:

```
cd my-app
npm i
```

## 2. Hello World

The `routes/index.ts` contains a simple Hono application:

```ts
// routes/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export default {
  handler: app.fetch,
}
```

endpts Functions use Web Standard APIs making them compatible with Hono by assigning `app.fetch` to the `handler`.

The `routes/` directory is a special directory that endpts automatically scans to register your applications routes. You can read more about the project structure in the [endpts Documentation](https://endpts.io/docs/core-concepts/serverless-functions).

## 3. Run

Run the command.

```ts
npm run dev
```

Then, visit `http://localhost:3000` in your browser or use curl:

```shell
curl http://localhost:3000
```

## 4. Deploy

You can deploy your application to endpts via the [endpts Dashboard](https://dashboard.endpts.io/). You can connect your GitHub account to automatically deploy your application on every push.
