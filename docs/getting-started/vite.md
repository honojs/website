# Vite

[Vite](https://vite.dev/guide/) is a highly extensible frontend build system that makes it easier to use UI frameworks with Hono. It supports TypeScript and ES modules natively, and offers:

- Extremely fast **dev server** with [ESBuild](https://esbuild.github.io/)
- Optimized **build process** using [Rollup](https://rollupjs.org/)

If you need SSR or a more full-stack solution, [Vike](/docs/getting-started/vike) may be what you're looking for.

Vite uses official and community **plugins** to support integration with [most mainstream UI frameworks](https://vite.dev/guide/#trying-vite-online). **Plugins are also necessary to integrate with Hono's fetch-based API.**

## Hono Plugins

There are a number of [official](https://github.com/honojs/vite-plugins) and community plugins for working with Hono and Vite.

- The [Dev Server](/docs/getting-started/vite.md#dev-server) is required to run Hono + Vite projects locally.
- The [Build](/docs/getting-started/vite.md#build) plugin bundles code for production.
- The [SSG](/docs/getting-started/vite.md#ssg) plugin allows you to build a static site from your Hono app.
- [SSR Components](/docs/getting-started/vite.md#ssr-components) and Vite plugins. See [Vike](/docs/getting-started/vike) for a preconfigured solution.

::: warning
Vite brings its own CORS protection. [Disable it](https://hono.dev/docs/middleware/builtin/cors#using-with-vite) to avoid conflicts if using `hono/cors`.
:::

### Dev Server

The [Dev Server plugin](https://github.com/honojs/vite-plugins/blob/main/packages/dev-server) is an adapter for Hono's fetch-based API. It makes key features (e.g., hot module replacement on the client) available, and includes adapters for Node and Bun. _If you are using Cloudflare, [`@cloudflare/vite-plugin`](https://developers.cloudflare.com/workers/vite-plugin/) is recommended instead._

::: info
Vite will take over serving static files. You can override this behavior to [serve static files from a Hono app](https://github.com/honojs/vite-plugins/tree/main/packages/dev-server#importing-asset-as-url-is-not-working).
:::

### Build

To build your app for production, use the [Build plugin](https://github.com/honojs/vite-plugins/tree/main/packages/build).

### SSG

Generate a static site from your Hono app with the [SSG plugin](https://github.com/honojs/vite-plugins/blob/main/packages/ssg).

### SSR

[Vite SSR Components](https://github.com/yusukebe/vite-ssr-components) replaces [`hono-vite-react-stack`](https://github.com/yusukebe/hono-vite-react-stack) as the recommended approach for directly integrating Hono with Vite.

## Vitest

[Vitest](https://vitest.dev/) is recommended for running tests. For basic examples, check out the [Testing guide](/docs/helpers/testing.md).

::: info
Cloudflare provides a test environment and database mocking through [`@cloudflare/vitest-pool-workers`](https://developers.cloudflare.com/workers/testing/vitest-integration/).
:::

## Examples

- [With Hono JSX/DOM](https://github.com/honojs/examples/tree/main/hono-vite-jsx) for a pure Hono stack
- [With React](https://github.com/yusukebe/hono-vite-react-stack-example)
- [Vitest + Cloudflare](https://github.com/yusukebe/vitest-pool-workers-hono)
