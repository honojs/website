# Accepts ヘッダ

Accepts ヘルパーはリクエストの Accept ヘッダを処理するのに役立ちます。

## インポート

```ts
import { Hono } from 'hono'
import { accepts } from 'hono/accepts'
```

## `accepts()`

`accepts()` 関数は Accept-Encoding や Accept-Language 等の Accept をヘッダ調べ、適切な値を返します。

```ts
import { accepts } from 'hono/accepts'

app.get('/', (c) => {
  const accept = accepts(c, {
    header: 'Accept-Language',
    supports: ['en', 'ja', 'zh'],
    default: 'en',
  })
  return c.json({ lang: accept })
})
```

### `AcceptHeader` 型

`AcceptHeader` 型の定義は以下のとおりです。

```ts
export type AcceptHeader =
  | 'Accept'
  | 'Accept-Charset'
  | 'Accept-Encoding'
  | 'Accept-Language'
  | 'Accept-Patch'
  | 'Accept-Post'
  | 'Accept-Ranges'
```

## オプション

### <Badge type="danger" text="required" /> header: `AcceptHeader`

調べる accept ヘッダの名前。

### <Badge type="danger" text="required" /> supports: `string[]`

アプリケーションがサポートするヘッダの値。

### <Badge type="danger" text="required" /> default: `string`

デフォルトの値。

### <Badge type="info" text="optional" /> match: `(accepts: Accept[], config: acceptsConfig) => string`

マッチを行うカスタム関数。
