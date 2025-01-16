---
title: JSX
description: 使用 `hono/jsx` 可以方便地编写 JSX 语法的 HTML，适用于客户端和服务器端渲染。
---

# JSX

你可以通过 `hono/jsx` 使用 JSX 语法编写 HTML。

虽然 `hono/jsx` 可以在客户端使用，但你可能最常用它来进行服务器端渲染。以下是一些在服务器端和客户端通用的 JSX 相关内容。

## 配置

要使用 JSX，需要修改 `tsconfig.json`：

`tsconfig.json`:

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

或者，你可以使用 pragma 指令：

```ts
/** @jsx jsx */
/** @jsxImportSource hono/jsx */
```

对于 Deno，你需要修改 `deno.json` 而不是 `tsconfig.json`：

```json
{
  "compilerOptions": {
    "jsx": "precompile",
    "jsxImportSource": "hono/jsx"
  }
}
```

## 使用方法

`index.tsx`:

```tsx
import { Hono } from 'hono'
import type { FC } from 'hono/jsx'

const app = new Hono()

const Layout: FC = (props) => {
  return (
    <html>
      <body>{props.children}</body>
    </html>
  )
}

const Top: FC<{ messages: string[] }> = (props: {
  messages: string[]
}) => {
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

export default app
```

## Fragment

使用 Fragment 可以在不添加额外节点的情况下组合多个元素：

```tsx
import { Fragment } from 'hono/jsx'

const List = () => (
  <Fragment>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </Fragment>
)
```

如果配置正确，你也可以使用 `<></>` 简写语法。

```tsx
const List = () => (
  <>
    <p>first child</p>
    <p>second child</p>
    <p>third child</p>
  </>
)
```

## `PropsWithChildren`

你可以使用 `PropsWithChildren` 来正确推断函数组件中的子元素类型。

```tsx
import { PropsWithChildren } from 'hono/jsx'

type Post = {
  id: number
  title: string
}

function Component({ title, children }: PropsWithChildren<Post>) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  )
}
```

## 插入原始 HTML

要直接插入 HTML，请使用 `dangerouslySetInnerHTML`：

```tsx
app.get('/foo', (c) => {
  const inner = { __html: 'JSX &middot; SSR' }
  const Div = <div dangerouslySetInnerHTML={inner} />
})
```

## 记忆化

使用 `memo` 记忆化计算字符串来优化你的组件：

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

## Context（上下文）

通过使用 `useContext`，你可以在组件树的任何层级共享数据，而无需通过 props 传递值。

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

## 异步组件

`hono/jsx` 支持异步组件，因此你可以在组件中使用 `async`/`await`。
如果你使用 `c.html()` 渲染它，它会自动等待。

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

## Suspense <Badge style="vertical-align: middle;" type="warning" text="实验性功能" />

现已提供类似 React 的 `Suspense` 功能。
如果你用 `Suspense` 包装异步组件，fallback 中的内容会首先渲染，一旦 Promise 解决，就会显示等待的内容。
你可以将其与 `renderToReadableStream()` 一起使用。

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

## ErrorBoundary <Badge style="vertical-align: middle;" type="warning" text="实验性功能" />

你可以使用 `ErrorBoundary` 捕获子组件中的错误。

在下面的示例中，如果发生错误，将显示在 `fallback` 中指定的内容。

```tsx
function SyncComponent() {
  throw new Error('Error')
  return <div>Hello</div>
}

app.get('/sync', async (c) => {
  return c.html(
    <html>
      <body>
        <ErrorBoundary fallback={<div>Out of Service</div>}>
          <SyncComponent />
        </ErrorBoundary>
      </body>
    </html>
  )
})
```

`ErrorBoundary` 也可以与异步组件和 `Suspense` 一起使用。

```tsx
async function AsyncComponent() {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  throw new Error('Error')
  return <div>Hello</div>
}

app.get('/with-suspense', async (c) => {
  return c.html(
    <html>
      <body>
        <ErrorBoundary fallback={<div>Out of Service</div>}>
          <Suspense fallback={<div>Loading...</div>}>
            <AsyncComponent />
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  )
})
```

## 与 html 中间件集成

结合 JSX 和 html 中间件可以实现强大的模板功能。
详细信息请参考 [html 中间件文档](/zh/docs/helpers/html)。

```tsx
import { Hono } from 'hono'
import { html } from 'hono/html'

const app = new Hono()

interface SiteData {
  title: string
  children?: any
}

const Layout = (props: SiteData) =>
  html`<!doctype html>
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

## 配合 JSX 渲染器中间件

[JSX 渲染器中间件](/docs/middleware/builtin/jsx-renderer) 可以让你更轻松地使用 JSX 创建 HTML 页面。

## 覆盖类型定义

你可以覆盖类型定义来添加自定义元素和属性。

```ts
declare module 'hono/jsx' {
  namespace JSX {
    interface IntrinsicElements {
      'my-custom-element': HTMLAttributes & {
        'x-event'?: 'click' | 'scroll'
      }
    }
  }
}
```
