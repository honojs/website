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
yarn add -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve
```

```sh [pnpm]
mkdir my-app
cd my-app
npm init
pnpm add hono
pnpm add -D @bytecodealliance/jco @bytecodealliance/componentize-js
pnpm add -D rollup @rollup/plugin-typescript @rollup/plugin-node-resolve
```

```sh [bun]
mkdir my-app
cd my-app
npm init
bun add hono
bun add -D @bytecodealliance/jco @bytecodealliance/componentize-js
```

:::

Move into `my-app` and install the dependencies.

::: code-group

```sh [npm]
cd my-app
npm i
```

```sh [yarn]
cd my-app
yarn
```

```sh [pnpm]
cd my-app
pnpm i
```

```sh [bun]
cd my-app
bun i
```

:::

Since `componentize-js` (and `jco` which re-uses that functionality) does not (yet) work with multiple JS files,
bundling is necessary, so [`rollup`][rollup] is used for package managers that do not already bundle.

The following Rollup configuration (`rollup.config.mjs`) should also be used:

```js
import typescript from "@rollup/plugin-typescript";
import resolve from "@rollup/plugin-node-resolve";
import dotenv from "rollup-plugin-dotenv";
import { nodeResolve } from "@rollup/plugin-node-resolve";

export default {
  input: "component.ts",
  external: /wasi:.*/,
  output: {
    file: "dist/component.js",
    format: "esm",
  },
  plugins: [
    dotenv(),
    resolve(),
    typescript({ noEmitOnError: true }),
    nodeResolve(),
  ],
};
```

[jco]: https://github.com/bytecodealliance/jco
[componentize-js]: https://github.com/bytecodealliance/componentize-js

## 2. Hello World

If you use the App Router, Edit `app/api/[[...route]]/route.ts`. Refer to the [Supported HTTP Methods](https://nextjs.org/docs/app/building-your-application/routing/route-handlers#supported-http-methods) section for more options.

```ts
import { Hono } from 'hono'

const app = new Hono();

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello WASM!',
  })
})

export const GET = handle(app)
export const POST = handle(app)

app.fire();
```

## 3. Build


First, transpile your Typescript into javsacript:

::: code-group

```sh [npm]
npx tsc -p .
```

```sh [yarn]
yarn tsc -p .
```

```sh [pnpm]
pnpx tsc -p .
```

```sh [bun]
bun build --target=bun --outfile=dist/component.js ./component.ts
```

:::

Then, bundle your transpile javascript into a single JS file, with it's dependencies:

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
bun build --target=bun --outfile=dist/component.js ./component.ts
```

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

::: warn
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


## More information

For more information on the WASI, WebAssembly components and more, see the following resources:

- [BytecodeAlliance Component Model book][cm-book]
- [`jco` codebase][jco]
  - [`jco` example components][jco-example-components] (in particular the [Hono example][jco-example-component-hono])
- [`componentize-js` codebase][compnentize-js]

[cm-book]: https://component-model.bytecodealliance.org/

[jco-example-components]: https://github.com/bytecodealliance/jco/tree/main/examples/components
[jco-example-component-hono]: https://github.com/bytecodealliance/jco/tree/main/examples/components/http-server-hono
