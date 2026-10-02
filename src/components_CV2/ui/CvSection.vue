<template>
  <section :id="id" class="sec" :aria-labelledby="`${id}-title`">
    <header class="sec__head" v-reveal>
      <span class="sec__index mono">{{ index }}</span>
      <h2 :id="`${id}-title`" class="sec__title">{{ title }}</h2>
      <p v-if="kicker" class="sec__kicker">{{ kicker }}</p>
    </header>
    <div class="sec__body">
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
import { vReveal } from '../directives'

defineProps<{ id: string; index: string; title: string; kicker?: string }>()
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.sec {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 28px;
  padding: clamp(64px, 10vw, 128px) 0;
  border-top: 1px solid var(--line);

  @include up(lg) {
    grid-template-columns: 280px minmax(0, 1fr);
    gap: 64px;
  }

  &__head {
    @include up(lg) {
      position: sticky;
      top: 104px;
      align-self: start;
    }
  }

  &__index {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    color: var(--accent);

    &::after {
      content: '';
      width: 32px;
      height: 1px;
      background: currentColor;
    }
  }

  &__title {
    @include display(96, 30);
    margin: 14px 0 8px;
    font-size: clamp(2rem, 4vw, 2.8rem);
    line-height: 1.05;
  }

  &__kicker {
    margin: 0;
    color: var(--muted);
    font-size: 0.95rem;
  }

  @include print {
    display: block;
    padding: 18pt 0 0;
    border-top: 0;

    &__head {
      display: flex;
      align-items: baseline;
      gap: 10pt;
      margin-bottom: 8pt;
      padding-bottom: 4pt;
      border-bottom: 1px solid var(--line-strong);
      break-after: avoid;
    }

    &__index,
    &__kicker {
      display: none;
    }

    &__title {
      margin: 0;
      font-size: 16pt;
    }
  }
}
</style>
