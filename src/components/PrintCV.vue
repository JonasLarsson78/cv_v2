<template>
  <div class="print-cv">
    <div class="print-header">
      <h1>{{ content.header.name }}</h1>
      <h2>{{ content.header.role }}</h2>
      <div class="contact-info">
        <div v-for="item in contactContent" :key="item.text" class="contact-item">
          <i :class="item.icon"></i>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>

    <div class="print-section">
      <h3>Summary</h3>
      <p>{{ content.header.summary }}</p>
    </div>

    <div v-for="section in content.sections" :key="section.title" class="print-section">
      <h3 v-if="section.title !== 'Contact' && section.title !== 'Kontakta'">{{ section.title }}</h3>

      <!-- Experience Section -->
      <div v-if="section.title === 'Experience' || section.title === 'Erfarenhet'" class="experience-list">
        <div v-for="exp in section.content" :key="exp.heading" class="experience-item">
          <div class="exp-header">
            <strong>{{ exp.heading }}</strong>
            <span class="date">{{ exp.date }}</span>
          </div>
          <div v-if="exp.details" class="exp-details">
            <p v-for="detail in exp.details" :key="detail">{{ detail }}</p>
          </div>
          <div v-if="exp.duties && exp.duties.length > 0" class="exp-duties">
            <div v-for="duty in exp.duties" :key="duty.header">
              <strong>{{ duty.header }}</strong>
              <ul>
                <li v-for="item in duty.items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div v-else-if="section.title === 'Skills' || section.title === 'Färdigheter'" class="skills-list">
        <span v-for="(skill, index) in section.content" :key="skill.text">
          <template v-if="index > 0">, </template>{{ skill.text }}
        </span>
      </div>

      <!-- Education Section -->
      <div v-else-if="section.title === 'Education' || section.title === 'Utbildning'" class="education-list">
        <div v-for="edu in section.content" :key="edu.heading" class="education-item">
          <strong>{{ edu.heading }}</strong>
          <p>{{ edu.subheading }}</p>
          <p v-if="edu.description">{{ edu.description }}</p>
        </div>
      </div>

      <!-- Contact Section (skip - shown in header) -->
      <template v-else-if="section.title === 'Contact' || section.title === 'Kontakta'"></template>

      <!-- Recommendations Section -->
      <div v-else-if="section.title === 'Recommendations' || section.title === 'Rekommendationer'" class="recommendations-list">
        <div v-for="rec in section.content" :key="rec.name" class="recommendation-item">
          <strong>{{ rec.name }}</strong>
          <p>{{ rec.company }}</p>
          <p>{{ rec.mail }} | {{ rec.phone }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import contentDataEn from '../data/cv-content.json'
import contentDataSe from '../data/cv-content-se.json'

const content = ref<any>(contentDataEn)
const local = localStorage.getItem('local')

onMounted(() => {
  if (local === 'se') {
    content.value = contentDataSe
  } else {
    content.value = contentDataEn
  }

  // Auto-trigger print dialog
  setTimeout(() => {
    window.print()
  }, 500)
})

const contactContent = computed(() => {
  const contactSection = content.value.sections.find((s: any) => s.title === 'Contact')
  return contactSection ? contactSection.content : []
})
</script>

<style lang="scss" scoped>
.print-cv {
  max-width: 210mm;
  margin: 0 auto;
  padding: 12mm 15mm;
  background: white;
  color: #000;
  font-family: 'Arial', sans-serif;
  font-size: 9pt;
  line-height: 1.3;

  .print-header {
    border-bottom: 2px solid #333;
    padding-bottom: 8px;
    margin-bottom: 12px;

    h1 {
      font-size: 20pt;
      margin: 0 0 3px 0;
      color: #1a1a1a;
    }

    h2 {
      font-size: 12pt;
      margin: 0 0 8px 0;
      color: #555;
      font-weight: normal;
    }

    .contact-info {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 6px;

      .contact-item {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 8pt;

        i {
          color: #555;
        }
      }
    }
  }

  .print-section {
    margin-bottom: 12px;
    page-break-inside: avoid;

    h3 {
      font-size: 11pt;
      margin: 0 0 6px 0;
      color: #1a1a1a;
      border-bottom: 1px solid #ddd;
      padding-bottom: 3px;
    }

    p {
      margin: 3px 0;
      text-align: justify;
    }
  }

  .experience-list {
    .experience-item {
      margin-bottom: 10px;
      page-break-inside: avoid;

      .exp-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        margin-bottom: 3px;

        strong {
          font-size: 10pt;
          color: #1a1a1a;
        }

        .date {
          font-size: 8pt;
          color: #666;
          font-style: italic;
        }
      }

      .exp-details {
        p {
          margin: 2px 0;
          color: #555;
        }
      }

      .exp-duties {
        margin-top: 4px;

        strong {
          display: block;
          margin-top: 3px;
          color: #333;
          font-size: 9pt;
        }

        ul {
          margin: 3px 0 0 15px;
          padding: 0;

          li {
            margin-bottom: 2px;
            font-size: 8pt;
          }
        }
      }
    }
  }

  .skills-list {
    font-size: 9pt;
    line-height: 1.4;
    text-align: justify;
  }

  .education-list {
    .education-item {
      margin-bottom: 8px;

      strong {
        display: block;
        margin-bottom: 2px;
        color: #1a1a1a;
        font-size: 9pt;
      }

      p {
        margin: 1px 0;
        color: #555;
        font-size: 8pt;
      }
    }
  }

  .recommendations-list {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;

    .recommendation-item {
      padding: 6px;
      background: #f9f9f9;
      border-left: 2px solid #333;

      strong {
        display: block;
        margin-bottom: 3px;
        color: #1a1a1a;
        font-size: 9pt;
      }

      p {
        margin: 1px 0;
        font-size: 8pt;
        color: #555;
      }
    }
  }

  .print-footer {
    margin-top: 15px;
    padding-top: 8px;
    border-top: 1px solid #ddd;
    text-align: center;
    font-size: 7pt;
    color: #888;
  }
}

@media print {
  .print-cv {
    padding: 0;
    margin: 0;
    max-width: 100%;
  }

  .print-section {
    page-break-inside: avoid;
  }
}

@media screen {
  body {
    background: #f5f5f5;
    padding: 20px;
  }
}
</style>