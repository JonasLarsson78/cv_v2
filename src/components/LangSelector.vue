<template>
  <div class="lang">
    <select :value="selectValue" @change="changeLang">
      <option value="en">🇺🇸 En</option>
      <option value="se">🇸🇪 Sv</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const local = localStorage.getItem('local')
const selectValue = ref('en')

onMounted(() => {
  selectValue.value = local ? local : 'en'
})

const changeLang = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value

  localStorage.removeItem('local')
  localStorage.setItem('local', value)
  window.location.reload()


}
</script>

<style style lang="scss" scoped>
.lang {
  position: absolute;
  top: 10px;
  left: 10px;

  select {
    width: 80px;
    height: 30px;
    font-size: 20px;
    border: 2px solid var(--fancy-color);
    border-radius: 5px;
  }
}
</style>