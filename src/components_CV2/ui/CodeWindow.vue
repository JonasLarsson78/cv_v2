<template>
  <div class="code" role="img" :aria-label="`${file}: ${name}, ${role}`">
    <div class="code__bar" aria-hidden="true">
      <span class="code__lights"><i /><i /><i /></span>
      <span class="code__tab">
        <svg viewBox="0 0 24 24" width="13" height="13"><path d="M2 3h4l6 10.5L18 3h4L12 21z" fill="#41b883" /><path d="M6 3h3.5L12 7.5 14.5 3H18l-6 10.5z" fill="#35495e" /></svg>
        {{ file }}
      </span>
    </div>

    <pre class="code__body" aria-hidden="true"><code><span
      v-for="(line, l) in rendered"
      :key="l"
      class="code__line"
      :class="{ 'is-current': l === cursorLine }"
    ><span class="code__ln">{{ l + 1 }}</span><span
        v-for="(tok, k) in line"
        :key="k"
        :class="tok.c && `t-${tok.c}`"
      >{{ tok.text }}</span><span v-if="l === cursorLine" class="code__caret" :class="{ 'is-idle': done }" /></span></code></pre>

    <div class="code__status" aria-hidden="true">
      <span><i class="code__ok" /> 0 problems</span>
      <span>Vue · TypeScript</span>
      <span>Ln {{ cursorLine + 1 }}, Col {{ cursorCol + 1 }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

// A tiny "editor" that types out a Vue SFC describing the developer — built from CV data.
const props = defineProps<{
  name: string
  role: string
  location: string
  stack: string[]
  available: boolean
}>()

type Tok = { text: string; c?: 'kw' | 'str' | 'prop' | 'tag' | 'attr' | 'bool' | 'fn' | 'punc' }

const file = 'Developer.vue'

const q = (s: string): Tok => ({ text: `'${s.replace(/'/g, "\\'")}'`, c: 'str' })
const p = (text: string): Tok => ({ text, c: 'punc' })

const lines = computed<Tok[][]>(() => [
  [p('<'), { text: 'script', c: 'tag' }, { text: ' setup lang', c: 'attr' }, p('='), { text: '"ts"', c: 'str' }, p('>')],
  [{ text: 'const', c: 'kw' }, { text: ' developer ' }, p('= {')],
  [{ text: '  name', c: 'prop' }, p(': '), q(props.name), p(',')],
  [{ text: '  role', c: 'prop' }, p(': '), q(props.role), p(',')],
  ...(props.location ? [[{ text: '  basedIn', c: 'prop' as const }, p(': '), q(props.location), p(',')]] : []),
  [
    { text: '  stack', c: 'prop' },
    p(': ['),
    ...props.stack.flatMap((s, i) => (i ? [p(', '), q(s)] : [q(s)])),
    p('],'),
  ],
  [{ text: '  available', c: 'prop' }, p(': '), { text: String(props.available), c: 'bool' }, p(',')],
  [p('}')],
  [p('</'), { text: 'script', c: 'tag' }, p('>')],
  [],
  [p('<'), { text: 'template', c: 'tag' }, p('>')],
  [p('  <'), { text: 'Developer', c: 'tag' }],
  [{ text: '    v-bind', c: 'attr' }, p('='), { text: '"developer"', c: 'str' }],
  [{ text: '    @hire', c: 'attr' }, p('='), { text: '"sayHello"', c: 'fn' }],
  [p('  />')],
  [p('</'), { text: 'template', c: 'tag' }, p('>')],
])

// Typing state: number of characters revealed (each line break counts as one).
const lineLengths = computed(() => lines.value.map((l) => l.reduce((n, t) => n + t.text.length, 0)))
const total = computed(() => lineLengths.value.reduce((n, len) => n + len + 1, 0) - 1)
const typed = ref(0)
const done = computed(() => typed.value >= total.value)

const position = computed(() => {
  let left = Math.min(typed.value, total.value)
  for (let l = 0; l < lineLengths.value.length; l++) {
    if (left <= lineLengths.value[l]) return { line: l, col: left }
    left -= lineLengths.value[l] + 1
  }
  const last = lineLengths.value.length - 1
  return { line: last, col: lineLengths.value[last] }
})
const cursorLine = computed(() => position.value.line)
const cursorCol = computed(() => position.value.col)

// Every line is always rendered (keeps the window size stable); text is sliced while typing.
const rendered = computed(() =>
  lines.value.map((line, l) => {
    if (l > cursorLine.value) return []
    if (l < cursorLine.value) return line
    let left = cursorCol.value
    return line
      .map((tok) => {
        const text = tok.text.slice(0, Math.max(0, left))
        left -= tok.text.length
        return { ...tok, text }
      })
      .filter((tok) => tok.text)
  }),
)

let timer = 0

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typed.value = Number.MAX_SAFE_INTEGER
    return
  }
  const tick = () => {
    // Type whitespace runs instantly and pause briefly at line ends, like a human would.
    const { line, col } = position.value
    const rest = lines.value[line]?.map((t) => t.text).join('').slice(col) ?? ''
    const indent = rest.match(/^ +/)?.[0].length ?? 0
    typed.value += Math.max(1, indent)
    if (done.value) return
    const atLineEnd = position.value.col === lineLengths.value[position.value.line]
    timer = window.setTimeout(tick, atLineEnd ? 140 : 22 + Math.random() * 38)
  }
  timer = window.setTimeout(tick, 900)
})

onBeforeUnmount(() => clearTimeout(timer))
</script>

<style lang="scss" scoped>
// The editor is always dark, in both themes — it reads as a real tool on the page.
$bg: #12110e;
$bar: #1a1915;
$line: #2a2823;
$text: #e8e2d6;
$muted: #6f6a5f;

.code {
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid #2c2a24;
  background: $bg;
  color: $text;
  box-shadow:
    0 1px 0 rgb(255 255 255 / 0.04) inset,
    0 40px 80px -30px rgb(0 0 0 / 0.55),
    0 12px 24px -12px rgb(0 0 0 / 0.35);

  &__bar {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 14px;
    background: $bar;
    border-bottom: 1px solid $line;
  }

  &__lights {
    display: flex;
    gap: 7px;

    i {
      width: 11px;
      height: 11px;
      border-radius: 50%;
      background: #3a3730;
      transition: background-color 0.3s ease;
    }
  }

  &:hover &__lights i {
    &:nth-child(1) {
      background: #ff5f57;
    }
    &:nth-child(2) {
      background: #febc2e;
    }
    &:nth-child(3) {
      background: #28c840;
    }
  }

  &__tab {
    position: absolute;
    left: 50%;
    display: inline-flex;
    align-items: center;
    gap: 7px;
    transform: translateX(-50%);
    color: #b7b0a2;
    font-family: var(--font-mono);
    font-size: 0.74rem;
  }

  &__body {
    margin: 0;
    padding: 18px 0;
    overflow-x: auto;
    font-family: var(--font-mono);
    font-size: clamp(0.7rem, 1.05vw, 0.82rem);
    line-height: 1.75;
    tab-size: 2;
  }

  &__line {
    display: block;
    min-height: 1.75em;
    padding-right: 20px;
    white-space: pre;

    &.is-current {
      background: rgb(255 255 255 / 0.035);
    }
  }

  &__ln {
    display: inline-block;
    width: 3.2em;
    padding-right: 1.2em;
    text-align: right;
    color: #4a463e;
    user-select: none;

    .is-current & {
      color: #a9a294;
    }
  }

  &__caret {
    display: inline-block;
    width: 2px;
    height: 1.15em;
    margin-left: 1px;
    vertical-align: -0.2em;
    background: var(--accent);

    &.is-idle {
      animation: caret 1.1s steps(1) infinite;
    }
  }

  &__status {
    display: flex;
    gap: 18px;
    height: 28px;
    align-items: center;
    padding: 0 14px;
    border-top: 1px solid $line;
    background: $bar;
    color: $muted;
    font-family: var(--font-mono);
    font-size: 0.66rem;

    span:last-child {
      margin-left: auto;
    }
  }

  &__ok {
    display: inline-block;
    width: 6px;
    height: 6px;
    margin-right: 4px;
    border-radius: 50%;
    background: #28c840;
    vertical-align: 1px;
  }
}

// Syntax theme
.t-kw {
  color: #ff7a45;
}
.t-str {
  color: #a9c98f;
}
.t-prop {
  color: #e6d3b3;
}
.t-tag {
  color: #7fb4ca;
}
.t-attr {
  color: #d7a86e;
}
.t-bool {
  color: #c4a2ff;
}
.t-fn {
  color: #f2c572;
}
.t-punc {
  color: #8d877b;
}

@keyframes caret {
  50% {
    opacity: 0;
  }
}
</style>
