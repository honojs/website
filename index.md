---
title: Hono - Web framework built on Web Standards
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono is a small, simple, and ultrafast web framework built on Web Standards. It works on Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js. Fast, but not only fast.',
      },
    ]
layout: home
hero:
  name: Hono
  text: Web application framework
  tagline: Fast, lightweight, built on Web Standards. Support for any JavaScript runtime.
  image:
    src: /images/code.webp
    alt: "An example of code for Hono. \
      import { Hono } from 'hono' \
      const app = new Hono() \
      app.get('/', (c) => c.text('Hello Hono!')) \

      export default app"
  actions:
    - theme: brand
      text: Get Started
      link: /docs/
    - theme: alt
      text: View on GitHub
      link: https://github.com/honojs/hono
features:
  - icon: 🚀
    title: Ultrafast & Lightweight
    details: The router RegExpRouter is really fast. The hono/tiny preset is under 14kB. Using only Web Standard APIs.
  - icon: 🌍
    title: Multi-runtime
    details: Works on Cloudflare, Fastly, Deno, Bun, AWS, or Node.js. The same code runs on all platforms.
  - icon: 🔋
    title: Batteries Included
    details: Hono has built-in middleware, custom middleware, third-party middleware, and helpers. Batteries included.
  - icon: 😃
    title: Delightful DX
    details: Super clean APIs. First-class TypeScript support. Now, we've got "Types".
---
