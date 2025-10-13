import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import type { DefaultTheme } from 'vitepress'
import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'

const sidebars = (): DefaultTheme.SidebarItem[] => [
  {
    text: 'Concepts',
    collapsed: true,
    items: [
      { text: 'Motivation', link: '/docs/concepts/motivation' },
      { text: 'Routers', link: '/docs/concepts/routers' },
      { text: 'Benchmarks', link: '/docs/concepts/benchmarks' },
      { text: 'Web Standard', link: '/docs/concepts/web-standard' },
      { text: 'Middleware', link: '/docs/concepts/middleware' },
      {
        text: 'Developer Experience',
        link: '/docs/concepts/developer-experience',
      },
      { text: 'Hono Stacks', link: '/docs/concepts/stacks' },
    ],
  },
  {
    text: 'Getting Started',
    collapsed: true,
    items: [
      { text: 'Basic', link: '/docs/getting-started/basic' },
      {
        text: 'Cloudflare Workers',
        link: '/docs/getting-started/cloudflare-workers',
      },
      {
        text: 'Cloudflare Pages',
        link: '/docs/getting-started/cloudflare-pages',
      },
      { text: 'Deno', link: '/docs/getting-started/deno' },
      { text: 'Bun', link: '/docs/getting-started/bun' },
      {
        text: 'Fastly Compute',
        link: '/docs/getting-started/fastly',
      },
      { text: 'Vercel', link: '/docs/getting-started/vercel' },
      { text: 'Next.js', link: '/docs/getting-started/nextjs' },
      { text: 'Netlify', link: '/docs/getting-started/netlify' },
      {
        text: 'AWS Lambda',
        link: '/docs/getting-started/aws-lambda',
      },
      {
        text: 'Lambda@Edge',
        link: '/docs/getting-started/lambda-edge',
      },
      {
        text: 'Azure Functions',
        link: '/docs/getting-started/azure-functions',
      },
      {
        text: 'Google Cloud Run',
        link: '/docs/getting-started/google-cloud-run',
      },
      {
        text: 'Supabase Functions',
        link: '/docs/getting-started/supabase-functions',
      },
      {
        text: 'Ali Function Compute',
        link: '/docs/getting-started/ali-function-compute',
      },
      {
        text: 'Azion',
        link: '/docs/getting-started/azion',
      },
      {
        text: 'Service Worker',
        link: '/docs/getting-started/service-worker',
      },
      { text: 'Node.js', link: '/docs/getting-started/nodejs' },
    ],
  },
  {
    text: 'API',
    collapsed: true,
    items: [
      { text: 'App', link: '/docs/api/hono' },
      { text: 'Routing', link: '/docs/api/routing' },
      { text: 'Context', link: '/docs/api/context' },
      { text: 'HonoRequest', link: '/docs/api/request' },
      { text: 'Exception', link: '/docs/api/exception' },
      { text: 'Presets', link: '/docs/api/presets' },
    ],
  },
  {
    text: 'Guides',
    collapsed: true,
    items: [
      { text: 'create-hono', link: '/docs/guides/create-hono' },
      { text: 'Middleware', link: '/docs/guides/middleware' },
      { text: 'Helpers', link: '/docs/guides/helpers' },
      {
        text: 'JSX',
        link: '/docs/guides/jsx',
      },
      {
        text: 'Client Components',
        link: '/docs/guides/jsx-dom',
      },
      { text: 'Testing', link: '/docs/guides/testing' },
      {
        text: 'Validation',
        link: '/docs/guides/validation',
      },
      {
        text: 'RPC',
        link: '/docs/guides/rpc',
      },
      {
        text: 'Best Practices',
        link: '/docs/guides/best-practices',
      },
      {
        text: 'Miscellaneous',
        link: '/docs/guides/others',
      },
      {
        text: 'FAQs',
        link: '/docs/guides/faq',
      },
    ],
  },
  {
    text: 'Helpers',
    collapsed: true,
    items: [
      { text: 'Accepts', link: '/docs/helpers/accepts' },
      { text: 'Adapter', link: '/docs/helpers/adapter' },
      { text: 'ConnInfo', link: '/docs/helpers/conninfo' },
      { text: 'Cookie', link: '/docs/helpers/cookie' },
      { text: 'css', link: '/docs/helpers/css' },
      { text: 'Dev', link: '/docs/helpers/dev' },
      { text: 'Factory', link: '/docs/helpers/factory' },
      { text: 'html', link: '/docs/helpers/html' },
      { text: 'JWT', link: '/docs/helpers/jwt' },
      { text: 'Proxy', link: '/docs/helpers/proxy' },
      { text: 'Route', link: '/docs/helpers/route' },
      { text: 'SSG', link: '/docs/helpers/ssg' },
      { text: 'Streaming', link: '/docs/helpers/streaming' },
      { text: 'Testing', link: '/docs/helpers/testing' },
      { text: 'WebSocket', link: '/docs/helpers/websocket' },
    ],
  },
  {
    text: 'Middleware',
    collapsed: true,
    items: [
      {
        text: 'Basic Authentication',
        link: '/docs/middleware/builtin/basic-auth',
      },
      {
        text: 'Bearer Authentication',
        link: '/docs/middleware/builtin/bearer-auth',
      },
      {
        text: 'Body Limit',
        link: '/docs/middleware/builtin/body-limit',
      },
      { text: 'Cache', link: '/docs/middleware/builtin/cache' },
      { text: 'Combine', link: '/docs/middleware/builtin/combine' },
      { text: 'Compress', link: '/docs/middleware/builtin/compress' },
      {
        text: 'Context Storage',
        link: '/docs/middleware/builtin/context-storage',
      },
      { text: 'CORS', link: '/docs/middleware/builtin/cors' },
      {
        text: 'CSRF Protection',
        link: '/docs/middleware/builtin/csrf',
      },
      { text: 'ETag', link: '/docs/middleware/builtin/etag' },
      {
        text: 'IP Restriction',
        link: '/docs/middleware/builtin/ip-restriction',
      },
      {
        text: 'JSX Renderer',
        link: '/docs/middleware/builtin/jsx-renderer',
      },
      { text: 'JWK', link: '/docs/middleware/builtin/jwk' },
      { text: 'JWT', link: '/docs/middleware/builtin/jwt' },
      { text: 'Logger', link: '/docs/middleware/builtin/logger' },
      { text: 'Language', link: '/docs/middleware/builtin/language' },
      {
        text: 'Method Override',
        link: '/docs/middleware/builtin/method-override',
      },
      {
        text: 'Pretty JSON',
        link: '/docs/middleware/builtin/pretty-json',
      },
      {
        text: 'Request ID',
        link: '/docs/middleware/builtin/request-id',
      },
      {
        text: 'Secure Headers',
        link: '/docs/middleware/builtin/secure-headers',
      },
      { text: 'Timeout', link: '/docs/middleware/builtin/timeout' },
      { text: 'Timing', link: '/docs/middleware/builtin/timing' },
      {
        text: 'Trailing Slash',
        link: '/docs/middleware/builtin/trailing-slash',
      },
      {
        text: '3rd-party Middleware',
        link: '/docs/middleware/third-party',
      },
    ],
  },
  {
    text: 'LLM',
    collapsed: true,
    items: [
      {
        text: 'Docs List',
        link: '/llms.txt',
      },
      {
        text: 'Full Docs',
        link: '/llms-full.txt',
      },
      {
        text: 'Tiny Docs',
        link: '/llms-small.txt',
      },
    ],
  },
]

export const sidebarsExamples = (): DefaultTheme.SidebarItem[] => [
  {
    text: 'Applications',
    items: [
      {
        text: 'Web API',
        link: '/examples/web-api',
      },
      {
        text: 'Proxy',
        link: '/examples/proxy',
      },
      {
        text: 'File upload',
        link: '/examples/file-upload',
      },
      {
        text: 'Bind a reverse proxy',
        link: '/examples/behind-reverse-proxy',
      },
      {
        text: 'Error handling in Validator',
        link: '/examples/validator-error-handling',
      },
      {
        text: 'Grouping routes for RPC',
        link: '/examples/grouping-routes-rpc',
      },
      {
        text: 'CBOR',
        link: '/examples/cbor',
      },
    ],
  },
  {
    text: '3rd-party Middleware',
    items: [
      {
        text: 'Zod OpenAPI',
        link: '/examples/zod-openapi',
      },
      {
        text: 'Hono OpenAPI',
        link: '/examples/hono-openapi',
      },
      {
        text: 'Swagger UI',
        link: '/examples/swagger-ui',
      },
      {
        text: 'Scalar',
        link: '/examples/scalar',
      },
      {
        text: 'Hono Docs Generator',
        link: '/examples/hono-docs',
      },
    ],
  },
  {
    text: 'Integrations',
    items: [
      {
        text: 'Cloudflare Durable Objects',
        link: '/examples/cloudflare-durable-objects',
      },
      {
        text: 'Cloudflare Queue',
        link: '/examples/cloudflare-queue',
      },
      {
        text: 'Cloudflare Testing',
        link: '/examples/cloudflare-vitest',
      },
      {
        text: 'Remix',
        link: '/examples/with-remix',
      },
      {
        text: 'htmx',
        link: '/examples/htmx',
      },
      {
        text: 'Stripe Webhook',
        link: '/examples/stripe-webhook',
      },
      {
        text: 'Prisma on Cloudflare',
        link: '/examples/prisma',
      },
      {
        text: 'Better Auth',
        link: '/examples/better-auth',
      },
      {
        text: 'Better Auth on Cloudflare',
        link: '/examples/better-auth-on-cloudflare',
      },
      {
        text: 'Pylon (GraphQL)',
        link: '/examples/pylon',
      },
      {
        text: 'Stytch Authentication',
        link: '/examples/stytch-auth',
      },
      {
        text: 'Auth.js',
        link: '/examples/hono-authjs.md',
      },
    ],
  },
]

export default defineConfig({
  lang: 'en-US',
  title: 'Hono',
  description:
    'Web framework built on Web Standards for Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Node.js, and others. Fast, but not only fast.',
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
    config(md) {
      md.use(groupIconMdPlugin)
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
      }),
    ],
  },
  themeConfig: {
    logo: '/images/logo.svg',
    siteTitle: 'Hono',
    algolia: {
      appId: '1GIFSU1REV',
      apiKey: 'c6a0f86b9a9f8551654600f28317a9e9',
      indexName: 'hono',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'x', link: 'https://x.com/honojs' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/hono.dev' },
    ],
    editLink: {
      pattern: 'https://github.com/honojs/website/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2022-present Yusuke Wada & Hono contributors. "kawaii" logo is created by SAWARATSUKI.',
    },
    nav: [
      { text: 'Docs', link: '/docs/' },
      { text: 'Examples', link: '/examples/' },
      {
        text: 'Discussions',
        link: 'https://github.com/orgs/honojs/discussions',
      },
    ],
    sidebar: {
      '/': sidebars(),
      '/examples/': sidebarsExamples(),
    },
  },
  head: [
    [
      'meta',
      {
        property: 'og:image',
        content: 'https://hono.dev/images/hono-title.png',
      },
    ],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'twitter:domain', content: 'hono.dev' }],
    [
      'meta',
      {
        property: 'twitter:image',
        content: 'https://hono.dev/images/hono-title.png',
      },
    ],
    [
      'meta',
      { property: 'twitter:card', content: 'summary_large_image' },
    ],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  titleTemplate: ':title - Hono',
  vite: {
    plugins: [
      groupIconVitePlugin({
        customIcon: {
          cloudflare: 'logos:cloudflare-workers-icon',
        },
      }),
    ],
    server: {
      allowedHosts: true,
    },
  },
})
