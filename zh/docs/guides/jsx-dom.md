---
title: 客户端组件
description: hono/jsx 不仅支持服务器端，还支持客户端。这意味着可以创建在浏览器中运行的交互式 UI。我们称之为客户端组件或 hono/jsx/dom。
---

# 客户端组件

`hono/jsx` 不仅支持服务器端，还支持客户端。这意味着可以创建在浏览器中运行的交互式 UI。我们称之为客户端组件或 `hono/jsx/dom`。

它既快速又轻量。使用 `hono/jsx/dom` 的计数器程序经过 Brotli 压缩后仅有 2.8KB，而 React 则需要 47.8KB。

本节将介绍客户端组件特有的功能特性。

## 计数器示例

这是一个简单计数器的示例，代码与 React 中的使用方式相同。

```tsx
import { useState } from 'hono/jsx'
import { render } from 'hono/jsx/dom'

function Counter() {
  const [count, setCount] = useState(0)
  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
    </div>
  )
}

function App() {
  return (
    <html>
      <body>
        <Counter />
      </body>
    </html>
  )
}

const root = document.getElementById('root')
render(<App />, root)
```

## `render()`

你可以使用 `render()` 将 JSX 组件插入到指定的 HTML 元素中。

```tsx
render(<Component />, container)
```

## 与 React 兼容的 Hooks

hono/jsx/dom 提供了与 React 完全兼容或部分兼容的 Hooks。你可以通过查看 [React 文档](https://react.dev/reference/react/hooks) 来了解这些 API。

- `useState()`
- `useEffect()`
- `useRef()`
- `useCallback()`
- `use()`
- `startTransition()`
- `useTransition()`
- `useDeferredValue()`
- `useMemo()`
- `useLayoutEffect()`
- `useReducer()`
- `useDebugValue()`
- `createElement()`
- `memo()`
- `isValidElement()`
- `useId()`
- `createRef()`
- `forwardRef()`
- `useImperativeHandle()`
- `useSyncExternalStore()`
- `useInsertionEffect()`
- `useFormStatus()`
- `useActionState()`
- `useOptimistic()`

## `startViewTransition()` 系列

`startViewTransition()` 系列包含了一些原创的 hooks 和函数，用于简化 [View Transitions API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) 的使用。以下是使用示例。

### 1. 最简单的示例

你可以使用 `startViewTransition()` 来简化 `document.startViewTransition` 的写法。

```tsx
import { useState, startViewTransition } from 'hono/jsx'
import { css, Style } from 'hono/css'

export default function App() {
  const [showLargeImage, setShowLargeImage] = useState(false)
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() =>
            setShowLargeImage((state) => !state)
          )
        }
      >
        点击！
      </button>
      <div>
        {!showLargeImage ? (
          <img src='https://hono.dev/images/logo.png' />
        ) : (
          <div
            class={css`
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
            `}
          ></div>
        )}
      </div>
    </>
  )
}
```

### 2. 结合 `keyframes()` 使用 `viewTransition()`

`viewTransition()` 函数允许你获取唯一的 `view-transition-name`。

你可以将其与 `keyframes()` 一起使用，`::view-transition-old()` 会被转换为 `::view-transition-old(${uniqueName})`。

```tsx
import { useState, startViewTransition } from 'hono/jsx'
import { viewTransition } from 'hono/jsx/dom/css'
import { css, keyframes, Style } from 'hono/css'

const rotate = keyframes`
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
`

export default function App() {
  const [showLargeImage, setShowLargeImage] = useState(false)
  const [transitionNameClass] = useState(() =>
    viewTransition(css`
      ::view-transition-old() {
        animation-name: ${rotate};
      }
      ::view-transition-new() {
        animation-name: ${rotate};
      }
    `)
  )
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() =>
            setShowLargeImage((state) => !state)
          )
        }
      >
        点击！
      </button>
      <div>
        {!showLargeImage ? (
          <img src='https://hono.dev/images/logo.png' />
        ) : (
          <div
            class={css`
              ${transitionNameClass}
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
            `}
          ></div>
        )}
      </div>
    </>
  )
}
```

### 3. 使用 `useViewTransition`

如果你只想在动画期间改变样式，可以使用 `useViewTransition()`。这个 hook 返回 `[boolean, (callback: () => void) => void]`，分别是 `isUpdating` 标志和 `startViewTransition()` 函数。

使用此 hook 时，组件会在以下两个时间点进行评估：

- 在调用 `startViewTransition()` 的回调函数内部
- 当 [finish promise 完成](https://developer.mozilla.org/en-US/docs/Web/API/ViewTransition/finished) 时

```tsx
import { useState, useViewTransition } from 'hono/jsx'
import { viewTransition } from 'hono/jsx/dom/css'
import { css, keyframes, Style } from 'hono/css'

const rotate = keyframes`
  from {
    rotate: 0deg;
  }
  to {
    rotate: 360deg;
  }
`

export default function App() {
  const [isUpdating, startViewTransition] = useViewTransition()
  const [showLargeImage, setShowLargeImage] = useState(false)
  const [transitionNameClass] = useState(() =>
    viewTransition(css`
      ::view-transition-old() {
        animation-name: ${rotate};
      }
      ::view-transition-new() {
        animation-name: ${rotate};
      }
    `)
  )
  return (
    <>
      <Style />
      <button
        onClick={() =>
          startViewTransition(() =>
            setShowLargeImage((state) => !state)
          )
        }
      >
        点击！
      </button>
      <div>
        {!showLargeImage ? (
          <img src='https://hono.dev/images/logo.png' />
        ) : (
          <div
            class={css`
              ${transitionNameClass}
              background: url('https://hono.dev/images/logo-large.png');
              background-size: contain;
              background-repeat: no-repeat;
              background-position: center;
              width: 600px;
              height: 600px;
              position: relative;
              ${isUpdating &&
              css`
                &:before {
                  content: '加载中...';
                  position: absolute;
                  top: 50%;
                  left: 50%;
                }
              `}
            `}
          ></div>
        )}
      </div>
    </>
  )
}
```

## `hono/jsx/dom` 运行时

这是一个专为客户端组件设计的轻量级 JSX 运行时。使用它会比使用 `hono/jsx` 产生更小的打包结果。在 `tsconfig.json` 中指定 `hono/jsx/dom`。

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx/dom"
  }
}
```