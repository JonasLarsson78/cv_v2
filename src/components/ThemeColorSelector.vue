<template>
  <div class="color">
    <select :value="selectValue" @change="changeColor">
      <option value="default">Default</option>
      <option value="blue">Blue</option>
      <option value="green">Green</option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
const selectValue = ref('default')

onMounted(() => {
  const local = localStorage.getItem('themeColor')
  if (local === 'blue') {
    selectValue.value = 'blue'
  } else if (local === 'green') {
    selectValue.value = 'green'
  } else {
    selectValue.value = 'default'
  }

  colorSet(selectValue.value)
})

const changeColor = (e: Event) => {
  const value = (e.target as HTMLSelectElement).value
  colorSet(value)

  window.location.reload()
}

const colorSet = (value: string) => {
  const root = document.documentElement
  if (value === 'blue') {
    selectValue.value = 'blue'
    localStorage.setItem('themeColor', 'blue')
    root.style.setProperty('--fancy-color', '#1A27BFFF')
    root.style.setProperty('--fancy-color-lightened', '#7581FFFF')
    root.style.setProperty('--fancy-color-rgb', '26, 39, 191')
  } else if (value === 'green') {
    selectValue.value = 'green'
    localStorage.setItem('themeColor', 'green')
    root.style.setProperty('--fancy-color', '#26A10EFF')
    root.style.setProperty('--fancy-color-lightened', '#75FF81FF')
    root.style.setProperty('--fancy-color-rgb', '38, 161, 142')
  } else if (value === 'default') {
    selectValue.value = 'default'
    localStorage.setItem('themeColor', 'default')
    root.style.setProperty('--fancy-color', '#ff6f61')
    root.style.setProperty('--fancy-color-lightened', '#ff8a75')
    root.style.setProperty('--fancy-color-rgb', '255, 111, 97')
  }
}
</script>

<style style lang="scss" scoped>
.color {
  position: relative;
  top: 0px;
  left: 0px;

  select {
    width: 80px;
    height: 30px;
    font-size: 16px;
    border: 1px solid var(--fancy-color);
    border-radius: 5px;
  }
}
</style>
