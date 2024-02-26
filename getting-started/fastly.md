# Fastly Compute

[Fastly's Compute](https://www.fastly.com/products/edge-compute) オファリングによって、大規模なでグローバルスケールのアプリケーションを構築し、 Fastry CDN のエッジで動かすことが出来ます。

Hono は Fastly Compute でも動きます。

## 1. CLI をインストールする

Fastly Compute を使用するために、 [Fastly アカウントを作成](https://www.fastly.com/jp/signup/)する必要があります。
次に [Fastly CLI](https://github.com/fastly/cli) をインストールします。

macOS

```
brew install fastly/tap/fastly
```

他の OS では次のドキュメントを参照してください:

- [Compute services | Fastly Developer Hub](https://developer.fastly.com/learning/compute/#download-and-install-the-fastly-cli)

## 2. セットアップ

スターターは Fastly Compute でも使用できます。
"create-hono" コマンドでプロジェクトを開始しましょう。

::: code-group

```txt [npm]
npm create hono@latest my-app
```

```txt [yarn]
yarn create hono my-app
```

```txt [pnpm]
pnpm create hono my-app
```

```txt [bun]
bunx create-hono my-app
```

```txt [deno]
deno run -A npm:create-hono my-app
```

:::

`my-app` に移動して依存関係をインストールします。

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

## 4. デプロイ

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
