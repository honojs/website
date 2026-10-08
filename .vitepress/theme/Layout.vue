<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import HeroCommand from './components/HeroCommand.vue'
import HeroImage from './components/HeroImage.vue'

const { Layout } = DefaultTheme
</script>

<template>
  <Layout>
    <template #home-hero-actions-after>
      <HeroCommand />
    </template>
    <template #home-hero-image>
      <HeroImage />
    </template>
  </Layout>
</template>
