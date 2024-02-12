import { defineConfig } from 'vitepress'
import type { DefaultTheme } from 'vitepress'

const sidebars = (): DefaultTheme.SidebarItem[] => [
  {
    text: 'Concepts',
    collapsed: true,
    items: [
      { text: 'Motivation', link: '/concepts/motivation' },
      { text: 'Routers', link: '/concepts/routers' },
      { text: 'Benchmarks', link: '/concepts/benchmarks' },
      { text: 'Web Standard', link: '/concepts/web-standard' },
      { text: 'Middleware', link: '/concepts/middleware' },
      { text: 'Developer Experience', link: '/concepts/developer-experience.md' },
      { text: 'Hono Stacks', link: '/concepts/stacks' },
    ],
  },
  {
    text: 'Getting Started',
    collapsed: true,
    items: [
      { text: 'Basic', link: '/getting-started/basic' },
      { text: 'Cloudflare Workers', link: '/getting-started/cloudflare-workers' },
      { text: 'Cloudflare Pages', link: '/getting-started/cloudflare-pages' },
      { text: 'Deno', link: '/getting-started/deno' },
      { text: 'Bun', link: '/getting-started/bun' },
      { text: 'Fastly Compute', link: '/getting-started/fastly' },
      { text: 'Vercel', link: '/getting-started/vercel' },
      { text: 'Netlify', link: '/getting-started/netlify' },
      { text: 'AWS Lambda', link: '/getting-started/aws-lambda' },
      { text: 'Lambda@Edge', link: '/getting-started/lambda-edge' },
      { text: 'Supabase Functions', link: '/getting-started/supabase-functions' },
      { text: 'Node.js', link: '/getting-started/nodejs' },
      { text: 'Others', link: '/getting-started/others' },
    ],
  },
  {
    text: 'API',
    collapsed: true,
    items: [
      { text: 'App', link: '/api/hono' },
      { text: 'Routing', link: '/api/routing' },
      { text: 'Context', link: '/api/context' },
      { text: 'HonoRequest', link: '/api/request' },
      { text: 'Exception', link: '/api/exception' },
      { text: 'Presets', link: '/api/presets' },
    ],
  },
  {
    text: 'Guides',
    collapsed: true,
    items: [
      { text: 'Middleware', link: '/guides/middleware' },
      { text: 'Helpers', link: '/guides/helpers' },
      {
        text: 'JSX',
        link: '/guides/jsx',
      },
      {
        text: 'Client Components',
        link: '/guides/jsx-dom',
      },
      { text: 'Testing', link: '/guides/testing' },
      {
        text: 'Validation',
        link: '/guides/validation',
      },
      {
        text: 'RPC',
        link: '/guides/rpc',
      },
      {
        text: 'Best Practices',
        link: '/guides/best-practices',
      },
      {
        text: 'Examples',
        link: '/guides/examples',
      },
      {
        text: 'Miscellaneous',
        link: '/guides/others',
      },
    ],
  },
  {
    text: 'Helpers',
    collapsed: true,
    items: [
      { text: 'Accepts', link: '/helpers/accepts' },
      { text: 'Adapter', link: '/helpers/adapter' },
      { text: 'Cookie', link: '/helpers/cookie' },
      { text: 'css', link: '/helpers/css' },
      { text: 'Dev', link: '/helpers/dev' },
      { text: 'Factory', link: '/helpers/factory' },
      { text: 'html', link: '/helpers/html' },
      { text: 'JWT', link: '/helpers/jwt' },
      { text: 'SSG', link: '/helpers/ssg' },
      { text: 'Streaming', link: '/helpers/streaming' },
      { text: 'Testing', link: '/helpers/testing' },
    ],
  },
  {
    text: 'Middleware',
    collapsed: true,
    items: [
      { text: 'Basic Authentication', link: '/middleware/builtin/basic-auth' },
      { text: 'Bearer Authentication', link: '/middleware/builtin/bearer-auth' },
      { text: 'Cache', link: '/middleware/builtin/cache' },
      { text: 'Compress', link: '/middleware/builtin/compress' },
      { text: 'CORS', link: '/middleware/builtin/cors' },
      { text: 'CSRF Protection', link: '/middleware/builtin/csrf' },
      { text: 'ETag', link: '/middleware/builtin/etag' },
      { text: 'JSX Renderer', link: '/middleware/builtin/jsx-renderer' },
      { text: 'JWT', link: '/middleware/builtin/jwt' },
      { text: 'Timing', link: '/middleware/builtin/timing' },
      { text: 'Logger', link: '/middleware/builtin/logger' },
      { text: 'Pretty JSON', link: '/middleware/builtin/pretty-json' },
      { text: 'Secure Headers', link: '/middleware/builtin/secure-headers' },
      { text: '3rd-party Middleware', link: '/middleware/third-party' },
    ],
  },
]

const sidebarsSnippets = (): DefaultTheme.SidebarItem[] => [
  {
    text: 'Application',
    items: [
      {
        text: 'File upload',
        link: '/snippets/file-upload',
      },
      {
        text: 'Error handling in Validator',
        link: '/snippets/validator-error-handling',
      },
      {
        text: 'Grouping routes for RPC',
        link: '/snippets/grouping-routes-rpc',
      },
    ],
  },
  {
    text: '3rd-party Middleware',
    items: [
      {
        text: 'Zod OpenAPI',
        link: '/snippets/zod-openapi',
      },
      {
        text: 'Swagger UI',
        link: '/snippets/swagger-ui',
      },
    ],
  },
  {
    text: 'Ecosystem',
    items: [
      {
        text: 'Remix + Hono',
        link: '/snippets/with-remix',
      },
    ],
  },
  {
    text: 'Integration',
    items: [
      {
        text: 'Cloudflare Durable Objects',
        link: '/snippets/cloudflare-durable-objects',
      },
      {
        text: 'Cloudflare Queue',
        link: '/snippets/cloudflare-queue',
      },
      {
        text: 'htmx',
        link: '/snippets/htmx',
      },
    ],
  },
]

export default defineConfig({
  lang: 'en-US',
  title: 'Hono',
  description:
    'Ultrafast web framework for Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Node.js, and others. Fast, but not only fast.',
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: true,
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  themeConfig: {
    logo: '/images/logo-small.png',
    siteTitle: 'Hono',
    algolia: {
      appId: '1GIFSU1REV',
      apiKey: '6a9bb2036e456356e224ece74546ca14',
      indexName: 'hono',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'x', link: 'https://twitter.com/honojs' },
    ],
    editLink: {
      pattern: 'https://github.com/honojs/website/edit/main/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Yusuke Wada & Hono contributors',
    },
    nav: [
      { text: 'Docs', link: '/top' },
      { text: 'Snippets', link: '/snippets/top' },
      { text: 'Examples', link: 'https://github.com/honojs/examples' },
      { text: 'Discussions', link: 'https://github.com/orgs/honojs/discussions' },
    ],
    sidebar: {
      '/': sidebars(),
      '/snippets/': sidebarsSnippets(),
    },
  },
  head: [
    ['meta', { property: 'og:image', content: 'https://hono.dev/images/hono-title.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'twitter:domain', content: 'hono.dev' }],
    ['meta', { property: 'twitter:image', content: 'https://hono.dev/images/hono-title.png' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  titleTemplate: ':title - Hono',
})
