# Cloudflare Testing

You can test Cloudflare Workers applications with `@cloudflare/vitest-plugin`, which runs your tests inside the Workers runtime. For setup details, see [Write your first test](https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/) in the Cloudflare docs.

Inside the tests, `import { env } from 'cloudflare:workers'` gives you the bindings defined in your Wrangler configuration. The `cloudflare:test` module provides helpers such as `createExecutionContext()`; see the [Cloudflare Test APIs section](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/).

Below is an example of the configuration one can make:

:::code-group

```ts [vitest.config.ts]
import { cloudflareTest } from '@cloudflare/vitest-plugin'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
    }),
  ],
})
```

```jsonc [wrangler.jsonc]
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "my-app",
  "main": "src/index.ts",
  "compatibility_date": "2024-09-09",
  "compatibility_flags": ["nodejs_compat"],
  "vars": {
    "MY_VAR": "my variable",
  },
}
```

:::

Imagine the application like the following:

```ts
// src/index.ts
import { Hono } from 'hono'

type Bindings = {
  MY_VAR: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/hello', (c) => {
  return c.json({ hello: 'world', var: c.env.MY_VAR })
})

export default app
```

You can test the application with Cloudflare Bindings by passing the `env` from `cloudflare:workers` to `app.request()`:

```ts
// src/index.test.ts
import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vitest'
import app from './index'

describe('Example', () => {
  it('Should return 200 response', async () => {
    const res = await app.request('/hello', {}, env)

    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({
      hello: 'world',
      var: 'my variable',
    })
  })
})
```

For TypeScript support of the `cloudflare:workers` and `cloudflare:test` modules, see [Define types](https://developers.cloudflare.com/workers/testing/vitest-integration/write-your-first-test/#define-types) in the Cloudflare docs.

## See Also

`@cloudflare/vitest-plugin` [GitHub repository examples](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-plugin-examples)\
[Migrate from `@cloudflare/vitest-pool-workers`](https://developers.cloudflare.com/workers/testing/vitest-integration/migration-guides/migrate-to-vitest-plugin/)\
[Migrate from Vitest 3 to Vitest 4](https://developers.cloudflare.com/workers/testing/vitest-integration/migration-guides/migrate-from-vitest-3-to-vitest-4/)
