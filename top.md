title: Hono - エッジ向けの爆速Webフレームワーク
titleTemplate: ':title'
---

# Hono

Hono - _**\[炎\] 🔥**_ - は小さく、シンプルで爆速なエッジ向けWebフレームワークです。
あらゆるJavaScriptランタイムで動作します: Cloudflare Workers、 Fastly Compute、 Deno、 Bun、 Vercel、 Netlify、 AWS Lambda、 Lambda@Edge そして Node.js。

速いですが、それだけではありません。

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## クイックスタート

これを実行するだけです:

::: code-group

```txt [npm]
npm create hono@latest
```

```txt [yarn]
yarn create hono
```

```txt [pnpm]
pnpm create hono
```

```txt [bun]
bunx create-hono
```

```txt [deno]
deno run -A npm:create-hono
```

:::

## 特徴

- **爆速** 🚀 - `RegExpRouter` は非常に高速なルーターです。 線形ループを使用しません。 速い!
- **軽量** 🪶 - `hono/tiny` プリセットは14kB未満です。 Hono は依存関係が無く Web Standard API のみを使用します。
- **マルチランタイム** 🌍 - Cloudflare Workers、 Fastly Compute、 Deno、 Bun、 AWS Lambda、 Node.js で動作します。 同じコードがすべてのプラットフォーム上で動作します。
- **バッテリー同梱** 🔋 - Hono にはビルドインミドルウェア、カスタムミドルウェア、サードパーティーミドルウェア及びヘルパーが含まれています。 バッテリー同梱!
- **楽しい DX** 😃 - 非常にクリーンな APIs。 最上級の TypeScript サポート。 Now, we've got "Types".

## 使用例

Hono は Express に似たフロントエンドを持たないWebアプリケーションフレームワークです。
しかしCDNエッジでミドルウェアを組み合わせることでより大規模なアプリケーションを構築できます。
以下にいくつかの使用例を紹介します。

- Web API の構築
- バックエンドサーバーのプロキシ
- CDN のフロント
- エッジアプリケーション
- ライブラリのベースサーバー
- フルスタックアプリケーション

## 誰が Hono を使っていますか?

| プロジェクト                                       | プラットフォーム        | 目的                                                                                      |
| ---------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| [cdnjs API Server](https://cdnjs.com/api)      | Cloudflare Workers | 無料でオープンソースの CDN サービス。 _Hono は API サービスに使われています_。                           |
| [Polyfill.io](https://www.polyfill.io/v3/)     | Fastly Compute     | ブラウザのポリフィルを提供する CDN サービス。 _Hono はコアサーバーに使用されています_。                       |
| [Ultra](https://ultrajs.dev)                   | Deno               | React/Deno のフレームワーク。 _内部サーバーに Hono が使われます_。                                    |
| [Deno Benchmarks](https://deno.com/benchmarks) | Deno               | V8 上に構築された安全な TypeScript ランタイム。 _Hono はベンチマークに使われています_。                    |
| [Cloudflare Blog](https://blog.cloudflare.com) | Cloudflare Workers | _記事内で紹介されているいくつかのアプリケーションは Hono が使われています_。                               |

そして以下。

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

## 1分で Hono

Hono を使用して Cloudflare Workers 向けのアプリケーションを作成するデモ。

![Demo](/images/sc.gif)

## 爆速

**Hono は最速です**、 Cloudflare Workers 向けの他のルーターと比較してみましょう。

```
Hono x 402,820 ops/sec ±4.78% (80 runs sampled)
itty-router x 212,598 ops/sec ±3.11% (87 runs sampled)
sunder x 297,036 ops/sec ±4.76% (77 runs sampled)
worktop x 197,345 ops/sec ±2.40% (88 runs sampled)
Fastest is Hono
✨  Done in 28.06s.
```

[他のベンチマーク](/concepts/benchmarks) も確認してください。

## 軽量

**Hono はとても小さいです**。 `hono/tiny` プリセットを使用した時、 Minify すれば **14KB 以下** になります。 ミドルウェアやアダプタはたくさんありますが、使用するときのみバンドルされます。 ちなみに Express は 572KB あります。

```
$ npx wrangler dev --minify ./src/index.ts
 ⛅️ wrangler 2.20.0
--------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.128.165:8787
Total Upload: 11.47 KiB / gzip: 4.34 KiB
```

## 複数のルーター

**Hono は複数のルーターを持っています**。

**RegExpRouter** は JavaScript で最速のルーターです。 ディスパッチ前に作成された単一の巨大な正規表現を使用してルートを検索します。 **SmartRouter** と併用すると全てのルーティングパターンをサポートします。

**LinearRouter** はルートの登録が非常に高速なため、アプリケーションが毎回初期化される環境に適しています。 **PatternRouter** はパターンを追加して照合するだけなので小さくなります。

[ルーティングの詳細](/concepts/routers)もご確認ください。

## Web 標準

**Web 標準 API**を使用しているおかげで、 Hono は沢山のプラットフォーム上で動作します。

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Deno
- Bun
- Vercel
- AWS Lambda
- Lambda@Edge
- Others

[Node.js アダプタ](https://github.com/honojs/node-server)を使って Hono は Node.js でも動きます。

[Web 標準についての詳細](/concepts/web-standard)もご確認ください。

## ミドルウェア & ヘルパー

**Hono は沢山のミドルウェアやヘルパーを持っています**。 それらは "Write Less, do more" を実現します。

Hono は以下のすぐに使えるミドルウェアとヘルパーを提供します:

- [Basic 認証](/middleware/builtin/basic-auth)
- [Bearer 認証](/middleware/builtin/bearer-auth)
- [キャッシュ](/middleware/builtin/cache)
- [圧縮](/middleware/builtin/compress)
- [Cookie](/helpers/cookie)
- [CORS](/middleware/builtin/cors)
- [ETag](/middleware/builtin/etag)
- [html](/helpers/html)
- [JSX](/guides/jsx)
- [JWT 認証](/middleware/builtin/jwt)
- [Logger](/middleware/builtin/logger)
- [JSON整形](/middleware/builtin/pretty-json)
- [Secure Headers](/middleware/builtin/secure-headers)
- [SSG](/helpers/ssg)
- [ストリーミング](/helpers/streaming)
- [GraphQL サーバー](https://github.com/honojs/middleware/tree/main/packages/graphql-server)
- [Firebase 認証](https://github.com/honojs/middleware/tree/main/packages/firebase-auth)
- [Sentry](https://github.com/honojs/middleware/tree/main/packages/sentry)
- etc...!

例えば、 ETag と リクエストロギングを追加するためには Hono を使用して以下のコードを書くだけです:

```ts
import { Hono } from 'hono'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'

const app = new Hono()
app.use(etag(), logger())
```

[ミドルウェアの詳細](/concepts/middleware)もご確認ください。

## 開発体験

Hono は楽しい "**開発体験**" を提供します。

`Context` オブジェクトによって Request/Response へ簡単にアクセスできます。
更に、 Hono は TypeScript で書かれており、 "**型**" を持っています。

例えば、パスパラメータはリテラル型になります。

![SS](/images/ss.png)

そして、バリデーターと Hono Client `hc` は RPC モードを有効にします。 RPC モードでは、
Zod などのお気に入りのバリデーターを使用して、サーバーサイド API 仕様をクライアントと簡単に共有してタイプセーフなアプリケーションを構築できます。

[Hono Stacks](/concepts/stacks)もご確認ください。
