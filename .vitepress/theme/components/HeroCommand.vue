<script setup lang="ts">
import { ref } from 'vue'

const command = 'npm create hono@latest'
const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(command)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 1500)
  } catch {
    // Clipboard access can be unavailable; the command is still selectable text.
  }
}
</script>

<template>
  <div class="hero-command">
    <code class="hero-command-text"
      ><span class="hero-command-prompt" aria-hidden="true">$ </span
      >{{ command }}</code
    >
    <button
      type="button"
      class="hero-command-copy"
      :class="{ copied }"
      :aria-label="copied ? 'Copied' : 'Copy command'"
      :title="copied ? 'Copied' : 'Copy'"
      @click="copy"
    >
      <svg
        v-if="!copied"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
        <path
          d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
        />
      </svg>
      <svg
        v-else
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </button>
  </div>
</template>
