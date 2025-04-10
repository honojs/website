import { defineConfig } from 'vitepress'
import share from './share'
import { en } from './en'
import { zh } from './zh'

export default defineConfig({
  ...share,
  base: '/', // 确保基础路径正确
  cleanUrls: true, // 启用干净的 URL
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
