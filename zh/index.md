---
title: 基于 Web 标准构建的 Web 框架
description: Hono 是一个小巧、简洁且超快速的 Web 框架，基于 Web 标准构建。它可以运行在 Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge 和 Node.js 上。不仅快速，更具备全方位优势。
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono 是一个小巧、简洁且超快速的 Web 框架，基于 Web 标准构建。它可以运行在 Cloudflare Workers、Fastly Compute、Deno、Bun、Vercel、Netlify、AWS Lambda、Lambda@Edge 和 Node.js 上。不仅快速，更具备全方位优势。',
      },
    ]
layout: home
hero:
  name: Hono
  text: Web 应用程序框架
  tagline: 快速、轻量，基于 Web 标准构建。支持所有 JavaScript 运行时环境。
  image:
    src: /images/code.webp
    alt: Hono
  actions:
    - theme: brand
      text: 开始使用
      link: /zh/docs/
    - theme: alt
      text: 在 GitHub 上查看
      link: https://github.com/honojs/hono
features:
  - icon: 🚀
    title: 超快速 & 轻量级
    details: RegExpRouter 路由系统性能卓越。hono/tiny 预设包大小仅有 14kB。仅使用 Web 标准 API。
  - icon: 🌍
    title: 多运行时支持
    details: 可在 Cloudflare、Fastly、Deno、Bun、AWS 或 Node.js 上运行。同样的代码可在所有平台上运行。
  - icon: 🔋
    title: 功能齐全
    details: Hono 内置中间件，支持自定义中间件，提供第三方中间件和辅助工具。开箱即用。
  - icon: 😃
    title: 出色的开发体验
    details: 简洁清晰的 API。一流的 TypeScript 支持。现在，我们实现了"类型"支持。
---

<script setup>
// 受 React 启发
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
      img.classList.add("kawaii")
    })
  }
  if (kawaii === 'true') {
    try {
      localStorage.setItem('kawaii', true)
    } catch (err) {}
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
