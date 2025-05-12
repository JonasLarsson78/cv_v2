<template>
  <section class="skills-section">
    <div class="skills-container">
      <div v-for="skill in resolvedSkills" :key="skill.text" class="skill-item">
        <img
          :src="skill.image"
          :alt="skill.text"
          class="skill-image"
          @click="toggleModal(skill)"
        />
        <p>{{ skill.text }}</p>
        <div class="skill-grade" style="margin: 0 auto">
          <span>1</span>
          <div
            v-for="n in 5"
            :key="n"
            :class="['grade-bar', { active: n <= skill.grade }]"
          ></div>
          <span>5</span>
        </div>
      </div>
    </div>
  </section>
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
  description?: string // Add optional description property
}

const modal = ref(false)
const modalContent = ref<Skill | null>(null) // Properly type modalContent

const props = defineProps({
  skills: {
    type: Array as () => Skill[],
    required: true,
    default: () => [],
  },
})

const resolvedSkills = computed(() => {
  return props.skills?.map((skill) => ({
    ...skill,
    image: new URL(skill.image, import.meta.url).href,
  }))
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
  .skills-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: center;
    padding: 20px;

    .skill-item {
      text-align: center;
      margin-top: 10px;

      .skill-image {
        width: 50px;
        height: 50px;
        cursor: pointer;
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
