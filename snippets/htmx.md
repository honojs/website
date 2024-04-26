# htmx

Using Hono with [htmx](https://htmx.org/).

## Snippets

### typed-htmx

By using [typed-htmx](https://github.com/Desdaemon/typed-htmx), you can write JSX with TypeScript definitions for htmx attributes.
We can follow the same pattern found on the [typed-htmx Example Project](https://github.com/Desdaemon/typed-htmx/blob/main/example/src/types.d.ts) to use it with `hono/jsx`.

Install the package:

```sh
npm i -D typed-htmx
```

On `src/global.d.ts` (or `app/global.d.ts` if you're using HonoX), import the `typed-htmx` types:

```ts
import "typed-htmx";
```

Extend Hono's JSX types with the typed-htmx definitions:

```ts
// A demo of how to augment foreign types with htmx attributes.
// In this case, Hono sources its types from its own namespace, so we do the same
// and directly extend its namespace.
declare global {
  namespace Hono {
    interface HTMLAttributes extends HtmxAttributes {
    }
  }
}
```

## References

- [htmx](https://htmx.org/)
- [typed-htmx](https://github.com/Desdaemon/typed-htmx)
