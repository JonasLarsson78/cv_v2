<template>
  <section ref="root" class="hero" @pointermove="onMove" @pointerleave="onLeave">
    <div class="hero__dots no-print" aria-hidden="true" />

    <div class="hero__inner">
      <div class="hero__text">
        <p class="hero__eyebrow">
          <span v-if="available" class="hero__status no-print">
            <span class="hero__pulse" />{{ t.available }}
          </span>
          <span class="mono hero__meta">{{ role }}<template v-if="location"> · {{ location }}</template></span>
        </p>

        <h1 class="hero__name" :aria-label="name">
          <span v-for="(word, w) in letters" :key="w" class="hero__word" aria-hidden="true">
            <span
              v-for="letter in word"
              :key="letter.i"
              class="hero__ch"
              :style="{ '--i': letter.i }"
            >{{ letter.ch }}</span>
            <span v-if="w === letters.length - 1" class="hero__dot">.</span>
          </span>
        </h1>

        <p class="hero__lede">{{ lede }}</p>

        <div class="hero__cta no-print">
          <a href="#contact" class="btn btn--primary">
            {{ t.contactMe }} <Icon name="arrow" :size="16" />
          </a>
          <button type="button" class="btn" @click="$emit('print')">
            <Icon name="printer" :size="16" /> {{ t.savePdf }}
          </button>
        </div>

        <ul class="hero__social">
          <li v-for="link in socials" :key="link.url">
            <a
              :href="link.url"
              class="icon-btn"
              :aria-label="link.label"
              :title="link.label"
              target="_blank"
              rel="noopener"
            >
              <Icon :name="link.icon" />
            </a>
            <span class="hero__social-print">{{ link.url.replace(/^(mailto:|https?:\/\/(www\.)?)/, '') }}</span>
          </li>
        </ul>
      </div>

      <div class="hero__visual no-print">
        <div class="hero__frame" :style="tiltStyle">
          <CodeWindow :name="name" :role="role" :location="location" :stack="stack" :available="available" />
        </div>
        <p v-if="coords" class="hero__caption mono">
          <span>{{ coords }}</span>
          <span>{{ location }}</span>
        </p>
      </div>

      <img class="hero__print-photo" src="/jpg/jonas_2025_05.jpg" :alt="name" width="160" height="160" />
    </div>

    <dl v-if="stats.length" class="hero__stats">
      <div v-for="(stat, i) in stats" :key="stat.label" class="hero__stat" v-reveal="i * 90">
        <dd><CountUp :value="stat.value" /></dd>
        <dt>{{ stat.label }}</dt>
      </div>
    </dl>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Icon from '../ui/Icon.vue'
import CountUp from '../ui/CountUp.vue'
import CodeWindow from '../ui/CodeWindow.vue'
import { vReveal } from '../directives'
import type { SocialLink } from '../composables/useCv'
import type { Messages } from '../i18n'

const props = defineProps<{
  name: string
  role: string
  lede: string
  location: string
  coords?: string
  stack: string[]
  available: boolean
  socials: SocialLink[]
  stats: { value: string; label: string }[]
  t: Messages
}>()

defineEmits<{ print: [] }>()

// Every letter gets a global index so the intro animation can stagger across words.
const letters = computed(() => {
  let i = 0
  return props.name.split(/\s+/).map((word) => [...word].map((ch) => ({ ch, i: i++ })))
})

const root = ref<HTMLElement>()
const tilt = ref({ x: 0, y: 0 })

function onMove(e: PointerEvent) {
  const el = root.value
  if (!el || e.pointerType !== 'mouse') return
  const rect = el.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width
  const y = (e.clientY - rect.top) / rect.height
  el.style.setProperty('--px', `${e.clientX - rect.left}px`)
  el.style.setProperty('--py', `${e.clientY - rect.top}px`)
  tilt.value = { x: (x - 0.5) * 10, y: (0.5 - y) * 10 }
}

function onLeave() {
  tilt.value = { x: 0, y: 0 }
  root.value?.style.removeProperty('--px')
  root.value?.style.removeProperty('--py')
}

const tiltStyle = computed(() => ({
  '--rx': `${tilt.value.y}deg`,
  '--ry': `${tilt.value.x}deg`,
}))
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.hero {
  position: relative;
  padding: clamp(120px, 18vh, 180px) 0 clamp(48px, 8vw, 96px);

  // Dot grid that lights up in the accent colour around the pointer.
  &__dots {
    position: absolute;
    inset: 0 calc(var(--gutter) * -1);
    z-index: -1;
    pointer-events: none;
    background-image: radial-gradient(var(--dot) 1px, transparent 1.5px);
    background-size: 22px 22px;
    mask-image: radial-gradient(ellipse 80% 70% at 70% 40%, #000 20%, transparent 75%);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: radial-gradient(var(--accent) 1.2px, transparent 1.7px);
      background-size: 22px 22px;
      mask-image: radial-gradient(
        220px circle at calc(var(--px, -999px) + var(--gutter)) var(--py, -999px),
        #000,
        transparent 70%
      );
      opacity: 0.85;
    }
  }

  &__inner {
    display: grid;
    gap: 56px;
    align-items: center;

    @include up(lg) {
      grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
      gap: 72px;
    }
  }

  &__eyebrow {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px 16px;
    margin: 0 0 28px;
  }

  &__status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px 6px 10px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background: var(--bg-elev);
    font-size: 0.8rem;
    font-weight: 500;
  }

  &__pulse {
    position: relative;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #22c55e;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: inherit;
      background: inherit;
      animation: pulse 2s var(--ease-out) infinite;
    }
  }

  &__meta {
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
  }

  // ---------- Name: variable-font letters ----------

  &__name {
    margin: 0;
    font-family: var(--font-display);
    font-variation-settings:
      'opsz' 144,
      'SOFT' 50;
    font-size: clamp(3.6rem, 12vw, 8.6rem);
    font-weight: 340;
    line-height: 0.92;
    letter-spacing: -0.045em;
  }

  &__word {
    display: inline-block;
    margin-right: 0.2em;

    &:last-child {
      margin-right: 0;
    }
  }

  &__ch {
    display: inline-block;
    cursor: default;
    transition:
      font-weight 0.6s var(--ease-out),
      color 0.3s ease;
    animation: rise 1.1s var(--ease-out) both;
    animation-delay: calc(var(--i) * 45ms + 120ms);

    // Hovered letter gets heavy, its neighbours get a little heavier — pure CSS via :has().
    &:hover {
      font-weight: 860;
      color: var(--accent);
    }

    &:hover + &,
    &:has(+ .hero__ch:hover) {
      font-weight: 600;
    }
  }

  &__dot {
    display: inline-block;
    color: var(--accent);
    animation: rise 1.1s var(--ease-out) 0.7s both;
  }

  &__lede {
    max-width: 34ch;
    margin: 32px 0 0;
    font-family: var(--font-display);
    font-variation-settings: 'opsz' 32;
    font-size: clamp(1.25rem, 2.2vw, 1.6rem);
    font-weight: 380;
    line-height: 1.4;
    letter-spacing: -0.01em;
    color: var(--ink-2);
    animation: fade-up 1s var(--ease-out) 0.5s both;
  }

  &__cta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 36px;
    animation: fade-up 1s var(--ease-out) 0.65s both;
  }

  &__social {
    display: flex;
    gap: 4px;
    margin: 24px 0 0 -8px;
    padding: 0;
    list-style: none;
    animation: fade-up 1s var(--ease-out) 0.8s both;
  }

  &__social-print {
    display: none;
  }

  // ---------- Code window with 3D tilt ----------

  &__visual {
    position: relative;
    width: 100%;
    max-width: 540px;
    margin: 0 auto;
    perspective: 1200px;
    animation: fade-up 1.2s var(--ease-out) 0.3s both;

    @include up(lg) {
      margin: 0 0 0 auto;
    }

    // Soft accent glow behind the editor.
    &::before {
      content: '';
      position: absolute;
      inset: 12% 8% 4%;
      z-index: -1;
      border-radius: 50%;
      background: var(--accent);
      opacity: 0.16;
      filter: blur(70px);
    }
  }

  &__frame {
    transform: rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg));
    transform-style: preserve-3d;
    transition: transform 0.8s var(--ease-out);
  }

  &__caption {
    display: flex;
    justify-content: space-between;
    margin: 14px 0 0;
    color: var(--muted);
  }

  &__print-photo {
    display: none;
  }

  // ---------- Stats ----------

  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0;
    margin: clamp(56px, 8vw, 96px) 0 0;
    border-top: 1px solid var(--line);
  }

  &__stat {
    padding: 24px 24px 0 0;

    & + & {
      @include up(md) {
        padding-left: 24px;
        border-left: 1px solid var(--line);
      }
    }

    dd {
      margin: 0;
      font-family: var(--font-display);
      font-variation-settings: 'opsz' 144;
      font-size: clamp(2.4rem, 5vw, 3.4rem);
      font-weight: 360;
      line-height: 1;
      letter-spacing: -0.03em;
      font-variant-numeric: tabular-nums;
    }

    dt {
      margin-top: 8px;
      color: var(--muted);
      font-size: 0.9rem;
    }
  }

  // ---------- Print ----------

  @include print {
    padding: 0 0 12pt;

    &__inner {
      display: flex;
      align-items: center;
      gap: 18pt;
    }

    &__text {
      flex: 1;
    }

    &__eyebrow {
      margin-bottom: 6pt;
    }

    &__name {
      font-size: 34pt;
      font-weight: 500;
    }

    &__lede {
      max-width: none;
      margin-top: 8pt;
      font-size: 12pt;
    }

    &__social {
      flex-wrap: wrap;
      gap: 2pt 14pt;
      margin: 8pt 0 0;

      li {
        display: flex;
        align-items: center;
        gap: 4pt;
        font-size: 9pt;
      }

      .icon-btn {
        width: auto;
        height: auto;
      }
    }

    &__social-print {
      display: inline;
    }

    &__print-photo {
      display: block;
      order: -1;
      width: 84pt;
      height: 84pt;
      border-radius: 50%;
      object-fit: cover;
      object-position: 50% 30%;
    }

    &__stats {
      display: none;
    }
  }
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(0.35em) rotate(4deg);
    filter: blur(8px);
  }
}

@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
}

@keyframes pulse {
  to {
    transform: scale(3);
    opacity: 0;
  }
}
</style>
