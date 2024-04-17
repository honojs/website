import { h } from 'vue'
import TwoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import '@shikijs/vitepress-twoslash/style.css'
import DefaultTheme from 'vitepress/theme'
import NotFound from './NotFound.vue'
import './custom.css'

export default {
  ...DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      'not-found': () => h(NotFound),
    })
  },
  enhanceApp({ app }) {
    app.use(TwoslashFloatingVue)
  },
}
