<template>
  <div class="marquee no-print" aria-hidden="true">
    <div class="marquee__track">
      <ul v-for="copy in 2" :key="copy" class="marquee__list">
        <li v-for="skill in unique" :key="skill.name" class="marquee__item">
          <img :src="skill.image" alt="" :class="{ 'is-mono': isMono(skill.image) }" loading="lazy" />
          {{ skill.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Skill } from '../composables/useCv'
import { isMono } from '../logos'

const props = defineProps<{ skills: Skill[] }>()

const unique = computed(() => {
  const seen = new Set<string>()
  return props.skills.filter((s) => !seen.has(s.name) && seen.add(s.name))
})
</script>

<style lang="scss" scoped>
.marquee {
  overflow: hidden;
  padding: 20px 0;
  border-block: 1px solid var(--line);
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);

  &__track {
    display: flex;
    width: max-content;
    animation: scroll 60s linear infinite;

    &:hover {
      animation-play-state: paused;
    }
  }

  &__list {
    display: flex;
    gap: 40px;
    margin: 0;
    padding: 0 20px;
    list-style: none;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.82rem;
    white-space: nowrap;
    transition: color 0.2s ease;

    &:hover {
      color: var(--ink);

      img {
        filter: none;
        opacity: 1;
      }
    }

    img {
      width: 20px;
      height: 20px;
      object-fit: contain;
      filter: grayscale(1);
      opacity: 0.7;
      transition:
        filter 0.3s ease,
        opacity 0.3s ease;
    }
  }
}

@keyframes scroll {
  to {
    transform: translateX(-50%);
  }
}
</style>
