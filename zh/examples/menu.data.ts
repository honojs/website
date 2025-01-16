import { sidebarsExamples } from '../../.vitepress/config/zh'

export default {
  load() {
    return {
      sidebarsExamples: sidebarsExamples(),
    }
  },
}
