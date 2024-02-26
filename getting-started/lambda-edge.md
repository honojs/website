# Lambda@Edge

[Lambda@Edge](https://aws.amazon.com/lambda/edge/) は Amazon Web Services のサーバーレスプラットフォームです。 これにより、 Amazon CloudFront のエッジロケーションで Lambda 関数を実行できるようになり、 HTTP リクエスト/レスポンスをカスタマイズできるようになります。

Hono は Node.js 18以上の Lambda@Edge をサポートします。

## 1. セットアップ

Lambda@Edge でアプリケーションを作成する時に
[CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html)
is useful to setup the functions such as CloudFront, IAM Role, API Gateway, and others.
CloudFront や IAM ロール、 API ゲートウェイなどを設定するのに役立ちます。

`cdk` CLI を使用してプロジェクトを初期化します。

::: code-group

```txt [npm]
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
mkdir lambda
```

```txt [yarn]
mkdir my-app
cd my-app
cdk init app -l typescript
yarn add hono
mkdir lambda
```

```txt [pnpm]
mkdir my-app
cd my-app
cdk init app -l typescript
pnpm add hono
mkdir lambda
```

```txt [bun]
mkdir my-app
cd my-app
cdk init app -l typescript
bun add hono
mkdir lambda
```

:::

## 2. Hello World

`lambda/index_edge.ts` を編集します。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/lambda-edge'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono on Lambda@Edge!'))

export const handler = handle(app)
```

## 3. デプロイ

`bin/my-app.ts` を変更します。

```ts
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyAppStack } from '../lib/my-app-stack';

const app = new cdk.App();
new MyAppStack(app, 'MyAppStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: 'us-east-1',
  },
});
```


`lambda/cdk-stack.ts` も変更します。

```ts
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class MyAppStack extends cdk.Stack {
  public readonly edgeFn: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const edgeFn = new NodejsFunction(this, 'edgeViewer', {
      entry: 'lambda/index_edge.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_20_X,
    });

    // Upload any html
    const originBucket = new s3.Bucket(this, 'originBucket');

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
    });
  }
}

```

最後に、以下のコマンドをを実行してデプロイします:

```
cdk deploy
```

## コールバック

Basic 認証後にリクエストを処理したい場合は `c.env.callback()` を使用できます。

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
