<template>
  <header class="nav no-print" :class="{ 'is-scrolled': scrolled }">
    <div class="nav__progress" ref="progress" aria-hidden="true" />
    <div class="nav__inner">
      <a href="#top" class="nav__brand" :aria-label="name">
        <span class="nav__mono">{{ initials }}</span>
        <span class="nav__name">{{ name }}</span>
      </a>

      <nav class="nav__links" aria-label="Sections">
        <a
          v-for="item in items"
          :key="item.id"
          :href="`#${item.id}`"
          :class="{ 'is-active': active === item.id }"
          :aria-current="active === item.id ? 'true' : undefined"
        >
          {{ item.label }}
        </a>
      </nav>

      <div class="nav__tools">
        <button class="nav__search" type="button" @click="$emit('palette')" :aria-label="t.palette.trigger">
          <Icon name="search" :size="15" />
          <span class="nav__search-label">{{ t.palette.trigger }}</span>
          <span class="kbd">{{ modKey }}</span><span class="kbd">K</span>
        </button>
        <button
          class="icon-btn nav__lang mono"
          type="button"
          :aria-label="t.langLabel"
          @click="$emit('lang')"
        >
          {{ lang === 'sv' ? 'EN' : 'SV' }}
        </button>
        <button class="icon-btn" type="button" :aria-label="t.themeLabel" @click="$emit('theme', $event)">
          <Transition name="spin" mode="out-in">
            <Icon :key="theme" :name="theme === 'dark' ? 'sun' : 'moon'" />
          </Transition>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import type { Messages, Lang } from '../i18n'
import type { Theme } from '../composables/useTheme'

const props = defineProps<{
  name: string
  items: { id: string; label: string }[]
  active: string
  lang: Lang
  theme: Theme
  t: Messages
}>()

defineEmits<{ palette: []; lang: []; theme: [event: MouseEvent] }>()

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .map((w) => w[0])
    .join(''),
)
const modKey = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘' : 'Ctrl'

const scrolled = ref(false)
const progress = ref<HTMLElement>()
const nativeTimeline = CSS.supports('animation-timeline: scroll()')

function onScroll() {
  scrolled.value = scrollY > 8
  if (!nativeTimeline && progress.value) {
    const max = document.documentElement.scrollHeight - innerHeight
    progress.value.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`
  }
}

onMounted(() => {
  onScroll()
  addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => removeEventListener('scroll', onScroll))
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.nav {
  position: fixed;
  inset: 0 0 auto;
  z-index: 50;
  border-bottom: 1px solid transparent;
  transition:
    background-color 0.3s ease,
    border-color 0.3s ease,
    backdrop-filter 0.3s ease;

  &.is-scrolled {
    background: var(--nav-bg);
    border-bottom-color: var(--line);
    backdrop-filter: saturate(1.4) blur(14px);
    -webkit-backdrop-filter: saturate(1.4) blur(14px);
  }

  // Reading progress: native scroll-driven animation, JS fallback in <script>.
  &__progress {
    position: absolute;
    inset: auto 0 -1px;
    height: 1px;
    background: var(--accent);
    transform: scaleX(0);
    transform-origin: 0 50%;

    @supports (animation-timeline: scroll()) {
      animation: progress linear both;
      animation-timeline: scroll(root);
    }
  }

  &__inner {
    display: flex;
    align-items: center;
    gap: 24px;
    max-width: var(--maxw);
    height: 68px;
    margin: 0 auto;
    padding: 0 var(--gutter);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    margin-right: auto;

    &:hover .nav__mono {
      transform: rotate(-8deg) scale(1.05);
      background: var(--accent);
    }
  }

  &__mono {
    display: grid;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    background: var(--ink);
    color: var(--bg);
    font-family: var(--font-display);
    font-weight: 600;
    font-size: 0.95rem;
    letter-spacing: -0.02em;
    transition:
      transform 0.6s var(--ease-out),
      background-color 0.3s ease;
  }

  &__name {
    font-weight: 500;
    font-size: 0.95rem;
    opacity: 0;
    transform: translateX(-6px);
    transition:
      opacity 0.4s ease,
      transform 0.5s var(--ease-out);

    .is-scrolled & {
      opacity: 1;
      transform: none;
    }

    @include down(sm) {
      display: none;
    }
  }

  &__links {
    display: none;
    gap: 4px;

    @include up(xl) {
      display: flex;
    }

    a {
      position: relative;
      padding: 8px 12px;
      border-radius: 999px;
      font-size: 0.88rem;
      color: var(--muted);
      text-decoration: none;
      transition: color 0.2s ease;

      &::after {
        content: '';
        position: absolute;
        left: 50%;
        bottom: 2px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--accent);
        transform: translateX(-50%) scale(0);
        transition: transform 0.4s var(--ease-out);
      }

      &:hover,
      &.is-active {
        color: var(--ink);
      }

      &.is-active::after {
        transform: translateX(-50%) scale(1);
      }
    }
  }

  &__tools {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__search {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
    padding: 0 8px 0 12px;
    margin-right: 6px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background: var(--bg-elev);
    color: var(--muted);
    font-size: 0.85rem;
    cursor: pointer;
    transition:
      border-color 0.2s ease,
      color 0.2s ease;

    &:hover {
      border-color: var(--ink);
      color: var(--ink);
    }

    @include down(sm) {
      width: 38px;
      padding: 0;
      justify-content: center;
      margin-right: 0;

      .kbd {
        display: none;
      }
    }
  }

  &__search-label {
    margin-right: 10px;

    @include down(sm) {
      display: none;
    }
  }

  &__lang {
    font-size: 0.72rem;
    font-weight: 600;
  }
}

@keyframes progress {
  to {
    transform: scaleX(1);
  }
}

.spin-enter-active,
.spin-leave-active {
  transition:
    transform 0.4s var(--ease-out),
    opacity 0.2s ease;
}

.spin-enter-from {
  transform: rotate(-90deg) scale(0.6);
  opacity: 0;
}

.spin-leave-to {
  transform: rotate(90deg) scale(0.6);
  opacity: 0;
}
</style>
