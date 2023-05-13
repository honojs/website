# Routers

The routers are the most important features for Hono.

Hono has 4 + 1 routers.

## RegExpRouter

**RegExpRouter** is the fastest router in the JavaScript world.

Although this is called "RegExp" it is not an Express-like implementation using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
They are using linear loops.
Therefore, regular expression matching will be performed for all routes and the performance will be degraded as you have more routes.

![Router Linear](/images/router-linear.jpg)

Hono's RegExpRouter turns the route pattern into "one large regular expression".
Then it can get the result with one-time matching.

![Router RegExp](/images/router-regexp.jpg)

This works faster than methods that use tree-based algorithms such as radix-tree in most cases.

## TrieRouter

**TrieRouter** is the router using the Trie-tree algorithm.
It does not use liner loops as same as RegExpRouter.

![Router Tree](/images/router-tree.jpg)

This router is not as fast as the RegExpRouter, but it is much faster than the Express router.
TrieRouter supports all patterns though RegExpRouter does not.

## SmartRouter

**SmartRouter** will select the best router by inferring from the registered routers.
Hono uses SmartRouter and the two routers by default.

```ts
// Inside the core of Hono.
readonly defaultRouter: Router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

When the application starts, SmartRouter detects the fastest router based on routing and continues to use it.

## PatternRouter

```
$ npx wrangler dev --minify ./src/index.ts
 ⛅️ wrangler 2.20.0
--------------------
⬣ Listening at http://0.0.0.0:8787
- http://127.0.0.1:8787
- http://192.168.128.165:8787
Total Upload: 11.47 KiB / gzip: 4.34 KiB
```

## LinearRouter
