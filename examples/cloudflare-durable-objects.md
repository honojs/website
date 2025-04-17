# Cloudflare Durable Objects

You can use Hono as the router in your Cloudflare Worker, calling RPC (Remote Procedure Calls) to interact with [Durable Objects](https://developers.cloudflare.com/durable-objects/). This is the recommended approach as of Cloudflare Workers compatibility date `2024-04-03`.

## Example: Counter Durable Object

### Initial Setup

First, create a new Cloudflare Workers project:

```bash
pnpm create cloudflare@latest
```

Follow the prompts:
- Choose "Hello World example"
- Select "Hello World Worker Using Durable Objects"
- Choose "TypeScript"
- Say "Yes" to git
- Say "No" to immediate deployment

### Basic Durable Objects Setup

Here's a minimal example showing how Durable Objects work. First, let's look at the core files:

`src/index.ts`:
```typescript
import { DurableObject } from "cloudflare:workers";

export class Counter extends DurableObject {
  // In-memory state (optional, consider storage for persistence)
  value = 0;

  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);

    // `blockConcurrencyWhile()` ensures no requests are delivered until
    // initialization completes.
    ctx.blockConcurrencyWhile(async () => {
      // After initialization, future reads do not need to access storage.
      this.value = (await ctx.storage.get("value")) || 0;
    });
  }

  async getCounterValue() {
    return this.value;
  }

  async increment(amount = 1): Promise<number> {
    this.value += amount;
    await this.ctx.storage.put("value", this.value);
    return this.value;
  }

  async decrement(amount = 1): Promise<number> {
    this.value -= amount;
    await this.ctx.storage.put("value", this.value);
    return this.value;
  }
}

export default {
  async fetch(request, env, ctx): Promise<Response> {
    const id: DurableObjectId = env.COUNTER.idFromName("counter");
    const stub = env.COUNTER.get(id);
    const counterValue = await stub.getCounterValue();
    return new Response(counterValue.toString());
  },
} satisfies ExportedHandler<Env>;
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
      "tag": "v1"
    }
  ],
  "durable_objects": {
    "bindings": [
      {
        "class_name": "Counter",
        "name": "COUNTER"
      }
    ]
  },
  "observability": {
    "enabled": true
  }
}
```

As you can see, in this situation, we have the worker interacting between the durable object. In the index file, we export default an object with a fetch function (the Worker) and the durable object class (counter).

## Adding Hono Integration

Hono can easily slot in with this setup. We just need to replace the export default part with a new Hono app. Here's how we can modify the code:

```typescript
import { DurableObject } from "cloudflare:workers";
import { Hono } from 'hono';

export class Counter extends DurableObject {
  // ... Counter class implementation stays the same ...
}

// Create a new Hono app
const app = new Hono();

// Add routes to interact with the Durable Object
app.get('/counter', async (c) => {
  const env = c.env;
  const id: DurableObjectId = env.COUNTER.idFromName("counter");
  const stub = env.COUNTER.get(id);
  const counterValue = await stub.getCounterValue();
  return c.text(counterValue.toString());
});

app.post('/counter/increment', async (c) => {
  const env = c.env;
  const id: DurableObjectId = env.COUNTER.idFromName("counter");
  const stub = env.COUNTER.get(id);
  const value = await stub.increment();
  return c.text(value.toString());
});

app.post('/counter/decrement', async (c) => {
  const env = c.env;
  const id: DurableObjectId = env.COUNTER.idFromName("counter");
  const stub = env.COUNTER.get(id);
  const value = await stub.decrement();
  return c.text(value.toString());
});

export default app;
```

Now you have a fully functional Hono application that interfaces with your Durable Object! The Hono router provides a clean API interface to interact with your Durable Object's methods, while maintaining all the benefits of Durable Objects' consistency and durability guarantees.

The `wrangler.jsonc` configuration remains the same as before, as Hono is just handling the routing layer while the Durable Object setup remains unchanged.