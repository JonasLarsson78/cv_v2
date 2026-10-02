import type { IconKey } from './icons'

export interface PaletteAction {
  id: string
  group: string
  label: string
  icon: IconKey
  hint?: string
  keywords?: string
  run: () => void
}
