---
title: htmx
description: 将 Hono 与 htmx 结合使用。
---

## typed-htmx

通过使用 [typed-htmx](https://github.com/Desdaemon/typed-htmx)，你可以使用带有 htmx 属性的 TypeScript 定义来编写 JSX。
我们可以参照 [typed-htmx 示例项目](https://github.com/Desdaemon/typed-htmx/blob/main/example/src/types.d.ts) 中的模式，将其与 `hono/jsx` 结合使用。

安装依赖包：

```sh
npm i -D typed-htmx
```

在 `src/global.d.ts`（如果你使用 HonoX，则在 `app/global.d.ts`）中，导入 `typed-htmx` 类型：

```ts
import 'typed-htmx'
```

使用 typed-htmx 定义扩展 Hono 的 JSX 类型：

```ts
// 这是一个如何使用 htmx 属性扩展外部类型的示例。
// 在这种情况下，Hono 从其自身的命名空间获取类型，因此我们采用相同方式
// 直接扩展其命名空间。
declare module 'hono/jsx' {
  namespace JSX {
    interface HTMLAttributes extends HtmxAttributes {}
  }
}
```

## 参考链接

- [htmx](https://htmx.org/)
- [typed-htmx](https://github.com/Desdaemon/typed-htmx)
