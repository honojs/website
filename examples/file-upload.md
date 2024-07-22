# File Upload

You can upload a file with `multipart/form-data` content type. The uploaded file will be available in `c.req.parseBody()`.

```ts
const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
})
```

## See also

- [API - HonoRequest - parseBody](/docs/api/request#parsebody)
