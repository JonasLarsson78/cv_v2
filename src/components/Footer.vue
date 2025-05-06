<template>
  <footer class="cv-footer">
    <div>© 2025 Jonas Larsson</div>
    <div>Made with ❤️ using Vue 3 - Vite</div>
  </footer>
</template>

<script setup lang="ts">
defineProps({
  sections: {
    type: Array as import('vue').PropType<Array<{ title: string }>>,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.cv-footer {
  text-align: center;
  margin-top: 20px;
}
</style>
