# Grouping routes for RPC

To enable type inference for Hono Client on the segmented `app` using `app.route()`, you can do the following:

## Snippets

Pass the return value of methods like `app.get()` or `app.post()` as Routes to `app.route()`.

```ts
import { Hono } from "hono";
import { hc } from "hono/client";

const subApp = new Hono();

const subRoutes = subApp.get("/", (c) => {
  return c.jsonT({ message: "Hello" });
});

const app = new Hono();
const routes = app.route("/sub", subRoutes);

type AppType = typeof routes;

const client = hc<AppType>("[YOUR HONO SERVER ENDPOINT]")

async function main() {
  const response = await client.sub.$get();
  const json = await response.json();
  console.log(json.message); // string
}

main();
```

## References

- [Guides - RPC - Client](guides/rpc#client)
