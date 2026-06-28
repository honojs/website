<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HeroImage from './components/HeroImage.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-image>
      <HeroImage />
    </template>
  </Layout>
</template>
