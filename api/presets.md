# Presets

Hono has several routers, each designed for a specific purpose.
You can specify the router you want to use in the constructor of Hono.

**Presets** are provided for common use cases, so you don't have to specify the router each time.
The `Hono` class imported from all presets is the same, the only difference being the router.
Therefore, you can use them interchangeably.

## `hono`

Usage:

```ts
import { Hono } from 'hono'
```

Routers:

```ts
this.router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

## `hono/quick`

Usage:

```ts
import { Hono } from 'hono/quick'
```

Router:

```ts
this.router = new LinearRouter()
```

## `hono/tiny`

Usage:

```ts
import { Hono } from 'hono/tiny'
```

Router:

```ts
this.router = new PatternRouter()
```

## Which preset should I use?

| Preset       | Suitable platforms                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hono`       | This is highly recommended for most use cases. Although the registration phase may be slower than `hono/quick`, it exhibits high performance once booted. It's ideal for long-life servers built with **Deno**, **Bun**, or **Node.js**. For environments such as **Cloudflare Workers**, **Deno Deploy**, **Lagon**, where v8 isolates are utilized, this preset is suitable too. Because the isolates persist for a certain amount of time after booting. |
| `hono/quick` | This preset is designed for environments where the application is initialized for every request. **Fastly Compute@Edge** operates in this manner, thus this preset is recommended for use it.                                                                                                                                                                                                                                                               |
| `hono/tiny`  | This is the smallest router package and is suitable for environments where resources are limited.                                                                                                                                                                                                                                                                                                                                                           |
