<template>
  <div class="contact">
    <p class="contact__headline" v-reveal>{{ t.contactHeadline }}</p>
    <p class="contact__lead" v-reveal="80">{{ t.contactLead }}</p>

    <div v-if="email" class="contact__email no-print" v-reveal="160">
      <a :href="`mailto:${email}`" class="contact__email-link">
        {{ email }}
        <Icon name="arrow" :size="28" />
      </a>
      <button type="button" class="btn" @click="$emit('copy', email)">
        <Icon name="copy" :size="16" /> {{ t.copyEmail }}
      </button>
    </div>

    <ul class="contact__list" v-reveal="220">
      <li v-for="item in items" :key="item.text">
        <component
          :is="item.url ? 'a' : 'span'"
          :href="item.url"
          :target="item.url?.startsWith('http') ? '_blank' : undefined"
          :rel="item.url?.startsWith('http') ? 'noopener' : undefined"
          class="contact__item"
        >
          <span class="contact__icon"><Icon :name="item.icon" :size="16" /></span>
          <span class="contact__text">{{ item.text }}</span>
          <span v-if="item.tag" class="contact__tag mono">{{ item.tag }}</span>
          <Icon v-if="item.url" name="arrow" :size="14" class="contact__arrow" />
        </component>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Icon from '../ui/Icon.vue'
import { vReveal } from '../directives'
import type { ContactItem } from '../composables/useCv'
import type { Messages } from '../i18n'

const props = defineProps<{ items: ContactItem[]; t: Messages }>()
defineEmits<{ copy: [value: string] }>()

const email = computed(() => props.items.find((i) => i.icon === 'mail')?.text)
</script>

<style lang="scss" scoped>
@use '../styles/mixins' as *;

.contact {
  &__headline {
    @include display(144, 50);
    max-width: 16ch;
    margin: 0;
    font-size: clamp(2.2rem, 6vw, 4.4rem);
    line-height: 1.02;
    letter-spacing: -0.035em;
  }

  &__lead {
    max-width: 52ch;
    margin: 24px 0 0;
    color: var(--ink-2);
    font-size: 1.05rem;
  }

  &__email {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 16px 28px;
    margin-top: 40px;
  }

  &__email-link {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-display);
    font-size: clamp(1.4rem, 4vw, 2.4rem);
    letter-spacing: -0.02em;
    text-decoration: none;
    overflow-wrap: anywhere;
    background-image: linear-gradient(var(--accent), var(--accent));
    background-size: 100% 1px;
    background-position: 0 100%;
    background-repeat: no-repeat;
    transition:
      color 0.3s ease,
      background-size 0.6s var(--ease-out);

    svg {
      flex: none;
      color: var(--accent);
      transition: transform 0.5s var(--ease-out);
    }

    &:hover {
      color: var(--accent);
      background-size: 100% 2px;

      svg {
        transform: translate(4px, -4px);
      }
    }
  }

  &__list {
    display: grid;
    margin: 48px 0 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid var(--line);

    @include up(md) {
      grid-template-columns: 1fr 1fr;
      column-gap: 32px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 0;
    border-bottom: 1px solid var(--line);
    color: var(--ink-2);
    text-decoration: none;
    transition: color 0.2s ease;

    &:is(a):hover {
      color: var(--ink);

      .contact__icon {
        background: var(--accent);
        border-color: var(--accent);
        color: var(--accent-ink);
      }

      .contact__arrow {
        opacity: 1;
        transform: none;
      }
    }
  }

  &__icon {
    display: grid;
    flex: none;
    place-items: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    border: 1px solid var(--line-strong);
    transition:
      background-color 0.25s ease,
      border-color 0.25s ease,
      color 0.25s ease;
  }

  &__text {
    min-width: 0;
    overflow-wrap: anywhere;
  }

  &__tag {
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--accent-soft);
    color: var(--accent);
    font-size: 0.68rem;
    text-transform: uppercase;
  }

  &__arrow {
    margin-left: auto;
    opacity: 0;
    transform: translate(-4px, 4px);
    transition:
      opacity 0.3s ease,
      transform 0.4s var(--ease-out);
  }

  @include print {
    &__headline,
    &__lead {
      display: none;
    }

    &__list {
      grid-template-columns: 1fr 1fr;
      margin: 0;
      border: 0;
    }

    &__item {
      padding: 2pt 0;
      border: 0;
    }

    &__icon {
      width: auto;
      height: auto;
      border: 0;
    }
  }
}
</style>
