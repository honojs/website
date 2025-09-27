# Hono Auth.js Integration

This guide shows you how to add authentication to your Hono applications using **Auth.js** (formerly NextAuth.js).

> [!IMPORTANT]
> The `@hono/auth-js` package currently **only supports React** for client-side integration.

## Quick Start

Get authentication running in 5 minutes:

1. **Install** → `npm install @hono/auth-js @auth/core`
2. **Set environment variables** → Copy the `.env` example below
3. **Create database tables** → Run the schema migration
4. **Add auth routes** → Copy the Hono setup
5. **Test it** → Use the client example

## Installation

```bash
npm install hono @hono/auth-js @auth/core
```

## Setup

### Step 1: Environment Variables

Create a `.env` file in your project root:

```properties
AUTH_SECRET=your-auth-secret-here
GITHUB_ID=your-github-client-id
GITHUB_SECRET=your-github-client-secret
GOOGLE_ID=your-google-client-id
GOOGLE_SECRET=your-google-client-secret
```

> [!TIP]
> Generate a strong `AUTH_SECRET` with:
> `openssl rand -base64 32`
> or use: `npx auth secret`

### Step 2: Database Setup

> [!NOTE]
> Copy the latest schema from the [Auth.js Drizzle adapter docs](https://authjs.dev/getting-started/adapters/drizzle).

Here's a schema for **SQLite with Drizzle ORM**:

::: code-group

```ts [db.ts]
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const client = createClient({
  url: 'DATABASE_URL',
  authToken: 'DATABASE_AUTH_TOKEN',
})
export const db = drizzle(client)
```

```ts [schema.ts]
import {
  integer,
  sqliteTable,
  text,
  primaryKey,
} from 'drizzle-orm/sqlite-core'
import type { AdapterAccountType } from 'next-auth/adapters'

export const users = sqliteTable('user', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name'),
  email: text('email').unique(),
  emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
  image: text('image'),
})

export const accounts = sqliteTable(
  'account',
  {
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: text('type').$type<AdapterAccountType>().notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refresh_token: text('refresh_token'),
    access_token: text('access_token'),
    expires_at: integer('expires_at'),
    token_type: text('token_type'),
    scope: text('scope'),
    id_token: text('id_token'),
    session_state: text('session_state'),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)

export const sessions = sqliteTable('session', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
})

export const verificationTokens = sqliteTable(
  'verificationToken',
  {
    identifier: text('identifier').notNull(),
    token: text('token').notNull(),
    expires: integer('expires', { mode: 'timestamp_ms' }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [
        verificationToken.identifier,
        verificationToken.token,
      ],
    }),
  })
)

export const authenticators = sqliteTable(
  'authenticator',
  {
    credentialID: text('credentialID').notNull().unique(),
    userId: text('userId')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    providerAccountId: text('providerAccountId').notNull(),
    credentialPublicKey: text('credentialPublicKey').notNull(),
    counter: integer('counter').notNull(),
    credentialDeviceType: text('credentialDeviceType').notNull(),
    credentialBackedUp: integer('credentialBackedUp', {
      mode: 'boolean',
    }).notNull(),
    transports: text('transports'),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)
```

:::

## Basic Usage

### Route Setup

Create an API route in your Hono application:

```ts
import { Hono } from 'hono'
import {
  initAuthConfig,
  verifyAuth,
  authHandler,
  DrizzleAdapter,
} from '@hono/auth-js'
import { GitHub, Google } from '@auth/core/providers'
import { db } from './db'
import {
  users,
  accounts,
  authenticators,
  sessions,
  verificationTokens,
} from './schema'

const v1Router = new Hono()
  .use(
    '*',
    initAuthConfig((c) => ({
      adapter: DrizzleAdapter(c.get('db'), {
        usersTable: users,
        accountsTable: accounts,
        authenticatorsTable: authenticators,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
      }),
      secret: c.env.AUTH_SECRET,
      providers: [
        GitHub({
          clientId: c.env.GITHUB_ID,
          clientSecret: c.env.GITHUB_SECRET,
        }),
        Google({
          clientId: c.env.GOOGLE_ID,
          clientSecret: c.env.GOOGLE_SECRET,
        }),
      ],
      session: { strategy: 'jwt' },
    }))
  )
  .use('*', verifyAuth())
  .use('/auth/*', authHandler())

const app = new Hono().route('/api/v1', v1Router)
export default app
```

## Usage Examples

### Protecting Routes

```ts
app.get('/protected', (c) => {
  const auth = c.get('authUser')
  if (!auth) return c.json({ error: 'Unauthorized' }, 401)
  return c.json(auth)
})
```

### Client-side Integration (React)

```tsx
import {
  SessionProvider,
  useSession,
  signIn,
} from '@hono/auth-js/react'

function App() {
  const { data: session } = useSession()
  return session ? (
    <p>Hello {session.user?.name}</p>
  ) : (
    <button onClick={() => signIn('github')}>
      Sign in with GitHub
    </button>
  )
}

export default function Root() {
  return (
    <SessionProvider>
      <App />
    </SessionProvider>
  )
}
```

## Configuration Reference

Customize Auth.js in your Hono app with:

- **Adapter** → Connects to your database (Drizzle shown above)
- **Providers** → GitHub, Google, or any Auth.js provider
- **Session** → `"jwt"` (stateless) or `"database"` (persistent)
- **Callbacks** → Hook into sign-in or session events

Example:

```ts
initAuthConfig((c) => ({
  adapter: DrizzleAdapter(c.get('db'), {
    /* tables */
  }),
  secret: c.env.AUTH_SECRET,
  providers: [
    GitHub({
      clientId: c.env.GITHUB_ID,
      clientSecret: c.env.GITHUB_SECRET,
    }),
    Google({
      clientId: c.env.GOOGLE_ID,
      clientSecret: c.env.GOOGLE_SECRET,
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async session({ session }) {
      return session
    },
  },
}))
```

## Learn More

- [Auth.js Docs](https://authjs.dev/) – providers, schema reference
- [Hono Docs](https://hono.dev/) – routing & middleware patterns
- Recipes: role-based access, password reset, email verification
