<template>
  <section class="skills-section">
    <div class="skills-container">
      <div v-for="skill in resolvedSkills" :key="skill.text" class="skill-item">
        <img :src="skill.image" :alt="skill.text" class="skill-image" />
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
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Skill {
  text: string
  image: string
  grade: number
}

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
    image: new URL(skill.image.replace('/src/compnents/', ''), import.meta.url)
      .href,
  }))
})
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
</style>
