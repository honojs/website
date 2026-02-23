# Azure Functions

[Azure Functions](https://azure.microsoft.com/en-us/products/functions) は Microsoft Azure のサーバーレスプラットフォームです。 イベントに応じてコードを実行でき、自動でコンピューティングリソースを管理します。

Hono は Azure Functions のために作られたわけではありませんが、 [Azure Functions Adapter](https://github.com/Marplex/hono-azurefunc-adapter) を使うことでうまく動かすことができます。

Node.js 18 以上の Azure Functions **V4** で動作します。

## 1. CLI をインストールする

Azure Function を作るために、 [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools) をインストールする必要があります。

macOS では:

```sh
brew tap azure/functions
brew install azure-functions-core-tools@4
```

他の OS では:

- [Install the Azure Functions Core Tools | Microsoft Learn](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4#install-the-azure-functions-core-tools)

## 2. セットアップ

TypeScript Node.js V4 プロジェクトをカレントディレクトリに作ります。

```sh
func init --typescript
```

ホストのデフォルトプレフィックスを変更するには、 `host.json` のルートに以下のプロパティを追加します:

```json
"extensions": {
    "http": {
        "routePrefix": ""
    }
}
```

::: info
Azure Functions でデフォルトのルートプレフィックスは `/api` です。 上のように変更しない場合は、 Hono の全てのルートを `/api` から初めてください。
:::

Hono と Azure Functions Adapter をインストールする準備ができました:

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

`src/app.ts` を作ります:

```ts
// src/app.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Azure Functions!'))

export default app
```

`src/functions/httpTrigger.ts` を作ります:

```ts
// src/functions/httpTrigger.ts
import { app } from '@azure/functions'
import { azureHonoHandler } from '@marplex/hono-azurefunc-adapter'
import honoApp from '../app'

app.http('httpTrigger', {
  methods: [
    //Add all your supported HTTP methods here
    'GET',
    'POST',
    'DELETE',
    'PUT',
  ],
  authLevel: 'anonymous',
  route: '{*proxy}',
  handler: azureHonoHandler(honoApp.fetch),
})
```

## 4. 実行

開発サーバーをローカルで実行し、 `http://localhost:7071` を Web ブラウザで開きます。

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

## 5. デプロイ

::: info
Azure にデプロイする前に、クラウドインフラストラクチャリソースを作る必要があります。 Microsoft のドキュメントを読んでください。 [Create supporting Azure resources for your function](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript?pivots=nodejs-model-v4&tabs=windows%2Cazure-cli%2Cbrowser#create-supporting-azure-resources-for-your-function)
:::

プロジェクトをビルドしてデプロイします:

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

プロジェクトを自分の Azure Cloud のファンクションアプリケーションにデプロイするために、 `<YourFunctionAppName>` を自分のアプリの名前に変えます。

```sh
func azure functionapp publish <YourFunctionAppName>
```
