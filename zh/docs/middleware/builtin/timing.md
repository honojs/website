---
title: Timing 中间件
description: hono 内置的 Timing 中间件，提供服务器计时功能。
---

# Timing 中间件

[服务器计时](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Server-Timing)中间件在响应头中提供性能指标。

::: info
注意：在 Cloudflare Workers 上，计时器指标可能不准确，因为[计时器仅显示最后一次 I/O 的时间](https://developers.cloudflare.com/workers/learning/security-model/#step-1-disallow-timers-and-multi-threading)。
:::

## 导入

```ts [npm]
import { Hono } from 'hono'
import { timing, setMetric, startTime, endTime } from 'hono/timing'
import type { TimingVariables } from 'hono/timing'
```

## 使用方法

```js
// 指定变量类型以推断 `c.get('metric')`：
type Variables = TimingVariables

const app = new Hono<{ Variables: Variables }>()

// 将中间件添加到路由器
app.use(timing());

app.get('/', async (c) => {

  // 添加自定义指标
  setMetric(c, 'region', 'europe-west3')

  // 添加带有计时的自定义指标，必须以毫秒为单位
  setMetric(c, 'custom', 23.8, '我的自定义指标')

  // 开始一个新的计时器
  startTime(c, 'db');
  const data = await db.findMany(...);

  // 结束计时器
  endTime(c, 'db');

  return c.json({ response: data });
});
```

### 条件启用

```ts
const app = new Hono()

app.use(
  '*',
  timing({
    // c: 请求的上下文
    enabled: (c) => c.req.method === 'POST',
  })
)
```

## 结果

![计时输出示例](/images/timing-example.png)

## 选项

### <Badge type="info" text="optional" /> total: `boolean`

显示总响应时间。默认值为 `true`。

### <Badge type="info" text="optional" /> enabled: `boolean` | `(c: Context) => boolean`

是否应将计时添加到头中。默认值为 `true`。

### <Badge type="info" text="optional" /> totalDescription: `boolean`

总响应时间的描述。默认值为 `Total Response Time`。

### <Badge type="info" text="optional" /> autoEnd: `boolean`

如果 `startTime()` 应在请求结束时自动结束。
如果禁用，未手动结束的计时器将不会显示。

### <Badge type="info" text="optional" /> crossOrigin: `boolean` | `string` | `(c: Context) => boolean | string`

此计时头应可读取的来源。

- 如果为 false，仅限当前来源。
- 如果为 true，来自所有来源。
- 如果为字符串，来自此域名。多个域名必须用逗号分隔。

默认值为 `false`。查看更多[文档](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Timing-Allow-Origin)。
