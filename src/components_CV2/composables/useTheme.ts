import { ref } from 'vue'

export type Theme = 'light' | 'dark'

const KEY = 'cv2-theme'

function initialTheme(): Theme {
  try {
    const stored = localStorage.getItem(KEY)
    if (stored === 'light' || stored === 'dark') return stored
  } catch {
    /* storage unavailable */
  }
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

const theme = ref<Theme>(initialTheme())

function apply(next: Theme) {
  theme.value = next
  document.documentElement.dataset.theme = next
  try {
    localStorage.setItem(KEY, next)
  } catch {
    /* storage unavailable */
  }
}

export function useTheme() {
  document.documentElement.dataset.theme = theme.value

  /** Toggles the theme with a circular reveal that grows from the pointer position. */
  function toggle(event?: MouseEvent) {
    const next: Theme = theme.value === 'dark' ? 'light' : 'dark'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduced) return apply(next)

    const x = event?.clientX || innerWidth - 40
    const y = event?.clientY || 32
    const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
    const root = document.documentElement

    root.classList.add('cv2-vt-theme')
    const transition = document.startViewTransition(() => apply(next))
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        {
          duration: 650,
          easing: 'cubic-bezier(.16,1,.3,1)',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
    transition.finished.finally(() => root.classList.remove('cv2-vt-theme'))
  }

  return { theme, toggle }
}
