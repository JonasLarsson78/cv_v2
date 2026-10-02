<template>
  <div class="edu">
    <article v-for="(item, i) in items" :key="item.program" class="edu__card" v-spotlight v-reveal="i * 80">
      <p class="edu__period mono">{{ item.period }}</p>
      <h3 class="edu__program">{{ item.program }}</h3>
      <p class="edu__school">{{ item.school }}</p>
      <p class="edu__desc">{{ item.description }}</p>
      <a
        v-if="item.certificate"
        :href="item.certificate"
        target="_blank"
        rel="noopener"
        class="edu__link link-underline no-print"
      >
        <Icon name="award" :size="16" /> {{ t.viewDiploma }}
        <Icon name="arrow" :size="14" />
      </a>
    </article>
  </div>
</template>

<script setup lang="ts">
import Icon from '../ui/Icon.vue'
import { vReveal, vSpotlight } from '../directives'
import type { Education } from '../composables/useCv'
import type { Messages } from '../i18n'

defineProps<{ items: Education[]; t: Messages }>()
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.edu {
  display: grid;
  gap: 16px;

  &__card {
    @include spotlight-card;
    padding: clamp(20px, 3vw, 32px);
  }

  &__period {
    margin: 0 0 12px;
    color: var(--muted);
  }

  &__program {
    @include display(48, 30);
    margin: 0;
    font-size: clamp(1.4rem, 2.6vw, 1.75rem);
    line-height: 1.15;
  }

  &__school {
    margin: 4px 0 0;
    color: var(--accent);
    font-weight: 500;
  }

  &__desc {
    max-width: 60ch;
    margin: 12px 0 0;
    color: var(--ink-2);
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 20px;
    font-size: 0.9rem;
    font-weight: 500;
  }

  @include print {
    &__card {
      padding: 0;
      border: 0;
      break-inside: avoid;
    }

    &__program {
      font-size: 12pt;
    }
  }
}
</style>
