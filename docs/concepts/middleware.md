# ミドルウェア

`Response` を返すプリミティブを "ハンドラ" と呼びます。
"Middleware" はハンドラの前後で使用され `Request` と `Response` を処理します。
玉ねぎのような構造です。

![Onion](/images/onion.png)

例えば、 "X-Response-Time" ヘッダを付与するミドルウェアはこのようになります。

```ts
app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})
```

このシンプルな方法によってカスタムミドルウェアを作成したり、ビルドインミドルウェアやサードパーティーミドルウェアを使用できます。
