# Secure Headers Middleware

Secure Headers Middleware simplifies the setup of security headers. Inspired in part by the capabilities of Helmet, it allows you to control the activation and deactivation of specific security headers.

## Import

::: code-group

```ts [npm]
import { Hono } from 'hono'
import { secureHeaders } from 'hono/secure-headers'
```

```ts [Deno]
import { Hono } from 'https://deno.land/x/hono/mod.ts'
import { secureHeaders } from 'https://deno.land/x/hono/middleware.ts'
```

:::

## Usage

You can use the optimal settings by default.

```ts
const app = new Hono()
app.get('*', secureHeaders())
```

You can suppress unnecessary headers by setting them to false.

```ts
const app = new Hono()
app.get(
  '*',
  secureHeaders({
    xFrameOptions: false,
    xXssProtection: false,
  })
)
```

You can override default header values using a string.

```ts
const app = new Hono()
app.get(
  '*',
  secureHeaders({
    strictTransportSecurity: 'max-age=63072000; includeSubDomains; preload',
    xFrameOptions: 'DENY',
    xXssProtection: '1',
  })
)
```

## Supported Options

Each option corresponds to the following Header Key-Value pairs.

| Option                        | Header                                                                                                                           | Value                                                                      | Default    |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- |
| -                             | X-Powered-By                                                                                                                     | (Delete Header)                                                            | True       |
| contentSecurityPolicy         | [Content-Security-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)                                                 | Usage: [Setting Content-Security-Policy](#setting-content-security-policy) | No Setting |
| crossOriginEmbedderPolicy     | [Cross-Origin-Embedder-Policy](https://developer.mozilla.org/docs/Web/HTTP/Headers/Cross-Origin-Embedder-Policy)                 | require-corp                                                               | **False**  |
| crossOriginResourcePolicy     | [Cross-Origin-Resource-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Resource-Policy)           | same-origin                                                                | True       |
| crossOriginOpenerPolicy       | [Cross-Origin-Opener-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cross-Origin-Opener-Policy)               | same-origin                                                                | True       |
| originAgentCluster            | [Origin-Agent-Cluster](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin-Agent-Cluster)                           | ?1                                                                         | True       |
| referrerPolicy                | [Referrer-Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy)                                     | no-referrer                                                                | True       |
| reportingEndpoints            | [Reporting-Endpoints](https://www.w3.org/TR/reporting-1/#header)                                                                 | Usage: [Setting Content-Security-Policy](#setting-content-security-policy) | No Setting |
| reportTo                      | [Report-To](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/report-to)                         | Usage: [Setting Content-Security-Policy](#setting-content-security-policy) | No Setting |
| strictTransportSecurity       | [Strict-Transport-Security](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security)                 | max-age=15552000; includeSubDomains                                        | True       |
| xContentTypeOptions           | [X-Content-Type-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options)                       | nosniff                                                                    | True       |
| xDnsPrefetchControl           | [X-DNS-Prefetch-Control](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-DNS-Prefetch-Control)                       | off                                                                        | True       |
| xDownloadOptions              | [X-Download-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Download-Options)                               | noopen                                                                     | True       |
| xFrameOptions                 | [X-Frame-Options](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options)                                     | SAMEORIGIN                                                                 | True       |
| xPermittedCrossDomainPolicies | [X-Permitted-Cross-Domain-Policies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Permitted-Cross-Domain-Policies) | none                                                                       | True       |
| xXssProtection                | [X-XSS-Protection](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection)                                   | 0                                                                          | True       |

## Middleware Conflict

Please be cautious about the order of specification when dealing with middleware that manipulates the same header.

In this case, Secure-headers operates and the `x-powered-by` is removed:

```ts
const app = new Hono()
app.use('*', secureHeaders())
app.use('*', poweredBy())
```

In this case, Powered-By operates and the `x-powered-by` is added:

```ts
const app = new Hono()
app.use('*', poweredBy())
app.use('*', secureHeaders())
```

## Setting Content-Security-Policy

```ts
const app = new Hono()
app.use(
  '/test',
  secureHeaders({
    reportingEndpoints: [
      {
        name: 'endpoint-1',
        url: 'https://example.com/reports',
      },
    ],
    // -- or alternatively
    // reportTo: [
    //   {
    //     group: 'endpoint-1',
    //     max_age: 10886400,
    //     endpoints: [{ url: 'https://example.com/reports' }],
    //   },
    // ],
    contentSecurityPolicy: {
      defaultSrc: ["'self'"],
      baseUri: ["'self'"],
      childSrc: ["'self'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", 'https:', 'data:'],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
      frameSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
      manifestSrc: ["'self'"],
      mediaSrc: ["'self'"],
      objectSrc: ["'none'"],
      reportTo: 'endpoint-1',
      sandbox: ['allow-same-origin', 'allow-scripts'],
      scriptSrc: ["'self'"],
      scriptSrcAttr: ["'none'"],
      scriptSrcElem: ["'self'"],
      styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
      styleSrcAttr: ['none'],
      styleSrcElem: ["'self'", 'https:', "'unsafe-inline'"],
      upgradeInsecureRequests: [],
      workerSrc: ["'self'"],
    },
  })
)
```
