# Grouping routes for RPC

If you want to enable type inference for multiple `app`s correctly, you can use `app.route()` as follows:

## Snippets

Pass the value returned from methods like `app.get()` or `app.post()` to the second argument of `app.route()`.

```ts
import { Hono } from "hono";
import { hc } from "hono/client";

const authorsApp = new Hono()
  .get("/", (c) => c.json({ result: "list authors" }))
  .post("/", (c) => c.json({ result: "create an author" }, 201))
  .get("/:id", (c) => c.json({ result: `get ${c.req.param("id")}` }));

const booksApp = new Hono()
  .get("/", (c) => c.json({ result: "list books" }))
  .post("/", (c) => c.json({ result: "create a book" }, 201))
  .get("/:id", (c) => c.json({ result: `get ${c.req.param("id")}` }));

const app = new Hono().route("/authors", authorsApp).route("/books", booksApp);

type AppType = typeof app;
```

## References

- [Guides - RPC - Client](/guides/rpc#client)
