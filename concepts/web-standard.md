# Web 標準

Hono は Fetch のような **Web 標準 APIs** のみを使用します。
これらは元々 `fetch` 関数で使用され、 HTTP リクエストを処理する基本的なオブジェクトで構成されています。
`Requests` / `Responses` 、 他に `URL` `URLSearchParam` `Headers` などがあります。

Cloudflare Workers 、 Deno 、 Bun は Web 標準 API 上に構築されています。
例えば、 "Hello World" を返すサーバーは以下のように書くことが出来ます。 Cloudflare Workers と Bun で動作します。

```ts
export default {
  async fetch() {
    return new Response('Hello World')
  },
}
```

Hono は Web 標準 API のみを使用します。 つまり Hono は Web 標準 API をサポートするあらゆるランタイムで動作します。
咥えて、 Node.js があり、次のようなランタイムで Hono が動作します。

- Cloudflare Workers (`workerd`)
- Deno
- Bun
- Fastly Compute
- AWS Lambda
- Node.js
- Vercel (edge-light)

Netlify やその他のプラットフォームでも動作します。
同じコードがすべてのプラットフォームで実行されます。

Cloudflare Workers 、 Deno 、 Shopify などが [WinterCG](https://wintercg.org) を立ち上げ、 Web 標準 API を使用した "Web 相互運用性" を実現する可能性を議論しました。
Hono はその手順に従い **"Web 標準の標準"**を目指します。
