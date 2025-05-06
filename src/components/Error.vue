<template>
  <div class="error-message">
    <p>Error loading content: {{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps({
  error: String,
})
</script>

<style lang="scss" scoped>
.error-message {
  color: red;
  font-size: 1.2rem;
  text-align: center;
  margin: 20px 0;
}
</style>
