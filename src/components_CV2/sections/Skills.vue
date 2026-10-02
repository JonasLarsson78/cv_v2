<template>
  <div class="skills">
    <div class="skills__filters no-print" role="tablist" :aria-label="title" v-reveal>
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="skills__filter"
        :class="{ 'is-active': active === tab.key }"
        :aria-selected="active === tab.key"
        @click="active = tab.key"
      >
        {{ tab.label }}
        <span class="skills__count">{{ tab.count }}</span>
      </button>
    </div>

    <TransitionGroup tag="ul" name="flip" class="skills__grid" v-reveal="80">
      <li
        v-for="skill in visible"
        :key="skill.name"
        class="skill"
        v-spotlight
        :style="{ '--level': skill.grade / 5 }"
      >
        <div class="skill__top">
          <span class="skill__logo">
            <img :src="skill.image" alt="" :class="{ 'is-mono': isMono(skill.image) }" loading="lazy" />
          </span>
          <span class="skill__level mono">{{ t.levels[skill.grade - 1] }}</span>
        </div>
        <h3 class="skill__name">{{ skill.name }}</h3>
        <p class="skill__desc">{{ skill.description }}</p>
        <div
          class="skill__meter"
          role="meter"
          :aria-valuenow="skill.grade"
          aria-valuemin="0"
          aria-valuemax="5"
          :aria-label="`${skill.name}: ${t.levels[skill.grade - 1]}`"
        >
          <span v-for="n in 5" :key="n" :class="{ 'is-on': n <= skill.grade }" />
        </div>
      </li>
    </TransitionGroup>

    <!-- Print: compact list grouped by category -->
    <dl class="skills__print">
      <template v-for="group in groups" :key="group.category">
        <dt>{{ group.category }}</dt>
        <dd>{{ group.items.map((s) => s.name).join(' · ') }}</dd>
      </template>
    </dl>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { vReveal, vSpotlight } from '../directives'
import { isMono } from '../logos'
import type { SkillGroup } from '../composables/useCv'
import type { Messages } from '../i18n'

const props = defineProps<{ groups: SkillGroup[]; title: string; t: Messages }>()

const ALL = '__all'
const active = ref(ALL)

const all = computed(() => {
  const seen = new Set<string>()
  return props.groups
    .flatMap((g) => g.items)
    .filter((s) => !seen.has(s.name) && seen.add(s.name))
    .sort((a, b) => b.grade - a.grade)
})

const tabs = computed(() => [
  { key: ALL, label: props.t.all, count: all.value.length },
  ...props.groups.map((g) => ({ key: g.category, label: g.category, count: g.items.length })),
])

const visible = computed(() =>
  active.value === ALL
    ? all.value
    : (props.groups.find((g) => g.category === active.value)?.items ?? all.value),
)
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.skills {
  &__filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 28px;
  }

  &__filter {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 36px;
    padding: 0 6px 0 14px;
    border-radius: 999px;
    border: 1px solid var(--line-strong);
    background: transparent;
    color: var(--ink-2);
    font-size: 0.86rem;
    cursor: pointer;
    transition:
      background-color 0.25s ease,
      color 0.25s ease,
      border-color 0.25s ease;

    &:hover {
      border-color: var(--ink);
      color: var(--ink);
    }

    &.is-active {
      background: var(--ink);
      border-color: var(--ink);
      color: var(--bg);

      .skills__count {
        background: rgb(255 255 255 / 0.16);
        color: inherit;
      }
    }
  }

  &__count {
    display: inline-grid;
    place-items: center;
    min-width: 24px;
    height: 24px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--bg-sunken);
    color: var(--muted);
    font-family: var(--font-mono);
    font-size: 0.7rem;
  }

  &__grid {
    position: relative;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 210px), 1fr));
    gap: 12px;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  &__print {
    display: none;
  }
}

.skill {
  @include spotlight-card;
  display: flex;
  flex-direction: column;
  padding: 18px;

  &:hover {
    transform: translateY(-3px);

    .skill__logo img {
      transform: scale(1.12) rotate(-6deg);
    }
  }

  &__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__logo {
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background: var(--bg-sunken);
    border: 1px solid var(--line);

    html[data-theme='dark'] & {
      background: #ece7dc;
      border-color: transparent;
    }

    img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      transition: transform 0.6s var(--ease-out);
    }
  }

  &__level {
    color: var(--muted);
    font-size: 0.7rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__name {
    margin: 16px 0 4px;
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  &__desc {
    flex: 1;
    margin: 0;
    color: var(--muted);
    font-size: 0.86rem;
    line-height: 1.5;
  }

  &__meter {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 4px;
    margin-top: 16px;

    span {
      height: 3px;
      border-radius: 2px;
      background: var(--line);
      transition: background-color 0.4s ease;

      &.is-on {
        background: var(--ink);
      }
    }
  }

  &:hover &__meter span.is-on {
    background: var(--accent);
  }
}

// FLIP animation when filtering (Vue TransitionGroup).
.flip-move,
.flip-enter-active,
.flip-leave-active {
  transition:
    transform 0.6s var(--ease-out),
    opacity 0.4s ease;
}

.flip-enter-from,
.flip-leave-to {
  opacity: 0;
  transform: scale(0.92);
}

.flip-leave-active {
  position: absolute;
  visibility: hidden;
}

@include print {
  .skills {
    &__grid {
      display: none;
    }

    &__print {
      display: grid;
      grid-template-columns: 110pt 1fr;
      gap: 3pt 12pt;
      margin: 0;

      dt {
        font-weight: 600;
      }

      dd {
        margin: 0;
        color: var(--ink-2);
      }
    }
  }
}
</style>
