---
title: 'Bun'
weight: 300
---

# Bun

Bun is another JavaScript runtime. It's not Node.js or Deno. Bun includes a trans compiler, so we can write the code with TypeScript.

Hono also works on Bun. Some middleware does not work with Bun, so please keep it in mind.

## 1. Install

### `bun` command

To install `bun` command, follow the instruction in [the official web site](https://bun.sh).

### `bun add`

Make the project directory, move into it, and run `bun add` command to install Hono from npm registry.

```
bun add hono
```

## 2. Hello World

"Hello World" script is below. Almost the same as writing on other platforms.

```ts
import { Hono } from 'hono'

const app = new Hono()
app.get('/', (c) => c.text('Hello! Hono!'))

export default {
  port: 3000,
  fetch: app.fetch,
}
```

## 3. Run

Run the command.

```ts
bun run index.ts
```

Then, access `http://localhost:3000` in your browser.

## `bun create`

You can also make a skelton project of Hono by the command below:

```
bun create hono ./my-app
cd my-app
bun run start
```

## Advanced

### Testing

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

{{< hint warning >}}
"_wiptest_" command is a still WIP. "_test_" command that is not a WIP might be released.
{{< /hint >}}

### JSX Middleware

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
