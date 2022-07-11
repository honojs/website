---
title: Pretty JSON Middleware
---

# Pretty JSON Middleware

Pretty JSON middleware enables "*json pretty print*" for JSON response body.
Adding `?pretty` to url query param, the JSON strings are prettified.

```js
// GET /
{"project":{"name":"Hono","repository":"https://github.com/honojs/hono"}}
```

will be:

```js
// GET /?pretty
{
  "project": {
    "name": "Hono",
    "repository": "https://github.com/honojs/hono"
  }
}
```

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}
```ts
import { Hono } from 'hono'
import { prettyJSON } from 'hono/pretty-json'
```
{{< /tab >}}
{{< tab "Deno" >}}
```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { prettyJSON } from 'https://deno.land/x/hono/middleware.ts'
```
{{< /tab >}}
{{< /tabs >}}


## Usage

```ts
const app = new Hono()

app.use('*', prettyJSON())
app.get('/', (c) => {
  return c.json({ message: 'Hono!' })
})
```
