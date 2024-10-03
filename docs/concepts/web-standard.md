# Web Standards

Hono uses only **Web Standards** like Fetch.
They were originally used in the `fetch` function and consist of basic objects that handle HTTP requests and responses.
In addition to `Requests` and `Responses`, there are `URL`, `URLSearchParam`, `Headers` and others.

Cloudflare Workers, Deno, and Bun also build upon Web Standards.
For example, a server that returns "Hello World" could be written as below. This could run on Cloudflare Workers and Bun.

```ts twoslash
export default {
  async fetch() {
    return new Response('Hello World')
  },
}
```

Hono uses only Web Standards, which means that Hono can run on any runtime that supports them.
In addition, we have a Node.js adapter. Hono runs on these runtimes:

- Cloudflare Workers (`workerd`)
- Deno
- Bun
- Fastly Compute
- AWS Lambda
- Node.js
- Vercel (edge-light)

It also works on Netlify and other platforms.
The same code runs on all platforms.

Cloudflare Workers, Deno, Shopify, and others launched [WinterCG](https://wintercg.org) to discuss the possibility of using the Web Standards to enable "web-interoperability".
Hono will follow their steps and go for **the Standard of the Web Standards**.
