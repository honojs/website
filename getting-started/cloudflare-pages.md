# Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) is an edge platform for full-stack web applications.
It serves static files and dynamic content provided by Cloudflare Workers.

Hono fully supports Cloudflare Pages.
It introduces a delightful developer experience. Vite's dev server is fast, and deploying with Wrangler is super quick.

## 1. Setup

A starter for Cloudflare Pages is available.
Start your project with "create-hono" command.

```text
npm create hono@latest my-app
```

Move into `my-app` and install the dependencies.

```text
cd my-app
npm i
```

Below is a basic directory structure.

```text
./
├── package.json
├── public
│   └── static // Put your static files.
│       └── style.css // You can refer to it as `/static/style.css`.
├── src
│   ├── index.tsx // The entry point for server-side.
│   └── renderer.tsx
├── tsconfig.json
└── vite.config.ts
```

## 2. Hello World

Edit `src/index.tsx` like the following:

```tsx
import { Hono } from 'hono'
import { renderer } from './renderer'

const app = new Hono()

app.get('*', renderer)

app.get('/', (c) => {
  return c.render(<h1>Hello, Cloudflare Pages!</h1>)
})

export default app
```

## 3. Run

Run the development server locally. Then, access `http://localhost:5173` in your Web browser.

```text
npm run dev
```

## 4. Deploy

If you have a Cloudflare account, you can deploy to Cloudflare.

```text
npm run deploy
```

## Bindings

You can use Cloudflare Bindings like variables, KV, D1, and others.
Edit the `vite.config.ts` like the following:

```ts
export default defineConfig({
  plugins: [
    pages(),
    devServer({
      entry: 'src/index.tsx',
      cf: {
        bindings: {
          NAME: 'Hono',
        },
        kvNamespaces: ['MY_KV'],
      },
    }),
  ],
})
```

When using D1, your app will read `.mf/d1/DB/db.sqlite` which is generated automatically with the following configuration:

```ts
export default defineConfig({
  plugins: [
    pages(),
    devServer({
      cf: {
        d1Databases: ['DB'],
        d1Persist: true,
      },
    }),
  ],
})
```

## Client-side

You can write client-side scripts and import them into your application using Vite's features.
If `/src/client.ts` is the entry point for the client, simply write it in the script tag.
Additionally, `import.meta.env.PROD` is useful for detecting whether it's running on a dev server or in the build phase.

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        {import.meta.env.PROD ? (
          <>
            <script type='module' src='/static/client.js'></script>
          </>
        ) : (
          <>
            <script type='module' src='/src/client.ts'></script>
          </>
        )}
      </head>
      <body>
        <h1>Hello</h1>
      </body>
    </html>
  )
})
```

In order to build the script properly, you can use the example config file `vite.config.ts` as shown below.

```ts
import { defineConfig } from 'vite'
import devServer from '@hono/vite-dev-server'
import pages from '@hono/vite-cloudflare-pages'

export default defineConfig(({ mode }) => {
  if (mode === 'client') {
    return {
      build: {
        lib: {
          entry: './src/client.ts',
          formats: ['es'],
          fileName: 'client',
          name: 'client',
        },
        rollupOptions: {
          output: {
            dir: './dist/static',
          },
        },
        emptyOutDir: false,
        copyPublicDir: false,
      },
    }
  } else {
    return {
      plugins: [
        pages(),
        devServer({
          entry: 'src/index.tsx',
        }),
      ],
    }
  }
})
```

You can run the following command to build the server and client script.

```text
vite build && vite build --mode client
```
