# Stytch Auth with Hono

This example shows how to set up a full-stack application with Stytch Frontend SDKs and Hono backend on Cloudflare
Workers with `vite` and `react`.

A complete example application using these principles can be
found [here](https://github.com/honojs/examples/tree/main/stytch-auth).

## Installation

::: code-group

```sh [npm]
# Backend
npm install @hono/stytch-auth stytch

# Frontend
npm install @stytch/react @stytch/vanilla-js
```

```sh [yarn]
# Backend
yarn add @hono/stytch-auth stytch

# Frontend
yarn add @stytch/react @stytch/vanilla-js
```

```sh [pnpm]
# Backend
pnpm add @hono/stytch-auth stytch

# Frontend
pnpm add @stytch/react @stytch/vanilla-js
```

```sh [bun]
# Backend
bun add @hono/stytch-auth stytch

# Frontend
bun add @stytch/react @stytch/vanilla-js
```

:::

## Setup

1. Create a [Stytch](https://stytch.com/?utm_source=hono&utm_medium=website&utm_campaign=workers) account and select
   **Consumer Authentication**.
2. Enable the **Frontend SDK** in [Configuration](https://stytch.com/dashboard/sdk-configuration).
3. Get your credentials from [Project Settings](https://stytch.com/dashboard).

## Environment Variables

Backend Workers env vars go in `.dev.vars`. Frontend Vite env vars go in `.env.local`.

::: code-group

```Plain Text[.dev.vars]
STYTCH_PROJECT_ID=project-live-xxx
STYTCH_PROJECT_SECRET=secret-live-xxx
```

```Plain Text[.env.local]
VITE_STYTCH_PUBLIC_TOKEN=public-token-live-xxx
```

:::

## Frontend

1. Wrap your application with the `<StytchProvider />` component and pass it an instance of the Stytch UI Client.
2. Use the `<StytchLogin />` component to log the user in. See
   the [Component Playground](https://stytch.com/docs/sdks/component-playground) for examples of different
   authentication methods and style customizations available.
3. After the user is logged in, the `useStytchUser()` hook can be used to retrieve the active user data.
4. The user's session information will automatically be stored as a cookie and made available to your backend.

::: code-group

```tsx[App.tsx]
import React from 'react'
import {StytchUIClient} from '@stytch/vanilla-js';
import {StytchProvider, useStytchUser} from '@stytch/react';
import LoginPage from './LoginPage'
import Dashboard from './Dashboard'

const stytch = new StytchUIClient(import.meta.env.VITE_STYTCH_PUBLIC_TOKEN ?? '');

function AppContent() {
  const { user, isInitialized } = useStytchUser()

  if (!isInitialized) return <div>Loading...</div>
  return user ? <Dashboard /> : <LoginPage />
}

function App() {
  return (
    <StytchProvider stytch={stytch}>
      <AppContent />
    </StytchProvider>
  )
}

export default App
```

```tsx[LoginPage.tsx]
import React from 'react'
import { StytchLogin } from '@stytch/react'
import { Products, OTPMethods } from '@stytch/vanilla-js'

const loginConfig = {
  products: [Products.otp],
  otpOptions: {
    expirationMinutes: 10,
    methods: [OTPMethods.Email],
  },
}

const LoginPage = () => {
  return <StytchLogin config={loginConfig} />
}

export default LoginPage
```

```tsx[Dashboard.tsx]
import React from 'react'
import { useStytchUser, useStytch } from '@stytch/react'

const Dashboard = () => {
  const { user } = useStytchUser()
  const stytchClient = useStytch()

  const handleLogout = () => stytchClient.session.revoke()

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <p>Welcome, {user.emails[0]?.email}!</p>
    </div>
  )
}

export default Dashboard
```

:::

## Backend

1. Wrap protected endpoints with a `Consumer.authenticateSessionLocal()` middleware to authenticate the Stytch session
   JWT.
2. Use the `Consumer.getStytchSession(c)` method to retrieve the Stytch session information within a route.
3. Routes that require the full user object can use the `Consumer.authenticateSessionRemote()` method to perform a
   network call to Stytch servers.

```ts[src/index.ts]
import { Hono } from 'hono'
import { Consumer } from '@hono/stytch-auth'

const app = new Hono()

// Public route
app.get('/health', (c) => c.json({ status: 'ok' }))

// Protected route with local authentication (very fast)
app.get('/api/local', Consumer.authenticateSessionLocal(), (c) => {
  const session = Consumer.getStytchSession(c)
  return c.json({
    message: 'Protected data',
    sessionId: session.session_id,
  })
})

// Protected route with remote authentication & full user data
app.get('/api/remote', Consumer.authenticateSessionRemote(), (c) => {
  const session = Consumer.getStytchSession(c)
  const user = Consumer.getStytchUser(c)
  return c.json({
    message: 'Protected data',
    sessionId: session.session_id,
    firstName: user.name.first_name,
  })
})

export default app
```

## Next Steps

Additional documentation and resources:

- Check out the [Stytch Auth Hono Example App](https://github.com/honojs/examples/tree/main/stytch-auth).
- Getting Started guide for the [Stytch JS SDK](https://stytch.com/docs/sdks/installation).
- Complete documentation for the [@hono/stytch-auth package](https://www.npmjs.com/package/@hono/stytch-auth).

Interested in Enterprise B2B features like Organization Management, RBAC, and SSO? See
the [Stytch B2B Authentication](https://stytch.com/docs/getting-started/b2b-vs-consumer-auth) product line.

Join the discussion, ask questions, and suggest new features in
the [Stytch Slack Community](https://stytch.com/docs/resources/support/overview).
