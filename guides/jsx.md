# JSX

With Hono, you can utilize JSX syntax to write HTML.
The `hono/jsx` is bundled with Hono and is strictly for Server-Side Rendering (SSR), not for client-side.

## Settings

To utilize JSX, modify the `tsconfig.json`:

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

Alternatively, use the pragma directives:

```ts
/** @jsx jsx */
/** @jsxImportSource hono/jsx */
```

For Deno, you have to add the pragmas and import `jsx` and `Fragment`:

::: code-group

```ts [Deno]
/** @jsx jsx */
/** @jsxFrag Fragment */

import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jsx, Fragment } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

`index.tsx`:

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

## Inserting Raw HTML

To directly insert HTML, use `dangerouslySetInnerHTML`:

```tsx
app.get('/foo', (c) => {
  const inner = { __html: 'JSX &middot; SSR' }
  const Div = <div dangerouslySetInnerHTML={inner} />
})
```

## Memoization

Optimize your components by memoizing computed strings using `memo`:

::: code-group

```ts [npm]
import { memo } from 'hono/jsx'
```

```ts [Deno]
import { memo } from 'https://deno.land/x/hono/middleware.ts'
```

:::

```tsx
import { memo } from 'hono/jsx'

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

Use Fragment to group multiple elements without adding extra nodes:

::: code-group

```ts [npm]
import { Fragment } from 'hono/jsx'
```

```ts [Deno]
import { Fragment } from 'https://deno.land/x/hono/middleware.ts'
```

:::

```tsx
const List = () => (
  <Fragment>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </Fragment>
)
```

## Integration with html Middleware

Combine the JSX and html middlewares for powerful templating.
For in-depth details, consult the [html middleware documentation](/middleware/builtin/html).

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
