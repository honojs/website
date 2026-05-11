import DefaultTheme from 'vitepress/theme'
import type { EnhanceAppContext } from 'vitepress'
import './custom.css'
import 'virtual:group-icons.css'
import '@shikijs/vitepress-twoslash/style.css'
import ThoslashFloatingVue from '@shikijs/vitepress-twoslash/client'
import { useSyncedPackageManagerCodeGroups } from './use-synced-package-manager-code-groups'

export default {
  extends: DefaultTheme,
  setup() {
    const setup = (DefaultTheme as { setup?: () => void }).setup
    setup?.()
    useSyncedPackageManagerCodeGroups()
  },
  enhanceApp({ app }: EnhanceAppContext) {
    app.use(ThoslashFloatingVue)
  },
}
