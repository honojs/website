import { defineConfig } from 'vitepress'

const sidebars = {
  introduction: {
    text: 'Introduction',
    collapsed: false,
    items: [
      { text: 'Getting Started', link: '/docs/getting-started/basic' },
      { text: 'Concepts', link: '/docs/introduction/concepts' },
      { text: 'Benchmarks', link: '/docs/introduction/benchmarks' },
    ],
  },
  platforms: {
    text: 'Platforms',
    collapsed: false,
    items: [
      { text: 'Cloudflare Workers', link: '/docs/getting-started/cloudflare-workers' },
      { text: 'Cloudflare Pages', link: '/docs/getting-started/cloudflare-pages' },
      { text: 'Deno', link: '/docs/getting-started/deno' },
      { text: 'Bun', link: '/docs/getting-started/bun' },
      { text: 'Fastly Compute@Edge', link: '/docs/getting-started/fastly' },
      { text: 'Lagon', link: '/docs/getting-started/lagon' },
      { text: 'Vercel', link: '/docs/getting-started/vercel' },
      { text: 'Node.js', link: '/docs/getting-started/nodejs' },
      { text: 'Others', link: '/docs/getting-started/others' },
    ],
  },
  reference: {
    text: 'Reference',
    collapsed: false,
    items: [
      { text: 'App', link: '/docs/api/hono' },
      { text: 'Routing', link: '/docs/api/routing' },
      { text: 'Context', link: '/docs/api/context' },
      { text: 'HonoRequest', link: '/docs/api/request' },
      { text: 'Exception', link: '/docs/api/exception' },
    ],
  },
  guides: {
    text: 'Guides',
    collapsed: false,
    items: [
      { text: 'Middleware', link: '/docs/guides/middleware' },
      {
        text: 'Validation',
        link: '/docs/guides/validation',
      },
      {
        text: 'RPC',
        link: '/docs/guides/rpc',
      },
    ],
  },
  'builtin-middleware': {
    text: 'Built-in Middleware',
    collapsible: true,
    items: [
      { text: 'Basic Authentication', link: '/middleware/builtin/basic-auth' },
      { text: 'Bearer Authentication', link: '/middleware/builtin/bearer-auth' },
      { text: 'Cache', link: '/middleware/builtin/cache' },
      { text: 'Compress', link: '/middleware/builtin/compress' },
      { text: 'CORS', link: '/middleware/builtin/cors' },
      { text: 'ETag', link: '/middleware/builtin/etag' },
      { text: 'html', link: '/middleware/builtin/html' },
      { text: 'JSX', link: '/middleware/builtin/jsx' },
      { text: 'JWT', link: '/middleware/builtin/jwt' },
      { text: 'Logger', link: '/middleware/builtin/logger' },
      { text: 'Pretty JSON', link: '/middleware/builtin/pretty-json' },
    ],
  },
}

export default defineConfig({
  lang: 'en-US',
  title: 'Hono',
  description:
    'Ultrafast web framework for Cloudflare Workers, Fastly Compute@Edge, Deno, Bun, Vercel, Lagon, Node.js, and others. Fast, but not only fast.',
  lastUpdated: true,
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
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'twitter', link: 'https://twitter.com/honojs' },
    ],
    editLink: {
      pattern: 'https://github.com/honojs/honojs.dev/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022-present Yusuke Wada & Hono contributors',
    },
    nav: [
      { text: 'Document', link: '/' },
      { text: 'Middleware', link: '/middleware/introduction' },
      { text: 'Examples', link: 'https://github.com/honojs/examples' },
      { text: 'Discussions', link: 'https://github.com/orgs/honojs/discussions' },
    ],
    sidebar: {
      '/': [
        sidebars['introduction'],
        sidebars['platforms'],
        sidebars['reference'],
        sidebars['guides'],
      ],
      '/docs/': [
        sidebars['introduction'],
        sidebars['platforms'],
        sidebars['reference'],
        sidebars['guides'],
      ],
      '/middleware/': [sidebars['builtin-middleware']],
    },
  },
  head: [
    ['meta', { property: 'og:image', content: '/images/hono-title.png' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'twitter:domain', content: 'hono.dev' }],
    ['meta', { property: 'twitter:image', content: '/images/hono-title.png' }],
    ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
  ],
  titleTemplate: ':title - Hono',
})
