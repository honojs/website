import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import './custom.css'
import 'virtual:group-icons.css'
import '@shikijs/vitepress-twoslash/style.css'
import ThoslashFloatingVue from '@shikijs/vitepress-twoslash/client'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(ThoslashFloatingVue)
  },
}
