---
title: Lambda@Edge
description: 使用 AWS CDK 在 Lambda@Edge 边缘计算平台上开发和部署 Hono 应用程序。
---
# Lambda@Edge

[Lambda@Edge](https://aws.amazon.com/lambda/edge/) 是亚马逊云服务（AWS）提供的一个无服务器平台。它允许您在 Amazon CloudFront 的边缘节点运行 Lambda 函数，使您能够自定义 HTTP 请求/响应的行为。

Hono 支持在 Node.js 18+ 环境下使用 Lambda@Edge。

## 1. 环境搭建

在 Lambda@Edge 上创建应用程序时，使用 [CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html) 可以方便地设置 CloudFront、IAM Role、API Gateway 等功能。

使用 `cdk` CLI 初始化您的项目。

::: code-group

```sh [npm]
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
mkdir lambda
```

```sh [yarn]
mkdir my-app
cd my-app
cdk init app -l typescript
yarn add hono
mkdir lambda
```

```sh [pnpm]
mkdir my-app
cd my-app
cdk init app -l typescript
pnpm add hono
mkdir lambda
```

```sh [bun]
mkdir my-app
cd my-app
cdk init app -l typescript
bun add hono
mkdir lambda
```

:::

## 2. Hello World

编辑 `lambda/index_edge.ts` 文件。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/lambda-edge'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono on Lambda@Edge!'))

export const handler = handle(app)
```

## 3. 部署

编辑 `bin/my-app.ts` 文件。

```ts
#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { MyAppStack } from '../lib/my-app-stack'

const app = new cdk.App()
new MyAppStack(app, 'MyAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
})
```

编辑 `lambda/cdk-stack.ts` 文件。

```ts
import { Construct } from 'constructs'
import * as cdk from 'aws-cdk-lib'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import * as s3 from 'aws-cdk-lib/aws-s3'

export class MyAppStack extends cdk.Stack {
  public readonly edgeFn: lambda.Function

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const edgeFn = new NodejsFunction(this, 'edgeViewer', {
      entry: 'lambda/index_edge.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    })

    // 上传任意 html 文件
    const originBucket = new s3.Bucket(this, 'originBucket')

    new cloudfront.Distribution(this, 'Cdn', {
      defaultBehavior: {
        origin: new origins.S3Origin(originBucket),
        edgeLambdas: [
          {
            functionVersion: edgeFn.currentVersion,
            eventType: cloudfront.LambdaEdgeEventType.VIEWER_REQUEST,
          },
        ],
      },
    })
  }
}
```

最后，运行以下命令进行部署：

```sh
cdk deploy
```

## 回调函数

如果您想添加基本身份验证并在验证后继续处理请求，可以使用 `c.env.callback()`

```ts
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import type { Callback, CloudFrontRequest } from 'hono/lambda-edge'
import { handle } from 'hono/lambda-edge'

type Bindings = {
  callback: Callback
  request: CloudFrontRequest
}

const app = new Hono<{ Bindings: Bindings }>()

app.get(
  '*',
  basicAuth({
    username: 'hono',
    password: 'acoolproject',
  })
)

app.get('/', async (c, next) => {
  await next()
  c.env.callback(null, c.env.request)
})

export const handler = handle(app)
```
