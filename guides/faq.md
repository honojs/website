# Frequently Asked Questions

This guide is a collection of frequently asked questions (FAQ) about Hono and how to resolve them.

## Is there an official Renovate config for Hono?

The Hono teams does not currently maintain [Renovate](https://github.com/renovatebot/renovate) Configuration.
Therefore, please use third-party renovate-config as follows.

In your `renovate.json` :

```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>shinGangan/renovate-config-hono" // [!code ++]
  ]
}
```

see [renovate-config-hono](https://github.com/shinGangan/renovate-config-hono) repository for more details.

## What would error tracking look like?
I have something like this
Sentry.init({
  dsn: "https://c814c99400cb9fc7650e1225fe23fc2f@o64124.ingest.us.sentry.io/4507064511168512",
});
Sentry.startSpan({ name: "hono" }, (rootSpan) => {
  Sentry.startSpan({ name: "hono", op: "paypal" }, (childSpan) => {
    // do something in here
    // childSpan will be nested inside of rootSpan
 });
  app.use('*', async (c, next) => {
    await next()
    if (c.error) {
      console.error(c.error)
      throw (c.error)
    }
  })

  app.onError((err, c) => {
    Sentry.startSpan({ name: "hono", op: "paypal" }, (childSpan) => {
        Sentry.captureException(err)
    });
    return c.text('Custom Error Message:' + err + err.cause, 500)
  })
  
I assume that this will catch all errors that happen in routes, as I don't have to throw errors or attach them to context. The c.error thing in error middlewear will throw an error and the onError handler will catch it?
