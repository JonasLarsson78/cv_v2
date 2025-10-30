<template>
  <div class="projects-container">
    <h2 class="section-title">Projects</h2>
    
    <!-- Password form - shown when not authenticated -->
    <div v-if="!isAuthenticated" class="password-form">
      <div class="password-card">
        <i class="fas fa-lock password-icon"></i>
        <h3 class="password-title">Protected Content</h3>
        <p class="password-description">This section contains confidential project information. Please enter the password to continue.</p>
        
        <div class="password-input-group">
          <input 
            type="password" 
            v-model="passwordInput"
            @keypress="handleKeyPress"
            placeholder="Enter password"
            class="password-input"
            :class="{ 'error': showPasswordError }"
          />
          <button @click="checkPassword" class="password-button">
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        
        <div v-if="showPasswordError" class="password-error">
          <i class="fas fa-exclamation-triangle"></i>
          Incorrect password. Please try again.
        </div>
      </div>
    </div>

    <!-- Projects grid - shown when authenticated -->
    <div v-else class="projects-grid">
      <div 
        v-for="project in projects" 
        :key="project.name"
        class="project-item"
      >
        <div class="project-image-container" @click="openModal(project)">
          <img 
            :src="project.image" 
            :alt="project.displayName"
            class="project-image"
            @error="onImageError"
          />
          <div class="zoom-overlay">
            <i class="fas fa-search-plus"></i>
          </div>
        </div>
        <h3 class="project-title">{{ project.displayName }}</h3>
      </div>
    </div>

    <!-- Modal for enlarged image -->
    <div v-if="selectedProject" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        <img 
          :src="selectedProject.image" 
          :alt="selectedProject.displayName"
          class="modal-image"
        />
        <h3 class="modal-title">{{ selectedProject.displayName }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Project {
  name: string
  displayName: string
  image: string
}

const projects = ref<Project[]>([])
const selectedProject = ref<Project | null>(null)

// Password protection state
const isAuthenticated = ref(false)
const passwordInput = ref('')
const showPasswordError = ref(false)
const correctPasswords = ref<string[]>([]) // Array of valid passwords

// Modal functions
const openModal = (project: Project) => {
  selectedProject.value = project
  // Prevent body scroll when modal is open
  document.body.style.overflow = 'hidden'
}

const closeModal = () => {
  selectedProject.value = null
  // Restore body scroll
  document.body.style.overflow = 'auto'
}

// Password authentication functions
const checkPassword = () => {
  if (correctPasswords.value.includes(passwordInput.value)) {
    isAuthenticated.value = true
    showPasswordError.value = false
    passwordInput.value = '' // Clear password input
  } else {
    showPasswordError.value = true
    // Clear error after 3 seconds
    setTimeout(() => {
      showPasswordError.value = false
    }, 3000)
  }
}

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    checkPassword()
  }
}

// Function to convert filename to display name
const formatDisplayName = (filename: string): string => {
  return filename
    .replace('.png', '')
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

// Handle image loading errors
const onImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  console.error('Failed to load image:', target.src)
  target.style.display = 'none'
}

onMounted(async () => {
  document.title = 'Projects'
  // Load passwords from JSON file
  try {
    const passwordModule = await import('../data/project-whitelist.json')
    correctPasswords.value = passwordModule.default
  } catch (error) {
    console.error('Failed to load passwords:', error)
    // Fallback passwords if file loading fails
    correctPasswords.value = ['jonas2025', 'admin123', 'projects2025']
  }

  // Define all project images
  const projectImages = [
    'info_bank.png',
    'kreditupplysning.png',
    'kundkort.png',
    'langivarvy.png',
    'produktinformation.png',
    'produktregler.png',
    'utdelningsvektyg.png'
  ]

  projects.value = projectImages.map(image => ({
    name: image.replace('.png', ''),
    displayName: formatDisplayName(image),
    image: `/png/projects/${image}`
  }))
})
</script>

<style scoped lang="scss">
.projects-container {
  padding: 2rem 0;
}

.section-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: var(--fancy-color);
  border-bottom: 2px solid var(--fancy-color);
  padding-bottom: 0.5rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.project-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 111, 97, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);

  &:hover {
    transform: translateY(-5px);
    border-color: var(--fancy-color);
    box-shadow: 0 8px 25px rgba(255, 111, 97, 0.2);
    background: rgba(255, 255, 255, 0.08);
  }
}

.project-image-container {
  margin-bottom: 1rem;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  position: relative;
  cursor: pointer;

  &:hover .zoom-overlay {
    opacity: 1;
  }
}

.project-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  border-radius: 6px;
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.zoom-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;

  i {
    color: white;
    font-size: 2rem;
  }
}

.project-title {
  font-size: 1.1rem;
  color: #ffffffde;
  margin: 0;
  font-weight: 500;
  letter-spacing: 0.5px;
}

// Responsive design
@media (max-width: 768px) {
  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .project-item {
    padding: 1rem;
  }
  
  .project-image-container {
    height: 150px;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .projects-container {
    padding: 1rem 0;
  }
  
  .projects-grid {
    gap: 1rem;
  }
  
  .project-image-container {
    height: 120px;
  }
}

// Modal styles
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  backdrop-filter: blur(5px);
}

.modal-content {
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(18, 18, 18, 0.95);
  border: 2px solid var(--fancy-color);
  border-radius: 12px;
  padding: 2rem;
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: var(--fancy-color);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  z-index: 1001;

  &:hover {
    background: rgba(255, 111, 97, 0.2);
    transform: scale(1.1);
  }
}

.modal-image {
  max-width: 100%;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.modal-title {
  color: var(--fancy-color);
  font-size: 1.5rem;
  margin: 0;
  text-align: center;
  font-weight: 500;
}

// Modal responsive design
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1.5rem;
  }
  
  .modal-image {
    max-height: 60vh;
  }
  
  .modal-title {
    font-size: 1.2rem;
  }
}

// Password form styles
.password-form {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  padding: 2rem 0;
}

.password-card {
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 111, 97, 0.3);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  max-width: 400px;
  width: 100%;
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--fancy-color);
    box-shadow: 0 8px 25px rgba(255, 111, 97, 0.2);
  }
}

.password-icon {
  font-size: 3rem;
  color: var(--fancy-color);
  margin-bottom: 1.5rem;
}

.password-title {
  color: var(--fancy-color);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.password-description {
  color: #ffffffde;
  margin-bottom: 2rem;
  line-height: 1.6;
  opacity: 0.8;
}

.password-input-group {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.password-input {
  flex: 1;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: #ffffffde;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: var(--fancy-color);
    box-shadow: 0 0 0 2px rgba(255, 111, 97, 0.2);
  }

  &.error {
    border-color: #ff4444;
    box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.password-button {
  padding: 0.75rem 1rem;
  background: var(--fancy-color);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50px;

  &:hover {
    background: var(--fancy-color-lightened);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
}

.password-error {
  color: #ff4444;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(255, 68, 68, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(255, 68, 68, 0.2);
}

// Password form responsive design
@media (max-width: 768px) {
  .password-form {
    padding: 1rem;
    min-height: 300px;
  }
  
  .password-card {
    padding: 2rem 1.5rem;
  }
  
  .password-icon {
    font-size: 2.5rem;
  }
  
  .password-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .password-card {
    padding: 1.5rem 1rem;
  }
  
  .password-input-group {
    flex-direction: column;
  }
  
  .password-button {
    width: 100%;
  }
}
</style>