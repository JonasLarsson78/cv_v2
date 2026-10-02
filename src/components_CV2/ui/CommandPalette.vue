<template>
  <Teleport to="body">
    <Transition name="palette">
      <div v-if="open" class="palette" @pointerdown.self="close">
        <div
          class="palette__dialog"
          role="dialog"
          aria-modal="true"
          :aria-label="t.placeholder"
          @keydown="onKeydown"
        >
          <div class="palette__search">
            <Icon name="search" :size="18" />
            <input
              ref="input"
              v-model="query"
              type="text"
              role="combobox"
              aria-autocomplete="list"
              aria-controls="palette-list"
              :aria-activedescendant="results[index] ? `palette-${results[index].id}` : undefined"
              :placeholder="t.placeholder"
              spellcheck="false"
              autocomplete="off"
            />
            <span class="kbd">esc</span>
          </div>

          <ul id="palette-list" ref="list" class="palette__list" role="listbox">
            <template v-for="(item, i) in results" :key="item.id">
              <li v-if="i === 0 || results[i - 1].group !== item.group" class="palette__group mono" role="presentation">
                {{ item.group }}
              </li>
              <li
                :id="`palette-${item.id}`"
                role="option"
                class="palette__item"
                :class="{ 'is-active': i === index }"
                :aria-selected="i === index"
                @pointermove="index = i"
                @click="run(item)"
              >
                <span class="palette__icon"><Icon :name="item.icon" :size="16" /></span>
                <span class="palette__label">
                  <template v-for="(part, p) in highlight(item.label)" :key="p">
                    <mark v-if="part.hit">{{ part.text }}</mark>
                    <template v-else>{{ part.text }}</template>
                  </template>
                </span>
                <span v-if="item.hint" class="palette__hint mono">{{ item.hint }}</span>
                <Icon v-if="i === index" name="enter" :size="14" class="palette__enter" />
              </li>
            </template>
            <li v-if="!results.length" class="palette__empty">{{ t.empty }}</li>
          </ul>

          <footer class="palette__footer mono">
            <span><span class="kbd"><Icon name="updown" :size="11" /></span> {{ t.hintNav }}</span>
            <span><span class="kbd"><Icon name="enter" :size="11" /></span> {{ t.hintSelect }}</span>
            <span><span class="kbd">esc</span> {{ t.hintClose }}</span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Icon from './Icon.vue'
import type { PaletteAction } from './palette'
import type { Messages } from '../i18n'

const props = defineProps<{ actions: PaletteAction[]; t: Messages['palette'] }>()
const open = defineModel<boolean>('open', { required: true })

const query = ref('')
const index = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()
let returnFocus: HTMLElement | null = null

/** Subsequence fuzzy match: "exp" matches "Experience", "gh" matches "GitHub". */
function score(text: string, q: string): number {
  const hay = text.toLowerCase()
  if (hay.includes(q)) return 100 - hay.indexOf(q)
  let pos = -1
  let gaps = 0
  for (const ch of q) {
    const next = hay.indexOf(ch, pos + 1)
    if (next === -1) return -1
    gaps += next - pos - 1
    pos = next
  }
  return 50 - gaps
}

const results = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return props.actions
  return props.actions
    .map((a) => ({ a, s: Math.max(score(a.label, q), score(a.keywords ?? '', q) - 10) }))
    .filter(({ s }) => s >= 0)
    .sort((x, y) => y.s - x.s)
    .map(({ a }) => a)
})

function highlight(label: string) {
  const q = query.value.trim().toLowerCase()
  if (!q) return [{ text: label, hit: false }]
  const at = label.toLowerCase().indexOf(q)
  if (at === -1) return [{ text: label, hit: false }]
  return [
    { text: label.slice(0, at), hit: false },
    { text: label.slice(at, at + q.length), hit: true },
    { text: label.slice(at + q.length), hit: false },
  ]
}

watch(query, () => (index.value = 0))

watch(open, async (isOpen) => {
  if (isOpen) {
    returnFocus = document.activeElement as HTMLElement | null
    query.value = ''
    index.value = 0
    document.documentElement.style.overflow = 'hidden'
    await nextTick()
    input.value?.focus()
  } else {
    document.documentElement.style.overflow = ''
    returnFocus?.focus?.()
  }
})

function close() {
  open.value = false
}

function run(action: PaletteAction) {
  close()
  // Let the dialog close (and focus restore) before running, so scrolling isn't blocked.
  requestAnimationFrame(() => action.run())
}

function move(delta: number) {
  const n = results.value.length
  if (!n) return
  index.value = (index.value + delta + n) % n
  nextTick(() => list.value?.querySelector('.is-active')?.scrollIntoView({ block: 'nearest' }))
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowDown') move(1)
  else if (e.key === 'ArrowUp') move(-1)
  else if (e.key === 'Enter' && results.value[index.value]) run(results.value[index.value])
  else if (e.key === 'Escape') close()
  else if (e.key === 'Tab') input.value?.focus() // keep focus trapped in the dialog
  else return
  e.preventDefault()
}

function onGlobalKey(e: KeyboardEvent) {
  const target = e.target as HTMLElement
  const typing = target.closest('input, textarea, [contenteditable="true"]')
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    open.value = !open.value
  } else if (e.key === '/' && !typing && !open.value) {
    e.preventDefault()
    open.value = true
  }
}

onMounted(() => addEventListener('keydown', onGlobalKey))
onBeforeUnmount(() => {
  removeEventListener('keydown', onGlobalKey)
  document.documentElement.style.overflow = ''
})
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.palette {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: min(14vh, 120px) 16px 16px;
  background: rgb(10 9 7 / 0.36);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);

  &__dialog {
    display: flex;
    flex-direction: column;
    width: min(640px, 100%);
    max-height: min(560px, 76vh);
    overflow: hidden;
    border-radius: 18px;
    border: 1px solid var(--line-strong);
    background: var(--bg-elev);
    box-shadow:
      0 0 0 1px rgb(0 0 0 / 0.02),
      0 40px 80px -20px rgb(0 0 0 / 0.45);
  }

  &__search {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 16px 0 20px;
    border-bottom: 1px solid var(--line);
    color: var(--muted);

    input {
      flex: 1;
      min-width: 0;
      height: 60px;
      border: 0;
      outline: 0;
      background: none;
      color: var(--ink);
      font: inherit;
      font-size: 1.05rem;

      &::placeholder {
        color: var(--muted);
      }
    }
  }

  &__list {
    flex: 1;
    overflow-y: auto;
    overscroll-behavior: contain;
    margin: 0;
    padding: 8px;
    list-style: none;
  }

  &__group {
    padding: 12px 12px 6px;
    color: var(--muted);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 12px;
    height: 46px;
    padding: 0 12px;
    border-radius: 10px;
    color: var(--ink-2);
    cursor: pointer;

    &.is-active {
      background: var(--bg-sunken);
      color: var(--ink);

      .palette__icon {
        border-color: var(--accent);
        color: var(--accent);
      }
    }
  }

  &__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    border: 1px solid var(--line-strong);
    transition:
      color 0.15s ease,
      border-color 0.15s ease;
  }

  &__label {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    mark {
      background: none;
      color: var(--accent);
      font-weight: 600;
    }
  }

  &__hint {
    color: var(--muted);
    font-size: 0.72rem;
  }

  &__enter {
    color: var(--muted);
  }

  &__empty {
    padding: 32px;
    text-align: center;
    color: var(--muted);
  }

  &__footer {
    display: flex;
    gap: 18px;
    padding: 12px 20px;
    border-top: 1px solid var(--line);
    color: var(--muted);
    font-size: 0.7rem;

    > span {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    @include down(sm) {
      display: none;
    }
  }
}

.palette-enter-active,
.palette-leave-active {
  transition: opacity 0.2s ease;

  .palette__dialog {
    transition:
      transform 0.35s var(--ease-out),
      opacity 0.2s ease;
  }
}

.palette-enter-from,
.palette-leave-to {
  opacity: 0;

  .palette__dialog {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
}
</style>
