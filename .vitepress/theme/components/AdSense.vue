<template>
  <div class="adsense-container">
    <ins class="adsbygoogle"
         :style="adStyle"
         :data-ad-client="adClient"
         :data-ad-slot="adSlot"
         :data-ad-format="adFormat"
         :data-full-width-responsive="fullWidthResponsive">
    </ins>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  adSlot: {
    type: String,
    required: true
  },
  adClient: {
    type: String,
    default: 'ca-pub-1331971422311386'
  },
  adFormat: {
    type: String,
    default: 'auto'
  },
  fullWidthResponsive: {
    type: String,
    default: 'true'
  },
  style: {
    type: String,
    default: 'display:block'
  }
})

const adStyle = props.style

onMounted(() => {
  try {
    // 确保在客户端环境下运行
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      window.adsbygoogle.push({})
    } else {
      // 如果AdSense脚本还没加载，等待一下再试
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          window.adsbygoogle.push({})
        }
      }, 1000)
    }
  } catch (error) {
    console.warn('AdSense error:', error)
  }
})
</script>

<style scoped>
.adsense-container {
  text-align: center;
  margin: 20px 0;
  padding: 10px;
}

.adsbygoogle {
  background: transparent;
}
</style> 