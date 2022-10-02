---
title: Basic Auth Middleware
---

# Basic Auth Middleware

This middleware can apply Basic authentication to a specified path.
Implementing Basic authentication with Cloudflare Workers or others is more complicated than it seems, but with this middleware, it's a snap.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { basicAuth } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

## Usage

```ts
const app = new Hono()

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/auth/page', (c) => {
  return c.text('You are authorized')
})
```

## Options

- `username`: string - _required_
  - The username of the user who is authenticating
- `password`: string - _required_
  - The password value for the provided username to authenticate against
- `realm`: string
  - The domain name of the realm, as part of the returned WWW-Authenticate challenge header. Default is `""`
  - _See: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/WWW-Authenticate#directives_
- `hashFunction`: Function
  - A function to handle hashing for safe comparison of authentication tokens

## Recipes

### Using on Fastly Compute@Edge

To use this middleware on Compute@Edge, you need to do one of two things:

1. Polyfill the `crypto` module
2. Install the `crypto-js`, and provide a `hashFunction` to the middleware. (recommended)

Here's how to use this middleware with the `crypto-js` method:

1. Install `crypto-js` via npm:

{{< tabs "Install" >}}
{{< tab "npm" >}}

```
npm i crypto-js
```

{{</ tab >}}
{{< tab "Yarn" >}}

```
yarn add crypto-js
```

{{</ tab >}}
{{< tab "pnpm" >}}

```
pnpm add crypto-js
```

{{</ tab >}}
{{</ tabs >}}

2. Provide a `hashFunction`, using the SHA-256 implementation from `crypto-js`, to the middleware:

```ts
import { SHA256 } from 'crypto-js'

app.use(
  '/auth/*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
    hashFunction: (d: string) => SHA256(d).toString(), // For Fastly Compute@Edge
  })
)
```
