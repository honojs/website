import { defineConfig } from 'vitepress'

const sidebars = {
  concepts: {
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
  gettingStarted: {
    text: 'Getting Started',
    collapsed: true,
    items: [
      { text: 'Basic', link: '/getting-started/basic' },
      { text: 'Cloudflare Workers', link: '/getting-started/cloudflare-workers' },
      { text: 'Cloudflare Pages', link: '/getting-started/cloudflare-pages' },
      { text: 'Deno', link: '/getting-started/deno' },
      { text: 'Bun', link: '/getting-started/bun' },
      { text: 'Fastly Compute@Edge', link: '/getting-started/fastly' },
      { text: 'Lagon', link: '/getting-started/lagon' },
      { text: 'Vercel', link: '/getting-started/vercel' },
      { text: 'AWS Lambda', link: '/getting-started/aws-lambda' },
      { text: 'Node.js', link: '/getting-started/nodejs' },
      { text: 'Others', link: '/getting-started/others' },
    ],
  },
  api: {
    text: 'API',
    collapsed: true,
    items: [
      { text: 'App', link: '/api/hono' },
      { text: 'Routing', link: '/api/routing' },
      { text: 'Context', link: '/api/context' },
      { text: 'HonoRequest', link: '/api/request' },
      { text: 'Exception', link: '/api/exception' },
      { text: 'Presets', link: '/api/presets' },
      { text: 'Adapter', link: '/api/adapter' },
    ],
  },
  guides: {
    text: 'Guides',
    collapsed: true,
    items: [
      { text: 'Middleware', link: '/guides/middleware' },
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
        text: 'Examples',
        link: '/guides/examples',
      },
      {
        text: 'Miscellaneous',
        link: '/guides/others',
      },
    ],
  },
  middleware: {
    text: 'Middleware',
    collapsed: true,
    items: [
      { text: 'Basic Authentication', link: '/middleware/builtin/basic-auth' },
      { text: 'Bearer Authentication', link: '/middleware/builtin/bearer-auth' },
      { text: 'Cache', link: '/middleware/builtin/cache' },
      { text: 'Compress', link: '/middleware/builtin/compress' },
      { text: 'Cookie', link: '/middleware/builtin/cookie' },
      { text: 'CORS', link: '/middleware/builtin/cors' },
      { text: 'ETag', link: '/middleware/builtin/etag' },
      { text: 'html', link: '/middleware/builtin/html' },
      { text: 'JSX', link: '/middleware/builtin/jsx' },
      { text: 'JWT', link: '/middleware/builtin/jwt' },
      { text: 'Timing', link: '/middleware/builtin/timing' },
      { text: 'Logger', link: '/middleware/builtin/logger' },
      { text: 'Pretty JSON', link: '/middleware/builtin/pretty-json' },
      { text: '3rd-party Middleware', link: '/middleware/third-party' },
    ],
  },
}

export default defineConfig({
  lang: 'en-US',
  title: 'Hono',
  description:
    'Ultrafast web framework for Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Vercel, Lagon, Node.js, and others. Fast, but not only fast.',
  lastUpdated: true,
  ignoreDeadLinks: true,
  cleanUrls: 'with-subfolders',
  markdown: {
    theme: {
      light: 'github-light',
      dark: 'github-dark',
    },
  },
  themeConfig: {
    logo: '/images/logo.png',
    siteTitle: 'Hono',
    algolia: {
      appId: '1GIFSU1REV',
      apiKey: '6a9bb2036e456356e224ece74546ca14',
      indexName: 'hono',
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'twitter', link: 'https://twitter.com/honojs' },
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
      { text: 'Examples', link: 'https://github.com/honojs/examples' },
      { text: 'Discussions', link: 'https://github.com/orgs/honojs/discussions' },
    ],
    sidebar: {
      '/': [
        sidebars['gettingStarted'],
        sidebars['concepts'],
        sidebars['api'],
        sidebars['guides'],
        sidebars['middleware'],
      ],
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
