---
title: JSX Middleware
---

# JSX Middleware

JSX Middleware enable rendering HTML with JSX syntax.
It's just for Sever-Side-Rendering. No virtual DOM.
This middleware is only for writing with TypeScript.

## Import

{{< tabs "import" >}}
{{< tab "npm" >}}

```ts
import { Hono } from 'hono'
import { jsx } from 'hono/jsx'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jsx } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

## Settings

{{< tabs "settings" >}}
{{< tab "Cloudflare Workers" >}}

tsconfig.json:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxFragmentFactory": "Fragment",
    "jsxImportSource": "hono/jsx"
  }
}
```

You do not have to `import { jsx } from 'hono/jsx`.

Or use pragma:

```ts
/** @jsx jsx */
/** @jsxFrag  Fragment */
import { jsx } from 'hono/jsx'
```

{{< /tab >}}
{{< tab "Deno" >}}

Pragma:

```ts
/** @jsx jsx */
/** @jsxFrag  Fragment */
```

{{< /tab >}}
{{< tab "Bun" >}}

tsconfig.json:

```json
{
  "compilerOptions": {
    "jsx": "preserve",
    "jsxFragmentFactory": "Fragment",
    "jsxImportSource": "hono/jsx"
  }
}
```

You do not have to `import { jsx } from 'hono/jsx`.

{{< /tab >}}
{{< /tabs >}}

## Usage

index.tsx:

```tsx
const app = new Hono()

const Layout = (props: { children?: string }) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

const Top = (props: { messages: string[] }) => {
  return (
    <Layout>
      <h1>Hello Hono!</h1>
      <ul>
        {props.messages.map((message) => {
          return <li>{message}!!</li>
        })}
      </ul>
    </Layout>
  )
}

app.get('/', (c) => {
  const messages = ['Good Morning', 'Good Evening', 'Good Night']
  return c.html(<Top messages={messages} />)
})
```

## dangerouslySetInnerHTML

`dangerouslySetInnerHTML` allows you to set HTML directly.

```tsx
app.get('/foo', (c) => {
  const inner = { __html: 'JSX &middot; SSR' }
  const Div = <div dangerouslySetInnerHTML={inner} />
})
```

## memo

You can memoize calculated strings of the component with `memo`.

{{< tabs "import-memo" >}}
{{< tab "npm" >}}

```ts
import { jsx, memo } from 'hono/jsx'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { jsx, memo } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

```tsx
import { jsx, memo } from 'hono/jsx'

const Header = memo(() => <header>Welcome to Hono</header>)
const Footer = memo(() => <footer>Powered by Hono</footer>)
const Layout = (
  <div>
    <Header />
    <p>Hono is cool!</p>
    <Footer />
  </div>
)
```

## Fragment

{{< tabs "import-fragment" >}}
{{< tab "npm" >}}

```ts
import { jsx, Fragment } from 'hono/jsx'
```

{{< /tab >}}
{{< tab "Deno" >}}

```ts
import { jsx, Fragment } from 'https://deno.land/x/hono/middleware.ts'
```

{{< /tab >}}
{{< /tabs >}}

```tsx
const List = () => (
  <Fragment>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </Fragment>
)
```

## With html Middleware

It's powerful to use JSX middleware with html middleware.
For more information, see [html middleware docs](/docs/builtin-middleware/html).

```tsx
import { Hono } from 'hono'
import { html } from 'hono/html'
import { jsx } from 'hono/jsx'

const app = new Hono()

interface SiteData {
  title: string
  children?: any
}

const Layout = (props: SiteData) => html`<!DOCTYPE html>
  <html>
    <head>
      <title>${props.title}</title>
    </head>
    <body>
      ${props.children}
    </body>
  </html>`

const Content = (props: { siteData: SiteData; name: string }) => (
  <Layout {...props.siteData}>
    <h1>Hello {props.name}</h1>
  </Layout>
)

app.get('/:name', (c) => {
  const { name } = c.req.param()
  const props = {
    name: name,
    siteData: {
      title: 'JSX with html sample',
    },
  }
  return c.html(<Content {...props} />)
})

export default app
```

## Tips for Cloudflare Workers

It's useful to use Miniflare's`live-reload` option for developing.

package.json:

```json
{
  "scripts": {
    "build": "esbuild --bundle --outdir=dist ./src/index.tsx",
    "dev": "miniflare --live-reload --debug"
  }
}
```

wrangler.toml:

```toml
[build]
command = "yarn build"
```
