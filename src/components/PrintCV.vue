<template>
  <div v-if="error" class="print-error">
    {{ error }}
  </div>
  <div v-else-if="content" class="print-cv">
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

    <div class="print-section summary">
      <h3>Summary</h3>
      <p>{{ content.header.summary }}</p>
    </div>

    <div v-for="section in (content.sections as any[])" :key="section.title" class="print-section">
      <h3 v-if="section.title !== 'Contact' && section.title !== 'Kontakta'">{{ section.title }}</h3>

      <!-- Experience Section -->
      <div v-if="section.title === 'Experience' || section.title === 'Erfarenhet'" class="experience-list">
        <div v-for="exp in (section.content as any[])" :key="(exp as any).heading" class="experience-item">
          <div class="exp-header">
            <strong>{{ (exp as any).heading }}</strong>
            <span class="date">{{ (exp as any).date }}</span>
          </div>
          <div v-if="(exp as any).details" class="exp-details">
            <p v-for="detail in (exp as any).details" :key="detail">{{ detail }}</p>
          </div>
          <div v-if="(exp as any).duties && (exp as any).duties.length > 0" class="exp-duties">
            <div v-for="duty in (exp as any).duties" :key="(duty as any).header">
              <strong>{{ (duty as any).header }}</strong>
              <ul>
                <li v-for="item in (duty as any).items" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- Skills Section -->
      <div v-else-if="section.title === 'Skills' || section.title === 'Färdigheter'" class="skills-list">
        <!-- New contentV2 format: categories with items -->
        <div v-if="(section as any).contentV2 && Array.isArray((section as any).contentV2)">
          <div v-for="cat in (section as any).contentV2" :key="(cat as any).category" class="skills-category">
            <strong>{{ (cat as any).category }}</strong>
            <div class="skills-items">
              <span v-for="(item, idx) in (cat as any).items" :key="(item as any).text">
                <template v-if="(idx as number) > 0">, </template>{{ (item as any).text }}
              </span>
            </div>
          </div>
        </div>

        <!-- Fallback: older flat content array -->
        <div v-else>
          <span v-for="(skill, index) in (section.content as any[])" :key="(skill as any).text">
            <template v-if="(index as number) > 0">, </template>{{ (skill as any).text }}
          </span>
        </div>
      </div>

      <!-- Education Section -->
      <div v-else-if="section.title === 'Education' || section.title === 'Utbildning'" class="education-list">
        <div v-for="edu in (section.content as any[])" :key="(edu as any).heading" class="education-item">
          <strong>{{ (edu as any).heading }}</strong>
          <p>{{ (edu as any).subheading }}</p>
          <p v-if="(edu as any).description">{{ (edu as any).description }}</p>
        </div>
      </div>

      <!-- Contact Section (skip - shown in header) -->
      <template v-else-if="section.title === 'Contact' || section.title === 'Kontakta'"></template>

      <!-- Recommendations Section -->
      <div v-else-if="section.title === 'Recommendations' || section.title === 'Rekommendationer'"
        class="recommendations-list">
        <div v-for="rec in (section.content as any[])" :key="(rec as any).name" class="recommendation-item">
          <strong>{{ (rec as any).name }}</strong>
          <p>{{ (rec as any).company }}</p>
          <p>{{ (rec as any).mail }} | {{ (rec as any).phone }}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { loadCvContentFromDb } from '../db/cvRepository'

const content = ref<ContentType | null>(null)
const error = ref<string | null>(null)
const local = localStorage.getItem('local')

onMounted(async () => {
  const lang = local === 'se' ? 'sv' : 'en'

  try {
    content.value = await loadCvContentFromDb(lang)
  } catch (e: any) {
    console.error(e)
    error.value = 'Kunde inte ladda CV från databasen'
    return
  }

  // Auto-trigger print dialog
  setTimeout(() => {
    window.print()
  }, 500)
})

const contactContent = computed(() => {
  if (!content.value) return []
  const contactSection = (content.value.sections as any[]).find(
    (s: any) => s.title === 'Contact' || s.title === 'Kontakta'
  )
  return contactSection ? contactSection.content : []
})
</script>

<style lang="scss" scoped>
.print-error {
  max-width: 210mm;
  margin: 20px auto;
  padding: 16px;
  background: #fee;
  color: #900;
  font-family: 'Arial', sans-serif;
  border: 1px solid #f99;
}

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

@page {
  size: A4;
  margin: 4mm;
}

@media print {

  html,
  body {
    margin: 0;
    padding: 0;
    height: 297mm;
  }

  .print-cv {
    padding: 4mm 6mm;
    margin: 0;
    max-width: 210mm;
    font-size: 7.5pt;
    line-height: 1.08;
    color: #000;
  }

  .print-header h1 {
    font-size: 16pt;
    margin-bottom: 2px;
  }

  .print-header h2 {
    font-size: 9pt;
    margin-bottom: 6px;
  }

  .contact-info {
    gap: 6px;
  }

  .print-section h3 {
    font-size: 9pt;
    margin-bottom: 3px;
    padding-bottom: 1px;
  }

  .experience-item {
    margin-bottom: 6px;
  }

  .exp-details p,
  .education-item p,
  .recommendation-item p {
    font-size: 7.5pt;
    margin: 1px 0;
  }

  .exp-duties ul li {
    font-size: 7pt;
    margin-bottom: 1px;
  }

  .skills-list {
    font-size: 7.5pt;
    line-height: 1.05;
  }

  .recommendations-list {
    grid-template-columns: 1fr;
    gap: 6px;
    display: none;
  }

  .education-list {
    display: none;
  }

  /* Clamp summary to a few lines to save space */
  .print-section.summary p {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0 0 4px 0;
    font-size: 7.5pt;
  }

  .print-footer {
    display: none;
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