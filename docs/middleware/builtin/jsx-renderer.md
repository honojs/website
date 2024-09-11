# JSX Renderer Middleware

JSX Renderer Middleware allows you to set up the layout when rendering JSX with the `c.render()` function, without the need for using `c.setRenderer()`. Additionally, it enables access to instances of Context within components through the use of `useRequestContext()`.

## Import

```ts
import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
```

## Usage

```jsx
const app = new Hono()

app.get(
  '/page/*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <header>Menu</header>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/page/about', (c) => {
  return c.render(<h1>About me!</h1>)
})
```

## Options

### <Badge type="info" text="optional" /> docType: `boolean` | `string`

If you do not want to add a DOCTYPE at the beginning of the HTML, set the `docType` option to `false`.

```tsx
app.use(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    },
    { docType: false }
  )
)
```

And you can specify the DOCTYPE.

```tsx
app.use(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>{children}</body>
        </html>
      )
    },
    {
      docType:
        '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">',
    }
  )
)
```

### <Badge type="info" text="optional" /> stream: `boolean` | `Record<string, string>`

If you set it to `true` or provide a Record value, it will be rendered as a streaming response.

```tsx
const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // sleep 1s
  return <div>Hi!</div>
}

app.get(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>
            <h1>SSR Streaming</h1>
            {children}
          </body>
        </html>
      )
    },
    { stream: true }
  )
)

app.get('/', (c) => {
  return c.render(
    <Suspense fallback={<div>loading...</div>}>
      <AsyncComponent />
    </Suspense>
  )
})
```

If `true` is set, the following headers are added:

```ts
{
  'Transfer-Encoding': 'chunked',
  'Content-Type': 'text/html; charset=UTF-8',
  'Content-Encoding': 'Identity'
}
```

You can customize the header values by specifying the Record values.

## Nested Layouts

The `Layout` component enables nesting the layouts.

```tsx
app.use(
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>{children}</body>
      </html>
    )
  })
)

const blog = new Hono()
blog.use(
  jsxRenderer(({ children, Layout }) => {
    return (
      <Layout>
        <nav>Blog Menu</nav>
        <div>{children}</div>
      </Layout>
    )
  })
)

app.route('/blog', blog)
```

## `useRequestContext()`

`useRequestContext()` returns an instance of Context.

```tsx
const RequestUrlBadge: FC = () => {
  const c = useRequestContext()
  return <b>{c.req.url}</b>
}

app.get('/page/info', (c) => {
  return c.render(
    <div>
      You are accessing: <RequestUrlBadge />
    </div>
  )
})
```

::: warning
You can't use `useRequestContext()` with the Deno's `precompile` JSX option. Use the `react-jsx`:

```json
   "compilerOptions": {
     "jsx": "precompile", // [!code --]
     "jsx": "react-jsx", // [!code ++]
     "jsxImportSource": "hono/jsx"
   }
 }
```

:::

## Extending `ContextRenderer`

By defining `ContextRenderer` as shown below, you can pass additional content to the renderer. This is handy, for instance, when you want to change the contents of the head tag depending on the page.

```tsx
declare module 'hono' {
  interface ContextRenderer {
    (
      content: string | Promise<string>,
      props: { title: string }
    ): Response
  }
}

const app = new Hono()

app.get(
  '/page/*',
  jsxRenderer(({ children, title }) => {
    return (
      <html>
        <head>
          <title>{title}</title>
        </head>
        <body>
          <header>Menu</header>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/page/favorites', (c) => {
  return c.render(
    <div>
      <ul>
        <li>Eating sushi</li>
        <li>Watching baseball games</li>
      </ul>
    </div>,
    {
      title: 'My favorites',
    }
  )
})
```
