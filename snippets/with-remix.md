# Remix + Hono

[Remix](https://remix.run/) is a Web Standard based full stack framework.

Now, Remix and Hono can be used together through the fetch API.

## Snippets

You can use Remix as Hono middleware using [Remix Hono](https://github.com/sergiodxa/remix-hono), like this:

```ts
import * as build from "@remix-run/dev/server-build";
import { remix } from "remix-hono/handler";

app.use("*", remix({ build, mode: process.env.NODE_ENV }));
```

## References

- [Remix](https://remix.run/)
- [Remix Hono](https://github.com/sergiodxa/remix-hono)
