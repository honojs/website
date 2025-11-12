# Monitoring Hono APIs with Apitally

[Apitally](https://apitally.io/hono) is a simple API monitoring and analytics tool for REST APIs. It integrates with Hono via a lightweight middleware and provides clean, intuitive dashboards with metrics, logs, and alerts out of the box.

With Apitally, you can:

- Monitor API usage, performance, and errors
- Track API adoption by individual consumers
- Log and inspect requests and responses
- Capture application logs, correlated with requests
- Set up uptime monitoring and custom alerts

> [!IMPORTANT]
> Apitally currently doesn't work on serverless platforms like AWS Lambda or Cloudflare Workers.

## Installation

Install the [Apitally SDK](https://www.npmjs.com/package/apitally) in your project:

```bash
# npm
npm install apitally

# yarn
yarn add apitally

# pnpm
pnpm add apitally

# bun
bun add apitally
```

## Setup

First, create an app in the [Apitally dashboard](https://app.apitally.io) to get your client ID. Then add the middleware to your Hono application using the `useApitally` function:

```ts
import { Hono } from 'hono'
import { useApitally } from 'apitally/hono'

const app = new Hono()

useApitally(app, {
  clientId: 'your-client-id', // Get this from the Apitally dashboard
  env: 'dev', // or "prod", etc.

  // Optional: Enable and configure request logging
  requestLogging: {
    enabled: true,
    logRequestHeaders: true,
    logRequestBody: true,
    logResponseBody: true,
    captureLogs: true,
  },
})

// Add your routes after the middleware
app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

Add the Apitally middleware before any other middleware to ensure it wraps the entire application stack.

## Identify consumers

To track API usage by individual consumers, use the `setConsumer` function to associate requests with consumer identifiers. This is typically done in a middleware after authentication. You can also provide an optional display name and consumer group.

```ts
import { setConsumer } from 'apitally/hono'

app.use(async (c, next) => {
  const payload = c.get('jwtPayload')
  if (payload) {
    setConsumer(c, {
      identifier: payload.sub,
      name: payload.name, // optional
      group: payload.group, // optional
    })
  }
  await next()
})
```

The Consumers dashboard in Apitally will now show all consumers and you can filter logs and metrics by consumer.

## See also

- [Apitally](https://apitally.io/hono) - Official website
- [Apitally SDK](https://github.com/apitally/apitally-js) - GitHub repository
- [Apitally documentation](https://docs.apitally.io/frameworks/hono) - Complete setup guide
