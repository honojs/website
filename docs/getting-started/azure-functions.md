# Azure Functions

[Azure Functions](https://azure.microsoft.com/en-us/products/functions) is a serverless platform from Microsoft Azure. You can run your code in response to events, and it automatically manages the underlying compute resources for you.

Hono was not designed for Azure Functions at first. But with [Azure Functions Adapter](https://github.com/Marplex/hono-azurefunc-adapter) it can run on it as well.

It works with Azure Functions **V4** running on Node.js 18 or above.

## 1. Install CLI

To create an Azure Function, you must first install [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools).

On macOS

```sh
brew tap azure/functions
brew install azure-functions-core-tools@4
```

Follow this link for other OS:

- [Install the Azure Functions Core Tools | Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools)

## 2. Setup

Create a TypeScript Node.js V4 project in the current folder.

```sh
func init --typescript
```

Change the default route prefix of the host. Add this property to the root json object of `host.json`:

```json
"extensions": {
    "http": {
        "routePrefix": ""
    }
}
```

::: info
The default Azure Functions route prefix is `/api`. If you don't change it as shown above, be sure to start all your Hono routes with `/api`
:::

Now you are ready to install Hono and the Azure Functions Adapter with:

::: code-group

```sh [npm]
npm i @marplex/hono-azurefunc-adapter hono
```

```sh [yarn]
yarn add @marplex/hono-azurefunc-adapter hono
```

```sh [pnpm]
pnpm add @marplex/hono-azurefunc-adapter hono
```

```sh [bun]
bun add @marplex/hono-azurefunc-adapter hono
```

:::

## 3. Hello World

Create `src/app.ts`:

```ts
// src/app.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Azure Functions!'))

export default app
```

Create `src/functions/httpTrigger.ts`:

```ts
// src/functions/httpTrigger.ts
import { app } from "@azure/functions";
import { azureHonoHandler } from "@marplex/hono-azurefunc-adapter";
import honoApp from "../app";

app.http("httpTrigger", {
  methods: [ //Add all your supported HTTP methods here
    "GET",
    "POST",
    "DELETE",
    "PUT"
  ],
  authLevel: "anonymous",
  route: "{*proxy}",
  handler: azureHonoHandler(honoApp.fetch)
});
```

## 4. Run

Run the development server locally. Then, access `http://localhost:7071` in your Web browser.

::: code-group

```sh [npm]
npm run start
```

```sh [yarn]
yarn start
```

```sh [pnpm]
pnpm start
```

```sh [bun]
bun run start
```

:::

## 5. Deploy

::: info
Before you can deploy to Azure, you need to create some resources in your cloud infrastructure. Please visit the Microsoft documentation on [Create supporting Azure resources for your function](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4&tabs=windows%2Cazure-cli%2Cbrowser#create-supporting-azure-resources-for-your-function)
:::

Build the project for deployment:

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


Deploy your project to the function app in Azure Cloud. Replace `<YourFunctionAppName>` with the name of your app.

```sh
func azure functionapp publish <YourFunctionAppName>
```