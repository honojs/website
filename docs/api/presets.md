# プリセット

Hono にはいくつかのルーターがあり、それぞれが特定の目的のために作られています。
Hono のコンストラクタで使用するルーターを指定できます。

**プリセット** は一般的な仕様ケースに合わせて提供されるため、毎回ルーターを指定する必要はありません。
すべてのプリセットからインポートされた `Hono` クラスは同じものであり、ルーターだけが違います。
そのため、交換が可能です。

## `hono`

使い方:

```ts
import { Hono } from 'hono'
```

ルーター:

```ts
this.router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

## `hono/quick`

使い方 :

```ts
import { Hono } from 'hono/quick'
```

ルーター:

```ts
this.router = new SmartRouter({
  routers: [new LinearRouter(), new TrieRouter()],
})
```

## `hono/tiny`

使い方:

```ts
import { Hono } from 'hono/tiny'
```

ルーター:

```ts
this.router = new PatternRouter()
```

## どのプリセットを使うべきですか?

| プリセット     | 適切なプラットフォーム              |
| ------------ | -------------------------------- |
| `hono`       | ほとんどのユースケースで特におすすめされます。 ルート登録は `hono/quick` より遅いかもしれませんが、起動してしまえば高速です。 **Deno** 、 **Bun** 、 **Node.js** で構築された常時起動サーバーに最適です。 V8 Isolates が使用される **Cloudflare Workers** 、 **Deno Deploy** にも適しています。 分離環境は起動後、一定時間持続するためです。 |
| `hono/quick` | リクエストごとにアプリケーションが初期化される環境向けに設計されています。 **Fastly Compute** はそのように動作するため、このプリセットが適しています。 |
| `hono/tiny`  | 最も小さいルーターパッケージで、リソースが限られている環境に適しています。 |
