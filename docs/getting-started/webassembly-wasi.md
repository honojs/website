# WebAssembly (w/ WASI)

[WebAssembly][wasm-core] is a secure, sandboxed, portable runtime that runs inside and outside web browsers.

In practice:

- Languages (like Javascript) _compile to_ WebAssembly (`.wasm` files)
- WebAssembly runtimes (like [`wasmtime`][wasmtime] or [`jco`][jco]) enable _running_ WebAssembly binaries

While core WebAssembly has _no_ access to things like the local filesystem or sockets, the [WebAssembly System Interface][wasi]
steps in to enable defining a platform under WebAssebly workloads.

This means that _with_ WASI, WebAssembly can operate on files, sockets, and much more.

::: info
Want to peek at the WASI interface yourself? check out [`wasi:http`][wasi-http]
:::

Support for WebAssembly w/ WASI in JS is powered by [StarlingMonkey][sm], and thanks to the focus on Web standards in
both StarlingMonkey and Hono, **Hono works \*out of the box with WASI-enabled WebAssembly ecosystems.**

[sm]: https://github.com/bytecodealliance/StarlingMonkey
[wasm-core]: https://webassembly.org/
[wasi]: https://wasi.dev/
[bca]: https://bytecodealliance.org/
[wasi-http]: https://github.com/WebAssembly/wasi-http

## 1. Setup

The WebAssembly JS ecosystem provides tooling to make it easy to get started building WASI-enabled WebAssembly components:

- [StarlingMonkey][sm] is a fork of [SpiderMonkey][spidermonkey] that compiles to WebAssembly and enables components
- [`componentize-js`][componentize-js] turns Javascript ES modules into WebAssembly components
- [`jco`][jco] is a multi-tool that builds components, generates types, and runs components in environments like NodeJS or the browser

::: info
Webassembly has an open ecosystem and is open source, with core projects stewarded primarily by the [Bytecode Alliance][bca] and it's members.

New features, issues, pull requests and other types of contributions are always welcome.
:::

While a starter for Hono on WebAssembly is not yet available, you can start a WebAssembly Hono project just
like any other:

::: code-group

```sh [npm]
mkdir my-app
cd my-app
npm init
npm i hono
npm i -D @bytecodealliance/jco @bytecodealliance/componentize-js @bytecodealliance/jco-std
npm i -D rolldown
```

````sh [yarn]
mkdir my-app
cd my-app
npm init
yarn add hono
yarn add -D @bytecodealliance/jco @bytecodealliance/componentize-js @bytecodealliance/jco-std
yarn add -D rolldown
G```

```sh [pnpm]
mkdir my-app
cd my-app
pnpm init --init-type module
pnpm add hono
pnpm add -D @bytecodealliance/jco @bytecodealliance/componentize-js @bytecodealliance/jco-std
pnpm add -D rolldown
````

```sh [bun]
mkdir my-app
cd my-app
npm init
bun add hono
bun add -D @bytecodealliance/jco @bytecodealliance/componentize-js @bytecodealliance/jco-std
```

:::

::: info
To ensure your project uses ES modules, ensure `type` is set to `"module"` in `package.json`
:::

After entering the `my-app` folder, install dependencies, and initialize Typescript:

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
pnpm exec --init
```

```sh [bun]
bun i
```

:::

Once you have a basic typescript configuration file (`tsconfig.json`), please ensure it has the following configuration:

- `compilerOptions.module` set to `"nodenext"`

Since `componentize-js` (and `jco` which re-uses it) supports only single JS files,
bundling is necessary, so [`rolldown`][rolldown] can be used to create a single file bundle.

A Rolldown configuration (`rolldown.config.mjs`) like the following can be used:

```js
import { defineConfig } from 'rolldown'

export default defineConfig({
  input: 'src/component.ts',
  external: /wasi:.*/,
  output: {
    file: 'dist/component.js',
    format: 'esm',
  },
})
```

::: info
Feel free to use any other bundlers that you're more comfortable with (`rolldown`, `esbuild`, `rollup`, etc)
:::

[jco]: https://github.com/bytecodealliance/jco
[componentize-js]: https://github.com/bytecodealliance/componentize-js
[rolldown]: https://rolldown.rs
[spidermonkey]: https://spidermonkey.dev/

## 2. Set up WIT interface & dependencies

[WebAssembly Inteface Types (WIT)][wit] is an Interface Definition Language ("IDL") that governs what functionality
a WebAssembly component uses ("imports"), and what it provides ("exports").

Amongst the standardized WIT interfaces, [`wasi:http`][wasi-http] is for dealing with HTTP requests (whether it's
receiving them or sending them out), and since we intend to make a web server, our component must declare the use
of `wasi:http/incoming-handler` in it's [WIT world][wit-world]:

First, let's set up the component's WIT world in a file called `wit/component.wit`:

```txt
package example:hono;

world component {
    export wasi:http/incoming-handler@0.2.6;
}
```

Put simply, the WIT file above means that our component "providers" the functionality of "receiving"/"handling incoming"
HTTP requests.

The `wasi:http/incoming-handler` interface relies on upstream standardized WIT interfaces (specifications
on how requests are structured, etc).

To pull those third party (Bytecode Alliance maintained) WIT interaces, one tool we can use is [`wkg`][wkg]:

```sh
wkg wit fetch
```

Once `wkg` has finished running, you should find your `wit` folder populated with a new `deps` folder alongside `component.wit`:

```
wit
├── component.wit
└── deps
    ├── wasi-cli-0.2.6
    │   └── package.wit
    ├── wasi-clocks-0.2.6
    │   └── package.wit
    ├── wasi-http-0.2.6
    │   └── package.wit
    ├── wasi-io-0.2.6
    │   └── package.wit
    └── wasi-random-0.2.6
        └── package.wit
```

[wkg]: https://github.com/bytecodealliance/wasm-pkg-tools
[wit-world]: https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md#wit-worlds
[wit]: https://github.com/WebAssembly/component-model/blob/main/design/mvp/WIT.md

## 3. Hello Wasm

To build a HTTP server in WebAssembly, we can make use of the [`jco-std`][jco-std] project, which
contains helpers that make the experience very similar to the standard Hono experience.

Let's fulfill our `component` world with a basic Hono application as a WebAssembly component in
a file called `src/component.ts`:

```ts
import { Hono } from 'hono'
import { fire } from '@bytecodealliance/jco-std/wasi/0.2.6/http/adapters/hono/server'

const app = new Hono()

app.get('/hello', (c) => {
  return c.json({ message: 'Hello from WebAssembly!' })
})

fire(app)

// Although we've called `fire()` with wasi HTTP configured for use above,
// we still need to actually export the `wasi:http/incoming-handler` interface object,
// as jco and componentize-js will be looking for the ES module export that matches the WASI interface.
export { incomingHandler } from '@bytecodealliance/jco-std/wasi/0.2.6/http/adapters/hono/server'
```

## 4. Build

Since we're using Rolldown (and it's configured to handle Typescript compilation), we can use it to build and bundle:

::: code-group

```sh [npm]
npx rolldown -c
```

```sh [yarn]
yarn rolldown -c
```

```sh [pnpm]
pnpm exec rolldown -c
```

```sh [bun]
bun build --target=bun --outfile=dist/component.js ./src/component.ts
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
pnpm exec jco componentize -w wit -o dist/component.wasm dist/component.js
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
pnpm exec jco serve dist/component.wasm
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
{ "message": "Hello from WebAssembly!" }
```

::: info
`jco serve` works by converting the WebAssembly component into a basic WebAssembly coremodule,
so that it can be run in runtimes like NodeJS and the browser.

This process is normally run via `jco transpile`, and is the way we can use JS engines like NodeJS
and the browser (which may use V8 or other Javascript engines) as WebAssembly Component runtimes.

How `jco transpile` is outside the scope of this guide, you can read more about it in [the Jco book][jco-book]
:::

## More information

To learn moreabout WASI, WebAssembly components and more, see the following resources:

- [BytecodeAlliance Component Model book][cm-book]
- [`jco` codebase][jco]
  - [`jco` example components][jco-example-components] (in particular the [Hono example][jco-example-component-hono])
- [Jco book][jco-book]
- [`componentize-js` codebase][componentize-js]
- [StarlingMonkey codebase][sm]

[cm-book]: https://component-model.bytecodealliance.org/
[jco-book]: https://bytecodealliance.github.io/jco/
[jco-example-components]: https://github.com/bytecodealliance/jco/tree/main/examples/components
[jco-example-component-hono]: https://github.com/bytecodealliance/jco/tree/main/examples/components/http-server-hono
