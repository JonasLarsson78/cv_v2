<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.75"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
    v-html="paths[name]"
  />
</template>

<script setup lang="ts">
import { paths, type IconKey } from './icons'

withDefaults(defineProps<{ name: IconKey; size?: number }>(), { size: 18 })
</script>
