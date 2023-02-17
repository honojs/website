# Cloudflare Pages

[Cloudflare Pages](https://pages.cloudflare.com) is a JAMstack platform for front-end developers to collaborate and deploy websites.

It supports many frameworks and it is usually suited for distributing static files.
But with [Pages Functions](https://developers.cloudflare.com/pages/platform/functions/), you can build a full-stack application.
Hono works on it.

## 1. Setup

A starter for Cloudflare Pages is available.
Start your project with "create-hono" command.

```
npm create hono@latest my-app
```

Move into `my-app` and install the dependencies.

```
cd my-app
npm i
```

Below is a basic directory structure that the script in the `/functions` will work dynamically.
Naming the file with `[[]]` like `[[route]].ts`, it can handle all requests to `/api/*`.

```
./
├── functions
│   └── api
│       └── [[route]].ts
├── package.json
├── pages
│   └── index.html
├── src
└── tsconfig.json
```

## 2. Hello World

You can make the API whose path is `/api/hello` by editing `functions/api/[[route]].ts`

```ts
import { Hono } from 'hono'
import { handle } from 'hono/cloudflare-pages'

const app = new Hono()

app.get('/hello', (c) => {
  return c.json({
    message: 'Hello, Cloudflare Pages!',
  })
})

export const onRequest = handle(app, '/api')
```

## 3. Run

Run the development server locally. Then, access `http://localhost:8788` in your Web browser.

```
npm run dev
```

`/api/hello` just returns JSON, but this can be leveraged to create a full-stack application with APIs and user-interfaces.

## 4. Deploy

If you have a Cloudflare account, you can deploy to Cloudflare.

```
npm run deploy
```
