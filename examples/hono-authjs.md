# Hono AuthJS Integration

This guide shows you how to add authentication to your Hono applications using Auth.js (formerly NextAuth.js). Perfect for VitePress and other web applications!

> ⚠️ **Important**: The `@hono/auth-js @auth/core` package currently **only supports React** for client-side integration.

## Quick Start

Get authentication running in 5 minutes:
1. **Install** → `npm install @hono/auth-js @auth/core`
2. **Set environment variables** → Copy the `.env` example below
3. **Create database tables** → Run the schema migration
4. **Add auth routes** → Copy the basic Hono setup
5. **Test it** → Use the provided client example

That's it! 🎉

## Installation

Install the required package:

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

> 💡 **Pro Tip**: Generate a strong `AUTH_SECRET` using `openssl rand -base64 32` or use the npm package by authjs `npx auth secret` this will automatically generate a secret and add it into the env

### Step 2: Database Setup

> 📝 **Note**: You can copy the latest schema from the [Auth.js documentation](https://authjs.dev/getting-started/adapters/drizzle)

Here's the complete schema for **SQLite with Drizzle ORM**:
::: code-group
```ts [db.ts]
import { createClient } from "@libsql/client"
import { drizzle } from "drizzle-orm/libsql"

const client = createClient({
  url: "DATABASE_URL",
  authToken: "DATABASE_AUTH_TOKEN",
})
export const db = drizzle(client)
```

```ts [schema.ts]
import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core"
import type { AdapterAccountType } from "next-auth/adapters"

export const users = sqliteTable("user", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
  image: text("image"),
})

export const accounts = sqliteTable("account", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").$type<AdapterAccountType>().notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}))

export const sessions = sqliteTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
})

export const verificationTokens = sqliteTable("verificationToken", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
}, (verificationToken) => ({
  compositePk: primaryKey({ columns: [verificationToken.identifier, verificationToken.token] }),
}))

export const authenticators = sqliteTable("authenticator", {
  credentialID: text("credentialID").notNull().unique(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  providerAccountId: text("providerAccountId").notNull(),
  credentialPublicKey: text("credentialPublicKey").notNull(),
  counter: integer("counter").notNull(),
  credentialDeviceType: text("credentialDeviceType").notNull(),
  credentialBackedUp: integer("credentialBackedUp", { mode: "boolean" }).notNull(),
  transports: text("transports"),
}, (authenticator) => ({
  compositePK: primaryKey({ columns: [authenticator.userId, authenticator.credentialID] }),
}))
```
:::

## Basic Usage

### Route Setup

Create an API route at `/api/v1` or any custom route you'd like in your Hono application:

```typescript
import { Hono } from 'hono'
import {
  initAuthConfig,
  verifyAuth,
  authHandler,
  DrizzleAdapter
} from '@hono/auth-js'
import { GitHub, Google, Credentials } from '@auth/core/providers'
import { db } from './db' // Your database instance
import {
  users,
  accounts,
  authenticators,
  sessions,
  verificationTokens
} from './schema' // Your database schema
import { tryPromise, comparePassword } from './utils' // Your utility functions

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
      session: {
        strategy: 'jwt',
      },
      callbacks: {
        async jwt({ token, trigger }) {
          if (trigger === 'signUp') {
            // New User can be done something
          }
          return token
        },
        async session({ session }) {
          return session
        },
      },
    }))
  )
  .use('*', verifyAuth())
  .use('/auth/*', authHandler())

const app = new Hono().route("/api/v1", v1Router)

export default app
```

## Usage Examples

### Protecting Routes

```typescript
// Protected route example
app.get('/protected', async (c) => {
  const auth = c.get('authUser')

  if (!auth) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  return c.json(auth)
})
```

### Client-side Integration

For client-side authentication, you can use the Auth.js client:

```tsx
import { SessionProvider, authConfigManager, useSession, signIn, signUp } from "@hono/auth-js/react";

authConfigManager.setConfig({
  basePath: "/api/v1/auth", // if you picked a different based path then use that instead of /api/v1
});

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <SessionProvider>
        <App />
      </SessionProvider>
    </StrictMode>
  );
}

function App () {
  const { data: session, status } = useSession()

  return (
    <div>
      <div>
        {
          session?.user 
          ? `Hello ${session?.user.name}` 
          : `Please Signin`
        }
      </div>
      {
        !!session
        ? null 
        : <button 
            onClick={() => signIn("github")}
          >
            Sign in with Github
          <button>
      }
    </div>
  )
}
```

### API Routes

The following API routes will be automatically created:

- `GET /api/auth/providers` - Get available providers
- `POST /api/auth/signin/:provider` - Sign in with a provider
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get current session
- `GET /api/auth/csrf` - Get CSRF token

## Configuration Options

### Adapter

The `DrizzleAdapter` requires your database instance and table schemas:

```typescript
adapter: DrizzleAdapter(c.get('db'), {
  usersTable: users,
  accountsTable: accounts,
  authenticatorsTable: authenticators,
  sessionsTable: sessions,
  verificationTokensTable: verificationTokens,
})
```

### Providers

You can configure multiple authentication providers:

```typescript
providers: [
  GitHub({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
  Google({
    clientId: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
  }),
  // Add more providers as needed
]
```

### Session Strategy

Choose between JWT and database sessions:

```typescript
session: {
  strategy: 'jwt', // or 'database'
}
```

### Callbacks

Use callbacks to customize the authentication flow:

```typescript
callbacks: {
  async jwt({ token, trigger }) {
    if (trigger === 'signUp') {
      // Handle new user signup
    }
    return token
  },
  async session({ session }) {
    // Customize session object
    return session
  },
}
```

## Error Handling

The integration includes built-in error handling for common authentication scenarios:

- Invalid credentials
- User not found
- Email verification required
- Password authentication errors

## Security Considerations

1. Always use HTTPS in production
2. Store sensitive environment variables securely
3. Use strong, unique `AUTH_SECRET`
4. Validate and sanitize user inputs
5. Implement proper session management
6. Use secure session cookies

## Deployment Considerations

> ⚠️ **Important for Production**: This setup requires careful configuration for deployment.

### Development (Vite Proxy)
During development with Vite, you can use proxy configuration to avoid CORS issues:

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // Your Hono server
        changeOrigin: true
      }
    }
  }
})
```

### Production Deployment
For production, you'll need to configure your web server (nginx, Apache, etc.) to serve both your frontend and Hono API from the **same domain** to avoid CORS issues:

```nginx
# nginx.conf example
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;  # Your frontend server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api/ {
        proxy_pass http://localhost:3001/api;  # Your Hono server
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

This ensures both your frontend and API are served from the same origin, which is required for authentication cookies to work properly.

### Cloudflare Workers/Pages Deployment

For **Cloudflare Workers/Pages** deployment, see the comprehensive [Cloudflare Pages Getting Started Guide](/docs/getting-started/cloudflare-pages) for detailed setup instructions.

> ⚠️ **Critical OAuth Requirement**: OAuth authentication requires the entire flow to happen on the same domain. For Cloudflare Pages, use **Pages Functions** to serve both your React app and API from the same domain (`yoursite.pages.dev`).

**Quick Cloudflare Setup:**
1. Use the [Cloudflare Pages template](https://hono.dev/docs/getting-started/cloudflare-pages) for your project
2. Deploy your Hono API as **Pages Functions** (`functions/api/[[route]].ts`)
3. Set environment variables as **secrets** via Wrangler CLI
4. Use **JWT session strategy** for better serverless performance

**Example Pages Functions Structure:**
```
functions/
├── api/
│   └── [[route]].ts    # Your Hono auth API
└── _middleware.ts       # Optional middleware
public/                  # Your React app build files
```

This setup ensures OAuth redirects work properly since everything runs on the same domain. For complete deployment instructions, refer to the [Cloudflare Pages documentation](/docs/getting-started/cloudflare-pages).

## Next Steps

- Explore additional Auth.js providers
- Implement custom credential providers
- Add email verification workflows
- Set up password reset functionality
- Configure role-based access control

For more information, check out the [Auth.js documentation](https://authjs.dev/).
