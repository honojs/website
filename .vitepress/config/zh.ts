import { defineConfig } from "vitepress"
import type { DefaultTheme } from 'vitepress'

const sidebars = (): DefaultTheme.SidebarItem[] => [
    {
      text: '核心概念',
      collapsed: true,
      items: [
        { text: '设计理念', link: '/zh/docs/concepts/motivation' },
        { text: '路由系统', link: '/zh/docs/concepts/routers' },
        { text: '性能基准', link: '/zh/docs/concepts/benchmarks' },
        { text: 'Web 标准', link: '/zh/docs/concepts/web-standard' },
        { text: '中间件', link: '/zh/docs/concepts/middleware' },
        { text: '开发者体验', link: '/zh/docs/concepts/developer-experience.md' },
        { text: 'Hono 技术栈', link: '/zh/docs/concepts/stacks' },
      ],
    },
    {
      text: '快速入门',
      collapsed: true,
      items: [
        { text: '基础教程', link: '/zh/docs/getting-started/basic' },
        { text: 'Cloudflare Workers 部署', link: '/zh/docs/getting-started/cloudflare-workers' },
        { text: 'Cloudflare Pages 部署', link: '/zh/docs/getting-started/cloudflare-pages' },
        { text: 'Deno 部署', link: '/zh/docs/getting-started/deno' },
        { text: 'Bun 部署', link: '/zh/docs/getting-started/bun' },
        { text: 'Fastly Compute 部署', link: '/zh/docs/getting-started/fastly' },
        { text: 'Vercel 部署', link: '/zh/docs/getting-started/vercel' },
        { text: 'Netlify 部署', link: '/zh/docs/getting-started/netlify' },
        { text: 'AWS Lambda 部署', link: '/zh/docs/getting-started/aws-lambda' },
        { text: 'Lambda@Edge 部署', link: '/zh/docs/getting-started/lambda-edge' },
        { text: 'Azure Functions 部署', link: '/zh/docs/getting-started/azure-functions' },
        { text: 'Supabase Functions 部署', link: '/zh/docs/getting-started/supabase-functions' },
        { text: '阿里云函数计算部署', link: '/zh/docs/getting-started/ali-function-compute' },
        { text: 'Service Worker 部署', link: '/zh/docs/getting-started/service-worker' },
        { text: 'Node.js 部署', link: '/zh/docs/getting-started/nodejs' },
      ],
    },
    {
      text: 'API 文档',
      collapsed: true,
      items: [
        { text: '应用实例', link: '/zh/docs/api/hono' },
        { text: '路由配置', link: '/zh/docs/api/routing' },
        { text: '上下文对象', link: '/zh/docs/api/context' },
        { text: 'Hono 请求对象', link: '/zh/docs/api/request' },
        { text: '异常处理', link: '/zh/docs/api/exception' },
        { text: '预设配置', link: '/zh/docs/api/presets' },
      ],
    },
    {
      text: '使用指南',
      collapsed: true,
      items: [
        { text: '中间件', link: '/zh/docs/guides/middleware' },
        { text: '辅助工具', link: '/zh/docs/guides/helpers' },
        { text: 'JSX 支持', link: '/zh/docs/guides/jsx' },
        { text: '客户端组件', link: '/zh/docs/guides/jsx-dom' },
        { text: '测试指南', link: '/zh/docs/guides/testing' },
        { text: '数据验证', link: '/zh/docs/guides/validation' },
        { text: 'RPC 调用', link: '/zh/docs/guides/rpc' },
        { text: '最佳实践', link: '/zh/docs/guides/best-practices' },
        { text: '其他功能', link: '/zh/docs/guides/others' },
        { text: '常见问题', link: '/zh/docs/guides/faq' },
      ],
    },
    {
      text: '辅助工具',
      collapsed: true,
      items: [
        { text: '内容协商', link: '/zh/docs/helpers/accepts' },
        { text: '适配器', link: '/zh/docs/helpers/adapter' },
        { text: '连接信息', link: '/zh/docs/helpers/conninfo' },
        { text: 'Cookie 处理', link: '/zh/docs/helpers/cookie' },
        { text: 'CSS 工具', link: '/zh/docs/helpers/css' },
        { text: '开发工具', link: '/zh/docs/helpers/dev' },
        { text: '工厂函数', link: '/zh/docs/helpers/factory' },
        { text: 'HTML 工具', link: '/zh/docs/helpers/html' },
        { text: 'JWT 工具', link: '/zh/docs/helpers/jwt' },
        { text: '静态站点生成', link: '/zh/docs/helpers/ssg' },
        { text: '流式传输', link: '/zh/docs/helpers/streaming' },
        { text: '测试工具', link: '/zh/docs/helpers/testing' },
        { text: 'WebSocket 支持', link: '/zh/docs/helpers/websocket' },
      ],
    },
    {
      text: '中间件',
      collapsed: true,
      items: [
        { text: '基础认证', link: '/zh/docs/middleware/builtin/basic-auth' },
        { text: 'Bearer 认证', link: '/zh/docs/middleware/builtin/bearer-auth' },
        { text: '请求体限制', link: '/zh/docs/middleware/builtin/body-limit' },
        { text: '缓存控制', link: '/zh/docs/middleware/builtin/cache' },
        { text: '中间件组合', link: '/zh/docs/middleware/builtin/combine' },
        { text: '压缩处理', link: '/zh/docs/middleware/builtin/compress' },
        { text: '上下文存储', link: '/zh/docs/middleware/builtin/context-storage' },
        { text: '跨域资源共享', link: '/zh/docs/middleware/builtin/cors' },
        { text: 'CSRF 防护', link: '/docs/middleware/builtin/csrf' },
        { text: 'ETag 支持', link: '/zh/docs/middleware/builtin/etag' },
        { text: 'IP 访问限制', link: '/zh/docs/middleware/builtin/ip-restriction' },
        { text: 'JSX 渲染器', link: '/zh/docs/middleware/builtin/jsx-renderer' },
        { text: 'JWT 中间件', link: '/zh/docs/middleware/builtin/jwt' },
        { text: '日志记录', link: '/zh/docs/middleware/builtin/logger' },
        { text: '请求方法重写', link: '/zh/docs/middleware/builtin/method-override' },
        { text: 'JSON 美化', link: '/zh/docs/middleware/builtin/pretty-json' },
        { text: '请求标识', link: '/zh/docs/middleware/builtin/request-id' },
        { text: '安全响应头', link: '/zh/docs/middleware/builtin/secure-headers' },
        { text: '超时处理', link: '/zh/docs/middleware/builtin/timeout' },
        { text: '计时器', link: '/zh/docs/middleware/builtin/timing' },
        { text: '尾部斜杠处理', link: '/zh/docs/middleware/builtin/trailing-slash' },
        { text: '第三方中间件', link: '/zh/docs/middleware/third-party' },
      ],
    },
  ]
  
  export const sidebarsExamples = (): DefaultTheme.SidebarItem[] => [
    {
      text: '应用示例',
      items: [
        { text: 'Web API 示例', link: '/zh/examples/web-api' },
        { text: '代理服务', link: '/zh/examples/proxy' },
        { text: '文件上传', link: '/zh/examples/file-upload' },
        { text: '验证器错误处理', link: '/zh/examples/validator-error-handling' },
        { text: 'RPC 路由分组', link: '/zh/examples/grouping-routes-rpc' },
        { text: 'CBOR 支持', link: '/zh/examples/cbor' },
      ],
    },
    {
      text: '第三方中间件示例',
      items: [
        { text: 'Zod OpenAPI', link: '/zh/examples/zod-openapi' },
        { text: 'Swagger UI', link: '/zh/examples/swagger-ui' },
        { text: 'Hono OpenAPI', link: '/zh/examples/hono-openapi' },
      ],
    },
    {
      text: '集成示例',
      items: [
        { text: 'Cloudflare Durable Objects', link: '/zh/examples/cloudflare-durable-objects' },
        { text: 'Cloudflare 队列', link: '/zh/examples/cloudflare-queue' },
        { text: 'Cloudflare 测试', link: '/zh/examples/cloudflare-vitest' },
        { text: 'Remix 集成', link: '/zh/examples/with-remix' },
        { text: 'htmx 集成', link: '/zh/examples/htmx' },
        { text: 'Stripe Webhook', link: '/zh/examples/stripe-webhook' },
        { text: 'Cloudflare 上的 Prisma', link: '/zh/examples/prisma' },
        { text: 'Pylon (GraphQL)', link: '/zh/examples/pylon' },
      ],
    },
  ]
  export const zh = defineConfig({
    lang: 'zh-CN',
    title: 'Hono',
    description: '基于 Web 标准构建的 Web 框架，支持 Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Node.js 等平台。不仅快速，更具全面性。',
    lastUpdated: true,
    themeConfig: {
    nav: [
        { text: '文档', link: '/zh/docs/' },
        { text: '示例', link: '/zh/examples/' },
        {
          text: '讨论',
          link: 'https://github.com/orgs/honojs/discussions',
        },
      ],
      sidebar: {
        '/': sidebars(),
        '/examples/': sidebarsExamples(),
      },
    },
  })

  export const search: DefaultTheme.AlgoliaSearchOptions['locales'] = {
    zh: {
      placeholder: '搜索文档',
      translations: {
        button: {
          buttonText: '搜索文档',
          buttonAriaLabel: '搜索文档'
        },
        modal: {
          searchBox: {
            resetButtonTitle: '清除查询条件',
            resetButtonAriaLabel: '清除查询条件',
            cancelButtonText: '取消',
            cancelButtonAriaLabel: '取消'
          },
          startScreen: {
            recentSearchesTitle: '搜索历史',
            noRecentSearchesText: '没有搜索历史',
            saveRecentSearchButtonTitle: '保存至搜索历史',
            removeRecentSearchButtonTitle: '从搜索历史中移除',
            favoriteSearchesTitle: '收藏',
            removeFavoriteSearchButtonTitle: '从收藏中移除'
          },
          errorScreen: {
            titleText: '无法获取结果',
            helpText: '你可能需要检查你的网络连接'
          },
          footer: {
            selectText: '选择',
            navigateText: '切换',
            closeText: '关闭',
            searchByText: '搜索提供者'
          },
          noResultsScreen: {
            noResultsText: '无法找到相关结果',
            suggestedQueryText: '你可以尝试查询',
            reportMissingResultsText: '你认为该查询应该有结果？',
            reportMissingResultsLinkText: '点击反馈'
          }
        }
      }
    }
  }