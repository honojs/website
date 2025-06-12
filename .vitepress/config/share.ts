import { defineConfig } from 'vitepress'
import {
  groupIconMdPlugin,
  groupIconVitePlugin,
} from 'vitepress-plugin-group-icons'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { createFileSystemTypesCache } from '@shikijs/vitepress-twoslash/cache-fs'
import transformPageData from './transformPageData'

export default defineConfig({
  sitemap: {
    hostname: 'https://honodev.pages.dev/'
  },
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
      const fence = md.renderer.rules.fence!
      md.renderer.rules.fence = function (tokens, idx, options, env, self) {
        const { localeIndex = 'root' } = env
        const codeCopyButtonTitle = (() => {
          switch (localeIndex) {
            case 'es':
              return 'Copiar código'
            case 'fa':
              return 'کپی کد'
            case 'ko':
              return '코드 복사'
            case 'pt':
              return 'Copiar código'
            case 'ru':
              return 'Скопировать код'
            case 'zh':
              return '复制代码'
            case 'ja':
              return 'コードをコピー'
            default:
              return 'Copy code'
          }
        })()
        return fence(tokens, idx, options, env, self).replace(
          '<button title="Copy Code" class="copy"></button>',
          `<button title="${codeCopyButtonTitle}" class="copy"></button>`
        )
      }
      md.use(groupIconMdPlugin)
    },
    codeTransformers: [
      transformerTwoslash({
        typesCache: createFileSystemTypesCache(),
      }),
    ],
  },
  themeConfig: {
    logo: '/images/logo-small.png',
    siteTitle: 'Hono',
    search: {
      provider: 'local',
      options: {
        disableDetailedView: false,
        miniSearch: {
          options: {
            extractField: (function() {
              const seenIds = new Map()
              return (document, fieldName) => {
                if (fieldName === 'id') {
                  const path = (document.relativePath || document.url || '').replace(/^[/#]+/, '')
                  const section = document.section?.title || ''
                  const baseId = `${path}${document.id ? '' + document.id : ''}${section ? '-' + section : ''}`
                  // Add counter for duplicate IDs
                  const count = seenIds.get(baseId) || 0
                  seenIds.set(baseId, count + 1)
                  return count > 0 ? `${baseId}-${count}` : baseId
                }
                return document[fieldName]
              }
            })()
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/honojs' },
      { icon: 'discord', link: 'https://discord.gg/KMh2eNSdxV' },
      { icon: 'x', link: 'https://x.com/honojs' },
      { icon: 'bluesky', link: 'https://bsky.app/profile/hono.dev' },
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright:
        'Copyright © 2022-present Yusuke Wada & ubitools',
    }
  },
  head: [
    [
      'script',
      {
        async: '',
        src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-1331971422311386',
        crossorigin: 'anonymous',
      },
    ],
    [
      'script',
      {
        async: '',
        src: 'https://www.googletagmanager.com/gtag/js?id=G-ZLJTKTTG43',
      },
    ],
    [
      'script',
      {},
      `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-ZLJTKTTG43');`,
    ],
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
  },
  transformPageData: transformPageData.transformPageData,
})
