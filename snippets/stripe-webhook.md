# Stripe Webhook Integration  

This introduces how to create an API with Hono to receive Stripe Webhook events.

## Preparation

Please install the official Stripe SDK at first:

```bash
npm install stripe
```

And put the following values on the `.dev.vars` file to insert the Stripe API keys:

```
STRIPE_API_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

You can learn about the Stripe API keys by the following documents:

- Secret Key: https://docs.stripe.com/keys
- Webhook secret: https://docs.stripe.com/webhooks


## How to protect the API for Stripe Webhook events

The API that processes webhook events is publicly accessible.

```javascript
import Stripe from 'stripe';
import { Hono } from 'hono';
const app = new Hono();

app.post("/webhook", async (context) => {
    const stripe = new Stripe(context.env.STRIPE_API_KEY);
    const event = await context.req.json();
    switch(event.type) {
        case "payment_intent.created": {
            console.log(event.data.object)
            break
        }
        default:
            break
    }
    return context.text("", 200);
})

export default app;
```

Therefore, a mechanism is needed to protect it from attacks such as malicious third parties spoofing Stripe's webhook event objects and sending requests. In Stripe's case, you can protect the API by issuing a webhook secret and verifying each request.

Learn more: https://docs.stripe.com/webhooks?lang=node#verify-official-libraries  

## Implementing the Webhook API by hosting environment or framework
To perform signature verification with Stripe, the raw request body is needed.
When using a framework, you need to ensure that the original body is not modified. If any changes are made to the raw request body, the verification will fail.

Here, we introduce implementation methods for major hosting environments and frameworks.

### Deploying to Cloudflare ( Workers / Pages )

When processing Stripe webhook events on Cloudflare Workers or Cloudflare Pages functions, the raw request body can be obtained from `context.req.text()`.

```js
import Stripe from 'stripe';
import { Hono } from 'hono';
const app = new Hono();

app.post("/webhook", async (context) => {
    const stripe = new Stripe(context.env.STRIPE_API_KEY);
    const event = await context.req.json(); // [!code --]
    const signature = context.req.header('stripe-signature'); // [!code ++]
    try { // [!code ++]
        if (!signature) { // [!code ++]
            return context.text("", 400); // [!code ++]
        } // [!code ++]
        const body = await context.req.text(); // [!code ++]
        const event = await stripe.webhooks.constructEventAsync( // [!code ++]
            body, // [!code ++]
            signature, // [!code ++]
            context.env.STRIPE_WEBHOOK_SECRET, // [!code ++]
            undefined, // [!code ++]
            Stripe.createSubtleCryptoProvider() // [!code ++]
        ); // [!code ++]
        switch(event.type) {
            case "payment_intent.created": {
                console.log(event.data.object)
                break
            }
            default:
                break
        }
        return context.text("", 200);
      } catch (err) { // [!code ++]
        const errorMessage = `⚠️  Webhook signature verification failed. ${err instanceof Error ? err.message : "Internal server error"}` // [!code ++]
        console.log(errorMessage); // [!code ++]
        return context.text(errorMessage, 400); // [!code ++]
      } // [!code ++]
})

export default app;
```

### Deploying as a Node.js Application  

For Node.js applications, the raw request body can be obtained from `Buffer.from(await request.arrayBuffer())`.

```js
import Stripe from 'stripe';
import { Hono } from 'hono';
const app = new Hono();

app.post("/webhook", async (context) => {
    const stripe = new Stripe(context.env.STRIPE_API_KEY);
    const event = await context.req.json(); // [!code --]
    const signature = context.req.header('stripe-signature'); // [!code ++]
    try { // [!code ++]
        if (!signature) { // [!code ++]
            return context.text("", 400); // [!code ++]
        } // [!code ++]
        const body = Buffer.from(await request.arrayBuffer()); // [!code ++]
        const event = await stripe.webhooks.constructEventAsync( // [!code ++]
            body, // [!code ++]
            signature, // [!code ++]
            context.env.STRIPE_WEBHOOK_SECRET // [!code ++]
        ); // [!code ++]
        switch(event.type) {
            case "payment_intent.created": {
                console.log(event.data.object)
                break
            }
            default:
                break
        }
        return context.text("", 200);
      } catch (err) { // [!code ++]
        const errorMessage = `⚠️  Webhook signature verification failed. ${err instanceof Error ? err.message : "Internal server error"}` // [!code ++]
        console.log(errorMessage); // [!code ++]
        return context.text(errorMessage, 400); // [!code ++]
      } // [!code ++]
})

export default app;
```

## Lear more

- Details on Stripe Webhooks:
https://docs.stripe.com/webhooks
- Implementing for payment processing: 
https://docs.stripe.com/payments/handling-payment-events
- Implementing for subscriptions:
https://docs.stripe.com/billing/subscriptions/webhooks
- List of webhook events sent by Stripe:
https://docs.stripe.com/api/events
- Sample template for Cloudflare:
https://github.com/stripe-samples/stripe-node-cloudflare-worker-template/