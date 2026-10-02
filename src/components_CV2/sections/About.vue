<template>
  <div class="about">
    <figure class="about__person" v-reveal>
      <img src="/jpg/jonas_2025_05.jpg" :alt="name" width="160" height="160" loading="lazy" />
      <figcaption>
        <strong>{{ name }}</strong>
        <span class="mono">{{ role }}</span>
      </figcaption>
    </figure>
    <p class="about__text" v-reveal="80">
      <template v-for="(part, i) in parts" :key="i">
        <mark v-if="part.hit">{{ part.text }}</mark>
        <template v-else>{{ part.text }}</template>
      </template>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { vReveal } from '../directives'
import { splitKeywords } from '../keywords'

const props = defineProps<{ text: string; keywords: string[]; name: string; role: string }>()

// Highlights technologies from the skills table wherever they appear in the text.
const parts = computed(() => splitKeywords(props.text, props.keywords))
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.about__person {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 0 0 28px;

  img {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    object-fit: cover;
    object-position: 50% 30%;
    border: 1px solid var(--line-strong);
    box-shadow: 0 0 0 4px var(--bg), 0 0 0 5px var(--line);
  }

  figcaption {
    display: grid;
    gap: 2px;
  }

  strong {
    font-weight: 600;
  }

  .mono {
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  @include print {
    display: none;
  }
}

.about__text {
  @include display(48, 20);
  max-width: 30em;
  margin: 0;
  font-size: clamp(1.3rem, 2.4vw, 1.75rem);
  font-weight: 350;
  line-height: 1.45;
  letter-spacing: -0.012em;
  color: var(--ink-2);

  mark {
    color: var(--ink);
    background: linear-gradient(transparent 62%, var(--accent-soft) 62%);
    box-shadow: inset 0 -1px 0 var(--accent);
    padding: 0 0.05em;
  }

  @include print {
    font-family: var(--font-sans);
    font-size: 10.5pt;
    max-width: none;

    mark {
      box-shadow: none;
      background: none;
      font-weight: 600;
    }
  }
}
</style>
