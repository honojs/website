# Cloudflare Durable Objects

Cloudflare Durable Objects cannot handle HTTP requests directly. Instead, they work through a two-step process:

1. A Worker receives HTTP fetch requests from clients
2. The Worker makes RPC (Remote Procedure Call) invocations to the Durable Object
3. The Durable Object processes the RPC and returns the result to the Worker
4. The Worker sends the HTTP response back to the client

You can use Hono as the router in your Cloudflare Worker, calling RPCs (Remote Procedure Calls) to interact with [Durable Objects](https://developers.cloudflare.com/durable-objects/). This is the recommended approach as of Cloudflare Workers compatibility date `2024-04-03`.

## Example: Counter Durable Object

```ts
import { DurableObject } from 'cloudflare:workers'
import { Hono } from 'hono'

export class Counter extends DurableObject {
  // In-memory state
  value = 0

  constructor(ctx: DurableObjectState, env: unknown) {
    super(ctx, env)

    // `blockConcurrencyWhile()` ensures no requests are delivered until initialization completes.
    ctx.blockConcurrencyWhile(async () => {
      // After initialization, future reads do not need to access storage.
      this.value = (await ctx.storage.get('value')) || 0
    })
  }

  async getCounterValue() {
    return this.value
  }

  async increment(amount = 1): Promise<number> {
    this.value += amount
    await this.ctx.storage.put('value', this.value)
    return this.value
  }

  async decrement(amount = 1): Promise<number> {
    this.value -= amount
    await this.ctx.storage.put('value', this.value)
    return this.value
  }
}

// Create a new Hono app to handle incoming HTTP requests
type Bindings = {
  COUNTER: DurableObjectNamespace<Counter>
}

const app = new Hono<{ Bindings: Bindings }>()

// Add routes to interact with the Durable Object
app.get('/counter', async (c) => {
  const env = c.env
  const id = env.COUNTER.idFromName('counter')
  const stub = env.COUNTER.get(id)
  const counterValue = await stub.getCounterValue()
  return c.text(counterValue.toString())
})

app.post('/counter/increment', async (c) => {
  const env = c.env
  const id = env.COUNTER.idFromName('counter')
  const stub = env.COUNTER.get(id)
  const value = await stub.increment()
  return c.text(value.toString())
})

app.post('/counter/decrement', async (c) => {
  const env = c.env
  const id = env.COUNTER.idFromName('counter')
  const stub = env.COUNTER.get(id)
  const value = await stub.decrement()
  return c.text(value.toString())
})

// Export the Hono app as the Worker's fetch handler
export default app
```

`wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "durable",
  "main": "src/index.ts",
  "compatibility_date": "2025-04-14",
  "migrations": [
    {
      "new_sqlite_classes": ["Counter"],
      "tag": "v1",
    },
  ],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "Counter",
        "name": "COUNTER",
      },
    ],
  },
  "observability": {
    "enabled": true,
  },
}
```

Now you have a fully functional Hono application that interfaces with your Durable Object! The Hono router provides a clean API interface to interact with and expose your Durable Object's methods.
