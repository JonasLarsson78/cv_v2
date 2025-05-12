<template>
  <footer class="cv-footer">
    <div v-if="copy">{{ copy }}</div>
    <div v-if="footer?.text">{{ footer?.text }}</div>
    <div v-if="footer?.cv">
      {{ footer?.cv.text }}
      <a v-if="footer?.cv.url" :href="footer?.cv.url" target="_blank">{{
        footer?.cv.text2
      }}</a>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
  footer: {
    type: Object as () => ContentType['footer'],
    required: true,
  },
})

const copy = computed(() => {
  const year = new Date().getFullYear().toString()
  const copyright = props?.footer?.copyright
  return typeof copyright === 'string'
    ? copyright.replace('{{year}}', year)
    : ''
})
</script>

<style lang="scss" scoped>
.cv-footer {
  text-align: center;
  margin-top: 20px;

  a {
    color: var(--fancy-color);
    text-decoration: none;
    transition: color 0.3s ease-in-out;

    &:hover {
      color: #ffffffde;
    }
  }
}
</style>
