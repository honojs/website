# Lambda@Edge

[Lambda@Edge](https://aws.amazon.com/lambda/edge/) is a serverless platform by Amazon Web Services. It allows you to run Lambda functions at Amazon CloudFront's edge locations, enabling you to customize behaviors for HTTP requests/responses.

Hono supports Lambda@Edge with the Node.js 18+ environment.

## 1. Setup

When creating the application on Lambda@Edge,
[CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html)
is useful to setup the functions such as CloudFront, IAM Role, API Gateway, and others.

Initialize your project with the `cdk` CLI.

```
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
mkdir lambda
```

## 2. Hello World

### Origin
Edit `lambda/index.ts`.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)
```

### Edge

Edit `lambda/index_edge.ts`.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/lambda-edge'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono on Lambda@Edge!'))

export const handler = handle(app)
```

## 3. Deploy

Edit `bin/my-app.ts`.

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


Edit `lambda/cdk-stack.ts`.

```ts
import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigw from 'aws-cdk-lib/aws-apigateway';

export class MyAppStack extends cdk.Stack {
  public readonly edgeFn: lambda.Function;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const edgeFn = new NodejsFunction(this, 'edgeViewer', {
      entry: 'lambda/index_edge.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });

    const originFn = new NodejsFunction(this, 'OriginFunction', {
      entry: 'lambda/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
    });
    const originApi = new apigw.LambdaRestApi(this, 'originApi', {
      handler: originFn,
    });

    new cloudfront.Distribution(this, 'Cdn', {
      defaultBehavior: {
        origin: new origins.RestApiOrigin(originApi),
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

Finally, run the command to deploy:

```
cdk deploy
```

## Callback

If you want to add Basic Auth and continue with request processing after verification, you can use c.env.callback()

```ts
import { Hono } from 'hono'
import { Callback, CloudFrontRequest, handle } from 'hono/lambda-edge'

type Bindings = {
  callback: Callback
  request: CloudFrontRequest
}

const app = new Hono<{ Bindings: Bindings }>()

app.get(
  '*',
  basicAuth({
    username: 'a',
    password: 'b'
  })
)

app.get('/index.html', async (c, next) => {
  await next()
  c.env.callback(null, c.env.request)
})

export const handler = handle(app)
```
