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
