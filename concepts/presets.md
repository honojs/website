# Presets

Hono has several routers, each designed for a specific purpose.
You can specify the router you want to use in the constructor of Hono.

However, to avoid specifying this every time, **presets** are provided for common purposes.

## `hono`

```ts
this.router = new SmartRouter({
  routers: [new RegExpRouter(), new TrieRouter()],
})
```

## `hono/quick`

```ts
this.router = new LinearRouter()
```

## `hono/tiny`

```ts
this.router = new PatternRouter()
```
