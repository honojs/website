# Monitoring Hono APIs with Apitally

[Apitally](https://apitally.io/hono) is a simple API monitoring and analytics tool for REST APIs. It integrates with Hono via a lightweight middleware and provides clean, intuitive dashboards with metrics, logs, and alerts out of the box.

With Apitally, you can:

- Monitor API usage, performance, and errors
- Track API adoption by individual consumers
- Log and inspect API requests and responses
- Capture application logs and traces, correlated with requests
- Set up uptime monitoring and custom alerts

## Installation

Install the [Apitally SDK](https://www.npmjs.com/package/apitally) in your project:

```bash
# npm
npm install apitally

# yarn
yarn add apitally @opentelemetry/api

# pnpm
pnpm add apitally

# bun
bun add apitally
```

## Setup

First, create an app in the [Apitally dashboard](https://app.apitally.io) to get your write token. Then call `useApitally` with your Hono application, the write token, and other configuration options immediately after creating the app, before registering middleware and routes:

```ts
import { Hono } from 'hono'
import { useApitally } from 'apitally'

const app = new Hono()

useApitally(app, {
  writeToken: 'your-write-token', // Get this from the Apitally dashboard
  env: 'dev', // or "prod", etc.

  // Optional: Capture request headers and request/response bodies
  captureRequestHeaders: true,
  captureRequestBody: true,
  captureResponseBody: true,
})

// Register middleware and routes below this point
app.get('/', (c) => c.text('Hello Hono!'))

export default app
```

## Identify consumers

To track API usage by individual consumers, use the `setConsumer` function to associate requests with consumer identifiers. This is typically done in a middleware after authentication. You can also provide an optional display name and consumer group.

```ts
import { setConsumer } from 'apitally'

app.use(async (c, next) => {
  const payload = c.get('jwtPayload')
  if (payload) {
    setConsumer({
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
- [Official setup guide](https://docs.apitally.io/setup-guides/hono)
- [Official setup guide for Cloudflare Workers](https://docs.apitally.io/setup-guides/hono-cloudflare-workers)
