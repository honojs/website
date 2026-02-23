# ファイルアップロード

コンテンツタイプ `multipart/form-data` でファイルをアップロードできます。 アップロードされたファイルは `c.req.parseBody()` で使用できます。

```ts
const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
})
```

## See also

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)
