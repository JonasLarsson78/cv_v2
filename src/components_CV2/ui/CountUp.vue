<template>
  <span ref="el" :aria-label="value">
    <span aria-hidden="true">{{ display }}</span>
  </span>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

// Animates every number inside a string, e.g. "30–50%" or "5+", once it scrolls into view.
const props = defineProps<{ value: string }>()

const el = ref<HTMLElement>()
const display = ref(props.value.replace(/\d+/g, '0'))
let frame = 0
let observer: IntersectionObserver | null = null

function run() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
    display.value = props.value
    return
  }
  const parts = props.value.split(/(\d+)/)
  const duration = 1600
  const start = performance.now()
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - p, 4)
    display.value = parts
      .map((part) => (/^\d+$/.test(part) ? String(Math.round(Number(part) * eased)) : part))
      .join('')
    if (p < 1) frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
}

onMounted(() => {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      observer?.disconnect()
      run()
    },
    { threshold: 0.6 },
  )
  if (el.value) observer.observe(el.value)
})

watch(
  () => props.value,
  () => {
    cancelAnimationFrame(frame)
    display.value = props.value
  },
)

onBeforeUnmount(() => {
  cancelAnimationFrame(frame)
  observer?.disconnect()
})
</script>
