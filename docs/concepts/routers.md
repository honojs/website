# Routers

The routers are the most important features for Hono.

Hono has five routers.

## RegExpRouter

**RegExpRouter** is the fastest router in the JavaScript world.

Although this is called "RegExp" it is not an Express-like implementation using [path-to-regexp](https://github.com/pillarjs/path-to-regexp).
They are using linear loops.
Therefore, regular expression matching will be performed for all routes and the performance will be degraded as you have more routes.

![](/images/router-linear.jpg)

Hono's RegExpRouter turns the route pattern into "one large regular expression".
Then it can get the result with one-time matching.

![](/images/router-regexp.jpg)

This works faster than methods that use tree-based algorithms such as radix-tree in most cases.

However, RegExpRouter doesn't support all routing patterns, so it's usually used in combination with one of the other routers below that support all routing patterns.

## TrieRouter

**TrieRouter** is the router using the Trie-tree algorithm.
Like RegExpRouter, it does not use linear loops.

![](/images/router-tree.jpg)

This router is not as fast as the RegExpRouter, but it is much faster than the Express router.
TrieRouter supports all patterns.

## SmartRouter

**SmartRouter** is useful when you're using multiple routers. It selects the best router by inferring from the registered routers.
Hono uses SmartRouter, RegExpRouter, and TrieRouter by default:

```ts
// Inside the core of Hono.
readonly defaultRouter: Router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

When the application starts, SmartRouter detects the fastest router based on routing and continues to use it.

## LinearRouter

RegExpRouter is fast, but the route registration phase can be slightly slow.
So, it's not suitable for an environment that initializes with every request.

**LinearRouter** is optimized for "one shot" situations.
Route registration is significantly faster than with RegExpRouter because it adds the route without compiling strings, using a linear approach.

The following is one of the benchmark results, which includes the route registration phase.

```console
• GET /user/lookup/username/hey
----------------------------------------------------- -----------------------------
LinearRouter     1.82 µs/iter      (1.7 µs … 2.04 µs)   1.84 µs   2.04 µs   2.04 µs
MedleyRouter     4.44 µs/iter     (4.34 µs … 4.54 µs)   4.48 µs   4.54 µs   4.54 µs
FindMyWay       60.36 µs/iter      (45.5 µs … 1.9 ms)  59.88 µs  78.13 µs  82.92 µs
KoaTreeRouter    3.81 µs/iter     (3.73 µs … 3.87 µs)   3.84 µs   3.87 µs   3.87 µs
TrekRouter       5.84 µs/iter     (5.75 µs … 6.04 µs)   5.86 µs   6.04 µs   6.04 µs

summary for GET /user/lookup/username/hey
  LinearRouter
   2.1x faster than KoaTreeRouter
   2.45x faster than MedleyRouter
   3.21x faster than TrekRouter
   33.24x faster than FindMyWay
```

## PatternRouter

**PatternRouter** is the smallest router among Hono's routers.

While Hono is already compact, if you need to make it even smaller for an environment with limited resources, use PatternRouter.

An application using only PatternRouter is under 15KB in size.

```console
$ npx wrangler deploy --minify ./src/index.ts
 ⛅️ wrangler 3.20.0
-------------------
Total Upload: 14.68 KiB / gzip: 5.38 KiB
```
