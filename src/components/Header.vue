<template>
  <header class="cv-header">
    <div class="profile-picture">
      <img src="/src/assets/jpg/jonas_2025_05.jpg" alt="Profile Picture" />
    </div>
    <div class="header-info">
      <h1 class="name">
        {{ content.header.name.split(' ')[0] }}
        <span class="highlight">{{ content.header.name.split(' ')[1] }}</span>
      </h1>
      <p class="role">{{ content.header.role }}</p>
      <p class="summary" v-html="content.header.summary"></p>
      <div class="social-icons">
        <a
          v-for="link in content.header.socialLinks"
          :key="link.icon"
          :href="link.url"
          target="_blank"
        >
          <i :class="link.icon"></i>
        </a>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps({
  content: Object,
})
</script>

<style lang="scss" scoped>
@use '../style.scss';

.cv-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;

  .profile-picture {
    img {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 3px solid var(--fancy-color);
      margin-right: 20px;
      transition: transform 0.3s ease-in-out;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .header-info {
    flex: 1;

    .name {
      font-size: 2.5rem;
      color: #ffffff;
      text-shadow: 0 0 10px var(--fancy-color);

      .highlight {
        color: var(--fancy-color);
      }
    }

    .role {
      font-size: 1.2rem;
      color: #a0a0a0;
    }

    .summary {
      font-size: 1rem;
      color: #a0a0a0;
    }

    .social-icons {
      a {
        color: var(--fancy-color);
        margin-right: 10px;
        font-size: 1.5rem;
        transition: color 0.3s ease-in-out;

        &:hover {
          color: var(--fancy-color-lightened);
        }
      }
    }
  }
}
</style>
