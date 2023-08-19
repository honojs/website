# Secure Header Middleware

Secure Header Middleware simplifies the setup of security headers. Inspired in part by the capabilities of Helmet, it allows you to control the activation and deactivation of specific security headers.

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { SecureHeader } from 'hono/secure-header'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { SecureHeader } from 'https://deno.land/x/hono/secure-header.ts'
```

:::

## Usage

You can use the optimal settings by default.

```ts
const app = new Hono()
app.get('*', secureHeader())
```

You can suppress unnecessary headers by setting them to false.

```ts
const app = new Hono()
app.get(
  '*',
  secureHeader({
    xFrameOptions: false,
    xXssProtection: false,
  })
)
```

## Note

### Supported Options
Each option corresponds to the following Header Key-Value pairs. The default for each option is True.


| Option                          | Header                                                                                          | Default Value                              |
|---------------------------------|-------------------------------------------------------------------------------------------------|--------------------------------------------|
| -                               | X-Powered-By | (Delete Header) |
| crossOriginEmbedderPolicy       | [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)   | require-corp                                |
| crossOriginResourcePolicy       | [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy) | same-origin |
| crossOriginOpenerPolicy         | [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) | same-origin |
| originAgentCluster              | [Origin-Agent-Cluster](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin-Agent-Cluster) | ?1 |
| referrerPolicy                  | [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) | no-referrer |
| strictTransportSecurity         | [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) | max-age=15552000; includeSubDomains |
| xContentTypeOptions             | [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) | nosniff |
| xDnsPrefetchControl             | [X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control) | off |
| xDownloadOptions                | [X-Download-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Download-Options) | noopen |
| xFrameOptions                   | [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) | SAMEORIGIN |
| xPermittedCrossDomainPolicies   | [X-Permitted-Cross-Domain-Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Permitted-Cross-Domain-Policies) | none |
| xXssProtection                  | [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) | 0 |

### Differences with Helmet
Headers Currently Being Implemented:

- Content-Security-Policy