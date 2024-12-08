# Google App Engine

App Engine is a serverless platform by Google Cloud.
App Engine's fully-managed environment manages your infrastructure so you can focus on coding.

Hono works on App Engine with the Node.js environment.
[Click here](https://cloud.google.com/appengine/docs/standard/lifecycle/support-schedule?hl=ja#nodejs) to see the versions of Node.js supported by the App Engine.

## 1. Setup

First, prepare the bare HONO. See the [Basic](https://hono.dev/docs/getting-started/basic) page for detailed preparation instructions.

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono@latest my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono@latest my-app
```

:::

Then you will be asked which template you would like to use.

When deploying to the App Engine, nodejs must be selected.

```
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
   cloudflare-workers
    deno
    fastly
    nextjs
❯    nodejs
    vercel
```

## 2. Hello Hono

Edit `src/index.ts`.

The App Engine runs the application on the port on the App Engine side, and since the working port of the App Engine can be obtained with `process.env.PORT`, the source side should also modify the `port`.

- before
  - `const port = 3000`
- after
  - `port = Number(process.env.PORT) || 3000`

```ts:src/index.ts
import { serve } from "@hono/node-server";
import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
    fetch: app.fetch,
    port,
});
```

Run npm run dev and if you see Hello Hono!

## 3. Deploy Preparation

To run Hono in Node.js in the App Engine standard environment, add the `build` and `start` commands to the `package.json`.

This is because we need to put it on the Node runtime as built in js, and App Engine will hit the command `start` to start the application.

Edit `package.json`.

```package.json
    "scripts": {
        "dev": "tsx watch src/index.ts",
+        "app-engine-build": "tsc --build",
+        "start": "node dist/index.js"
    },
```

::: info
The reason I don't have the `build` command as `build` is that when I raise the source to App Engine, the `Cloud Build` side automatically runs the `build` command if there is a `build` command.
But there, the `tsc` command will result in an error. To avoid this behavior, we use `app-engine-build`.
:::

Specify the build destination in `tsconfig.json`.

```tsconfig.json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "NodeNext",
    "strict": true,
    "verbatimModuleSyntax": true,
    "skipLibCheck": true,
    "types": [
      "node"
    ],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx",
+    "outDir": "./dist",
  }
}
```

Create `app.yaml` and specify in `app.yaml` the minimum fields required to run the App Engine.

```app.yaml
runtime: nodejs20
```

## 4. Deploy

Create a project from the Cloud Console and obtain a project ID.

The App Engine API must be enabled from [here](https://cloud.google.com/build/docs/deploying-builds/deploy-appengine?hl=ja).

Then execute the following commands.

```sh
npm run app-engine-build
gcloud app deploy --project [YOUR_PROJECT_ID]
```

You can check the operation by accessing the service URL displayed after deployment is complete!!