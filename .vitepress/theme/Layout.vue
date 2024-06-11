<script setup lang="ts">
import { onMounted } from 'vue'
import { useData, useRouter } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

const { Layout } = DefaultTheme
const { page } = useData()
const router = useRouter()

const redirects: {
  pattern: RegExp
  to: string
}[] = [
  {
    pattern: /^(?=\/(api|concepts|getting-started|guides|helpers|middleware))/,
    to: '/docs',
  },
  {
    pattern: /\/top$/,
    to: '/',
  },
]

const redirectChangedPath = (currentPath: string) => {
  redirects.some(({ pattern, to }) => {
    if (pattern.test(currentPath)) {
      console.log(`redirect hit: ${currentPath}`)
      router.go(currentPath.replace(pattern, to))
      return true
    }
  })
}
// On first access
onMounted(() => {
  redirectChangedPath(router.route.path)
})
// On internal link access
router.onAfterRouteChanged = (to) => {
  redirectChangedPath(to)
}
</script>

<template>
  <Layout v-if="page.isNotFound">
    <div class="NotFound">
      <p class="code">404</p>
      <h1 class="title">PAGE NOT FOUND</h1>
      <div class="divider" />
      <blockquote class="quote">
        But if you don't change your direction, and if you keep looking, you may end up where you
        are heading.
      </blockquote>
      <div class="action">
        <a class="link" href="/" target="_self" aria-label="go to home"> Take me home </a>
      </div>
    </div>
  </Layout>
  <Layout v-else />
</template>

<style>
.NotFound {
  padding: 64px 24px 96px;
  text-align: center;
}

@media (min-width: 768px) {
  .NotFound {
    padding: 96px 32px 168px;
  }
}

.NotFound .code {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
}

.NotFound .title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
}

.NotFound .divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  background-color: var(--vp-c-divider);
}

.NotFound .quote {
  margin: 0 auto;
  max-width: 256px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.NotFound .action {
  padding-top: 20px;
}

.NotFound .link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition: border-color 0.25s, color 0.25s;
}

.NotFound .link:hover {
  border-color: var(--vp-c-brand-dark);
  color: var(--vp-c-brand-dark);
}
</style>
