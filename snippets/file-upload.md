# File Upload

In Hono, you can access to the uploaded files via `c.req.parseBody()`.

## Snippets

You can upload a file with `multipart/form-data` content type. The uploaded file will be available in `c.req.parseBody()`.

```ts
const app = new Hono()

app.post('/upload', async (c) => {
  const body = await c.req.parseBody()
  console.log(body['file']) // File | string
})
```

## References

- [API - HonoRequest - parseBody](/api/request#parsebody)
