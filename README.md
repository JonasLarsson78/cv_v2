# Jonas Larsson - Personal CV Website

A modern, responsive CV/portfolio website built with Vue 3, TypeScript, and Vite. This application showcases professional experience, skills, and projects with a clean, user-friendly interface.

## 🌟 Features

- **Modern Tech Stack**: Vue 3 with Composition API, TypeScript, and Vite
- **Responsive Design**: Mobile-first approach with SCSS styling
- **Multi-language Support**: English and Swedish content
- **Single Page Application**: Vue Router for seamless navigation
- **Interactive Components**: Skills showcase, project portfolio, and contact information
- **Font Awesome Icons**: Professional iconography throughout the application
- **Production Ready**: Optimized build process and deployment configuration

## 🚀 Live Demo

Visit the live website: [Jonas Larsson CV](https://cv-v2-jonaslarsson78.vercel.app)

## 📁 Project Structure

```
├── public/                 # Static assets
│   ├── db/                # SQLite database (cv.sqlite) and schema (db.sql)
│   ├── jpg/               # JPEG images
│   ├── png/               # PNG images (including project screenshots)
│   └── svg/               # SVG icons and graphics
├── src/
│   ├── components/        # Vue components
│   │   ├── CV.vue         # Main CV page component
│   │   ├── Projects.vue   # Projects portfolio page
│   │   ├── Header.vue     # Site header with navigation
│   │   ├── Footer.vue     # Site footer
│   │   ├── Menu.vue       # Navigation menu
│   │   ├── Section.vue    # Reusable section component
│   │   ├── Skills.vue     # Skills showcase
│   │   └── LangSelector.vue # Language switcher
│   ├── data/              # Application data (legacy JSON + config)
│   │   ├── cv-content.json    # Legacy English content (now migrated to SQLite)
│   │   ├── cv-content-se.json # Legacy Swedish content (now migrated to SQLite)
│   │   └── project-whitelist.json # Project filtering
│   ├── router/            # Vue Router configuration
│   ├── App.vue            # Root component
│   ├── main.ts            # Application entry point
│   └── style.scss         # Global styles
└── vercel.json            # Deployment configuration
```

## 🛠️ Technologies Used

- **Frontend Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: SCSS/Sass
- **Routing**: Vue Router 4
- **Icons**: Font Awesome
- **Deployment**: Vercel

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/JonasLarsson78/cv_v2.git
   cd cv_v2
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## 📝 Content Customization

### Updating CV Content

The CV content is now stored in a SQLite database located in `public/db/cv.sqlite`.

- `public/db/cv.sqlite` – runtime database used by the app
- `public/db/db.sql` – schema + seed data (generated from the original JSON)

The original JSON files in `src/data/` are kept only as reference:

- `cv-content.json` – legacy English content
- `cv-content-se.json` – legacy Swedish content

The database contains structured data for:

- Personal information and summary
- Work experience
- Education
- Skills and technologies
- Contact information
- Social media links

### Adding Projects

Projects are managed through:

- `project-whitelist.json` - Controls which projects are displayed
- Project images stored in `public/png/projects/`

### Styling

Global styles are defined in `src/style.scss`. Component-specific styles use scoped CSS within each Vue component.

## 🌍 Multi-language Support

The application supports both English and Swedish languages. Language switching is handled by the `LangSelector` component, which loads the appropriate content file based on user selection.

## 🚀 Deployment

This project is configured for deployment on Vercel with the included `vercel.json` configuration file. The setup includes:

- Automatic deployments from the main branch
- SPA routing support with rewrites
- Optimized build process

### Deploy to Vercel

1. **Fork or clone this repository**
2. **Connect to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Import your repository
   - Deploy with default settings

### Other Deployment Options

The built application can be deployed to any static hosting service:

- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 About

Created by [Jonas Larsson](https://www.linkedin.com/in/jonlarsson/) - a front-end-focused systems developer with 5+ years of professional experience in modern web development.

## 🤝 Contributing

While this is a personal CV website, suggestions and improvements are welcome! Feel free to:

- Report bugs
- Suggest new features
- Submit pull requests

---

Made with ❤️ using Vue 3 + TypeScript + Vite
