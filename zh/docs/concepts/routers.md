---
title: 路由
description: Hono 提供了多种高性能路由实现，包括最快的 RegExpRouter、功能完整的 TrieRouter 以及智能选择的 SmartRouter。
---
# 路由

路由是 Hono 最重要的功能特性。

Hono 有五种路由。

## RegExpRouter（正则表达式路由）

**RegExpRouter** 是 JavaScript 世界中最快的路由。

虽然它被称为"正则表达式"路由，但它并不是像 Express 那样使用 [path-to-regexp](https://github.com/pillarjs/path-to-regexp) 的实现方式。
Express 使用线性循环方式，这意味着需要对所有路由进行正则表达式匹配，随着路由数量的增加，性能会逐渐下降。

![路由线性匹配](/images/router-linear.jpg)

Hono 的 RegExpRouter 将路由模式转换为"一个大型正则表达式"。
这样就可以通过一次匹配获得结果。

![路由正则表达式](/images/router-regexp.jpg)

在大多数情况下，这种方式比使用基于树形算法（如基数树）的方法更快。

## TrieRouter（字典树路由）

**TrieRouter** 是使用字典树（Trie-tree）算法的路由。
与 RegExpRouter 一样，它也不使用线性循环。

![路由树形结构](/images/router-tree.jpg)

这个路由虽然不如 RegExpRouter 快，但比 Express 路由快得多。
TrieRouter 支持所有路由模式，而 RegExpRouter 则不支持全部模式。

## SmartRouter（智能路由）

由于 RegExpRouter 不支持所有路由模式，
因此它通常与支持所有模式的其他路由配合使用。

**SmartRouter** 会通过推断已注册的路由来选择最佳路由。
Hono 默认使用 SmartRouter 和以下两个路由：

```ts
// Hono 核心代码内部
readonly defaultRouter: Router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

当应用启动时，SmartRouter 会基于路由情况检测最快的路由，并持续使用它。

## LinearRouter（线性路由）

RegExpRouter 虽然快，但路由注册阶段可能会稍慢。
因此，它不适合在每个请求都需要初始化的环境中使用。

**LinearRouter** 针对"一次性"场景进行了优化。
由于它采用线性方式添加路由而无需编译字符串，因此路由注册速度明显快于 RegExpRouter。

以下是包含路由注册阶段的基准测试结果之一：

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

对于 Fastly Compute 这样的环境，最好使用 LinearRouter 搭配 `hono/quick` 预设。

## PatternRouter（模式路由）

**PatternRouter** 是 Hono 所有路由中体积最小的。

虽然 Hono 本身已经很精简，但如果你需要在资源受限的环境中进一步减小体积，可以使用 PatternRouter。

仅使用 PatternRouter 的应用大小在 15KB 以下。

```console
$ npx wrangler deploy --minify ./src/index.ts
 ⛅️ wrangler 3.20.0
-------------------
Total Upload: 14.68 KiB / gzip: 5.38 KiB
```