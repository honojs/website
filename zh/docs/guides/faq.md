---
title: 常见问题
description: hono开发和部署中常见问题
---
# Hono 常见问题

本指南收集了关于 Hono 的常见问题（FAQ）及其解决方案。

## Hono 是否有官方的 Renovate 配置？

Hono 团队目前并不维护 [Renovate](https://github.com/renovatebot/renovate) 配置。
因此，请使用第三方 renovate-config，具体配置如下。

在你的 `renovate.json` 文件中：

```json
// renovate.json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>shinGangan/renovate-config-hono" // [!code ++]
  ]
}
```

更多详细信息请参阅 [renovate-config-hono](https://github.com/shinGangan/renovate-config-hono) 仓库。
