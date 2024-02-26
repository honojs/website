# AWS Lambda

AWS Lambda は Amazon Web Services のサーバーレスプラットフォームです。
イベントに応じてコードを実行し、コンピュートリソースは自動で管理されます。

Hono は AWS Lambda の Node.js 18 以上の環境で動作します。

## 1. セットアップ

AWS Lambda でアプリケーションを作成する場合、
[CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html)
が IAM ロールや API ゲートウェイなどを設定するのに役立ちます。

`cdl` CLI を使ってプロジェクトを初期化します。

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

`lambda/index.ts` を編集します。

```ts
import { Hono } from 'hono'
import { handle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export const handler = handle(app)
```

## 3. デプロイ

`lib/cdk-stack.ts` を編集してください。

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

最後にこのコマンドでデプロイします:

```
cdk deploy
```

## バイナリデータの提供

Hono はバイナリデータのレスポンスもサポートします。
Lambda ではバイナリデータを base64 でエンコードして返す必要があります。
`Content-Type` ヘッダにバイナリタイプが指定されると、 Hono は自動で base64 エンコードを行います。

```ts
app.get('/binary', async (c) => {
  // ...
  c.status(200)
  c.header('Content-Type', 'image/png') // means binary data
  return c.body(buffer) // supports `ArrayBufferLike` type, encoded to base64.
})
```

## AWS Lambda オブジェクトへのアクセス


Hono では、 `LambdaEvent` 、 `LambdaContext` タイプをバインドし `c.env` で AWS Lambda イベントとコンテキストにアクセスできます。

```ts
import { Hono } from 'hono'
import type { LambdaEvent, LambdaContext } from 'hono/aws-lambda'
import { handle } from 'hono/aws-lambda'

type Bindings = {
  event: LambdaEvent
  context: LambdaContext 
}

const app = new Hono<{ Bindings: Bindings }>()

app.get('/aws-lambda-info/', (c) => {
  return c.json({
      isBase64Encoded: c.env.event.isBase64Encoded,
      awsRequestId: c.env.context.awsRequestId
  })
})

export const handler = handle(app)
```

## RequestContext へのアクセス

Hono では、 `LambdaEvent` タイプをバインドし、`c.env.event.requestContext` で AWS Lambda のリクエストコンテキストにアクセスできます。

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

### v3.10.0 以前 (非推奨)

`ApiGatewayRequestContext` タイプをバインドし、 `c.env.` を使用することで AWS Lambda リクエストにアクセスできます。

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

## Lambda レスポンスストリーミング

AWS Lambda の呼び出しモードを変更することで[ストリーミングレスポンス](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-response-streaming/)を実現できます。


```diff
fn.addFunctionUrl({
  authType: lambda.FunctionUrlAuthType.NONE,
+  invokeMode: lambda.InvokeMode.RESPONSE_STREAM,
})
```

通常 awslambda.streamifyResponse を使用して NodeJS.WritableStream にチャンクを描き込む必要がありますが、 AWS Lambda アダプタを使用すると、ハンドルの代わりに streamHandle を使用することで Hono のストリーミングレスポンスを実現できます。

```ts
import { Hono } from 'hono'
import { streamHandle } from 'hono/aws-lambda'

const app = new Hono()

app.get('/stream', async (c) => {
  return c.streamText(async (stream) => {
    for (let i = 0; i < 3; i++) {
      await stream.writeln(`${i}`)
      await stream.sleep(1)
    }
  })
})

const handler = streamHandle(app)
```
