<template>
  <Transition name="boot" mode="out-in">
    <div v-if="!cv" key="boot" class="boot" role="status" aria-live="polite">
      <template v-if="error">
        <p class="boot__line">{{ error }}</p>
        <button type="button" class="btn" @click="start">{{ t.retry }}</button>
      </template>
      <template v-else>
        <p class="boot__line mono">
          <span class="boot__prompt">$</span> {{ t.loading }}<span class="boot__caret" />
        </p>
        <div class="boot__bar"><span /></div>
        <p class="boot__sub mono">{{ t.loadingSub }}</p>
      </template>
    </div>

    <div v-else key="cv" class="cv2">
      <a class="skip-link no-print" href="#about">Skip to content</a>

      <SiteNav
        :name="cv.name"
        :items="navItems"
        :active="activeId"
        :lang="lang"
        :theme="theme"
        :t="t"
        @palette="paletteOpen = true"
        @lang="switchLang"
        @theme="toggleTheme"
      />

      <main class="cv2__page">
        <Hero
          :name="cv.name"
          :role="cv.role"
          :lede="cv.lede"
          :location="location"
          :coords="coords"
          :stack="stack"
          :available="available"
          :socials="cv.socials"
          :stats="stats"
          :t="t"
          @print="print"
        />
      </main>

      <TechMarquee :skills="allSkills" />

      <div class="cv2__page">
        <CvSection id="about" index="01" :title="t.about" :kicker="t.aboutKicker">
          <About :text="cv.about" :keywords="keywords" :name="cv.name" :role="cv.role" />
        </CvSection>

        <CvSection
          v-if="cv.experience.length"
          id="experience"
          index="02"
          :title="cv.titles.experience"
          :kicker="t.experienceKicker"
        >
          <Experience :roles="cv.experience" :lang="lang" :t="t" />
        </CvSection>

        <CvSection
          v-if="cv.skills.length"
          id="skills"
          index="03"
          :title="cv.titles.skills"
          :kicker="t.skillsKicker(allSkills.length, cv.skills.length)"
        >
          <Skills :groups="cv.skills" :title="cv.titles.skills" :t="t" />
        </CvSection>

        <CvSection
          v-if="cv.education.length"
          id="education"
          index="04"
          :title="cv.titles.education"
          :kicker="t.educationKicker"
        >
          <Education :items="cv.education" :t="t" />
        </CvSection>

        <CvSection
          v-if="cv.references.length"
          id="references"
          index="05"
          :title="cv.titles.references"
          :kicker="t.referencesKicker"
        >
          <References :items="cv.references" />
        </CvSection>

        <CvSection id="contact" index="06" :title="cv.titles.contact" :kicker="t.contactKicker">
          <Contact :items="cv.contact" :t="t" @copy="copy" />
        </CvSection>

        <SiteFooter :footer="cv.footer" :t="t" />
      </div>

      <CommandPalette v-model:open="paletteOpen" :actions="actions" :t="t.palette" />

      <Transition name="toast">
        <div v-if="toast" class="toast no-print" role="status">
          <Icon name="check" :size="16" /> {{ toast }}
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useCv } from './composables/useCv'
import { useTheme } from './composables/useTheme'
import { findKeywords } from './keywords'
import type { PaletteAction } from './ui/palette'
import Icon from './ui/Icon.vue'
import CvSection from './ui/CvSection.vue'
import CommandPalette from './ui/CommandPalette.vue'
import SiteNav from './sections/SiteNav.vue'
import Hero from './sections/Hero.vue'
import TechMarquee from './sections/TechMarquee.vue'
import About from './sections/About.vue'
import Experience from './sections/Experience.vue'
import Skills from './sections/Skills.vue'
import Education from './sections/Education.vue'
import References from './sections/References.vue'
import Contact from './sections/Contact.vue'
import SiteFooter from './sections/SiteFooter.vue'

const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT@9..144,300..900,0..100&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap'

const { cv, error, lang, t, load, setLang } = useCv()
const { theme, toggle: toggleTheme } = useTheme()

// ---------- Boot ----------

function injectFonts() {
  if (document.querySelector('link[data-cv2-fonts]')) return
  for (const href of ['https://fonts.googleapis.com', 'https://fonts.gstatic.com']) {
    const link = Object.assign(document.createElement('link'), { rel: 'preconnect', href })
    if (href.includes('gstatic')) link.crossOrigin = ''
    document.head.append(link)
  }
  const css = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: FONTS_URL })
  css.dataset.cv2Fonts = ''
  document.head.append(css)
}

async function start() {
  // Global styles are loaded on demand so they never reach the original CV.
  await Promise.all([import('./styles/cv2.scss'), load()])
}

onMounted(() => {
  document.documentElement.classList.add('cv2')
  document.documentElement.lang = lang.value
  injectFonts()
  start()
})

onBeforeUnmount(() => {
  document.documentElement.classList.remove('cv2')
  observer?.disconnect()
})

watch(
  () => cv.value?.name,
  (name) => {
    if (name) document.title = `${name} — ${cv.value?.role}`
  },
)

// ---------- Derived data ----------

const allSkills = computed(() => {
  const seen = new Set<string>()
  return (cv.value?.skills ?? [])
    .flatMap((g) => g.items)
    .filter((s) => !seen.has(s.name) && seen.add(s.name))
})

const keywords = computed(() => allSkills.value.map((s) => s.name))

// Core stack for the code window: the first technologies mentioned in the summary.
const stack = computed(() => {
  const found = findKeywords(`${cv.value?.lede ?? ''} ${cv.value?.about ?? ''}`, keywords.value)
  return found.length ? found.slice(0, 3) : keywords.value.slice(0, 3)
})

const locationItem = computed(() => cv.value?.contact.find((c) => c.icon === 'location'))

// "Engelska gången 29C, 254 51 Helsingborg" → "Helsingborg, Sweden"
const location = computed(() => {
  const city = locationItem.value?.text.split(',').pop()?.replace(/\d+/g, '').trim()
  return city ? `${city}, ${t.value.country}` : ''
})

// Pull lat/lng out of the Google Maps link stored in the database.
const coords = computed(() => {
  const match = locationItem.value?.url?.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)
  if (!match) return undefined
  const [lat, lng] = [Number(match[1]), Number(match[2])]
  return `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`
})

// Shown when the most recent role has ended.
const available = computed(() => {
  const ends = (cv.value?.experience ?? []).map((r) => r.end?.getTime() ?? 0)
  return ends.length > 0 && Math.max(...ends) < Date.now() - 31 * 864e5
})

const stats = computed(() => {
  const data = cv.value
  if (!data) return []
  const devMonths = data.experience
    .filter((r) => /develop|utvecklare/i.test(r.title))
    .reduce((sum, r) => sum + r.months, 0)
  const perf = data.experience
    .flatMap((r) => r.duties.flatMap((d) => d.items))
    .join(' ')
    .match(/(\d+)\s*[-–]\s*(\d+)\s*%/)

  return [
    devMonths >= 12 && { value: `${Math.floor(devMonths / 12)}+`, label: t.value.statYears },
    allSkills.value.length > 0 && { value: String(allSkills.value.length), label: t.value.statTech },
    perf && { value: `${perf[1]}–${perf[2]}%`, label: t.value.statPerf },
  ].filter((s): s is { value: string; label: string } => !!s)
})

const navItems = computed(() => {
  const data = cv.value
  if (!data) return []
  return [
    { id: 'about', label: t.value.about, show: true },
    { id: 'experience', label: data.titles.experience, show: data.experience.length > 0 },
    { id: 'skills', label: data.titles.skills, show: data.skills.length > 0 },
    { id: 'education', label: data.titles.education, show: data.education.length > 0 },
    { id: 'references', label: data.titles.references, show: data.references.length > 0 },
    { id: 'contact', label: data.titles.contact, show: true },
  ].filter((i) => i.show)
})

// ---------- Active section tracking ----------

const activeId = ref('')
let observer: IntersectionObserver | null = null

function observeSections() {
  observer?.disconnect()
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) if (entry.isIntersecting) activeId.value = entry.target.id
    },
    { rootMargin: '-40% 0px -55% 0px' },
  )
  for (const { id } of navItems.value) {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  }
}

watch(navItems, () => nextTick(observeSections), { flush: 'post' })

// ---------- Actions ----------

const paletteOpen = ref(false)
const toast = ref('')
let toastTimer = 0

function notify(message: string) {
  toast.value = message
  clearTimeout(toastTimer)
  toastTimer = window.setTimeout(() => (toast.value = ''), 2200)
}

async function copy(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    notify(t.value.copied)
  } catch {
    window.location.href = `mailto:${value}`
  }
}

function print() {
  window.print()
}

function switchLang() {
  setLang(lang.value === 'sv' ? 'en' : 'sv')
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ block: 'start' })
}

const actions = computed<PaletteAction[]>(() => {
  const p = t.value.palette
  const email = cv.value?.contact.find((c) => c.icon === 'mail')?.text
  return [
    ...navItems.value.map((item, i) => ({
      id: `nav-${item.id}`,
      group: p.navigate,
      label: item.label,
      icon: 'hash' as const,
      hint: String(i + 1).padStart(2, '0'),
      run: () => scrollTo(item.id),
    })),
    {
      id: 'theme',
      group: p.actions,
      label: theme.value === 'dark' ? p.toLight : p.toDark,
      icon: theme.value === 'dark' ? 'sun' : 'moon',
      keywords: 'theme dark light mode tema mörkt ljust',
      run: () => toggleTheme(),
    },
    {
      id: 'lang',
      group: p.actions,
      label: p.toggleLang,
      icon: 'languages',
      keywords: 'language språk english svenska',
      run: switchLang,
    },
    { id: 'print', group: p.actions, label: p.print, icon: 'printer', keywords: 'pdf print skriv ut', run: print },
    ...(email
      ? [{ id: 'copy', group: p.actions, label: p.copyEmail, icon: 'copy' as const, hint: email, run: () => copy(email) }]
      : []),
    ...(cv.value?.socials ?? [])
      .filter((s) => s.icon !== 'mail')
      .map((s) => ({
        id: `link-${s.icon}`,
        group: p.links,
        label: s.label,
        icon: s.icon,
        hint: s.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, ''),
        run: () => window.open(s.url, '_blank', 'noopener'),
      })),
    ...(cv.value?.footer.repoUrl
      ? [
          {
            id: 'source',
            group: p.links,
            label: t.value.sourceLabel,
            icon: 'github' as const,
            keywords: 'source code repo github källkod',
            run: () => window.open(cv.value!.footer.repoUrl, '_blank', 'noopener'),
          },
        ]
      : []),
  ]
})
</script>

<style lang="scss" scoped>
@use './styles/mixins' as *;

.cv2__page {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 var(--gutter);

  @include print {
    max-width: none;
    padding: 0;
  }
}

.skip-link {
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 200;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--bg);
  transform: translateY(-200%);
  transition: transform 0.3s var(--ease-out);

  &:focus {
    transform: none;
  }
}

// ---------- Boot screen ----------

.boot {
  display: grid;
  place-content: center;
  justify-items: start;
  gap: 16px;
  min-height: 100vh;
  padding: 24px;
  background: var(--bg, #f4f1ea);
  color: var(--ink, #16140f);
  font-family: var(--font-sans, system-ui, sans-serif);

  &__line {
    margin: 0;
    font-size: 0.9rem;
  }

  &__prompt {
    color: var(--accent, #c2410c);
    margin-right: 6px;
  }

  &__caret {
    display: inline-block;
    width: 0.55em;
    height: 1.1em;
    margin-left: 4px;
    vertical-align: -0.2em;
    background: currentColor;
    animation: blink 1s steps(1) infinite;
  }

  &__bar {
    position: relative;
    width: min(320px, 70vw);
    height: 2px;
    overflow: hidden;
    background: var(--line, #e0dacd);

    span {
      position: absolute;
      inset: 0;
      width: 40%;
      background: var(--accent, #c2410c);
      animation: indeterminate 1.1s var(--ease-out, ease) infinite;
    }
  }

  &__sub {
    margin: 0;
    color: var(--muted, #7a7468);
  }
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}

@keyframes indeterminate {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(250%);
  }
}

.boot-leave-active {
  transition: opacity 0.35s ease;
}

.boot-leave-to {
  opacity: 0;
}

// ---------- Toast ----------

.toast {
  position: fixed;
  left: 50%;
  bottom: 28px;
  z-index: 120;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 999px;
  background: var(--ink);
  color: var(--bg);
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: var(--shadow-lg);
  transform: translateX(-50%);

  svg {
    color: var(--accent);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.5s var(--ease-out);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, 16px) scale(0.96);
}
</style>
