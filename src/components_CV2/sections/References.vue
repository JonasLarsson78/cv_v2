<template>
  <ul class="refs">
    <li v-for="(person, i) in items" :key="person.mail" class="refs__card" v-spotlight v-reveal="i * 80">
      <span class="refs__avatar" aria-hidden="true">{{ initials(person.name) }}</span>
      <div class="refs__body">
        <h3 class="refs__name">{{ person.name }}</h3>
        <p class="refs__company">{{ person.company }}</p>
        <div class="refs__links">
          <a :href="`mailto:${person.mail}`" class="link-underline">
            <Icon name="mail" :size="15" /> {{ person.mail }}
          </a>
          <a :href="`tel:${person.phone.replace(/\s/g, '')}`" class="link-underline">
            <Icon name="phone" :size="15" /> {{ formatPhone(person.phone) }}
          </a>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup lang="ts">
import Icon from '../ui/Icon.vue'
import { vReveal, vSpotlight } from '../directives'
import type { Reference } from '../composables/useCv'

defineProps<{ items: Reference[] }>()

const initials = (name: string) =>
  name
    .split(/\s+/)
    .map((w) => w[0])
    .join('')

// 0703394666 → 070-339 46 66 (Swedish mobile format)
const formatPhone = (phone: string) =>
  /^07\d{8}$/.test(phone) ? phone.replace(/^(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1-$2 $3 $4') : phone
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.refs {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;

  &__card {
    @include spotlight-card;
    display: flex;
    gap: 18px;
    padding: 24px;
  }

  &__avatar {
    display: grid;
    flex: none;
    place-items: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: var(--bg-sunken);
    border: 1px solid var(--line);
    font-family: var(--font-display);
    font-size: 1.1rem;
    color: var(--ink-2);
  }

  &__body {
    min-width: 0;
  }

  &__name {
    margin: 0;
    font-size: 1.05rem;
    font-weight: 600;
  }

  &__company {
    margin: 2px 0 0;
    color: var(--muted);
    font-size: 0.9rem;
  }

  &__links {
    display: grid;
    gap: 6px;
    margin-top: 14px;
    font-size: 0.88rem;

    a {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      width: fit-content;
      max-width: 100%;
      overflow-wrap: anywhere;
      color: var(--ink-2);

      &:hover {
        color: var(--ink);
      }
    }
  }

  @include print {
    &__card {
      padding: 0;
      border: 0;
    }

    &__avatar {
      display: none;
    }
  }
}
</style>
