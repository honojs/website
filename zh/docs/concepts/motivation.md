---
title: 动机
description: Hono 是一个快速、轻量、跨平台的 Web 框架，基于 Web 标准 API 构建，致力于成为 Web 标准的标准。
---
# 动机

在本节中，我们将讨论 Hono 的核心理念和设计哲学。

## 动机

最初，我只是想在 Cloudflare Workers 上创建一个 Web 应用。
但当时并没有一个能在 Cloudflare Workers 上良好运行的框架。
于是，我开始构建 Hono。

我认为这是一个学习如何使用字典树（Trie trees）构建路由器的好机会。
后来，一位朋友展示了一个名为"RegExpRouter"的超高速路由器。
还有一位朋友创建了基本身份验证（Basic authentication）中间件。

通过仅使用 Web 标准 API，我们成功使其在 Deno 和 Bun 上运行。当人们问"Bun 上有没有类似 Express 的框架？"时，我们可以回答："没有，但是有 Hono"。
（虽然现在 Express 已经可以在 Bun 上运行了。）

我们还有朋友开发了 GraphQL 服务器、Firebase 认证和 Sentry 中间件。
同时，我们也有了 Node.js 适配器。
一个生态系统就这样逐渐形成了。

换句话说，Hono 不仅速度极快，而且功能强大，可以在任何地方运行。
我们可以展望，Hono 有望成为 **Web 标准的标准**。