# Cloudflare Testing

You can implement the cloudflare testing easily with `@cloudflare/vitest-pool-workers` for which some configuration has to be made priorly more on that can be found over in [cloudflare docs about testing](https://developers.cloudflare.com/workers/testing/vitest-integration/get-started/write-your-first-test/)

Cloudflare Testing with vitest pool workers provide a `cloudflare:test` module at runtime which exposes the env passed in as the second argument during testing more on it in the [Cloudflare Test APIs section](https://developers.cloudflare.com/workers/testing/vitest-integration/test-apis/)

Below is an example of the configuration one can make
:::code-group

```ts [vitest.config.ts]
import { defineWorkersProject } from '@cloudflare/vitest-pool-workers/config'

export default defineWorkersProject(() => {
  const migrationsPath = path.join(__dirname, 'path/to/migrations') // path to migrations directory
  const migrations = await readD1Migrations(migrationsPath)
  return {
    test: {
      setup: ["path/to/file/apply_migrations.ts"]
      globals: true,
      poolOptions: {
        workers: {
          singleWorker: true,
          isolatedStorage: false,
          miniflare: {
            // This is where you add your wrangler.toml configurations
            compatibilityDate: '2024-04-01',
            d1Databases: ['DB'],
            bindings: {
              SECRET: 'any-secret',
              MIGRATIONS: migrations,
             },
          },
        },
      },
    },
  }
})
```

```ts [apply_migrations.ts]
// Add this file in the setup array so that is runs before any of your tests
import { applyD1Migrations, env } from 'cloudflare:test'

await applyD1Migrations(env.DB, env.MIGRATIONS)
```

```ts [env.d.ts]
declare module 'cloudflare:test' {
  interface ProvidedEnv {
    DB: D1Database
    SECRET: string
    MIGRATIONS: D1Migrations[]
  }
}
```

:::

Once all is set up the application can be easily tested by using the testClient and passing in the `env` exposed from the module `cloudflare:test`

```ts
import { env } from 'cloudflare:test'
import { testClient } from 'hono/testing'

it('test', async () => {
  const app = new Hono().get('/search', (c) =>
    c.json({ hello: 'world' })
  )
  const res = await testClient(app, env).search.$get()

  expect(await res.json()).toEqual({ hello: 'world' })
})
```

## See Also

`@cloudflare/vitest-pool-workers` [Github Repository examples](https://github.com/cloudflare/workers-sdk/tree/main/fixtures/vitest-pool-workers-examples)
