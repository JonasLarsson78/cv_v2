<template>
  <footer class="footer no-print">
    <p class="footer__hint">
      {{ t.paletteHint }} <span class="kbd">{{ modKey }}</span> <span class="kbd">K</span>
      {{ t.paletteHint2 }}
    </p>
    <div class="footer__row">
      <p class="footer__meta">
        <span>{{ footer.copyright }}</span>
        <span>{{ footer.text }}</span>
      </p>
      <div class="footer__links">
        <a v-if="footer.repoUrl" :href="footer.repoUrl" target="_blank" rel="noopener" class="link-underline">
          <Icon name="github" :size="15" /> {{ t.sourceLabel }}
        </a>
        <a href="#top" class="icon-btn" :aria-label="t.backToTop" :title="t.backToTop">
          <Icon name="arrowUp" :size="16" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import Icon from '../ui/Icon.vue'
import type { Cv } from '../composables/useCv'
import type { Messages } from '../i18n'

defineProps<{ footer: Cv['footer']; t: Messages }>()

const modKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.footer {
  padding: 48px 0 40px;
  border-top: 1px solid var(--line);
  color: var(--muted);
  font-size: 0.85rem;

  &__hint {
    display: none;
    align-items: center;
    gap: 6px;
    margin: 0 0 28px;

    @media (hover: hover) and (pointer: fine) {
      display: flex;
    }
  }

  &__row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
  }

  &__meta {
    display: grid;
    gap: 2px;
    margin: 0;
  }

  &__links {
    display: flex;
    align-items: center;
    gap: 16px;

    a:not(.icon-btn) {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: var(--ink-2);
    }
  }
}
</style>
