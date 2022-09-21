---
title: 'Others'
weight: 400
---

# Others

Hono is composed of Web Standard API such as Request and Response.
So it will also work on the edge runtime, which uses the same Web Standard.

## Fastly Compute@Edge

Hono also works on Fastly Compute@Edge.
These is a starter kit for it, please refer them.

<https://github.com/honojs/compute-starter-kit>

{{< hint info >}}
"_Serve Static_" middleware is not supported for Fastly Compute@Edge
{{< /hint >}}

## Node.js

Hono is not designed for Node.js, but with "[Adaptor Server](https://github.com/honojs/node-server)" it can run on Node.js as well.

```ts
import { serve } from '@honojs/node-server' // Write above `Hono`
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hono meets Node.js'))

serve(app)
```

## Others

These are not well tested but may work.

- Vercel Edge Functions
- Netlify Edge Functions
- Supabase Edge Functions
