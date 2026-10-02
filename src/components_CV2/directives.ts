import type { Directive } from 'vue'

let observer: IntersectionObserver | null = null

function getObserver() {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue
        entry.target.classList.add('is-in')
        observer?.unobserve(entry.target)
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.06 },
  )
  return observer
}

/** Fades an element in the first time it scrolls into view. Value = delay in ms. */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, { value }) {
    el.classList.add('reveal')
    if (value) el.style.setProperty('--reveal-delay', `${value}ms`)
    if (typeof IntersectionObserver === 'undefined') el.classList.add('is-in')
    else getObserver().observe(el)
  },
  unmounted(el) {
    observer?.unobserve(el)
  },
}

const spotlightHandlers = new WeakMap<HTMLElement, (e: PointerEvent) => void>()

/** Exposes the pointer position as --mx / --my so CSS can paint a spotlight. */
export const vSpotlight: Directive<HTMLElement> = {
  mounted(el) {
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      el.style.setProperty('--mx', `${e.clientX - rect.left}px`)
      el.style.setProperty('--my', `${e.clientY - rect.top}px`)
    }
    spotlightHandlers.set(el, onMove)
    el.addEventListener('pointermove', onMove)
  },
  unmounted(el) {
    const onMove = spotlightHandlers.get(el)
    if (onMove) el.removeEventListener('pointermove', onMove)
  },
}
