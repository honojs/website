# Service Worker

[Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) はキャッシュやプッシュ通知などを処理するために Web ブラウザのバックグラウンドで動くスクリプトです。 Service Worker アダプタを使用することで、 Hono で作ったアプリケーションを [FetchEvent](https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent) ハンドラとしてブラウザ内で動かすことができます。

このページでは [Vite](https://vitejs.dev/) を使ってプロジェクトを作る例を解説します。

## 1. セットアップ

まずは、プロジェクトのディレクトリを作って移動します:

```sh
mkdir my-app
cd my-app
```

プロジェクトに必要なファイルを作成します。 以下のように `package.json` を書いてください:

```json
{
  "name": "my-app",
  "private": true,
  "scripts": {
    "dev": "vite dev"
  },
  "type": "module"
}
```

同様に、 `tsconfig.json` も作ってください:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "WebWorker"],
    "moduleResolution": "bundler"
  },
  "include": ["./"],
  "exclude": ["node_modules"]
}
```

次に、必要なパッケージをインストールします。

::: code-group

```sh [npm]
npm i hono
npm i -D vite
```

```sh [yarn]
yarn add hono
yarn add -D vite
```

```sh [pnpm]
pnpm add hono
pnpm add -D vite
```

```sh [bun]
bun add hono
bun add -D vite
```

:::

## 2. Hello World

`index.html` を書きます:

```html
<!doctype html>
<html>
  <body>
    <a href="/sw">Hello World by Service Worker</a>
    <script type="module" src="/main.ts"></script>
  </body>
</html>
```

`main.ts` は Service Worker を登録するためのスクリプトです:

```ts
function register() {
  navigator.serviceWorker
    .register('/sw.ts', { scope: '/sw', type: 'module' })
    .then(
      function (_registration) {
        console.log('Register Service Worker: Success')
      },
      function (_error) {
        console.log('Register Service Worker: Error')
      }
    )
}
function start() {
  navigator.serviceWorker
    .getRegistrations()
    .then(function (registrations) {
      for (const registration of registrations) {
        console.log('Unregister Service Worker')
        registration.unregister()
      }
      register()
    })
}
start()
```

`sw.ts` で、 Hono を使ってアプリケーションを作り、 Service Worker アダプタの `handle` 関数を使って `fetch` イベントに登録します。 これにより、 Hono アプリケーションが `/sw` 以下のアクセスを傍受できるようになります。

```ts
// To support types
// https://github.com/microsoft/TypeScript/issues/14877
declare const self: ServiceWorkerGlobalScope

import { Hono } from 'hono'
import { handle } from 'hono/service-worker'

const app = new Hono().basePath('/sw')
app.get('/', (c) => c.text('Hello World'))

self.addEventListener('fetch', handle(app))
```

### `fire()` を使う

`fire()` 関数は自動で `addEventListener('fetch', handle(app))` を呼び、 コードをより簡潔にします。

```ts
import { Hono } from 'hono'
import { fire } from 'hono/service-worker'

const app = new Hono().basePath('/sw')
app.get('/', (c) => c.text('Hello World'))

fire(app)
```

## 3. 実行

開発サーバーを起動します

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm run dev
```

```sh [bun]
bun run dev
```

:::

デフォルトでは、開発サーバーは `5173` 番ポートで起動します。 ブラウザで `http://localhost:5173/` にアクセスすることで Service Worker の登録が完了します。 次に、 `/sw` にアクセスして Hono アプリケーションからのレスポンスを見ることができます。
