# Cloudbase SCF

[Cloudbase SCF](https://docs.cloudbase.net/cloud-function/introduce) (Serverless Cloud Function) is a fully managed, event-driven compute service provided by Tencent Cloud. It allows developers to focus on writing and deploying code without the need to manage servers. The service supports various triggers and automatically scales to handle incoming requests, making it ideal for building scalable and efficient applications.

## 1. Setup

Before you begin, ensure that you have the following installed:
- Node.js (version 14 or later)
- `@cloudbase/cli` (required for deployment)

Install `@cloudbase/cli` globally:

```bash
npm install -g @cloudbase/cli
```

### Get Start

```sh [npm]
npm create hono@latest my-app
```

Move to `my-app` and install the dependencies.

```sh [npm]
cd my-app
npm i
```

## 2. Hello World

Edit `src/index.ts` like below.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

app.get('/json', (c) => {
  return c.json({ message: 'Hello Hono!' })
})

export default app
export const main = handle(app)
```

Edit `src/server.js` so that you can run the development server locally.

```ts
import { serve } from '@hono/node-server'
import app from './index'

const port = 3000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port
})
```

Edit `package.json`:

```json
{
  "name": "hono",
  "scripts": {
    "dev": "tsx watch src/node.ts",
    "build": "esbuild --bundle --outfile=./dist/index.js --platform=node --target=node20 ./src/index.ts",
    "deploy": "tcb framework deploy"
  },
  "dependencies": {
    "@hono/node-server": "^1.12.2",
    "hono": "file:"
  },
  "devDependencies": {
    "@types/node": "^20.11.17",
    "esbuild": "^0.23.1",
    "tsx": "^4.7.1"
  }
}
```

Edit `cloudbaserc.json`:

```json
{
  "version": "2.0",
  "envId": "yourEnvId-3ef6zbg34ed33g1w",
  "$schema": "https://framework-1258016615.tcloudbaseapp.com/schema/latest.json",
  "framework": {
    "name": "frameworkName",
    "plugins": {
      "server": {
        "use": "@cloudbase/framework-plugin-node",
        "inputs": {
          "projectPath": "dist",
          "entry": "index.js",
          "path": "/yourAccessPath",
          "name": "yourFunctionName",
          "wrapExpress": false,
          "platform": "function",
          "functionOptions": {
            "handler": "index.main"       
          }
        }
      }
    }
  },
  "region": "ap-shanghai"
}
```
To test your code in local you can do this.

```sh [npm]
npm run dev
```

## 3. Deploy

Make sure to create the SCF in your Dashboard **before** deploying it, so that you can use a higher Node.js version (Node.js 18.15). Otherwise, your code will not work with lower versions (like 10.15).

```sh [npm]
npm run deploy
```
