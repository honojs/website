# Stripe Webhook Integration  

This introduces how to create an API with Hono to receive Stripe Webhook events.

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

```diff
import Stripe from 'stripe';
import { Hono } from 'hono';
const app = new Hono();

app.post("/webhook", async (context) => {
    const stripe = new Stripe(context.env.STRIPE_API_KEY);
-    const event = await context.req.json();
+    const signature = context.req.header('stripe-signature');
+    try {
+        if (!signature) {
+            return context.text("", 400);
+        }
+        const body = await context.req.text();
+        const event = await stripe.webhooks.constructEventAsync(
+            body,
+            signature,
+            context.env.STRIPE_WEBHOOK_SECRET,
+            undefined,
+            Stripe.createSubtleCryptoProvider()
+        );
        switch(event.type) {
            case "payment_intent.created": {
                console.log(event.data.object)
                break
            }
            default:
                break
        }
        return context.text("", 200);
+      } catch (err) {
+        const errorMessage = `⚠️  Webhook signature verification failed. ${err instanceof Error ? err.message : "Internal server error"}`
+        console.log(errorMessage);
+        return context.text(errorMessage, 400);
+      }
})

export default app;
```

### Deploying as a Node.js Application  

For Node.js applications, the raw request body can be obtained from `Buffer.from(await request.arrayBuffer())`.

```diff
import Stripe from 'stripe';
import { Hono } from 'hono';
const app = new Hono();

app.post("/webhook", async (context) => {
    const stripe = new Stripe(context.env.STRIPE_API_KEY);
-    const event = await context.req.json();
+    const signature = context.req.header('stripe-signature');
+    try {
+        if (!signature) {
+            return context.text("", 400);
+        }
+        const body = Buffer.from(await request.arrayBuffer());
+        const event = await stripe.webhooks.constructEventAsync(
+            body,
+            signature,
+            context.env.STRIPE_WEBHOOK_SECRET
+        );
        switch(event.type) {
            case "payment_intent.created": {
                console.log(event.data.object)
                break
            }
            default:
                break
        }
        return context.text("", 200);
+      } catch (err) {
+        const errorMessage = `⚠️  Webhook signature verification failed. ${err instanceof Error ? err.message : "Internal server error"}`
+        console.log(errorMessage);
+        return context.text(errorMessage, 400);
+      }
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