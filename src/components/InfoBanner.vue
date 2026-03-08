<template>
  <div class="info-banner">
    <span class="info-label">Info:</span>
    <span v-if="message" v-html="message" role="status" aria-live="polite" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string
}>()
</script>

<style lang="scss" scoped>
.info-banner {
  border: 2px solid var(--fancy-color);
  background: linear-gradient(180deg, #111111 0%, #424242 50%, #111111 99%);
  color: inherit;
  border-radius: 10px;
  padding: 10px 14px;
  font-weight: 600;
  margin: 0 auto 20px;
  max-width: 910px;
}
.info-label {
  color: white;
  display: inline-block;
  padding: 2px 8px;
  border: 1px solid var(--fancy-color);
  border-radius: 999px;
  background: rgba(var(--fancy-color-rgb));
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  vertical-align: middle;
  margin-right: 20px;
}
</style>
