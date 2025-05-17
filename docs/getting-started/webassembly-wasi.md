# WebAssembly (w/ WASI)

[WebAssembly][wasm-core] is a secure, sandboxed, portable runtime that runs inside and outside browsers. In practice,
many languages *compile to* WebAssembly, and WebAssembly runtimes *run* WebAssembly binaries (`.wasm`).

While core WebAssembly has *no* access to things like the local filesystem or sockets, the [WebAssembly System Interface][wasi]
steps in to enable defining a platform under WebAssebly workloads. This means that *with* WASI, WebAssembly can operate on
files, sockets, and much more.

::: info
Want to peek at the WASI interface yourself? check out [`wasi:http`][wasi-http]
:::

Support for WebAssembly w/ WASI in JS is powered underneat by [StarlingMonkey][sm], and thanks to the focus on Web standards in
both StarlingMonkey and Hono, **Hono works *out of the box with WASI-enabled WebAssembly ecosystems.**

[sm]: https://github.com/bytecodealliance/StarlingMonkey
[wasm-core]: https://webassembly.org/
[wasi]: https://wasi.dev/
[bca]: https://bytecodealliance.org/

## 1. Setup

The WebAssembly JS ecosystem provides tooling to make it easy to get started building WASI-enabled WebAssembly components:

- [StarlingMonkey][sm] is a WebAssembly-aware JS runtime
- [`componentize-js`][componentize-js] is a tool for building WebAssembly components from Javascript files
- [`jco`][jco] is a multi-tool for building, generating types, and running components in environments like NodeJS or the browser

::: info
Webassembly has an open ecosystem is an open source, with core projects stewarded primarily by the [Bytecode Alliance][bca] and it's members.

New features, issues, pull requests and other types of contributions are always welcome.
:::

While a starter for WebAssembly Hono is not yet available, you can start a WebAssembly Hono project just
like any other:

::: code-group

```sh [npm]
mkdir my-app
cd my-app
npm init
npm i hono
npm i -D @bytecodealliance/jco @bytecodealliance/componentize-js rollup
npm i -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve
```

```sh [yarn]
mkdir my-app
cd my-app
npm init
yarn add hono
yarn add -D @bytecodealliance/jco @bytecodealliance/componentize-js
yarn add -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve tslib
```

```sh [pnpm]
mkdir my-app
cd my-app
npm init
pnpm add hono
pnpm add -D @bytecodealliance/jco @bytecodealliance/componentize-js
pnpm add -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve tslib
```

```sh [bun]
mkdir my-app
cd my-app
npm init
bun add hono
bun add -D @bytecodealliance/jco @bytecodealliance/componentize-js
```

:::

::: info
To ensure your project uses ES modules, consider setting `type` to `"module"` in package.json
:::

Once you're in `my-app`, install dependencies, and initialize Typescript:

::: code-group

```sh [npm]
npm i
npx tsc --init
```

```sh [yarn]
yarn
yarn tsc --init
```

```sh [pnpm]
pnpm i
pnpx tsc --init
```

```sh [bun]
bun i
bun run tsc --init
```

:::


Once you have a basic typescript configuration file (`tsconfig.json`), please ensure it has the following configuration:

- `compilerOptions.module` set to `"nodenext"`

Since `componentize-js` (and `jco` which re-uses that functionality) does not (yet) work with multiple JS files,
bundling is necessary, so [`rollup`][rollup] is used for package managers that do not already bundle.

The following Rollup configuration (`rollup.config.mjs`) should also be used:

```js
import typescript from "@rollup/plugin-typescript";
import nodeResolve from "@rollup/plugin-node-resolve";

export default {
  input: "component.mts",
  external: /wasi:.*/,
  output: {
    file: "dist/component.js",
    format: "esm",
  },
  plugins: [
    typescript({ noEmitOnError: true }),
    nodeResolve(),
  ],
};
```

::: info
Feel free to use any other bundlers that you're more comfortable with (`esbuild`, `rolldown`, etc)
:::

[jco]: https://github.com/bytecodealliance/jco
[componentize-js]: https://github.com/bytecodealliance/componentize-js
[rollup]: https://rollupjs.org/

## 2. Retrieve WIT dependencies

[`wasi:http`][wasi-http] is the standardized interface for dealing with HTTP requests (whether it's receiving them or sending them out),
and since our component reuses that functionality, we have to declare it in the [WIT world][wit-world] our component exports:

[wit-world]: https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md#wit-worlds

First, let's set up the component's WIT world:

```wit
/// wit/component.wit
package example:hono;

world component {
    import wasi:cli/environment@0.2.3;

    export wasi:http/incoming-handler@0.2.3;
}
```

Put simply, the WIT file above means that we "make available" the functionality of "receiving" HTTP requests. While the above is
relatively simple, it does depend on some upstream third party WIT interfaces (specifications on how requests are structured, etc).

To pull those third party (Bytecode Alliance maintained) WIT interaces, one tool we can use is [`wkg`][wkg]:

```sh
wkg wit fetch
```

Once `wkg` has finished running, you should find your `wit` folder populated with a new `deps` folder alongside `component.wit`:

```
wit
├── component.wit
└── deps
    ├── wasi-cli-0.2.3
    │   └── package.wit
    ├── wasi-clocks-0.2.3
    │   └── package.wit
    ├── wasi-http-0.2.3
    │   └── package.wit
    ├── wasi-io-0.2.3
    │   └── package.wit
    └── wasi-random-0.2.3
        └── package.wit
```

[wkg]: https://github.com/bytecodealliance/wasm-pkg-tools
[wasi-http]: https://github.com/WebAssembly/wasi-http

## 3. Hello Wasm

Let's fulfill our `component` world with a basic Hono application as a WebAssembly component:

```ts
// component.mts
import { Hono } from 'hono'

const app = new Hono();

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello WASM!',
  })
})

/**
 * Register the Hono application with the global fetch listener as supported by the underlying StarlingMonkey JS runtime.
 *
 * Since both Hono and StarlingMonkey are aligned Web Standards (WinterCG/WinterTC),
 * this enables Hono to run smoothly in WASI-enabled (`wasi:http`) Webassembly environments.
 *
 * See: https://github.com/bytecodealliance/ComponentizeJS#using-starlingmonkeys-fetch-event
 * See: https://hono.dev/docs/concepts/web-standard
 * See: https://wintertc.org/
 * See: https://github.com/WebAssembly/wasi-http
 */
app.fire();
```

## 4. Build

Since we're using Rollup (and it's configured to handle Typescript compilation), we can use it to build and bundle:

::: code-group

```sh [npm]
npx rollup -c
```

```sh [yarn]
yarn rollup -c
```

```sh [pnpm]
pnpx rollup -c
```

```sh [bun]
bun build --target=bun --outfile=dist/component.js ./component.mts
```

:::

::: info
The bundling step is necessary because WebAssembly JS ecosystem tooling only currently supports a single JS file,
and we'd like to include Hono along with related libraries.

For components with simpler requirements, bundlers are not necessary.
:::

To build your WebAssembly component, use `jco` (and indirectly `componentize-js`):

::: code-group

```sh [npm]
npx jco componentize -w wit -o dist/component.wasm dist/component.js
```

```sh [yarn]
yarn jco componentize -w wit -o dist/component.wasm dist/component.js
```

```sh [pnpm]
pnpx jco componentize -w wit -o dist/component.wasm dist/component.js
```

```sh [bun]
bun run jco componentize -w wit -o dist/component.wasm dist/component.js
```

:::


## 3. Run

To run your Hono WebAssembly HTTP server, you can use any WASI-enabled WebAssembly runtime:

- [`wasmtime`][wasmtime]
- `jco` (runs in NodeJS)

In this guide, we'll use `jco serve` since it's already installed.

::: warning
`jco serve` is meant for development, and is not recommended for production use.
:::

[wasmtime]: https://wasmtime.dev

::: code-group

```sh [npm]
npx jco serve dist/component.wasm
```

```sh [yarn]
yarn jco serve dist/component.wasm
```

```sh [pnpm]
pnpx jco serve dist/component.wasm
```

```sh [bun]
bun run jco serve dist/component.wasm
```

:::

You should see output like the following:

```
$ npx jco serve dist/component.wasm
Server listening @ localhost:8000...
```

Sending a request to `localhost:8000/hello` will produce the JSON output you've specified in your Hono application.

You should see output like the following:

```json
{"message":"Hello WASM!"}
```

## More information

To learn moreabout WASI, WebAssembly components and more, see the following resources:

- [BytecodeAlliance Component Model book][cm-book]
- [`jco` codebase][jco]
  - [`jco` example components][jco-example-components] (in particular the [Hono example][jco-example-component-hono])
- [`componentize-js` codebase][componentize-js]

[cm-book]: https://component-model.bytecodealliance.org/

[jco-example-components]: https://github.com/bytecodealliance/jco/tree/main/examples/components
[jco-example-component-hono]: https://github.com/bytecodealliance/jco/tree/main/examples/components/http-server-hono
