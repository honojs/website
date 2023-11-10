# Grouping routes for RPC

To enable type inference for Hono Client on the segmented `app` using `app.route()`, you can do the following:

## Snippets

Pass the return value of methods like `app.get()` or `app.post()` as Routes to `app.route()`.

```ts
import { Hono } from "hono";
import { hc } from "hono/client";

const authorsApp = new Hono()
  .get("/", (c) => c.jsonT({ result: "list authors" }))
  .post("/", (c) => c.jsonT({ result: "create an author" }, 201))
  .get("/:id", (c) => c.jsonT({ result: `get ${c.req.param("id")}` }));

const booksApp = new Hono()
  .get("/", (c) => c.jsonT({ result: "list books" }))
  .post("/", (c) => c.jsonT({ result: "create a book" }, 201))
  .get("/:id", (c) => c.jsonT({ result: `get ${c.req.param("id")}` }));

const app = new Hono().route("/authors", authorsApp).route("/books", booksApp);

type AppType = typeof app;

const client = hc<AppType>("[YOUR HONO SERVER ENDPOINT]");

async function main() {
  const response = await client.authors.$get();
  const json = await response.json();
  console.log(json.result); // string
}

main();
```

## References

- [Guides - RPC - Client](guides/rpc#client)
