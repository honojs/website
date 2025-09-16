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

<script setup>
// Heavily inspired by React
// https://github.com/reactjs/react.dev/pull/6817
import { onMounted } from 'vue'
onMounted(() => {
  var preferredKawaii
  try {
    preferredKawaii = localStorage.getItem('kawaii')
  } catch (err) {}
  const urlParams = new URLSearchParams(window.location.search)
  const kawaii = urlParams.get('kawaii')
  const setKawaii = () => {
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/images/hono-kawaii.png'
      img.alt = 'A Kawai Version of the Hono Logo. The first "o" is replaced with a flame, with japanese characters in the bottom right, and a JSX fragment closing tag above the flame.'
      img.classList.add("kawaii")
    })
  }
  if (kawaii === 'true') {
    try {
      localStorage.setItem('kawaii', true)
    } catch (err) {}
    console.log('kawaii mode enabled. logo credits to @sawaratsuki1004 via https://github.com/SAWARATSUKI/ServiceLogos');
    setKawaii()
  } else if (kawaii === 'false') {
    try {
      localStorage.removeItem('kawaii', false)
    } catch (err) {}
    const images = document.querySelectorAll('.VPImage.image-src')
    images.forEach((img) => {
      img.src = '/images/code.webp'
      img.classList.remove("kawaii")
    })
  } else if (preferredKawaii) {
    setKawaii()
  }
})
</script>
