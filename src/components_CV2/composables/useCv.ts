import { computed, ref, shallowRef } from 'vue'
import { loadCvContentFromDb } from '../../db/cvRepository'
import { messages, type Lang } from '../i18n'

export type IconName =
  | 'linkedin'
  | 'github'
  | 'mail'
  | 'phone'
  | 'location'
  | 'globe'
  | 'link'

export interface SocialLink {
  icon: IconName
  url: string
  label: string
}

export interface ContactItem {
  icon: IconName
  text: string
  url?: string
  tag?: string
}

export interface Role {
  title: string
  company: string
  notes: string[]
  period: string
  start: Date | null
  end: Date | null
  months: number
  duties: { header: string; items: string[] }[]
}

export interface Education {
  period: string
  school: string
  program: string
  description: string
  certificate?: string
}

export interface Reference {
  name: string
  company: string
  mail: string
  phone: string
}

export interface Skill {
  name: string
  image: string
  grade: number
  description: string
}

export interface SkillGroup {
  category: string
  items: Skill[]
}

export interface Cv {
  name: string
  role: string
  lede: string
  about: string
  socials: SocialLink[]
  contact: ContactItem[]
  experience: Role[]
  education: Education[]
  references: Reference[]
  skills: SkillGroup[]
  titles: Record<'experience' | 'skills' | 'education' | 'references' | 'contact', string>
  footer: { copyright: string; text: string; repoUrl: string; repoLabel: string }
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, maj: 4, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, okt: 9, oct: 9, nov: 10, dec: 11,
}

function parseMonth(value: string): Date | null {
  const match = value.trim().match(/^([a-zåäö]+)\.?\s+(\d{4})$/i)
  if (!match) return null
  const month = MONTHS[match[1].slice(0, 3).toLowerCase()]
  return month === undefined ? null : new Date(Number(match[2]), month, 1)
}

function parsePeriod(period: string) {
  const [from, to] = period.split(/\s+[-–]\s+/)
  const start = from ? parseMonth(from) : null
  const end = to && /present|now|nu|pågående/i.test(to) ? new Date() : to ? parseMonth(to) : null
  const months =
    start && end
      ? (end.getFullYear() - start.getFullYear()) * 12 + end.getMonth() - start.getMonth() + 1
      : 0
  return { start, end, months }
}

function iconFromClass(cls: string): IconName {
  if (cls.includes('linkedin')) return 'linkedin'
  if (cls.includes('github')) return 'github'
  if (cls.includes('envelope')) return 'mail'
  if (cls.includes('phone')) return 'phone'
  if (cls.includes('map')) return 'location'
  if (cls.includes('globe')) return 'globe'
  return 'link'
}

const SOCIAL_LABELS: Partial<Record<IconName, string>> = {
  linkedin: 'LinkedIn',
  github: 'GitHub',
  mail: 'Email',
}

/** Splits "Hi! My name is Jonas — a front-end-focused…" into a punchy lede + the rest. */
function splitSummary(summary: string) {
  // Split on sentence ends followed by a capital letter, so "Node.js" stays intact.
  const sentences = summary.split(/(?<=[.!?])\s+(?=[A-ZÅÄÖ])/)
  const intro = sentences.find((s) => s.includes('—')) ?? sentences[0]
  const lede = intro.replace(/^.*?—\s*/, '').trim()
  const about = sentences
    .slice(sentences.indexOf(intro) + 1)
    .join(' ')
    .trim()
  return { lede: lede.charAt(0).toUpperCase() + lede.slice(1), about }
}

// cvRepository returns loosely typed sections, so we detect each section by its shape
// instead of relying on translated titles.
function normalize(raw: ContentType, lang: Lang): Cv {
  const t = messages[lang]
  const { lede, about } = splitSummary(raw.header.summary)
  const cv: Cv = {
    name: raw.header.name,
    role: raw.header.role,
    lede,
    about,
    socials: raw.header.socialLinks.map((s) => {
      const icon = iconFromClass(s.icon)
      return { icon, url: s.url, label: SOCIAL_LABELS[icon] ?? s.url }
    }),
    contact: [],
    experience: [],
    education: [],
    references: [],
    skills: [],
    titles: {
      experience: 'Experience',
      skills: 'Skills',
      education: 'Education',
      references: 'References',
      contact: t.contactKicker,
    },
    footer: {
      copyright: (raw.footer?.copyright ?? '').replace('{{year}}', String(new Date().getFullYear())),
      text: raw.footer?.text ?? '',
      repoUrl: raw.footer?.cv?.url ?? '',
      repoLabel: [raw.footer?.cv?.text, raw.footer?.cv?.text2].filter(Boolean).join(' '),
    },
  }

  for (const section of raw.sections as any[]) {
    const first = section.content?.[0]

    if (Array.isArray(section.contentV2)) {
      cv.titles.skills = section.title
      cv.skills = section.contentV2.map((group: any) => ({
        category: String(group.category),
        items: (group.items as any[]).map((item) => ({
          name: String(item.text),
          image: String(item.image),
          grade: Number(item.grade) || 0,
          description: String(item.description ?? ''),
        })),
      }))
    } else if (first && 'date' in first && 'details' in first) {
      cv.titles.experience = section.title
      cv.experience = (section.content as any[]).map((entry) => {
        const [company = '', ...notes] = entry.details as string[]
        return {
          title: entry.heading,
          company,
          notes,
          period: String(entry.date).replace(/\s+-\s+/, ' – '),
          duties: entry.duties ?? [],
          ...parsePeriod(entry.date),
        }
      })
    } else if (first && 'company' in first) {
      cv.titles.references = section.title
      cv.references = section.content
    } else if (first && 'icon' in first) {
      cv.titles.contact = section.title
      cv.contact = (section.content as any[]).map((c) => ({
        icon: iconFromClass(c.icon),
        text: c.text,
        url: c.url,
        tag: c.tag,
      }))
    } else if (first && 'subheading' in first) {
      cv.titles.education = section.title
      cv.education = (section.content as any[]).map((e) => {
        const [period = '', school = ''] = String(e.heading).split('|').map((s) => s.trim())
        return {
          period,
          school,
          program: e.subheading,
          description: e.description,
          certificate: e.examensbevis,
        }
      })
    }
  }

  return cv
}

function readLang(): Lang {
  try {
    return localStorage.getItem('local') === 'se' ? 'sv' : 'en'
  } catch {
    return 'en'
  }
}

export function useCv() {
  const lang = ref<Lang>(readLang())
  const cv = shallowRef<Cv | null>(null)
  const error = ref<string | null>(null)
  const t = computed(() => messages[lang.value])

  async function load(next: Lang = lang.value) {
    error.value = null
    try {
      const raw = await loadCvContentFromDb(next)
      const data = normalize(raw, next)
      const apply = () => {
        cv.value = data
        lang.value = next
        document.documentElement.lang = next
      }
      // Cross-fade language changes when the browser supports View Transitions.
      if (cv.value && document.startViewTransition) await document.startViewTransition(apply).finished
      else apply()
    } catch (e) {
      console.error(e)
      error.value = messages[next].error
    }
  }

  function setLang(next: Lang) {
    try {
      // Same key as the original CV so both versions share the preference.
      localStorage.setItem('local', next === 'sv' ? 'se' : 'en')
    } catch {
      /* storage unavailable */
    }
    return load(next)
  }

  return { cv, error, lang, t, load, setLang }
}

export function formatDuration(months: number, lang: Lang) {
  const t = messages[lang]
  const y = Math.floor(months / 12)
  const m = months % 12
  return [y ? t.years(y) : '', m ? t.months(m) : ''].filter(Boolean).join(' ')
}
