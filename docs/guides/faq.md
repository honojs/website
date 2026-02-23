# よくある質問

Hono のよくある質問 (FAQ) と解決方法をまとめたガイド。

## Hono 公式の Renovate 設定はありますか?

Hono チームは現在 [Renovate](https://github.com/renovatebot/renovate) 設定をメンテナンスしていません。
そのため、下のようにサードパーティーの renovate-config を使用してください。

`renovate.json` :

```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>shinGangan/renovate-config-hono" // [!code ++]
  ]
}
```

[renovate-config-hono](https://github.com/shinGangan/renovate-config-hono) リポジトリで詳細を確認してください。
