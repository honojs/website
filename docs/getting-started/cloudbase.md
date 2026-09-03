# Tencent CloudBase

[Tencent CloudBase](https://docs.cloudbase.net/en/) is Tencent Cloud's serverless backend platform. [HTTP Cloud Functions](https://docs.cloudbase.net/en/cloud-function/develop/how-to-writing-functions-code) run as a plain Node.js process. Your application listens on port `9000`, and CloudBase starts it through [`scf_bootstrap`](https://docs.cloudbase.net/en/cloud-function/develop/scf-bootstrap). [`@hono/node-server`](https://github.com/honojs/node-server) works as-is. No extra Hono adapter is required.

## 1. Setup

Start your project with the "create-hono" command. Select `nodejs`.

::: code-group

```sh [npm]
npm create hono@latest my-app
cd my-app
npm i
```

```sh [yarn]
yarn create hono my-app
cd my-app
yarn
```

```sh [pnpm]
pnpm create hono my-app
cd my-app
pnpm i
```

```sh [bun]
bun create hono@latest my-app
cd my-app
bun i
```

:::

## 2. Hello World

Edit `src/index.ts`. CloudBase HTTP Cloud Functions require port `9000`.

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => c.text('Hello CloudBase!'))

serve({
  fetch: app.fetch,
  port: 9000,
})
```

## 3. Run

```sh
npm run dev
```

Then access `http://localhost:9000`.

## 4. Bootstrap

Create `scf_bootstrap` in the project root (no file extension) and make it executable:

```sh
#!/bin/bash
/var/lang/node20/bin/node dist/index.js
```

```sh
chmod +x scf_bootstrap
```

Use LF line endings. The Node path must match the function runtime; `/var/lang/node20/bin/node` is for Node.js 20.19.

## 5. Deploy

Build the app, then deploy an HTTP function (Node.js 20.19) with the [CloudBase CLI](https://docs.cloudbase.net/en/cli-v1/functions/deploy):

```sh
npm run build
tcb fn deploy <function-name> --httpFn
```

For console zip upload, see the [Node.js HTTP function quick start](https://docs.cloudbase.net/en/cloud-function/quickstart/httpfunc/nodejs).
