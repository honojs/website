# AWS Lambda

AWS Lambda is a serverless platform by Amazon Web Services.
You can run your code in response to events and automatically manages the underlying compute resources for you.

Hono works on AWS Lambda with the Node.js 18+ environment.

## 1. Setup

When creating the application on AWS Lambda,
[CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
is useful to setup the functions such as IAM Role, API Gateway, and others.

Initialize your project with the `cdk` CLI.

::: code-group

```sh [npm]
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
npm i -D esbuild
mkdir lambda
touch lambda/index.ts
```

```sh [yarn]
mkdir my-app
cd my-app
cdk init app -l typescript
yarn add hono
yarn add -D esbuild
mkdir lambda
touch lambda/index.ts
```

```sh [pnpm]
mkdir my-app
cd my-app
cdk init app -l typescript
pnpm add hono
pnpm add -D esbuild
mkdir lambda
touch lambda/index.ts
```

```sh [bun]
mkdir my-app
cd my-app
cdk init app -l typescript
bun add hono
bun add -D esbuild
mkdir lambda
touch lambda/index.ts
```

:::

## 2. Hello World

Edit `lambda/index.ts`.

```ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)
```

## 3. Deploy

Edit `lib/my-app-stack.ts`.

```ts
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new NodejsFunction(this, 'lambda', {
      entry: 'lambda/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_22_X,
    })
    const fnUrl = fn.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
    })
    new cdk.CfnOutput(this, 'lambdaUrl', {
      value: fnUrl.url!,
    })
  }
}
```

Finally, run the command to deploy:

```sh
cdk deploy
```

## Serve Binary data

Hono supports binary data as a response.
In Lambda, base64 encoding is required to return binary data.
Once binary type is set to `Content-Type` header, Hono automatically encodes data to base64.

```ts
app.get('/binary', async (c) => {
  // ...
  c.status(200)
  c.header('Content-Type', 'image/png') // means binary data
  return c.body(buffer) // supports `ArrayBufferLike` type, encoded to base64.
})
```

## Access AWS Lambda Object

In Hono, you can access the AWS Lambda Events and Context by binding the `LambdaEvent`, `LambdaContext` type and using `c.env`

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

## Access RequestContext

In Hono, you can access the AWS Lambda request context by binding the `LambdaEvent` type and using `c.env.event.requestContext`.

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

### Before v3.10.0 (deprecated)

you can access the AWS Lambda request context by binding the `ApiGatewayRequestContext` type and using `c.env.`

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

## Lambda response streaming

By changing the invocation mode of AWS Lambda, you can achieve [Streaming Response](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/).

```diff
fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
+  invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
})
```

Typically, the implementation requires writing chunks to NodeJS.WritableStream using awslambda.streamifyResponse, but with the AWS Lambda Adaptor, you can achieve the traditional streaming response of Hono by using streamHandle instead of handle.

```ts
import { Hono } from 'hono'
import { streamHandle } from 'hono/aws-lambda'
import { streamText } from 'hono/streaming'

const app = new Hono()

app.get('/stream', async (c) => {
  return streamText(c, async (stream) => {
    for (let i = 0; i < 3; i++) {
      await stream.writeln(`${i}`)
      await stream.sleep(1)
    }
  })
})

export const handler = streamHandle(app)
```
