# Fastly Compute

[Fastly's Compute](https://www.fastly.com/products/edge-compute) オファリングによって、大規模なでグローバルスケールのアプリケーションを構築し、 Fastry CDN のエッジで動かすことが出来ます。

Hono は Fastly Compute でも動きます。

## 1. CLI をインストールする

Fastly Compute を使用するために、 [Fastly アカウントを作成](https://www.fastly.com/jp/signup/)する必要があります。
次に [Fastly CLI](https://github.com/fastly/cli) をインストールします。

macOS

```sh
brew install fastly/tap/fastly
```

他の OS では次のドキュメントを参照してください:

- [Compute services | Fastly Developer Hub](https://developer.fastly.com/learning/compute/#download-and-install-the-fastly-cli)

## 2. セットアップ

スターターは Fastly Compute でも使用できます。
"create-hono" コマンドでプロジェクトを開始しましょう。
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
bunx create-hono my-app
```

```sh [deno]
deno run -A npm:create-hono my-app
```

:::

`my-app` に移動して依存関係をインストールします。

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

`src/index.ts` を変更します:

```ts
// src/index.ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hello Fastly!'))

app.fire()
```

## 4. Run

ローカルで開発サーバーを起動し、ブラウザで `http://localhost:7676` にアクセスしてください。

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

## 4. デプロイ

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

それだけです!!!
