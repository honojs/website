# Tencent CloudBase

[Tencent CloudBase](https://docs.cloudbase.net/en/) is Tencent Cloud's serverless backend platform. [HTTP Cloud Functions](https://docs.cloudbase.net/en/cloud-function/develop/how-to-writing-functions-code) run as a plain Node.js process — not a Lambda-style event handler. Your application listens on port `9000`, and CloudBase starts it through [`scf_bootstrap`](https://docs.cloudbase.net/en/cloud-function/develop/scf-bootstrap). [`@hono/node-server`](https://github.com/honojs/node-server) works as-is. No extra Hono adapter is required.

## 1. Setup

Start your project with the "create-hono" command. Select `nodejs` for this example.

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

CloudBase HTTP Cloud Functions require the server to listen on port `9000`. Update `src/index.ts`.

<!-- prettier-ignore -->
```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello CloudBase!')
})

serve({
  fetch: app.fetch,
  port: 3000 // [!code --]
  port: 9000 // [!code ++]
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
```

::: info
Listen on port `9000` and bind to `0.0.0.0` rather than `127.0.0.1`. `serve()` without a `hostname` already listens on all interfaces. See the [Node.js HTTP function quick start](https://docs.cloudbase.net/en/cloud-function/quickstart/httpfunc/nodejs).
:::

## 3. Run

Run the development server locally. Then, access `http://localhost:9000` in your Web browser.

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

## 4. Bootstrap

HTTP Cloud Functions start through a `scf_bootstrap` file in the project root (no file extension). Create the file and make it executable:

```sh
#!/bin/bash
/var/lang/node20/bin/node dist/index.js
```

```sh
chmod +x scf_bootstrap
```

The Node binary path must match the function runtime. For Node.js 20.19, use `/var/lang/node20/bin/node`. See [Runtime Environment Support](https://docs.cloudbase.net/en/cloud-function/runtime-support) for other versions.

::: info
Use LF line endings in `scf_bootstrap`. CRLF can prevent the file from running on Linux. Details are in the [bootstrap file guide](https://docs.cloudbase.net/en/cloud-function/develop/scf-bootstrap).
:::

## 5. Deploy

Build the TypeScript project:

::: code-group

```sh [npm]
npm run build
```

```sh [yarn]
yarn build
```

```sh [pnpm]
pnpm build
```

```sh [bun]
bun run build
```

:::

Create an HTTP Cloud Function (not an event-triggered function) with a Node.js 20.19 runtime, or another Node.js 18+ runtime that matches your `scf_bootstrap` path.

### Deploy with the CloudBase CLI

Install and log in to the [CloudBase CLI](https://docs.cloudbase.net/en/cli-v1/functions/deploy), then deploy from the project directory:

```sh
npm install -g @cloudbase/cli
tcb login
tcb fn deploy <function-name> --httpFn
```

### Deploy from the console

You can also create an HTTP Cloud Function in the CloudBase console and upload a zip of the built app. Include `dist`, production `node_modules`, and `scf_bootstrap`. Package the files themselves, not the parent folder. See the [Node.js HTTP function quick start](https://docs.cloudbase.net/en/cloud-function/quickstart/httpfunc/nodejs) for console steps.

After deployment, configure HTTP access as described in [Access Cloud Functions via HTTP](https://docs.cloudbase.net/en/service/access-cloud-function).
