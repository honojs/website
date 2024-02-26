# Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) はフルスタック Web アプリケーションのためのエッジプラットフォームです。
静的ファイルと Cloudflare Workers で動的コンテンツを配信できます。

Hono は Cloudflare Pages も完全にサポートしています。
楽しい開発体験をもたらします。 Vite による開発サーバーも Wrangler によるデプロイも非常に高速です。

## 1. セットアップ

スターターは Cloudflare Pages もサポートしています。
"create-hono" でプロジェクトを開始しましょう。

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

これは基本的なディレクトリ構成です。

```text
./
├── package.json
├── public
│   └── static // Put your static files.
│       └── style.css // You can refer to it as `/static/style.css`.
├── src
│   ├── index.tsx // The entry point for server-side.
│   └── renderer.tsx
├── tsconfig.json
└── vite.config.ts
```

## 2. Hello World

`src/index.tsx` を編集します:

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Pages!</h1>)
})

export default app
```

## 3. Run

ローカルで開発サーバーを起動し、ブラウザで `http://localhost:5173` へアクセスしましょう。

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

Cloudflare アカウントを持っている場合、 Cloudflare にデプロイ出来ます。 `package.json` の `$npm_execpath` をお好きなパッケージマネージャに置き換えてください。

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

## バインディング

変数、 KV 、 D1 などの Cloudflare バインディングを使用できます。
`vite.config.ts` を編集してください:

```ts
import { getEnv } from '@hono/vite-dev-server/cloudflare-pages'

export default defineConfig({
  plugins: [
    pages(),
    devServer({
      entry: 'src/index.tsx',
      env: getEnv({
        bindings: {
          NAME: 'Hono',
        },
        kvNamespaces: ['MY_KV'],
      }),
    }),
  ],
})
```

D1 を使用する場合、アプリは設定を読み取って `.mf/d1/DB/db.sqlite` を自動で作成します:

```ts
export default defineConfig({
  plugins: [
    pages(),
    devServer({
      entry: 'src/index.tsx',
      env: getEnv({
        d1Databases: ['DB'],
        d1Persist: true,
      }),
    }),
  ],
})
```

## クライアントサイド

クライアントサイドスクリプトを作成し、 Vite の機能でインポートできます。
`/src/client.ts` がクライアントエントリポイントの場合、 `<script>` タグに書くだけです。
さらに、 `import.meta.env.PROD` は開発サーバーかビルド中かを知るのに役立ちます。

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        {import.meta.env.PROD ? (
          <>
            <script type='module' src='/static/client.js'></script>
          </>
        ) : (
          <>
            <script type='module' src='/src/client.ts'></script>
          </>
        )}
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
  )
})
```

正しくスクリプトをビルドするためにこのような `vite.config.ts` の設定が役立ちます。

```ts
import pages from '@hono/vite-cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        rollupOptions: {
          input: './src/client.ts',
          output: {
            entryFileNames: 'static/client.js',
          },
        },
      },
    }
  } else {
    return {
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx',
        }),
      ],
    }
  }
})
```

次のコマンドを実行して、サーバーとクライアントのスクリプトをビルドできます。

```text
vite build --mode client && vite build
```
