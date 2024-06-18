import { sidebarsExamples } from '../.vitepress/config'

export default {
  load() {
    return {
      sidebarsExamples: sidebarsExamples(),
    }
  },
}
