# Preview bot protection on a Hono API

The [WebDecoy middleware](https://github.com/WebDecoy/node) can evaluate
requests in monitor mode before you enable blocking. This example uses
a local tripwire rule and Hono's `app.request()` to show the difference
without an API key or a running HTTP server.

## Run the example

```sh
npm install hono @webdecoy/hono @webdecoy/node
```

Save the following as `demo.mjs`:

```js
import { Hono } from 'hono'
import { webdecoy } from '@webdecoy/hono'
import { tripwire } from '@webdecoy/node'

const testPath = '/api/demo-check'
const app = new Hono()

app.use(
  '/api/*',
  webdecoy({
    mode: 'monitor',
    rules: [tripwire({ paths: [testPath] })],
  })
)

app.get('/api/status', (c) => c.json({ ok: true }))
app.get(testPath, (c) => {
  const decision = c.get('webdecoyDecision')
  console.log('Tripwire matched:', decision?.deniedBy('tripwire'))
  return c.json({ ok: true })
})

console.log(
  'Normal route:',
  (await app.request('/api/status')).status
)
console.log('Test route:', (await app.request(testPath)).status)
```

Run `node demo.mjs`. The output is:

```text
Normal route: 200
Tripwire matched: true
Test route: 200
```

The test route returns `200` even though the tripwire rule matched.
Read the decision from the Hono context to decide what to log. Keep
tokens, request headers, and other sensitive data out of those logs.

Change `mode` to `'enforce'` and rerun the example. The test route
returns `403` before its handler runs, while the normal route still
returns `200`. The test path is deliberately marked as a tripwire.
Use paths that serve no legitimate traffic when adapting the rule.
