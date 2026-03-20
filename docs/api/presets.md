# Presets

Hono has several routers, each designed for a specific purpose.
You can specify the router you want to use in the constructor of Hono.

**Presets** are provided for common use cases, so you don't have to specify the router each time.
The `Hono` class imported from all presets is the same, the only difference being the router.
Therefore, you can use them interchangeably.

## `hono`

Usage:

```ts twoslash
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

```ts twoslash
import { Hono } from 'hono/quick'
```

Router:

```ts
this.router = new SmartRouter({
  routers: [new LinearRouter(), new TrieRouter()],
})
```

## `hono/tiny`

Usage:

```ts twoslash
import { Hono } from 'hono/tiny'
```

Router:

```ts
this.router = new PatternRouter()
```

## Which preset should I use?

| Preset       | Suitable platforms                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `hono`       | This is highly recommended for most use cases. Although the registration phase may be slower than `hono/quick`, it exhibits high performance once booted. It's ideal for long-life servers built with **Deno**, **Bun**, or **Node.js**. It is also suitable for **Fastly Compute**, as route registration occurs during the app build phase on that platform. For environments such as **Cloudflare Workers**, **Deno Deploy**, where v8 isolates are utilized, this preset is suitable as well. Because the isolations persist for a certain amount of time after booting. |
| `hono/quick` | This preset is designed for environments where the application is initialized for every request.                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `hono/tiny`  | This is the smallest router package and it's suitable for environments where resources are limited.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
