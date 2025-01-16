import { sidebarsExamples } from '../.vitepress/config/en'

export default {
  load() {
    return {
      sidebarsExamples: sidebarsExamples(),
    }
  },
}
