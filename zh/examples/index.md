---
title: 示例
description: 在这个部分，你可以看到一些实际的例子，来创建你的应用程序。
---

<script setup>
import { data } from './menu.data.ts'
</script>

# 示例

在这个部分，你可以看到一些实际的例子，来创建你的应用程序。

<div v-for="sections of data">
  <section v-for="category of sections">
    <h2>{{ category.text }}</h2>
    <ul v-for="item of category.items">
      <li><a :href="item.link">{{ item.text }}</a></li>
    </ul>
  </section>
</div>

## GitHub repository

你也可以在 GitHub 仓库中查看示例：[Hono 示例](https://github.com/honojs/examples)

## 贡献

欢迎你为 Hono 贡献示例。请参阅 [贡献指南](https://github.com/honojs/hono/blob/main/CONTRIBUTING.md) 了解更多信息。
