# Method Override

[hono-method-override](https://github.com/bingtsingw/hono-method-override) is a third-party plugin that allows you to use HTTP verbs such as PUT or DELETE in places where the client (like standard HTML forms) doesn't support them.

You can install it via:

```bash
npm install hono-method-override
```

## Basic Usage

To use it, import the `methodOverride` middleware and apply it to your Hono app:

```ts
import { Hono } from 'hono'
import { methodOverride } from 'hono-method-override'

const app = new Hono()

app.use('*', methodOverride({ app }))

app.delete('/post', (c) => c.text('DELETE /post'))

export default app
```

In your HTML form, you can then override the method by passing a `_method` query parameter (or customizing the configuration based on the plugin's options):

```html
<form method="POST" action="/post?_method=DELETE">
  <button type="submit">Delete Post</button>
</form>
```

## See also

- [hono-method-override](https://github.com/bingtsingw/hono-method-override)
