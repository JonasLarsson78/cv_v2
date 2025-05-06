<template>
  <Error v-if="error" :error="error" />
  <div v-else-if="content.header" class="cv-container">
    <Header :content="content" />

    <main class="cv-main">
      <Section
        v-for="section in content.sections"
        :key="section.title"
        :section="section"
      >
        <Skills
          v-if="section.title === 'Skills' && section.content"
          :skills="
            section.content.filter(
              (item) => 'text' in item && 'image' in item && 'grade' in item
            )
          "
        />
      </Section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import Section from './components/Section.vue'
import Skills from './components/Skills.vue'
import Error from './components/Error.vue'
import contentData from './assets/data/cv-content.json'

const content = ref(contentData)
const error = ref<string | null>(null)

onMounted(() => {
  document.title = 'Jonas CV'
  content.value = contentData
})
</script>

<style lang="scss" scoped>
@use 'sass:color';
@use './style.scss';

.cv-container {
  font-family: 'Fira Code', monospace;
  color: #e0e0e0;
  background: linear-gradient(180deg, #111111ff 0%, #424242 50%, #111111ff 99%);
  padding: 20px;
  border-radius: 15px;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 20px rgba(var(--fancy-color-rgb), 0.5);
  background-size: cover;
  background-blend-mode: overlay;
  animation: glow 5s infinite alternate;

  @keyframes glow {
    0% {
      box-shadow: 0 4px 20px rgba(var(--fancy-color-rgb), 0.5);
    }
    100% {
      box-shadow: 0 4px 30px rgba(var(--fancy-color-rgb), 0.8);
    }
  }

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

  .cv-main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 20px;

    .cv-section {
      background: rgba(0, 0, 0, 0.8);
      padding: 15px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(var(--fancy-color-rgb), 0.3);
      transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 20px rgba(var(--fancy-color-rgb), 0.5);
      }

      .section-title {
        font-size: 1.5rem;
        color: var(--fancy-color);
        border-bottom: 2px solid var(--fancy-color);
        padding-bottom: 5px;
        margin-bottom: 10px;
      }

      ul {
        list-style: none;
        padding: 0;

        li {
          margin-bottom: 10px;
        }
      }

      .experience-item {
        margin-bottom: 15px;

        h3 {
          font-size: 1.2rem;
          color: var(--fancy-color);
        }

        p {
          margin: 5px 0;
        }
      }
    }
  }

  .error-message {
    color: red;
    font-size: 1.2rem;
    text-align: center;
    margin: 20px 0;
  }

  .skill-grade {
    display: flex;
    gap: 5px;
    margin-top: 5px;
    align-items: center;
    justify-content: center;

    .grade-bar {
      width: 20px;
      height: 5px;
      background-color: #a0a0a0;
      border-radius: 3px;

      &.active {
        background-color: var(--fancy-color);
      }
    }
  }

  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
    margin: 0 10px;

    .cv-header {
      flex-direction: column;
      align-items: center;

      .profile-picture {
        img {
          width: 120px;
          height: 120px;
          margin-bottom: 15px;
        }
      }

      .header-info {
        text-align: center;

        .name {
          font-size: 2rem;
        }

        .role {
          font-size: 1rem;
        }

        .summary {
          font-size: 0.9rem;
        }

        .social-icons {
          a {
            font-size: 1.2rem;
          }
        }
      }
    }
  }

  @media (max-width: 480px) {
    .cv-main {
      grid-template-columns: 1fr;
    }

    .cv-section {
      padding: 10px;

      .section-title {
        font-size: 1.2rem;
      }

      .experience-item {
        h3 {
          font-size: 1rem;
        }

        p {
          font-size: 0.9rem;
        }
      }

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
</style>
