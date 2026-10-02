// Logos drawn in black only; they are inverted in dark mode (see the `.is-mono` rules).
const MONO_LOGOS = ['github', 'express', 'vercel', 'oauth2']

export function isMono(image: string) {
  return MONO_LOGOS.some((name) => image.endsWith(`/${name}.svg`))
}
