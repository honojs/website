# Alibaba Cloud Function Compute

[Alibaba Cloud Function Compute](https://www.alibabacloud.com/en/product/function-compute) is a fully managed, event-driven compute service. Function Compute allows you to focus on writing and uploading code without having to manage infrastructure such as servers.

## 1. Setup

> [serverless-devs](https://github.com/Serverless-Devs/Serverless-Devs) is an open source and open serverless developer platform dedicated to providing developers with a powerful tool chain system. Through this platform, developers can not only experience multi cloud serverless products with one click and rapidly deploy serverless projects, but also manage projects in the whole life cycle of serverless applications, and combine serverless devs with other tools / platforms very simply and quickly to further improve the efficiency of R & D, operation and maintenance.

Install [serverless-devs](https://github.com/Serverless-Devs/Serverless-Devs) CLI

```sh
npm install @serverless-devs/s -g
```

Add the AK & SK configuration

```sh
s config add
# Please select a provider: Alibaba Cloud (alibaba)
# Input your AccessKeyID & AccessKeySecret
```

## 2. Hello World

Create a new project in a new directory:

```sh
npm init
```

Add the required dependencies:

```sh
npm add hono @hono/node-server
npm add esbuild --save-dev
```

Edit `scripts` section in `package.json`:

```json
{
  "scripts": {
    "build": "esbuild --bundle --outfile=./dist/index.js --platform=node --target=node20 ./src/index.ts",
    "dev": "node ./dist/index.js",
    "deploy": "s deploy -y"
  }
}
```

Edit `src/index.ts`:

```ts
import { serve } from '@hono/node-server'
import { Hono } from 'hono'

const REQUEST_ID_HEADER = 'x-fc-request-id'

const app = new Hono()

app.post('/initialize', (c) => {
  console.log(`RequestId: ${c.req.header(REQUEST_ID_HEADER)}`)
  return c.text('Initialize')
})

app.post('/invoke', (c) => {
  console.log(`RequestId: ${c.req.header(REQUEST_ID_HEADER)}`)
  return c.text('Invoke')
})

app.get('/', (c) => {
  return c.text('Hello from index!')
})

app.get('/hello', (c) => {
  return c.text('Hi!')
})

const port = 9000
console.log(`Server is running on port ${port}`)

serve({
  fetch: app.fetch,
  port,
})
```

Edit `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true,
    "lib": ["ESNext"],
    "types": [],
    "jsx": "react-jsx",
    "jsxImportSource": "hono/jsx"
  }
}
```

Edit `s.yaml`:

```yaml
edition: 3.0.0
name: my-app
access: 'default'

vars:
  region: 'us-west-1'

resources:
  my_app:
    component: fc3
    props:
      region: ${vars.region}
      functionName: 'my-app'
      runtime: 'custom.debian10'
      description: 'hello world by Hono'
      timeout: 10
      memorySize: 512
      environmentVariables:
        PATH: >-
          /var/fc/lang/nodejs20/bin:/usr/local/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/opt/bin
        NODE_PATH: /opt/nodejs/node_modules
      cpu: 0.5
      diskSize: 512
      code: ./dist
      customRuntimeConfig:
        command:
          - node
          - index.js
        port: 9000
      triggers:
        - triggerConfig:
            methods:
              - GET
              - POST
              - PUT
              - DELETE
            authType: anonymous
            disableURLInternet: false
          triggerName: default
          description: ''
          qualifier: LATEST
          triggerType: http
```

## 3. Deploy

Finally, run the command to deploy:

```sh
npm install # install dependencies
npm run build # Compile the TypeScript code to JavaScript
npm run deploy # Deploy the function to Alibaba Cloud Function Compute
```
