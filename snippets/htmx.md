# htmx

Using Hono with [htmx](https://htmx.org/).

## Snippets

### typed-htmx

With using [typed-htmx](https://github.com/Desdaemon/typed-htmx), you can write the JSX with the type definitions of htmx.

Install:

```txt
npm i -D typed-htmx
```

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["typed-htmx"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

## References

- [htmx](https://htmx.org/)
- [typed-htmx](https://github.com/Desdaemon/typed-htmx)
