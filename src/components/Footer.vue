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
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  width: 100%;
  padding: 10px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 10px rgba(var(--fancy-color-rgb), 0.3);
  text-align: center;

  .menu {
    display: flex;
    justify-content: center;
    gap: 10px;
  }
}
</style>
