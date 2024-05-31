# Bun

[Bun](https://bun.sh) is another JavaScript runtime. It's not Node.js or Deno. Bun includes a trans compiler, we can write the code with TypeScript.
Hono also works on Bun.

## 1. Install Bun

To install `bun` command, follow the instruction in [the official web site](https://bun.sh).

## 2. Setup

A starter for Bun is available. Start your project with "bun create" command.
Select `bun` template for this example.

```sh
bun create hono my-app
```

Move into my-app and install the dependencies.

```sh
cd my-app
bun install
```

## 3. Hello World

"Hello World" script is below. Almost the same as writing on other platforms.

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app
```

## 4. Run

Run the command.

```sh
bun run dev
```

Then, access `http://localhost:3000` in your browser.

## Change port number

You can specify the port number with exporting the `port`.

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello Bun!'))

export default app // [!code --]
export default { // [!code ++]
  port: 3000, // [!code ++]
  fetch: app.fetch, // [!code ++]
} // [!code ++]
```

## Serve static files

To serve static files, use `serveStatic` imported from `hono/bun`.

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
├── src
└── static
    ├── demo
    │   └── index.html
    ├── fallback.txt
    ├── hello.txt
    └── images
        └── dinotocat.png
```

### `rewriteRequestPath`

If you want to map `http://localhost:3000/static/*` to `./statics`, you can use the `rewriteRequestPath` option:

```ts
app.get(
  '/static/*',
  serveStatic({
    root: './',
    rewriteRequestPath: (path) => path.replace(/^\/static/, '/statics'),
  })
)
```

### `mimes`

You can add MIME types with `mimes`:

```ts
app.get(
  '/static/*',
  serveStatic({
    mimes: {
      m3u8: 'application/vnd.apple.mpegurl',
      ts: 'video/mp2t',
    }
  })
)
```

### `onNotFound`

You can specify handling when the requested file is not found with `onNotFound`:

```ts
app.get(
  '/static/*',
  serveStatic({
    onNotFound: (path, c) => {
      console.log(`${path} is not found, you access ${c.req.path}`)
    },
  })
)
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

```sh
bun test index.test.ts
```
