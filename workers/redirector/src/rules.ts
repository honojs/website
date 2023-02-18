type Rule = {
  from: string
  to: string
}

export const rules: Rule[] = [
  { from: '/docs/getting-started/', to: '/getting-started/basic' },
  { from: '/docs/getting-started/cloudflare-workers/', to: '/getting-started/cloudflare-workers' },
  { from: '/docs/getting-started/deno/', to: '/getting-started/deno' },
  { from: '/docs/getting-started/bun/', to: '/getting-started/bun' },
  { from: '/docs/getting-started/lagon/', to: '/getting-started/lagon' },
  { from: '/docs/getting-started/others/', to: '/getting-started/others' },
  { from: '/docs/api/', to: '/api/hono' },
  { from: '/docs/api/routing/', to: '/api/routing' },
  { from: '/docs/api/context/', to: '/api/context' },
  { from: '/docs/api/middleware/', to: '/api/middleware' },
  { from: '/docs/builtin-middleware/basic-auth/', to: '/middleware/builtin/basic-auth' },
  { from: '/docs/builtin-middleware/bearer-auth/', to: '/middleware/builtin/bearer-auth' },
  { from: '/docs/builtin-middleware/cache/', to: '/middleware/builtin/cache' },
  { from: '/docs/builtin-middleware/compress/', to: '/middleware/builtin/compress' },
  { from: '/docs/builtin-middleware/cors/', to: '/middleware/builtin/cors' },
  { from: '/docs/builtin-middleware/etag/', to: '/middleware/builtin/etag' },
  { from: '/docs/builtin-middleware/html/', to: '/middleware/builtin/html' },
  { from: '/docs/builtin-middleware/jsx/', to: '/middleware/builtin/jsx' },
  { from: '/docs/builtin-middleware/jwt/', to: '/middleware/builtin/jwt' },
  { from: '/docs/builtin-middleware/logger/', to: '/middleware/builtin/logger' },
  { from: '/docs/builtin-middleware/pretty-json/', to: '/middleware/builtin/pretty-json' },
  { from: '/docs/builtin-middleware/validator/', to: '/guides/validation' },
  { from: '/docs/builtin-middleware/', to: '/middleware/introduction' },
  { from: '/docs/third-party-middleware/', to: '/middleware/introduction' },
]
