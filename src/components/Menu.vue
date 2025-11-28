<template>
  <nav class="cv-menu" v-if="props.sections && sections.length">
    <ul>
      <li>
        <a
          :class="[{ active: activeSection === 'Top' }]"
          href="#top"
          @click="activeSection = 'Top'"
          >Top</a
        >
      </li>
      <li>-></li>
      <li v-for="section in props.sections" :key="section.title">
        <a
          :class="[{ active: activeSection === section?.title }]"
          :href="'#' + section.title.toLowerCase().replace(/\s+/g, '-')"
          @click="activeSection = section.title"
          >{{ section.title }}
        </a>
      </li>
    </ul>
    <div class="selectors"><Lang /> <Color /></div>
  </nav>
  <p v-else>No sections available</p>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { PropType } from 'vue'
import Lang from './LangSelector.vue'
import Color from './ThemeColorSelector.vue'

const props = defineProps({
  sections: {
    type: Array as PropType<{ title: string }[]>,
    required: true,
  },
})

const activeSection = ref('Top')

// Add scroll event listener to set activeSection to "Top" when scrolled to the top
onMounted(() => {
  const handleScroll = () => {
    if (window.scrollY === 0) {
      activeSection.value = 'Top'
    }
  }
  window.addEventListener('scroll', handleScroll)
  // Cleanup event listener on unmount
  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
})
</script>

<style scoped lang="scss">
.cv-menu {
  position: sticky;
  top: 10px;
  background-color: #333;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 20px;
  border: 2px solid var(--fancy-color);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;

  ul {
    display: flex;
    list-style: none;
    padding: 0;
    margin: 0;
    li {
      margin-right: 15px;
      a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
        transition: color 0.3s;
        &:hover {
          color: var(--fancy-color);
        }
        &.active {
          color: var(--fancy-color);
          text-decoration: underline;
        }
      }
    }
  }

  .selectors {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  @media (max-width: 768px) {
    display: none;
  }
}
</style>
