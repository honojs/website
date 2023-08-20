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


| Option                          | Header                                                                                          | Value                                    | Default |
|---------------------------------|-------------------------------------------------------------------------------------------------|------------------------------------------|---------|
| -                               | X-Powered-By                                                                                   | (Delete Header)                          | True    |
| crossOriginEmbedderPolicy       | [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)   | require-corp                             | False    |
| crossOriginResourcePolicy       | [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy) | same-origin                              | True    |
| crossOriginOpenerPolicy         | [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy) | same-origin                              | True    |
| originAgentCluster              | [Origin-Agent-Cluster](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin-Agent-Cluster) | ?1                                       | True    |
| referrerPolicy                  | [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy) | no-referrer                              | True    |
| strictTransportSecurity         | [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security) | max-age=15552000; includeSubDomains      | True    |
| xContentTypeOptions             | [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options) | nosniff                                  | True    |
| xDnsPrefetchControl             | [X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control) | off                                      | True    |
| xDownloadOptions                | [X-Download-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Download-Options) | noopen                                   | True    |
| xFrameOptions                   | [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) | SAMEORIGIN                               | True    |
| xPermittedCrossDomainPolicies   | [X-Permitted-Cross-Domain-Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Permitted-Cross-Domain-Policies) | none                                     | True    |
| xXssProtection                  | [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection) | 0                                        | True    |



### Differences with Helmet
Headers Currently Being Implemented:

- Content-Security-Policy