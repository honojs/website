# Bun

Bun is another JavaScript runtime. It's not Node.js or Deno. Bun includes a trans compiler, so we can write the code with TypeScript.

Hono also works on Bun. Some middleware does not work with Bun, so please keep it in mind.

## 1. Install Bun

### `bun` command

To install `bun` command, follow the instruction in [the official web site](https://bun.sh).

### `bun add`

Make the project directory, move into it, and run `bun add` command to install Hono from npm registry.

```
bun add hono
```

## 2. Setup

A starter for Bun is available. Start your project with "create-hono" command.

```
npm create hono@latest my-app
```

Move into my-app and install the dependencies.

```
cd my-app
bun install
```

## 3. Hello World

"Hello World" script is below. Almost the same as writing on other platforms.

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default {
  port: 3000,
  fetch: app.fetch,
}
```

## 4. Run

Run the command.

```ts
bun run --hot index.ts
```

Then, access `http://localhost:3000` in your browser.

## Serve static files

To server static files, use `serveStatic` imported from `hono/bun`.

```ts
import { serveStatic } from 'hono/bun'

const app = new Hono()

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './favicon.ico' }))
app.get('/', (c) => c.text('You can access: /static/hello.txt'))
app.get('*', serveStatic({ path: './static/fallback.txt' }))
```

For the above code, it will work well with the following directory structure.

```
./
├── favicon.ico
├── index.ts
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

## Testing

You can use `bun:test` for testing on Bun.

```ts
import { describe, expect, it } from 'bun:test'
import app from '.'

describe('My first test', () => {
  it('Should return 200 Response', async () => {
    const req = new Request('http://localhost/')
    const res = await app.fetch(req)
    expect(res.status).toBe(200)
  })
})
```

Then, run the command.

```
bun wiptest index.test.ts
```

::: warning
"_wiptest_" command is a still WIP. "_test_" command that is not a WIP might be released.
:::

## JSX Middleware

JSX Middleware works on Bun. It does not depend `React`, so you can use JSX without installing React.
To use it, set up `tsconfig.json` like below:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxFragmentFactory": "Fragment",
    "jsxImportSource": "hono/jsx"
  }
}
```
