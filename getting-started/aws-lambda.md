# AWS Lambda

AWS Lambda is a serverless platform by Amazon Web Services.
You can run your code in response to events and automatically manages the underlying compute resources for you.

Hono works on AWS Lambda with the Node.js 18+ environment.

## 1. Setup

When creating the application on AWS Lambda,
[CDK](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk.html)
is useful to setup the functions such as IAM Role, API Gateway, and others.

Initialize your project with the `cdk` CLI.

```
mkdir my-app
cd my-app
cdk init app -l typescript
npm i hono
mkdir lambda
```

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

Edit `lib/cdk-stack.ts`:

```ts
import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as lambda from 'aws-cdk-lib/aws-lambda'
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    const fn = new NodejsFunction(this, 'lambda', {
      entry: 'lambda/index.ts',
      handler: 'handler',
      runtime: lambda.Runtime.NODEJS_18_X,
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

Finally, run the command to deploy:

```
cdk deploy
```
