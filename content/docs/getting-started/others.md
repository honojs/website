---
title: "Others"
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
"*Serve Static*" middleware is not supported for Fastly Compute@Edge
{{< /hint >}}

## Others

These are not well tested but may work.

* Vercel Edge Functions
* Netlify Edge Functions
* Supabase Edge Functions