---
title: AWS Lambda
description: 使用 AWS Lambda 运行 Hono，包括环境搭建和示例代码。
---
# AWS Lambda

AWS Lambda 是亚马逊云服务（Amazon Web Services）提供的一个无服务器平台。
它能让你的代码响应事件并自动管理底层计算资源。

Hono 可以在 Node.js 18+ 环境下的 AWS Lambda 上运行。

## 1. 环境搭建

在 AWS Lambda 上创建应用程序时，
使用 [CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html)
可以方便地配置 IAM 角色、API Gateway 等功能。

使用 `cdk` CLI 初始化你的项目。

::: code-group

```sh [npm]
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
mkdir lambda
touch lambda/index.ts
```

```sh [yarn]
mkdir my-app
cd my-app
cdk init app -l typescript
yarn add hono
mkdir lambda
touch lambda/index.ts
```

```sh [pnpm]
mkdir my-app
cd my-app
cdk init app -l typescript
pnpm add hono
mkdir lambda
touch lambda/index.ts
```

```sh [bun]
mkdir my-app
cd my-app
cdk init app -l typescript
bun add hono
mkdir lambda
touch lambda/index.ts
```

:::

## 2. Hello World

编辑 `lambda/index.ts`。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)
```

## 3. 部署

编辑 `lib/cdk-stack.ts`。

```ts
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new NodejsFunction(this, 'lambda', {
      entry: 'lambda/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    })
    fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })
    new apigw.LambdaRestApi(this, 'myapi', {
      handler: fn,
    })
  }
}
```

最后，运行以下命令进行部署：

```sh
cdk deploy
```

## 处理二进制数据

Hono 支持二进制数据响应。
在 Lambda 中，返回二进制数据需要进行 base64 编码。
当在 `Content-Type` 头部设置二进制类型时，Hono 会自动将数据编码为 base64。

```ts
app.get('/binary', async (c) => {
  // ...
  c.status(200)
  c.header('Content-Type', 'image/png') // 表示二进制数据
  return c.body(buffer) // 支持 `ArrayBufferLike` 类型，会自动编码为 base64
})
```

## 访问 AWS Lambda 对象

在 Hono 中，你可以通过绑定 `LambdaEvent`、`LambdaContext` 类型并使用 `c.env` 来访问 AWS Lambda 的事件和上下文

```ts
import { Hono } from 'hono'
import type { LambdaEvent, LambdaContext } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  event: LambdaEvent
  lambdaContext: LambdaContext
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/aws-lambda-info/', (c) => {
  return c.json({
    isBase64Encoded: c.env.event.isBase64Encoded,
    awsRequestId: c.env.lambdaContext.awsRequestId,
  })
})

export const handler = handle(app)
```

## 访问请求上下文

在 Hono 中，你可以通过绑定 `LambdaEvent` 类型并使用 `c.env.event.requestContext` 来访问 AWS Lambda 的请求上下文。

```ts
import { Hono } from 'hono'
import type { LambdaEvent } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  event: LambdaEvent
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/custom-context/', (c) => {
  const lambdaContext = c.env.event.requestContext
  return c.json(lambdaContext)
})

export const handler = handle(app)
```

### v3.10.0 之前的版本（已弃用）

你可以通过绑定 `ApiGatewayRequestContext` 类型并使用 `c.env` 来访问 AWS Lambda 的请求上下文

```ts
import { Hono } from 'hono'
import type { ApiGatewayRequestContext } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  requestContext: ApiGatewayRequestContext
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/custom-context/', (c) => {
  const lambdaContext = c.env.requestContext
  return c.json(lambdaContext)
})

export const handler = handle(app)
```

## Lambda 响应流

通过更改 AWS Lambda 的调用模式，你可以实现[响应流](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/)。

```diff
fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
+  invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
})
```

通常情况下，实现这一功能需要使用 awslambda.streamifyResponse 向 NodeJS.WritableStream 写入数据块，但使用 AWS Lambda 适配器时，你可以使用 streamHandle 代替 handle 来实现 Hono 传统的流式响应。

```ts
import { Hono } from 'hono'
import { streamHandle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/stream', async (c) => {
  return streamText(c, async (stream) => {
    for (let i = 0; i < 3; i++) {
      await stream.writeln(`${i}`)
      await stream.sleep(1)
    }
  })
})

const handler = streamHandle(app)
```