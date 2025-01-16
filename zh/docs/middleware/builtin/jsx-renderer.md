---
title: JSX 渲染器中间件
description: hono 内置的 JSX 渲染器中间件，提供在渲染 JSX 时设置布局的功能，并允许在组件中访问 Context 实例。
---

# JSX 渲染器中间件

JSX 渲染器中间件让你能够在使用 `c.render()` 函数渲染 JSX 时设置布局，而无需使用 `c.setRenderer()`。此外，它还允许通过 `useRequestContext()` 在组件中访问 Context 实例。

## 导入

```ts
import { Hono } from 'hono'
import { jsxRenderer, useRequestContext } from 'hono/jsx-renderer'
```

## 使用方法

```jsx
const app = new Hono()

app.get(
  '/page/*',
  jsxRenderer(({ children }) => {
    return (
      <html>
        <body>
          <header>菜单</header>
          <div>{children}</div>
        </body>
      </html>
    )
  })
)

app.get('/page/about', (c) => {
  return c.render(<h1>关于我！</h1>)
})
```

## 配置选项

### <Badge type="info" text="可选" /> docType: `boolean` | `string`

如果你不想在 HTML 开头添加 DOCTYPE 声明，可以将 `docType` 选项设置为 `false`。

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

你也可以指定自定义的 DOCTYPE。

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

### <Badge type="info" text="可选" /> stream: `boolean` | `Record<string, string>`

如果将其设置为 `true` 或提供一个 Record 值，响应将以流式方式渲染。

```tsx
const AsyncComponent = async () => {
  await new Promise((r) => setTimeout(r, 1000)) // 暂停 1 秒
  return <div>你好！</div>
}

app.get(
  '*',
  jsxRenderer(
    ({ children }) => {
      return (
        <html>
          <body>
            <h1>SSR 流式渲染</h1>
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
    <Suspense fallback={<div>加载中...</div>}>
      <AsyncComponent />
    </Suspense>
  )
})
```

如果设置为 `true`，将添加以下响应头：

```ts
{
  'Transfer-Encoding': 'chunked',
  'Content-Type': 'text/html; charset=UTF-8',
  'Content-Encoding': 'Identity'
}
```

你可以通过指定 Record 值来自定义响应头的值。

## 嵌套布局

`Layout` 组件支持布局的嵌套。

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
        <nav>博客菜单</nav>
        <div>{children}</div>
      </Layout>
    )
  })
)

app.route('/blog', blog)
```

## `useRequestContext()`

`useRequestContext()` 返回一个 Context 实例。

```tsx
import { useRequestContext, jsxRenderer } from 'hono/jsx-renderer'

const app = new Hono()
app.use(jsxRenderer())

const RequestUrlBadge: FC = () => {
  const c = useRequestContext()
  return <b>{c.req.url}</b>
}

app.get('/page/info', (c) => {
  return c.render(
    <div>
      你正在访问：<RequestUrlBadge />
    </div>
  )
})
```

::: warning
你不能在 Deno 的 `precompile` JSX 选项中使用 `useRequestContext()`。请使用 `react-jsx`：

```json
   "compilerOptions": {
     "jsx": "precompile", // [!code --]
     "jsx": "react-jsx", // [!code ++]
     "jsxImportSource": "hono/jsx"
   }
 }
```

:::

## 扩展 `ContextRenderer`

通过如下方式定义 `ContextRenderer`，你可以向渲染器传递额外的内容。这在需要根据页面更改 head 标签内容等场景下特别有用。

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
          <header>菜单</header>
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
        <li>吃寿司</li>
        <li>看棒球比赛</li>
      </ul>
    </div>,
    {
      title: '我的最爱',
    }
  )
})
```
