<script setup lang="ts">
// Hero snippet highlighted at build time and frozen as static HTML, so there's
// no client-side highlighting (and no flash). Generated with shiki — the engine
// VitePress uses — and the same themes from `.vitepress/config.ts`:
//
//   codeToHtml(snippet, {
//     lang: 'ts',
//     themes: { light: 'github-light', dark: 'github-dark' },
//     defaultColor: false,
//   })
//
// Re-run that and paste the result here to change the snippet.
const codeHtml = `<pre class="shiki shiki-themes github-light github-dark" style="--shiki-light:#24292e;--shiki-dark:#e1e4e8;--shiki-light-bg:#fff;--shiki-dark-bg:#24292e" tabindex="0"><code><span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">import</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> { Hono } </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">from</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF"> 'hono'</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">const</span><span style="--shiki-light:#005CC5;--shiki-dark:#79B8FF"> app</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> =</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> new</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0"> Hono</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">()</span></span>
<span class="line"><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">app.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">get</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'/'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">, (</span><span style="--shiki-light:#E36209;--shiki-dark:#FFAB70">c</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">) </span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">=></span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> c.</span><span style="--shiki-light:#6F42C1;--shiki-dark:#B392F0">text</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">(</span><span style="--shiki-light:#032F62;--shiki-dark:#9ECBFF">'Hello Hono!'</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8">))</span></span>
<span class="line"></span>
<span class="line"><span style="--shiki-light:#D73A49;--shiki-dark:#F97583">export</span><span style="--shiki-light:#D73A49;--shiki-dark:#F97583"> default</span><span style="--shiki-light:#24292E;--shiki-dark:#E1E4E8"> app</span></span></code></pre>`

// Kept in sync with the kawaii image handled by the toggle in `.vitepress/config.ts`.
const kawaiiAlt =
  'A Kawaii Version of the Hono Logo. The first "o" is replaced with a flame, with japanese characters in the bottom right, and a JSX fragment closing tag above the flame.'
</script>

<template>
  <div class="hero-image-slot">
    <div class="hero-code-window">
      <div class="hero-code-titlebar" aria-hidden="true">
        <span class="hero-code-dot hero-code-dot--red" />
        <span class="hero-code-dot hero-code-dot--yellow" />
        <span class="hero-code-dot hero-code-dot--green" />
      </div>
      <div class="hero-code-body" v-html="codeHtml" />
    </div>
    <img class="hero-kawaii" src="/images/hono-kawaii.png" :alt="kawaiiAlt" />
  </div>
</template>
