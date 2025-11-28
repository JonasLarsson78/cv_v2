<template>
  <section v-if="section.title" class="cv-section">
    <h2 class="section-title">{{ section.title }}</h2>
    <div v-if="section.title === education">
      <p>
        <strong>{{ section.content[0].heading }}</strong>
      </p>
      <p>{{ section.content[0].subheading }}</p>
      <p>{{ section.content[0].description }}</p>
      <p><a :href="section.content[0].examensbevis" target="
        _blank">{{ degree }}</a></p>
    </div>
    <ul v-else-if="section.title === recommendations">
      <li v-for="rec in section.content" :key="rec.name">
        <p><strong>Name:</strong> {{ rec.name }}</p>
        <p><strong>Company:</strong> {{ rec.company }}</p>
        <p>
          <strong>Email:</strong>
          <a class="mobile-text" :href="'mailto:' + rec.mail">{{ rec.mail }}</a>
        </p>
        <p>
          <strong>Phone:</strong>
          <a :href="'tel:' + rec.phone">{{ rec.phone }}</a>
        </p>
        <br />
      </li>
    </ul>
    <div v-else-if="section.title === contact">
      <p v-for="contact in section.content" :key="contact.text">
        <i :class="contact.icon"></i>
        <a :href="contact.url">{{ contact.text }}</a>
      </p>
    </div>
    <div v-else-if="section.title === experience">
      <div v-for="experience in section.content" :key="experience.heading" class="experience-item">
        <h3>{{ experience.heading }}</h3>
        <p>
          <strong>{{ experience.date }}</strong>
        </p>
        <ul>
          <li v-for="detail in experience.details" :key="detail">
            {{ detail }}
          </li>
        </ul>
        <ul v-if="experience.duties.length" v-for="(duties, index) in experience.duties" :key="index" style="margin-left: 40px;list-style: disc;">
          <h4>{{ duties.header }}</h4>
          <li v-for="d in duties.items" :key="d" style="text-align: left;">
            {{ d }}
          </li>
        </ul>
      </div>
    </div>
    <slot v-else></slot>
  </section>
</template>

<script setup lang="ts">
defineProps({
  section: {
    type: Object,
    required: true,
    default: () => ({ title: '', content: [] }),
  },
})
const local = localStorage.getItem('local')

const education = local !== 'se' ? 'Education' : 'Utbildning'
const recommendations = local !== 'se' ? 'Recommendations' : 'Rekommendationer'
const contact = local !== 'se' ? 'Contact' : 'Kontakta'
const experience = local !== 'se' ? 'Experience' : 'Erfarenhet'
const degree = local !== 'se' ? 'Degree Certificate' : 'Examensbevis'

</script>

<style lang="scss" scoped>
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

  @media (max-width: 480px) {
    .mobile-text {
      overflow-wrap: break-word;
    }
  }

  a {
    color: var(--fancy-color);
    text-decoration: none;
    margin-left: 5px;

    &:hover {
      color: #ffffffde;
    }
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

    h4 {
      color: var(--fancy-color);
    }

    p {
      margin: 5px 0;
    }
  }
}
</style>
