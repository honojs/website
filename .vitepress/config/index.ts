import { defineConfig } from 'vitepress'
import share from './share'
import { en } from './en'
import { zh } from './zh'

export default defineConfig({
  ...share,
  locales: {
    root: {
      label: 'English',
      lang: 'en',
      link: '/',
      ...en,
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      ...zh,
    }
  }
})
