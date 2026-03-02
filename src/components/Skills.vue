<template>
  <div v-if="skillsV2">
    <section class="skills-section list-style">
      <div v-for="group in groupedSkills" :key="group.category" class="skills-group">
        <h3 class="group-title">{{ group.category }}:</h3>
        <ul class="skills-list">
          <li v-for="skill in group.items" :key="skill.text" class="skill-list-item">
            <button class="skill-row" @click="toggleModal(skill)">
              <img :src="skill.image" :alt="skill.text" class="skill-mini" />
              <div class="skill-meta">
                <span class="skill-title">{{ skill.text }}</span>
                <span class="skill-desc" v-if="skill.description"> — {{ skill.description }}</span>
              </div>
              <div class="skill-grade-compact">
                <div v-for="n in 5" :key="n" :class="['grade-dot', { active: n <= skill.grade }]"></div>
              </div>
            </button>
          </li>
        </ul>
      </div>
    </section>
  </div>
  <div v-else>
    <section class="skills-section">
      <div class="skills-container">
        <div v-for="skill in resolvedSkills" :key="skill.text" class="skill-item">
          <img :src="skill.image" :alt="skill.text" class="skill-image" @click="toggleModal(skill)" />
          <p>{{ skill.text }}</p>
          <div class="skill-grade" style="margin: 0 auto">
            <span>1</span>
            <div v-for="n in 5" :key="n" :class="['grade-bar', { active: n <= skill.grade }]"></div>
            <span>5</span>
          </div>
        </div>
      </div>
    </section>

  </div>
  <div v-if="modal">
    <div class="modal">
      <h2>{{ modalContent?.text }}</h2>
      <img :src="modalContent?.image" :alt="modalContent?.text" />
      <p>Grade: {{ modalContent?.grade }}</p>
      <p v-if="modalContent?.description">{{ modalContent?.description }}</p>
      <button @click="toggleModal(null)">Close</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Skill {
  text: string
  image: string
  grade: number
  description?: string
}
const skillsV2 = ref(true) // toggle this to switch between old flat skills and new grouped skills with modal details
const modal = ref(false)
const modalContent = ref<Skill | null>(null) // Properly type modalContent

const props = defineProps({
  skills: {
    type: Array as () => any[],
    required: false,
    default: () => [],
  },
  section: {
    type: Object as () => any,
    required: false,
  },
})

const resolvedSkills = computed(() => {
  const fromSkills = (props.section?.content || [])
  return fromSkills.map((skill: any) => ({
    ...skill,
    image: skill.image ? new URL(skill.image, import.meta.url).href : undefined,
  }))
})

const groupedSkills = computed(() => {
  // If `section` prop provided, merge contentV2 (groups) and flat content
  if (props.section) {
    const section = props.section
    const groups: any[] = []

    // map contentV2 groups if present
    if (Array.isArray(section.contentV2) && section.contentV2.length) {
      section.contentV2.forEach((g: any) => {
        groups.push({
          category: g.category || 'Ungrouped',
          items: (g.items || []).map((skill: any) => ({
            ...skill,
            image: skill.image ? new URL(skill.image, import.meta.url).href : undefined,
          })),
        })
      })
    }

    // collect flat items from section.content
    const flat = (Array.isArray(section.content) ? section.content : [])
      .filter((item: any) => 'text' in item && 'image' in item && 'grade' in item)
      .map((skill: any) => ({
        ...skill,
        image: skill.image ? new URL(skill.image, import.meta.url).href : undefined,
      }))

    if (flat.length) {
      if (groups.length) {
        // merge flat items into existing groups instead of creating an "Other" group
        const keywordMap: Record<string, string[]> = {
          frontend: ['vue', 'react', 'html', 'css', 'sass', 'javascript', 'javascript', 'js', 'typescript', 'ts', 'vite', 'pinia'],
          backend: ['node', 'go', 'graphql', 'mysql'],
          devops: ['docker', 'npm', 'github', 'postman'],
          design: ['figma'],
        }

        const findGroupIndexFor = (skillText: string) => {
          const t = (skillText || '').toLowerCase()
          // try exact matching against existing items
          for (let i = 0; i < groups.length; i++) {
            if ((groups[i].items || []).some((it: any) => (it.text || '').toLowerCase() === t)) return i
          }
          // try keyword map
          for (const [key, keywords] of Object.entries(keywordMap)) {
            if (keywords.some(k => t.includes(k))) {
              // find a group whose category name matches key
              const idx = groups.findIndex(g => (g.category || '').toLowerCase().includes(key))
              if (idx >= 0) return idx
            }
          }
          return -1
        }

        flat.forEach((skill: any) => {
          const idx = findGroupIndexFor(skill.text)
          if (idx >= 0) {
            // avoid exact duplicate
            if (!groups[idx].items.some((it: any) => (it.text || '').toLowerCase() === (skill.text || '').toLowerCase())) {
              groups[idx].items.push(skill)
            }
          } else {
            // fallback: append to first group
            groups[0].items.push(skill)
          }
        })
      } else {
        // no groups defined, present flat items as a single group
        groups.push({ category: 'Skills', items: flat })
      }
    }

    // sort each group's items
    groups.forEach((g: any) => {
      if (Array.isArray(g.items) && g.items.length) {
        const hasOrder = g.items.some((it: any) => it.order !== undefined && it.order !== null)
        if (hasOrder) {
          g.items.sort((a: any, b: any) => {
            const ao = a.order != null ? Number(a.order) : Number.POSITIVE_INFINITY
            const bo = b.order != null ? Number(b.order) : Number.POSITIVE_INFINITY
            return ao - bo
          })
        } else {
          g.items.sort((a: any, b: any) => String(a.text).localeCompare(String(b.text)))
        }
      }
    })

    return groups
  }

  // fallback: use `skills` prop (either grouped or flat)
  const s = props.skills || []
  if (s.length === 0) return []

  if (s[0] && 'category' in s[0] && Array.isArray(s[0].items)) {
    const groups = (s as any[]).map((g: any) => ({
      category: g.category,
      items: (g.items || []).map((skill: any) => ({
        ...skill,
        image: skill.image ? new URL(skill.image, import.meta.url).href : undefined,
      })),
    }))

    // sort each group's items by `order` if present, otherwise alphabetically
    groups.forEach((g: any) => {
      if (Array.isArray(g.items) && g.items.length) {
        const hasOrder = g.items.some((it: any) => it.order !== undefined && it.order !== null)
        if (hasOrder) {
          g.items.sort((a: any, b: any) => {
            const ao = a.order != null ? Number(a.order) : Number.POSITIVE_INFINITY
            const bo = b.order != null ? Number(b.order) : Number.POSITIVE_INFINITY
            return ao - bo
          })
        } else {
          g.items.sort((a: any, b: any) => String(a.text).localeCompare(String(b.text)))
        }
      }
    })

    return groups
  }

  const groups = [
    {
      category: 'Skills',
      items: (props.skills || []).map((skill: any) => ({
        ...skill,
        image: skill.image ? new URL(skill.image, import.meta.url).href : undefined,
      })),
    },
  ]

  // sort the single group's items as well
  groups.forEach((g: any) => {
    if (Array.isArray(g.items) && g.items.length) {
      const hasOrder = g.items.some((it: any) => it.order !== undefined && it.order !== null)
      if (hasOrder) {
        g.items.sort((a: any, b: any) => {
          const ao = a.order != null ? Number(a.order) : Number.POSITIVE_INFINITY
          const bo = b.order != null ? Number(b.order) : Number.POSITIVE_INFINITY
          return ao - bo
        })
      } else {
        g.items.sort((a: any, b: any) => String(a.text).localeCompare(String(b.text)))
      }
    }
  })

  return groups
})

const toggleModal = (skill: Skill | null) => {
  if (skill === null) {
    modal.value = false
    modalContent.value = null
    return
  }

  if (skill.text === modalContent.value?.text) {
    modal.value = false
    modalContent.value = null
  } else {
    modal.value = true
    modalContent.value = skill
  }
}
</script>

<style lang="scss" scoped>
.skills-section {
  padding: 10px 20px;

  .skills-group {
    margin-bottom: 18px;

    .group-title {
      font-size: 1.05rem;
      color: var(--fancy-color);
      margin: 6px 0 8px 0;
    }

    .skills-list {
      list-style: none;
      padding: 0;
      margin: 0;

      .skill-list-item {
        margin-bottom: 8px;

        .skill-row {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          background: transparent;
          border: none;
          color: inherit;
          text-align: left;
          padding: 6px 8px;
          border-radius: 6px;
          cursor: pointer;

          &:hover {
            background: rgba(255, 255, 255, 0.02);
          }

          .skill-mini {
            width: 22px;
            height: 22px;
          }

          .skill-meta {
            flex: 1;

            .skill-title {
              font-weight: 600;
            }

            .skill-desc {
              font-size: 0.85rem;
              color: #bdbdbd;
            }
          }

          .skill-grade-compact {
            display: flex;
            gap: 4px;

            .grade-dot {
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #444;

              &.active {
                background: var(--fancy-color);
              }
            }
          }
        }
      }

    }
  }

  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;

    .skill-item {
      width: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .skill-image {
        width: 48px;
        height: 48px;
        cursor: pointer;
      }

      .skill-grade {
        display: flex;
        gap: 5px;
        margin-top: 6px;
        align-items: center;
        justify-content: center;

        span {
          font-size: 0.85rem;
          color: #bdbdbd;
          line-height: 1;
        }

        .grade-bar {
          width: 20px;
          height: 5px;
          background-color: #a0a0a0;
          border-radius: 3px;
        }

        .grade-bar.active {
          background-color: var(--fancy-color);
        }
      }
    }
  }

  @media (max-width: 480px) {
    .skills-container {
      .skill-grade {
        gap: 3px;

        .grade-bar {
          width: 15px;
          height: 4px;
        }
      }
    }
  }
}

.modal {
  background-color: #121212;
  border-radius: 10px;
  box-shadow: 0 4px 20px rgba(var(--fancy-color-rgb), 0.5);
  color: #fff;
  border: 2px solid var(--fancy-color);
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 20px;

  img {
    width: 30px;
    height: 30px;
  }

  @media (max-width: 768px) {
    display: none;
  }
}
</style>
