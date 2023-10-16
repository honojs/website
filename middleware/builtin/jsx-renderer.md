# JSX Renderer Middleware

JSX Renderer Middleware allows you to set up the layout when rendering JSX with the `c.render()` function, without the need for using `c.setRenderer()`. Additionally, it enables access to instances of Context within components through the use of `useRequestContext()`.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { jsxRenderer, useRequestContext } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

```js
const app = new Hono()

app.get(
  '/page/*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <nav>Menu</nav>
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

### `useRequestContext()`

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

## Extending `ContextRenderer`

By defining `ContextRenderer` as shown below, you can pass additional content to the renderer. This is handy, for instance, when you want to change the contents of the head tag depending on the page.

```tsx
declare module 'hono' {
  interface ContextRenderer {
    (content: string, props: { title: string }): Response
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
