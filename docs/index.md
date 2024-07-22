---
title: Hono - エッジ向けの爆速Webフレームワーク
titleTemplate: ':title'
---

# Hono

Hono - _**\[炎\] 🔥**_ - は小さく、シンプルで爆速なエッジ向けWebフレームワークです。
あらゆるJavaScriptランタイムで動作します: Cloudflare Workers 、 Fastly Compute 、 Deno 、 Bun 、 Vercel 、 Netlify 、 AWS Lambda 、 Lambda@Edge そして Node.js。

Honoは速いけど、速いだけではありません。

```ts
import { Hono } from 'hono'
const app = new Hono()

app.get('/', (c) => c.text('Hono!'))

export default app
```

## クイックスタート

これを実行するだけです:

::: code-group

```sh [npm]
npm create hono@latest
```

```sh [yarn]
yarn create hono
```

```sh [pnpm]
pnpm create hono@latest
```

```sh [bun]
bun create hono@latest
```

```sh [deno]
deno run -A npm:create-hono@latest
```

:::

## 特徴

- **爆速** 🚀 - `RegExpRouter` は非常に高速なルーターです。 線形ループを使用しません。 めちゃくちゃ速い!
- **軽量** 🪶 - `hono/tiny` プリセットは 14KB 未満です。 Hono は依存関係が無く Web 標準のみを使用します。
- **マルチランタイム** 🌍 - Cloudflare Workers 、 Fastly Compute 、 Deno 、 Bun 、 AWS Lambda 、 Node.js で動作します。 同じコードがすべてのプラットフォーム上で動作します。
- **バッテリー同梱** 🔋 - Hono にはビルドインミドルウェア、カスタムミドルウェア、サードパーティーミドルウェア及びヘルパーが含まれています。 バッテリー同梱!
- **楽しい DX** 😃 - 非常にクリーンな API 。 最上級の TypeScript サポート。 Now, we've got "Types".

## 使用例

Hono は Express に似たフロントエンドを持たないWebアプリケーションフレームワークです。
しかし CDN エッジでミドルウェアを組み合わせることでより大規模なアプリケーションを構築できます。
以下にいくつかの使用例を紹介します。

- Web API の構築
- バックエンドサーバーのプロキシ
- CDN のフロント
- エッジアプリケーション
- ライブラリのベースサーバー
- フルスタックアプリケーション

## 誰が Hono を使っていますか?

| Project                                                            | Platform           | What for?                                                                               |
| ------------------------------------------------------------------ | ------------------ | --------------------------------------------------------------------------------------- |
| [cdnjs](https://cdnjs.com)                                         | Cloudflare Workers | A free and open-source CDN service. _Hono is used for the api server_.                  |
| [Cloudflare D1](https://www.cloudflare.com/developer-platform/d1/) | Cloudflare Workers | Serverless SQL databases. _Hono is used for the internal api server_.                   |
| [Unkey](https://unkey.dev)                                         | Cloudflare Workers | An open-source API authentication and authorization. _Hono is used for the api server_. |
| [OpenStatus](https://openstatus.dev)                               | Bun                | An open-source website & API monitoring platform. _Hono is used for the api server_.    |
| [Deno Benchmarks](https://deno.com/benchmarks)                     | Deno               | A secure TypeScript runtime built on V8. _Hono is used for benchmarking_.               |

そして、

- [Drivly](https://driv.ly/) - Cloudflare Workers
- [repeat.dev](https://repeat.dev/) - Cloudflare Workers

Do you want to see more? See [Who is using Hono in production?](https://github.com/orgs/honojs/discussions/1510).

## Hono 1分クッキング

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

[他のベンチマーク](/docs/concepts/benchmarks) も確認してください。

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

[ルーティングの詳細](/docs/concepts/routers)もご確認ください。

## Web 標準

**Web 標準**を使用しているおかげで、 Hono は沢山のプラットフォーム上で動作します。

- Cloudflare Workers
- Cloudflare Pages
- Fastly Compute
- Deno
- Bun
- Vercel
- AWS Lambda
- Lambda@Edge
- その他...!

[Node.js アダプタ](https://github.com/honojs/node-server)を使って Hono は Node.js でも動きます。

[Web 標準についての詳細](/docs/concepts/web-standard)もご確認ください。

## ミドルウェア & ヘルパー

**Hono は沢山のミドルウェアやヘルパーを持っています**。 それらは "Write Less, do more" を実現します。

Hono は以下のすぐに使えるミドルウェアとヘルパーを提供します:

- [Basic 認証](/docs/middleware/builtin/basic-auth)
- [Bearer 認証](/docs/middleware/builtin/bearer-auth)
- [Body Limit](/docs/middleware/builtin/body-limit)
- [キャッシュ](/docs/middleware/builtin/cache)
- [圧縮](/docs/middleware/builtin/compress)
- [Cookie](/docs/helpers/cookie)
- [CORS](/docs/middleware/builtin/cors)
- [ETag](/docs/middleware/builtin/etag)
- [html](/docs/helpers/html)
- [JSX](/docs/guides/jsx)
- [JWT 認証](/docs/middleware/builtin/jwt)
- [Logger](/docs/middleware/builtin/logger)
- [JSON 整形](/docs/middleware/builtin/pretty-json)
- [Secure Headers](/docs/middleware/builtin/secure-headers)
- [SSG](/docs/helpers/ssg)
- [ストリーミング](/docs/helpers/streaming)
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

[ミドルウェアの詳細](/docs/concepts/middleware)もご確認ください。

## 開発体験

Hono は楽しい "**開発体験**" を提供します。

`Context` オブジェクトによって Request/Response へ簡単にアクセスできます。
更に、 Hono は TypeScript で書かれており、 "**型**" を持っています。

例えば、パスパラメータはリテラル型になります。

![SS](/images/ss.png)

そして、バリデーターと Hono Client `hc` は RPC モードを有効にします。 RPC モードでは、
Zod などのお気に入りのバリデーターを使用して、サーバーサイド API 仕様をクライアントと簡単に共有してタイプセーフなアプリケーションを構築できます。

[Hono Stacks](/docs/concepts/stacks)もご確認ください。
