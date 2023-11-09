# Error handling in Validator

By using a validator, you can handle invalid input more easily.

## Snippets

You can utilize the callback result for implementing custom error handling.

Although this snippet employs [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator), you can apply a similar approach with any supported validator library.

```ts
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const app = new Hono();

const userSchema = z.object({
  name: z.string(),
  age: z.number(),
});

app.post(
    "/users/new",
  zValidator("json", userSchema, (result, c) => {
      if (!result.success) {
      return c.text("Invalid!", 400);
    }
  }),
  async (c) => {
    const user = c.req.valid("json");
    console.log(user.name); // string
    console.log(user.age); // number
  }
);
```

## References

- [Zod Validator](https://github.com/honojs/middleware/blob/main/packages/zod-validator)
- [Valibot Validator](https://github.com/honojs/middleware/tree/main/packages/valibot-validator)
- [Typebox Validator](https://github.com/honojs/middleware/tree/main/packages/typebox-validator)
- [Typia Validator](https://github.com/honojs/middleware/tree/main/packages/typia-validator)
