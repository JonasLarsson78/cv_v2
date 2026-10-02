<template>
  <ol ref="list" class="timeline" :style="{ '--progress': progress }">
    <li
      v-for="(role, i) in roles"
      :key="role.period + role.title"
      class="role"
      :class="{ 'is-passed': passed > i }"
      v-reveal="i * 60"
    >
      <div class="role__when">
        <span class="mono">{{ role.period }}</span>
        <span v-if="role.months" class="role__duration">{{ formatDuration(role.months, lang) }}</span>
      </div>

      <article class="role__card" v-spotlight>
        <h3 class="role__title">{{ role.title }}</h3>
        <p class="role__company">{{ role.company }}</p>
        <p v-for="note in role.notes" :key="note" class="role__note">{{ note }}</p>

        <template v-if="role.duties.length">
          <div :id="`duties-${i}`" class="role__duties" :class="{ 'is-open': open.has(i) }">
            <div class="role__duties-inner">
              <div v-for="duty in role.duties" :key="duty.header" class="role__duty">
                <h4 class="mono">{{ duty.header.replace(/:$/, '') }}</h4>
                <ul>
                  <li v-for="item in duty.items" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            type="button"
            class="role__toggle no-print"
            :aria-expanded="open.has(i)"
            :aria-controls="`duties-${i}`"
            @click="toggle(i)"
          >
            {{ open.has(i) ? t.showLess : t.showMore }}
            <Icon name="chevron" :size="14" />
          </button>
        </template>
      </article>
    </li>
  </ol>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import { vReveal, vSpotlight } from '../directives'
import { formatDuration, type Role } from '../composables/useCv'
import type { Lang, Messages } from '../i18n'

const props = defineProps<{ roles: Role[]; lang: Lang; t: Messages }>()

// Most recent role starts expanded.
const open = reactive(new Set<number>(props.roles[0]?.duties.length ? [0] : []))
const toggle = (i: number) => (open.has(i) ? open.delete(i) : open.add(i))

// The timeline line "draws" itself as you scroll through the list.
const list = ref<HTMLElement>()
const progress = ref(0)
const passed = ref(0)
let frame = 0

function measure() {
  frame = 0
  const el = list.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const anchor = innerHeight * 0.6
  progress.value = Math.min(1, Math.max(0, (anchor - rect.top) / rect.height))
  passed.value = [...el.children].filter((li) => li.getBoundingClientRect().top < anchor).length
}

const onScroll = () => (frame ||= requestAnimationFrame(measure))

onMounted(() => {
  measure()
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onScroll)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  removeEventListener('scroll', onScroll)
  removeEventListener('resize', onScroll)
})
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

$rail: 7px;

.timeline {
  position: relative;
  display: grid;
  gap: 20px;
  margin: 0;
  padding: 0 0 0 32px;
  list-style: none;

  // Rail + animated fill.
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    bottom: 8px;
    left: $rail;
    width: 1px;
    background: var(--line-strong);
  }

  &::after {
    background: var(--accent);
    transform: scaleY(var(--progress, 0));
    transform-origin: top;
  }

  @include up(md) {
    padding-left: 0;

    &::before,
    &::after {
      left: calc(170px + 24px);
    }
  }
}

.role {
  position: relative;
  display: grid;
  gap: 10px;

  @include up(md) {
    grid-template-columns: 170px minmax(0, 1fr);
    gap: 49px;
  }

  // Node on the rail.
  &::before {
    content: '';
    position: absolute;
    z-index: 1;
    top: 6px;
    left: calc(-32px + #{$rail} - 4px);
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--bg);
    border: 1px solid var(--line-strong);
    transition:
      background-color 0.4s ease,
      border-color 0.4s ease,
      box-shadow 0.4s ease;

    @include up(md) {
      left: calc(170px + 24px - 4px);
    }
  }

  &.is-passed::before {
    background: var(--accent);
    border-color: var(--accent);
    box-shadow: 0 0 0 5px var(--accent-soft);
  }

  &__when {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 12px;
    padding-top: 2px;
    color: var(--muted);
    white-space: nowrap;

    @include up(md) {
      flex-direction: column;
      text-align: right;
    }
  }

  &__duration {
    font-size: 0.82rem;
  }

  &__card {
    @include spotlight-card;
    padding: clamp(20px, 3vw, 32px);
  }

  &__title {
    @include display(48, 30);
    margin: 0;
    font-size: clamp(1.4rem, 2.6vw, 1.75rem);
    line-height: 1.15;
  }

  &__company {
    margin: 4px 0 0;
    color: var(--accent);
    font-weight: 500;
  }

  &__note {
    margin: 10px 0 0;
    color: var(--ink-2);
  }

  // Animatable height: auto via grid-template-rows 0fr → 1fr.
  &__duties {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.6s var(--ease-out);

    &.is-open {
      grid-template-rows: 1fr;
    }
  }

  &__duties-inner {
    overflow: hidden;
  }

  &__duty {
    padding-top: 24px;

    h4 {
      margin: 0 0 10px;
      color: var(--muted);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    ul {
      display: grid;
      gap: 8px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    li {
      position: relative;
      padding-left: 22px;
      color: var(--ink-2);

      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: calc(0.8em - 1px);
        width: 8px;
        height: 2px;
        border-radius: 2px;
        background: var(--accent);
      }
    }
  }

  &__toggle {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 20px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--ink);
    font-size: 0.88rem;
    font-weight: 500;
    cursor: pointer;

    svg {
      transition: transform 0.4s var(--ease-out);
    }

    &[aria-expanded='true'] svg {
      transform: rotate(180deg);
    }

    &:hover {
      color: var(--accent);
    }
  }
}

@include print {
  .timeline {
    gap: 10pt;
    padding: 0;

    &::before,
    &::after {
      display: none;
    }
  }

  .role {
    grid-template-columns: 100pt minmax(0, 1fr);
    gap: 12pt;
    break-inside: avoid;

    &::before {
      display: none;
    }

    &__when {
      flex-direction: column;
      text-align: left;
      white-space: normal;
    }

    &__card {
      padding: 0;
      border: 0;
    }

    &__title {
      font-size: 12pt;
    }

    &__duties {
      grid-template-rows: 1fr;
    }

    &__duty {
      padding-top: 6pt;
    }
  }
}
</style>
