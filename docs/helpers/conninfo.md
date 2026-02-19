# ConnInfo Helper

The ConnInfo Helper helps you to get the connection information. For example, you can get the client's remote address easily.

## Import

::: code-group

```ts [Cloudflare Workers]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/cloudflare-workers'
```

```ts [Deno]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/deno'
```

```ts [Bun]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/bun'
```

```ts [Vercel]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/vercel'
```

```ts [AWS Lambda]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/aws-lambda'
```

```ts [Cloudflare Pages]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/cloudflare-pages'
```

```ts [Netlify]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/netlify'
```

```ts [Lambda@Edge]
import { Hono } from 'hono'
import { getConnInfo } from 'hono/lambda-edge'
```

```ts [Node.js]
import { Hono } from 'hono'
import { getConnInfo } from '@hono/node-server/conninfo'
```

:::

## Usage

```ts
const app = new Hono()

app.get('/', (c) => {
  const info = getConnInfo(c) // info is `ConnInfo`
  return c.text(`Your remote address is ${info.remote.address}`)
})
```

## Type Definitions

The type definitions of the values that you can get from `getConnInfo()` are the following:

```ts
type AddressType = 'IPv6' | 'IPv4' | undefined

type NetAddrInfo = {
  /**
   * Transport protocol type
   */
  transport?: 'tcp' | 'udp'
  /**
   * Transport port number
   */
  port?: number

  address?: string
  addressType?: AddressType
} & (
  | {
      /**
       * Host name such as IP Addr
       */
      address: string

      /**
       * Host name type
       */
      addressType: AddressType
    }
  | {}
)

/**
 * HTTP Connection information
 */
interface ConnInfo {
  /**
   * Remote information
   */
  remote: NetAddrInfo
}
```
