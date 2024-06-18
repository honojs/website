# Middleware

We call the primitive that returns `Response` as "Handler".
"Middleware" is executed before and after the Handler and handles the `Request` and `Response`.
It's like an onion structure.

![Onion](/images/onion.png)

For example, we can write the middleware to add the "X-Response-Time" header as follows.

```ts
app.use(async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${end - start}`)
})
```

With this simple method, we can write our own custom middleware and we can use the built-in or third party middleware.
