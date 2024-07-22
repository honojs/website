---
title: Hono - エッジ向けの爆速 Web フレームワーク
titleTemplate: ':title'
head:
  - [
      'meta',
      {
        property: 'og:description',
        content: 'Hono は小さく、シンプルで爆速なエッジ向け Web フレームワークです。 Cloudflare Workers 、 Fastly Compute 、 Deno 、 Bun 、 Vercel 、 Netlify 、 AWS Lambda 、 Lambda@Edge そして Node.js で動作します。 速いですが、それだけではありません。',
      },
    ]
layout: home
hero:
  name: Hono
  text: Webアプリケーションフレームワーク
  tagline: 高速、 軽量、 Web 標準。 あらゆる JavaScript ランタイムをサポートします。
  image:
    src: /images/code.webp
    alt: Hono
  actions:
    - theme: brand
      text: Get Started
      link: /docs/
    - theme: alt
      text: GitHub
      link: https://github.com/honojs/hono
features:
  - icon: 🚀
    title: 爆速 & 軽量
    details: RegExpRouter は超高速なルーターです。 hono/tiny プリセットはわずか 14kB。 Web 標準 API のみを使用します。
  - icon: 🌍
    title: マルチランタイム
    details: Cloudflare 、 Fastly 、 Deno 、 Bun 、 AWS また Node.js で動作します。 同じコードが全てのプライベートで使用できます。
  - icon: 🔋
    title: バッテリー同梱
    details: Hono にはビルドインミドルウェア、カスタムミドルウェア、サードパーティーミドルウェアそしてヘルパーがあります。 バッテリー同梱。
  - icon: 😃
    title: 楽しい開発体験
    details: 超クリーンな API。 最高級の TypeScript サポート。 Now, we've got "Types".
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
