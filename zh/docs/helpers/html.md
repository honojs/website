---
title: html 工具类
description: 使用hono的html工具类，可以在JavaScript模板字面量中使用名为html的标签来编写HTML。
---

html 工具类允许你在 JavaScript 模板字面量中使用名为 `html` 的标签来编写 HTML。通过使用 `raw()`，内容将按原样渲染。你需要自行处理这些字符串的转义。

## 导入

```ts
import { Hono } from 'hono'
import { html, raw } from 'hono/html'
```

## `html`

```ts
const app = new Hono()

app.get('/:username', (c) => {
  const { username } = c.req.param()
  return c.html(
    html`<!doctype html>
      <h1>Hello! ${username}!</h1>`
  )
})
```

### 在 JSX 中插入代码片段

在 JSX 中插入内联脚本：

```tsx
app.get('/', (c) => {
  return c.html(
    <html>
      <head>
        <title>测试网站</title>
        {html`
          <script>
            // 无需使用 dangerouslySetInnerHTML
            // 在此处编写的内容将不会被转义
          </script>
        `}
      </head>
      <body>Hello!</body>
    </html>
  )
})
```

### 作为函数式组件使用

由于 `html` 返回一个 HtmlEscapedString，它可以不使用 JSX 而作为完全功能的组件使用。

#### 使用 `html` 来提升性能，替代 `memo`

```typescript
const Footer = () => html`
  <footer>
    <address>我的地址...</address>
  </footer>
`
```

### 接收 props 并嵌入值

```typescript
interface SiteData {
  title: string
  description: string
  image: string
  children?: any
}
const Layout = (props: SiteData) => html`
<html>
<head>
  <meta charset="UTF-8">
  <title>${props.title}</title>
  <meta name="description" content="${props.description}">
  <head prefix="og: http://ogp.me/ns#">
  <meta property="og:type" content="article">
  <!-- 更多元素会降低 JSX 的性能，但不会影响模板字面量 -->
  <meta property="og:title" content="${props.title}">
  <meta property="og:image" content="${props.image}">
</head>
<body>
  ${props.children}
</body>
</html>
`

const Content = (props: { siteData: SiteData; name: string }) => (
  <Layout {...props.siteData}>
    <h1>Hello {props.name}</h1>
  </Layout>
)

app.get('/', (c) => {
  const props = {
    name: 'World',
    siteData: {
      title: 'Hello <> World',
      description: '这是一段描述',
      image: 'https://example.com/image.png',
    },
  }
  return c.html(<Content {...props} />)
})
```

## `raw()`

```ts
app.get('/', (c) => {
  const name = 'John &quot;Johnny&quot; Smith'
  return c.html(html`<p>I'm ${raw(name)}.</p>`)
})
```

## 使用技巧

得益于以下这些库，Visual Studio Code 和 vim 也能将模板字面量解析为 HTML，从而提供语法高亮和格式化功能：

- <https://marketplace.visualstudio.com/items?itemName=bierner.lit-html>
- <https://github.com/MaxMEllon/vim-jsx-pretty>
