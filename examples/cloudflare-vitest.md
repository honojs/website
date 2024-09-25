# Cloudflare Testing

You can implement the Cloudflare testing easily with `@cloudflare/vitest-pool-workers` for which some configuration has to be made priorly more on that can be found over in [Cloudflare Docs about testing](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test/).

Cloudflare Testing with vitest pool workers provide a `cloudflare:test` module at runtime which exposes the env passed in as the second argument during testing more on it in the [Cloudflare Test APIs section](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/).

Below is an example of the configuration one can make:

:::code-group

```ts [vitest.config.ts]
import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersProject(() => {
  return {
    test: {
      globals: true,
      poolOptions: {
        workers: { wrangler: { configPath: './wrangler.toml' } },
      },
    },
  }
})
```

```toml [wrangler.toml]
compatibility_date = "2024-09-09"
compatibility_flags = [ "nodejs_compat" ]

[vars]
MY_VAR = "my variable"
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

You can test the application with Cloudflare Bindings by passing in the `env` exposed from the module `cloudflare:test` to `app.request()`:

```ts
// src/index.test.ts
import { env } from 'cloudflare:test'
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

## See Also

`@cloudflare/vitest-pool-workers` [Github Repository examples](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples)\
[Migrate from old testing system](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/migrate-from-miniflare-2/)
