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
import type { FC } from 'hono/jsx'

const app = new Hono()

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC<{ messages: string[] }> = (props: { messages: string[] }) => {
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

Or you can write it with `<></>` if it set up properly.

```tsx
const List = () => (
  <>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </>
)
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

## Context

By using `useContext`, you can share data globally across any level of the Component tree without passing values through props.

```tsx
import type { FC } from 'hono/jsx'
import { createContext, useContext } from 'hono/jsx'

const themes = {
  light: {
    color: '#000000',
    background: '#eeeeee',
  },
  dark: {
    color: '#ffffff',
    background: '#222222',
  },
}

const ThemeContext = createContext(themes.light)

const Button: FC = () => {
  const theme = useContext(ThemeContext)
  return <button style={theme}>Push!</button>
}

const Toolbar: FC = () => {
  return (
    <div>
      <Button />
    </div>
  )
}

// ...

app.get('/', (c) => {
  return c.html(
    <div>
      <ThemeContext.Provider value={themes.dark}>
        <Toolbar />
      </ThemeContext.Provider>
    </div>
  )
})
```

## Async Component

`hono/jsx` supports an Async Component, so you can use `async`/`await` in your component.
If you render it with `c.html()`, it will await automatically.

```tsx
const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // sleep 1s
  return <div>Done!</div>
}

app.get('/', (c) => {
  return c.html(
    <html>
      <body>
        <AsyncComponent />
      </body>
    </html>
  )
})
```

## Suspense <Badge style="vertical-align: middle;" type="warning" text="Experimental" />

The React-like `Suspense` feature is available.
If you wrap the async component with `Suspense`, the content in the fallback will be rendered first, and once the Promise is resolved, the awaited content will be displayed.
You can use it with `renderToReadableStream()`.

```tsx
import { renderToReadableStream, Suspense } from 'hono/jsx/streaming'

//...

app.get('/', (c) => {
  const stream = renderToReadableStream(
    <html>
      <body>
        <Suspense fallback={<div>loading...</div>}>
          <Component />
        </Suspense>
      </body>
    </html>
  )
  return c.body(stream, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Transfer-Encoding': 'chunked',
    },
  })
})
```

## Integration with html Middleware

Combine the JSX and html middlewares for powerful templating.
For in-depth details, consult the [html middleware documentation](/helpers/html).

```tsx
import { Hono } from 'hono'
import { html } from 'hono/html'

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

## With JSX Renderer Middleware

The [JSX Renderer Middleware](/middleware/builtin/jsx-renderer) allows you to create HTML pages more easily with the JSX.

## Pre-Compile

`hono/jsx` supports [the `precompile` feature for Deno](https://deno.com/blog/v1.38#fastest-jsx-transform). To enable it, write `deno.json` as follows.

```json
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "hono/jsx"
  },
  "imports": {
    "hono/jsx/jsx-runtime": "https://deno.land/x/hono@v3.10.0/jsx/jsx-runtime.ts"
  }
}
```

## Override type definitions

You can override the type definition to add your custom elements and attributes.

```ts
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'my-custom-element': Hono.HTMLAttributes & {
        'x-event'?: 'click' | 'scroll'
      }
    }
  }
}
```
