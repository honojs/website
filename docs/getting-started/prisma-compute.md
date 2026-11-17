# Prisma Compute

[Prisma Compute](https://www.prisma.io/compute) is a hosting platform for TypeScript applications. It runs your application on [Bun](https://bun.com), so a Hono application written for Bun works there without an adapter.

You describe the application in TypeScript with [Prisma Composer](https://www.prisma.io/docs/composer), and the Prisma CLI deploys what you describe.

This guide assumes you have Bun and Node.js 22.18 or later installed, because the Prisma CLI runs on Node.js. You also need a [Prisma account](https://console.prisma.io) to deploy.

## 1. Setup

Start your project with "create-hono" command. Select `bun` template for this example.

```sh
bun create hono@latest my-app
```

Move into `my-app` and install the Composer packages and the Prisma CLI.

```sh
cd my-app
bun add @prisma/composer @prisma/composer-prisma-cloud
bun add -d prisma
```

Composer loads your files as ES modules and deploys a single built file, so set `type` to `module` and add a `build` script to `package.json`.

```json
{
  "type": "module",
  "scripts": {
    "dev": "bun run --hot src/index.ts",
    "build": "bun build src/index.ts --target=bun --outfile dist/server.mjs"
  }
}
```

Replace the `compilerOptions` in `tsconfig.json` so that TypeScript resolves the Composer packages and accepts imports that end in `.ts`.

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "Preserve",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["bun"],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

## 2. Hello World

A Composer application is your server code plus three small files that declare it.

`src/service.ts` names the service and points to the built file:

```ts
import node from '@prisma/composer/node'
import { compute } from '@prisma/composer-prisma-cloud'

export default compute({
  name: 'api',
  deps: {},
  build: node({
    module: import.meta.url,
    entry: '../dist/server.mjs',
  }),
})
```

`module.ts` in the project root is the application itself. Its name becomes the project name on Prisma Compute:

```ts
import { module } from '@prisma/composer'
import apiService from './src/service.ts'

export default module('my-app', ({ provision }) => {
  provision(apiService)
})
```

`prisma.config.ts` in the project root is the deploy configuration. The `region` is where the first deploy creates the project:

```ts
import { defineConfig as composer } from '@prisma/composer/config'
import { nodeBuild } from '@prisma/composer/node/control'
import {
  prismaCloud,
  prismaState,
} from '@prisma/composer-prisma-cloud/control'
import { definePrismaConfig } from 'prisma/config'

export default definePrismaConfig({
  composer: composer({
    entry: './module.ts',
    extensions: [
      prismaCloud({ region: 'eu-central-1' }),
      nodeBuild(),
    ],
    state: prismaState(),
  }),
})
```

Then edit `src/index.ts`. Start the server with `Bun.serve` instead of `export default app`, read the port from `service.port()`, and listen on `0.0.0.0` so that Prisma Compute can reach it:

```ts
import { Hono } from 'hono'
import service from './service.ts'

const app = new Hono()

app.get('/', (c) => {
  return c.text('Hello Prisma Compute!')
})

Bun.serve({
  port: service.port(),
  hostname: '0.0.0.0',
  fetch: app.fetch,
})
```

## 3. Run

Run the development server locally. Then, access `http://localhost:3000` in your Web browser.

```sh
bun run dev
```

## 4. Deploy

Sign in to your Prisma account. This command opens your browser.

```sh
npx prisma auth login
```

The `deploy` command does not build the application for you, so build it first and then deploy.

```sh
bun run build
npx prisma deploy
```

The command prints the public URL of the service when it finishes.

```txt
my-app
└─ api   compute-service cps_xxxxxxxxxxxxxxxxxxxxxxxx
         https://xxxxxxxxxxxxxxxxxxxxxxxx.fra.prisma.build
```

The build and the CLI write generated files to `dist`, `.prisma-composer` and `.alchemy`, so add these directories to `.gitignore`.

## Database

A service can declare a [Prisma Postgres](https://www.prisma.io/postgres) database as a dependency. The deploy then creates the database and passes the connection string to the service, so you do not set any environment variables.

Add the dependency in `src/service.ts`:

```ts
import node from '@prisma/composer/node'
import { compute, rawPostgres } from '@prisma/composer-prisma-cloud'

export default compute({
  name: 'api',
  deps: { db: rawPostgres() },
  build: node({
    module: import.meta.url,
    entry: '../dist/server.mjs',
  }),
})
```

Provision the database in `module.ts` and pass it to the service:

```ts
import { module } from '@prisma/composer'
import { rawPostgres } from '@prisma/composer-prisma-cloud'
import apiService from './src/service.ts'

export default module('my-app', ({ provision }) => {
  const db = provision(rawPostgres({ name: 'database' }))
  provision(apiService, { deps: { db } })
})
```

`service.load()` returns the connection string as `db.url`, which you can give to any PostgreSQL client. This example uses the `SQL` client built into Bun:

```ts
import { SQL } from 'bun'
import { Hono } from 'hono'
import service from './service.ts'

const { db } = service.load()

const app = new Hono()

app.get('/now', async (c) => {
  const sql = new SQL({ url: db.url, max: 1, prepare: false })
  try {
    const [row] = await sql`select now() as now`
    return c.json(row)
  } finally {
    await sql.close()
  }
})

Bun.serve({
  port: service.port(),
  hostname: '0.0.0.0',
  fetch: app.fetch,
})
```

Prisma Compute suspends a service that receives no requests, and a database connection that was open at that point is no longer usable when the service resumes. The example therefore opens a connection for each request and closes it afterwards, instead of keeping a pool for the lifetime of the process.

A service with a database dependency needs Composer to supply the connection string, so run it locally with `prisma dev` instead of `bun run dev`. It starts a local PostgreSQL database and prints the local URL of the service.

```sh
bun run build
npx prisma dev
```

Build and deploy again to create the database on Prisma Compute.

To use Prisma ORM with Hono, see the [Prisma example](/examples/prisma).
