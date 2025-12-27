# Getting Started

Using Hono is super easy. We can set up the project, write code, develop with a local server, and deploy quickly. The same code will work on any runtime, just with different entry points. Let's look at the basic usage of Hono.

## Starter

Starter templates are available for each platform. Use the following "create-hono" command.

::: code-group

```sh [npm]
npm create hono@latest my-app
```

```sh [yarn]
yarn create hono my-app
```

```sh [pnpm]
pnpm create hono@latest my-app
```

```sh [bun]
bun create hono@latest my-app
```

```sh [deno]
deno init --npm hono@latest my-app
```

:::

Then you will be asked which template you would like to use.
Let's select Cloudflare Workers for this example.

```
? Which template do you want to use?
    aws-lambda
    bun
    cloudflare-pages
❯   cloudflare-workers
    deno
    fastly
    nextjs
    nodejs
    vercel
```

The template will be pulled into `my-app`, so go to it and install the dependencies.

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

Once the package installation is complete, run the following command to start up a local server.

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## Hello World

You can write code in TypeScript with the Cloudflare Workers development tool "Wrangler", Deno, Bun, or others without being aware of transpiling.

Write your first application with Hono in `src/index.ts`. The example below is a starter Hono application.

The `import` and the final `export default` parts may vary from runtime to runtime,
but all of the application code will run the same code everywhere.

```ts
import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app
```

Start the development server and access `http://localhost:8787` with your browser.

::: code-group

```sh [npm]
npm run dev
```

```sh [yarn]
yarn dev
```

```sh [pnpm]
pnpm dev
```

```sh [bun]
bun run dev
```

:::

## Return JSON

Returning JSON is also easy. The following is an example of handling a GET Request to `/api/hello` and returning an `application/json` Response.

```ts
app.get('/api/hello', (c) => {
  return c.json({
    ok: true,
    message: 'Hello Hono!',
  })
})
```

## Request and Response

Getting a path parameter, URL query value, and appending a Response header is written as follows.

```ts
app.get('/posts/:id', (c) => {
  const page = c.req.query('page')
  const id = c.req.param('id')
  c.header('X-Message', 'Hi!')
  return c.text(`You want to see ${page} of ${id}`)
})
```

We can easily handle POST, PUT, and DELETE not only GET.

```ts
app.post('/posts', (c) => c.text('Created!', 201))
app.delete('/posts/:id', (c) =>
  c.text(`${c.req.param('id')} is deleted!`)
)
```

## Return HTML

You can write HTML with [the html Helper](/docs/helpers/html) or using [JSX](/docs/guides/jsx) syntax. If you want to use JSX, rename the file to `src/index.tsx` and configure it (check with each runtime as it is different). Below is an example using JSX.

```tsx
const View = () => {
  return (
    <html>
      <body>
        <h1>Hello Hono!</h1>
      </body>
    </html>
  )
}

app.get('/page', (c) => {
  return c.html(<View />)
})
```

## Return raw Response

You can also return the raw [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

```ts
app.get('/', () => {
  return new Response('Good morning!')
})
```

## Using Middleware

Middleware can do the hard work for you.
For example, add in Basic Authentication.

```ts
import { basicAuth } from 'hono/basic-auth'

// ...

app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: 'secret',
  })
)

app.get('/admin', (c) => {
  return c.text('You are authorized!')
})
```

There are useful built-in middleware including Bearer and authentication using JWT, CORS and ETag.
Hono also provides third-party middleware using external libraries such as GraphQL Server and Firebase Auth.
And, you can make your own middleware.

## Adapter

There are Adapters for platform-dependent functions, e.g., handling static files or WebSocket.
For example, to handle WebSocket in Cloudflare Workers, import `hono/cloudflare-workers`.

```ts
import { upgradeWebSocket } from 'hono/cloudflare-workers'

app.get(
  '/ws',
  upgradeWebSocket((c) => {
    // ...
  })
)
```

## Next step

Most code will work on any platform, but there are guides for each.
For instance, how to set up projects or how to deploy.
Please see the page for the exact platform you want to use to create your application!
