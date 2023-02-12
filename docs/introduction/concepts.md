# Concepts

## Motivation

At first, I just wanted to create a web application on Cloudflare Workers.
But, there was no good framework that works on Cloudflare Workers,
so I started building Hono and thought it would be a good opportunity to learn how to build a router using Trie trees.

Then a friend showed up with ultra crazy fast router called "RegExpRouter".
And, I also had a friend who created the Basic authentication middleware.

Thanks to using only Web Standard API, we could make it work on Deno and Bun. "No Express for Bun?" we could answer, "No, but there is Hono" though Express works on Bun now.

We also have friends who make GraphQL servers, Firebase authentication, and Sentry middleware.
And there is also a Node.js adapter.
An ecosystem has been created.

In other words, Hono is damn fast, makes a lot of things possible, and works anywhere.
You can look that Hono will become **Standard for Web Standard**.

## Routers

The routers are the most important features for Hono.
There is no other router in the world that is as fast and smart.

Hono has 2 + 1 routers.

### RegExpRouter

**RegExpRouter** is the fastest router in the JavaScript world.

Although this is called "RegExp" it is not an Express-like implementation using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
They are using linear loops.
Therefore, regular expression matching must be performed for all routes, and the more routes there are, the worse the performance will be.

![Router Linear](/images/router-linear.jpg)

Hono's RegExpRouter turns the route pattern into "one large regular expression".
Then it can get the route with one-time matching.

![Router RegExp](/images/router-regexp.jpg)

This works faster than methods that use tree-based algorithms such as radix-tree in most cases.

### TrieRouter

**TrieRouter** is the router using the Trie-tree algorithm.
It does not use liner loops as same as RegExpRouter.

![Router Tree](/images/router-tree.jpg)

This router is not as fast as the RegExpRouter, but it is much faster than the Express router.
The other two routers have route patterns that they do not support, but TrieRouter supports all patterns.

### SmartRouter

**SmartRouter** will select the best router for the application from the registered routers.
Hono uses SmartRouter and the three routers by default.

```ts
// Inside the core of Hono.
readonly defaultRouter: Router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

When the application starts, SmartRouter detects the fastest router based on routing and continues to use it.
For example, the application has only static routes, StaticRouter is used.

## Web Standard

Hono uses only **Web Standard API** or which is called Fetch Standard.
They were originally used in the `fetch` function and consist of basic objects that handle HTTP requests and responses.
In addition to `Requests` and `Responses`, there are `URL`, `URLSearchParam`, `Headers` and others.

Cloudflare Workers, Deno and Bun, which have recently emerged, use this Web Standard API to build HTTP servers.
For example, a server that returns "Hello World" could be written like this and run on Cloudflare Workers and Bun.

```ts
export default {
  async fetch() {
    return new Response('Hello World')
  },
}
```

Hono uses only Web Standard, which means that Hono can run on any runtime that uses Web Standard.
And we have Node.js adapter server. Now Hono runs on these runtimes.

- Cloudflare Workers (workerd)
- Deno
- Bun
- Fastly Compute@Edge
- Lagon
- Node.js

It also works on Vercel, Netlify, and other platforms.
The same code runs on all platforms.

Cloudflare Workers, Deno, Shopfiy, and others launched [WinterCG](https://wintercg.org) to discuss the possibility of using the Web Standard API to enable "web-interoperability".
Hono will follow their steps and go for the Standard of the Web Standard.

## Middleware

We call the primitive that returns `Response` a "Handler".
"Middleware" is executed before and after the Handler and handles the `Request` and `Response`.
It's like an onion structure.

![Onion](/images/onion.png)

For example, we can write the middleware to add the "X-Response-Time" header as follows.

```ts
app.use('*', async (c, next) => {
  const start = Date.now()
  await next()
  const end = Date.now()
  c.res.headers.set('X-Response-Time', `${start - end}`)
})
```

With this simple method of writing, we can write our own custom middleware, we can use the built-in ones, and there are third parties.

## Developer Experience

To create a great application, we need great development experience.
Fortunately, we can write applications for Cloudflare Workers, Deno, and Bun in TypeScript without having the transpiling to JavaScript.
Hono is written in TypeScript and can make applications Type-safe.
