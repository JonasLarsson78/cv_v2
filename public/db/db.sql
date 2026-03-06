PRAGMA foreign_keys = ON;

-- =========================
-- 1. SPRÅK
-- =========================
DROP TABLE IF EXISTS languages;
CREATE TABLE languages (
  code TEXT PRIMARY KEY, -- 'sv', 'en'
  name TEXT NOT NULL
);

INSERT INTO languages (code, name) VALUES
('sv', 'Svenska'),
('en', 'English');

-- =========================
-- 2. HEADER + ÖVERSÄTTNINGAR
-- =========================
DROP TABLE IF EXISTS header_translations;
DROP TABLE IF EXISTS social_links;
DROP TABLE IF EXISTS header;

CREATE TABLE header (
  id INTEGER PRIMARY KEY
);

CREATE TABLE header_translations (
  header_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  summary TEXT NOT NULL,
  PRIMARY KEY (header_id, language),
  FOREIGN KEY (header_id) REFERENCES header(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

CREATE TABLE social_links (
  id INTEGER PRIMARY KEY,
  header_id INTEGER NOT NULL,
  icon TEXT NOT NULL,
  url TEXT NOT NULL,
  FOREIGN KEY (header_id) REFERENCES header(id)
);

-- =========================
-- 3. FOOTER + ÖVERSÄTTNINGAR
-- =========================
DROP TABLE IF EXISTS footer_translations;
DROP TABLE IF EXISTS footer;

CREATE TABLE footer (
  id INTEGER PRIMARY KEY,
  cv_url TEXT NOT NULL
);

CREATE TABLE footer_translations (
  footer_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  copyright TEXT NOT NULL,
  text TEXT NOT NULL,
  cv_text TEXT NOT NULL,
  cv_text2 TEXT NOT NULL,
  PRIMARY KEY (footer_id, language),
  FOREIGN KEY (footer_id) REFERENCES footer(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

-- =========================
-- 4. SECTIONS + ÖVERSÄTTNINGAR
-- =========================
DROP TABLE IF EXISTS section_entry_duty_item_translations;
DROP TABLE IF EXISTS section_entry_duty_items;
DROP TABLE IF EXISTS section_entry_duty_translations;
DROP TABLE IF EXISTS section_entry_duties;
DROP TABLE IF EXISTS section_entry_translations;
DROP TABLE IF EXISTS section_entries;
DROP TABLE IF EXISTS section_translations;
DROP TABLE IF EXISTS sections;

CREATE TABLE sections (
  id INTEGER PRIMARY KEY
);

CREATE TABLE section_translations (
  section_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  title TEXT NOT NULL,
  PRIMARY KEY (section_id, language),
  FOREIGN KEY (section_id) REFERENCES sections(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

-- =========================
-- 5. SECTION ENTRIES + ÖVERSÄTTNINGAR
-- =========================
CREATE TABLE section_entries (
  id INTEGER PRIMARY KEY,
  section_id INTEGER NOT NULL,
  examensbevis TEXT,
  date TEXT,
  FOREIGN KEY (section_id) REFERENCES sections(id)
);

CREATE TABLE section_entry_translations (
  entry_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  heading TEXT,
  subheading TEXT,
  details TEXT,
  PRIMARY KEY (entry_id, language),
  FOREIGN KEY (entry_id) REFERENCES section_entries(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

-- =========================
-- 6. DUTIES + ÖVERSÄTTNINGAR
-- =========================
CREATE TABLE section_entry_duties (
  id INTEGER PRIMARY KEY,
  entry_id INTEGER NOT NULL,
  FOREIGN KEY (entry_id) REFERENCES section_entries(id)
);

CREATE TABLE section_entry_duty_translations (
  duty_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  header TEXT NOT NULL,
  PRIMARY KEY (duty_id, language),
  FOREIGN KEY (duty_id) REFERENCES section_entry_duties(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

CREATE TABLE section_entry_duty_items (
  id INTEGER PRIMARY KEY,
  duty_id INTEGER NOT NULL,
  FOREIGN KEY (duty_id) REFERENCES section_entry_duties(id)
);

CREATE TABLE section_entry_duty_item_translations (
  item_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  item TEXT NOT NULL,
  PRIMARY KEY (item_id, language),
  FOREIGN KEY (item_id) REFERENCES section_entry_duty_items(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

-- =========================
-- 7. REKOMMENDATIONER + ÖVERSÄTTNINGAR
-- =========================
DROP TABLE IF EXISTS recommendation_translations;
DROP TABLE IF EXISTS recommendations;

CREATE TABLE recommendations (
  id INTEGER PRIMARY KEY
);

CREATE TABLE recommendation_translations (
  recommendation_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  company TEXT NOT NULL,
  mail TEXT NOT NULL,
  phone TEXT NOT NULL,
  PRIMARY KEY (recommendation_id, language),
  FOREIGN KEY (recommendation_id) REFERENCES recommendations(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

-- =========================
-- 8. SKILLS: KATEGORIER + ÖVERSÄTTNINGAR
-- =========================
DROP TABLE IF EXISTS skill_translations;
DROP TABLE IF EXISTS skills;
DROP TABLE IF EXISTS skill_category_translations;
DROP TABLE IF EXISTS skill_categories;

CREATE TABLE skill_categories (
  id INTEGER PRIMARY KEY
);

CREATE TABLE skill_category_translations (
  category_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  name TEXT NOT NULL,
  PRIMARY KEY (category_id, language),
  FOREIGN KEY (category_id) REFERENCES skill_categories(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

CREATE TABLE skills (
  id INTEGER PRIMARY KEY,
  category_id INTEGER NOT NULL,
  image TEXT,
  grade INTEGER,
  "order" INTEGER,
  FOREIGN KEY (category_id) REFERENCES skill_categories(id)
);

CREATE TABLE skill_translations (
  skill_id INTEGER NOT NULL,
  language TEXT NOT NULL,
  text TEXT NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (skill_id, language),
  FOREIGN KEY (skill_id) REFERENCES skills(id),
  FOREIGN KEY (language) REFERENCES languages(code)
);

-- =========================
-- 9. DATA: HEADER (SV + EN från dina JSON-filer)
-- =========================
INSERT INTO header (id) VALUES (1);

-- Svenska (från cv-content-se.json)
INSERT INTO header_translations (header_id, language, name, role, summary) VALUES
(1, 'sv',
 'Jonas Larsson',
 'Systemutvecklare',
 'Hej! Jag heter Jonas — en frontend-fokuserad systemutvecklare med 5+ års yrkeserfarenhet av att bygga moderna, skalbara och användarvänliga webbapplikationer. Jag är specialiserad på Vue 3, TypeScript, JavaScript, Node.js och moderna frontend-arkitekturer, och jag har praktisk erfarenhet av React,molndrivna pipelines (AWS), MySQL-databaser, API-integrationer och verktyg som förbättrar utvecklingsflöden. Under mina år på Zmarta arbetade jag med att skapa och förbättra gränssnitt inom finans- och jämförelsetjänster — med fokus på prestanda, tillgänglighet, UX och robust kodkvalitet. Jag brinner för att lösa verkliga problem, skapa enkla lösningar för komplexa flöden och att ständigt utvecklas inom modern webbutveckling.'
);

-- Engelska (från cv-content.json)
INSERT INTO header_translations (header_id, language, name, role, summary) VALUES
(1, 'en',
 'Jonas Larsson',
 'System Developer',
 'Hi! My name is Jonas — a front-end-focused systems developer with 5+ years of professional experience building modern, scalable, and user-friendly web applications. I specialize in Vue 3, TypeScript, JavaScript, Node.js, and modern front-end architectures, and I have hands-on experience with React, cloud-powered pipelines (AWS), MySQL databases, API integrations, and tools that improve development workflows. During my years at Zmarta, I worked on creating and improving interfaces in financial and comparison services — focusing on performance, accessibility, UX, and robust code quality. I am passionate about solving real-world problems, creating simple solutions for complex workflows, and constantly evolving in modern web development.'
);

-- Social links (samma i båda JSON)
INSERT INTO social_links (id, header_id, icon, url) VALUES
(1, 1, 'fab fa-linkedin', 'https://www.linkedin.com/in/jonlarsson/'),
(2, 1, 'fab fa-github',   'https://github.com/JonasLarsson78'),
(3, 1, 'fas fa-envelope', 'mailto:jl.7804@gmail.com');

-- =========================
-- 10. DATA: FOOTER (SV + EN från JSON-filerna)
-- =========================
INSERT INTO footer (id, cv_url) VALUES
(1, 'https://github.com/JonasLarsson78/cv_v2');

-- Svenska
INSERT INTO footer_translations (footer_id, language, copyright, text, cv_text, cv_text2)
VALUES
(1, 'sv',
 'cv_v2 V2.0 © {{year}} Jonas Larsson. Alla rättigheter förbehållna.',
 'Skapad med ❤️ och Vue 3 + TypeScript + Vite',
 'Cv på',
 'Github'
);

-- Engelska
INSERT INTO footer_translations (footer_id, language, copyright, text, cv_text, cv_text2)
VALUES
(1, 'en',
 'cv_v2 V2.0 © {{year}} Jonas Larsson. All rights reserved.',
 'Made with ❤️ using Vue 3 + TypeScript + Vite',
 'Cv on',
 'Github'
);

-- =========================
-- 11. DATA: SECTIONS (titlar från båda JSON)
-- =========================
INSERT INTO sections (id) VALUES
(1),(2),(3),(4),(5);

-- Svenska titles
INSERT INTO section_translations (section_id, language, title) VALUES
(1, 'sv', 'Utbildning'),
(2, 'sv', 'Kontakta'),
(3, 'sv', 'Erfarenhet'),
(4, 'sv', 'Rekommendationer'),
(5, 'sv', 'Färdigheter');

-- Engelska titles (från cv-content.json)
INSERT INTO section_translations (section_id, language, title) VALUES
(1, 'en', 'Education'),
(2, 'en', 'Contact'),
(3, 'en', 'Experience'),
(4, 'en', 'Recommendations'),
(5, 'en', 'Skills');

-- =========================
-- 12. UTBILDNING / EDUCATION (entry_id = 1)
-- =========================
INSERT INTO section_entries (id, section_id, examensbevis, date)
VALUES (
  1,
  1,
  'https://file-server-seven.vercel.app/img/jpg/examensbevis.jpg',
  NULL
);

-- Svenska
INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details)
VALUES
(1, 'sv',
 'Aug 2018 - Maj 2020 | EC Utbildning',
 'Frontend Developer YH',
 'Frontend-utvecklare YH-program på EC Utbildning i Helsingborg. Programmet fokuserade på webbutveckling, inklusive HTML, CSS, JavaScript, React.js och olika ramverk och bibliotek.'
);

-- Engelska (från cv-content.json)
INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details)
VALUES
(1, 'en',
 'Aug 2018 - May 2020 | EC Utbildning',
 'Frontend Developer YH',
 'Frontend Developer YH program at EC Utbildning in Helsingborg, Sweden. The program focused on web development, including HTML, CSS, JavaScript, React.js and various frameworks and libraries.'
);

-- =========================
-- 13. KONTAKT / CONTACT (entries 2–6)
-- =========================
INSERT INTO section_entries (id, section_id, examensbevis, date) VALUES
(2, 2, NULL, NULL),
(3, 2, NULL, NULL),
(4, 2, NULL, NULL),
(5, 2, NULL, NULL),
(6, 2, NULL, NULL);

-- Svenska (från cv-content-se.json)
INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(2, 'sv', NULL, NULL,
 '{"icon":"fas fa-map-marker-alt","text":"Engelska gången 29C, 254 51 Helsingborg","url":"https://www.google.com/maps/place/Engelska+g%C3%A5ngen+29C,+254+51+Helsingborg/@56.0777161,12.6893713,17z/data=!3m1!4b1!4m6!3m5!1s0x4652320524b00e51:0xd2336aa25aa5bee6!8m2!3d56.0777161!4d12.6919462!16s%2Fg%2F11c25_pcd0?entry=ttu&g_ep=EgoyMDI1MDkwNy4wIKXMDSoASAFQAw%3D%3D"}'),
(3, 'sv', NULL, NULL,
 '{"icon":"fas fa-phone","text":"0706-444922","url":"tel:0706444922"}'),
(4, 'sv', NULL, NULL,
 '{"icon":"fas fa-envelope","text":"jl.7804@gmail.com","url":"mailto:jl.7804@gmail.com"}'),
(5, 'sv', NULL, NULL,
 '{"icon":"fas fa-globe","text":"Curriculum vitae","url":"https://cv-v2-sage.vercel.app"}'),
(6, 'sv', NULL, NULL,
 '{"icon":"fas fa-globe","text":"Curriculum vitae","url":"https://mincv-portfolio.vercel.app","tag":"Ny"}');

-- Engelska (från cv-content.json)
INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(2, 'en', NULL, NULL,
 '{"icon":"fas fa-map-marker-alt","text":"Engelska gången 29C, 254 51 Helsingborg","url":"https://www.google.com/maps/place/Engelska+g%C3%A5ngen+29C,+254+51+Helsingborg/@56.0777161,12.6893713,17z/data=!3m1!4b1!4m6!3m5!1s0x4652320524b00e51:0xd2336aa25aa5bee6!8m2!3d56.0777161!4d12.6919462!16s%2Fg%2F11c25_pcd0?entry=ttu&g_ep=EgoyMDI1MDkwNy4wIKXMDSoASAFQAw%3D%3D"}'),
(3, 'en', NULL, NULL,
 '{"icon":"fas fa-phone","text":"0706-444922","url":"tel:0706444922"}'),
(4, 'en', NULL, NULL,
 '{"icon":"fas fa-envelope","text":"jl.7804@gmail.com","url":"mailto:jl.7804@gmail.com"}'),
(5, 'en', NULL, NULL,
 '{"icon":"fas fa-globe","text":"Curriculum vitae","url":"https://cv-v2-sage.vercel.app"}'),
(6, 'en', NULL, NULL,
 '{"icon":"fas fa-globe","text":"Personal portfolio","url":"https://mincv-portfolio.vercel.app","tag":"New"}');

-- =========================
-- 14. ERFARENHET / EXPERIENCE
-- =========================

-- 14.1 Zmarta (entry_id = 7)
INSERT INTO section_entries (id, section_id, examensbevis, date)
VALUES (7, 3, NULL, 'Aug 2020 - Aug 2025');

-- Svenska
INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(7, 'sv',
 'Systemutvecklare',
 NULL,
 '["Zmarta AB Skåne Ängelholm"]'
);

-- Engelska (från cv-content.json)
INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(7, 'en',
 'System developer',
 NULL,
 '["Zmarta AB Skåne Ängelholm"]'
);

-- Duties for Zmarta
INSERT INTO section_entry_duties (id, entry_id) VALUES
(1, 7),
(2, 7);

-- Duty headers
INSERT INTO section_entry_duty_translations (duty_id, language, header) VALUES
(1, 'sv', 'Arbetsuppgifter och ansvar:'),
(2, 'sv', 'Exempel på resultat:'),
(1, 'en', 'Duties & Responsibilities:'),
(2, 'en', 'Example of results:');

-- Duty items rows
INSERT INTO section_entry_duty_items (id, duty_id) VALUES
(1, 1),
(2, 1),
(3, 1),
(4, 1),
(5, 1),
(6, 1),
(7, 1),
(8, 2),
(9, 2),
(10,2);

-- Svenska items (från cv-content-se.json)
INSERT INTO section_entry_duty_item_translations (item_id, language, item) VALUES
(1, 'sv', 'Utvecklade och förbättrade kundflöden, formulär, dashboards och verktyg i Vue 3 + TypeScript'),
(2, 'sv', 'Byggde och underhållde Node.js backend-tjänster och integrerade interna och externa API:er'),
(3, 'sv', 'Arbetade med AWS-pipelines för CI/CD och automatiserade distributionsflöden'),
(4, 'sv', 'Optimerade prestanda, minskade tekniska skulder och förbättrade UI/UX för konverteringskritiska delar'),
(5, 'sv', 'Arbetade nära designteamet med komponenter, designsystem och Figma'),
(6, 'sv', 'Hanterade MySQL-databaser och GraphQL-integrationer'),
(7, 'sv', 'Tog ansvar för kodkvalitet, kodgranskningar och tekniska beslut inom teamet'),
(8, 'sv', 'Förbättrade sidprestanda med upp till 30-50 % genom cachning, lazy loading och kodoptimeringar'),
(9, 'sv', 'Skapade nya interna verktyg som förenklade arbetsflöden och minskade manuell hantering för team'),
(10,'sv', 'Ledde frontend-implementering i flera större projekt');

-- Engelska items (från cv-content.json)
INSERT INTO section_entry_duty_item_translations (item_id, language, item) VALUES
(1, 'en', 'Developed and improved customer flows, forms, dashboards and tools in Vue 3 + TypeScript'),
(2, 'en', 'Built and maintained Node.js backend services and integrated internal and external APIs'),
(3, 'en', 'Worked with AWS pipelines for CI/CD and automated deployment flows'),
(4, 'en', 'Optimized performance, reduced technical debt and improved UI/UX for conversion-critical parts'),
(5, 'en', 'Worked closely with the design team with components, design systems and Figma'),
(6, 'en', 'Managed MySQL databases and GraphQL integrations'),
(7, 'en', 'Took responsibility for code quality, code reviews and technical decisions within the team'),
(8, 'en', 'Improved page performance by up to 30-50% through caching, lazy loading and code optimizations'),
(9, 'en', 'Created new internal tools that simplified workflows and reduced manual handling for teams'),
(10,'en', 'Lead frontend implementation in several major projects');

-- 14.2 Frontend-utvecklare / Frontend Developer (LIA2) entry_id = 8
INSERT INTO section_entries (id, section_id, examensbevis, date)
VALUES (8, 3, NULL, 'Mars 2020 - May 2020');

INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(8, 'sv',
 'Frontend-utvecklare',
 NULL,
 '["Praktik(LIA2) - Sogeti Skåne Helsingborg"]'
),
(8, 'en',
 'Frontend Developer',
 NULL,
 '["Praktik(LIA2) - Sogeti Skåne Helsingborg"]'
);

-- 14.3 Frontend-utvecklare / Frontend Developer (LIA1) entry_id = 9
INSERT INTO section_entries (id, section_id, examensbevis, date)
VALUES (9, 3, NULL, 'Sept 2019 - Dec 2019');

INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(9, 'sv',
 'Frontend-utvecklare',
 NULL,
 '["Praktik(LIA1) - Sogeti Skåne Helsingborg"]'
),
(9, 'en',
 'Frontend Developer',
 NULL,
 '["Praktik(LIA1) - Sogeti Skåne Helsingborg"]'
);

-- 14.4 Budbilsförare / Delivery driver entry_id = 10
INSERT INTO section_entries (id, section_id, examensbevis, date)
VALUES (10, 3, NULL, 'Mars 2017 - Dec 2017');

INSERT INTO section_entry_translations (entry_id, language, heading, subheading, details) VALUES
(10, 'sv',
 'Budbilsförare',
 NULL,
 '["Schenker Åker AB","Arbetade med att leverera paket."]'
),
(10, 'en',
 'Delivery driver',
 NULL,
 '["Schenker Åker AB","Worked on delivering packages."]'
);

-- =========================
-- 15. REKOMMENDATIONER / RECOMMENDATIONS
-- =========================
INSERT INTO recommendations (id) VALUES (1),(2);

INSERT INTO recommendation_translations (recommendation_id, language, name, company, mail, phone) VALUES
(1, 'sv', 'Jesper Ekberg', 'Zmarta AB', 'jesper.ekberg@mephistopheles.se', '0703394666'),
(1, 'en', 'Jesper Ekberg', 'Zmarta AB', 'jesper.ekberg@mephistopheles.se', '0703394666'),

(2, 'sv', 'Christoffer Lönnerfors', 'Zmarta AB', 'christoffer.lonnerfors@gmail.com', '0703586538'),
(2, 'en', 'Christoffer Lönnerfors', 'Zmarta AB', 'christoffer.lonnerfors@gmail.com', '0703586538');

-- =========================
-- 16. SKILLS (contentV2 – SV från se.json, EN från en.json)
-- =========================

-- Kategorier
INSERT INTO skill_categories (id) VALUES
(1),(2),(3),(4),(5),(6),(7);

INSERT INTO skill_category_translations (category_id, language, name) VALUES
(1, 'sv', 'Frontend'),
(2, 'sv', 'Backend'),
(3, 'sv', 'Tools & DevOps'),
(4, 'sv', 'Design & UX'),
(5, 'sv', 'Databaser'),
(6, 'sv', 'Testing'),
(7, 'sv', 'Security & Auth'),

(1, 'en', 'Frontend'),
(2, 'en', 'Backend'),
(3, 'en', 'Tools & DevOps'),
(4, 'en', 'Design & UX'),
(5, 'en', 'Databases'),
(6, 'en', 'Testing'),
(7, 'en', 'Security & Auth');

-- FRONTEND skills (id 1–11)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(1,  1, '/svg/html.svg',      5,  1),
(2,  1, '/svg/css.svg',       4,  2),
(3,  1, '/svg/sass.svg',      4,  3),
(4,  1, '/svg/js.svg',        4,  4),
(5,  1, '/svg/ts.svg',        3,  5),
(6,  1, '/svg/vue.svg',       4,  6),
(7,  1, '/svg/vue.svg',       3,  7),
(8,  1, '/svg/pinia.svg',     4,  8),
(9,  1, '/svg/react.svg',     3,  9),
(10, 1, '/svg/vite.svg',      3, 10),
(11, 1, '/svg/bootstrap.svg', 3, 11);

-- Svenska descriptions (från cv-content-se.json contentV2)
INSERT INTO skill_translations (skill_id, language, text, description) VALUES
(1,  'sv', 'HTML',       'Semantisk HTML och tillgänglighet.'),
(2,  'sv', 'CSS',        'Responsiva layouter med Flexbox och Grid.'),
(3,  'sv', 'SASS',       'Modulär och underhållbar CSS.'),
(4,  'sv', 'Javascript', 'Modern JS (ES6+) för interaktivitet.'),
(5,  'sv', 'Typescript', 'Typning och bättre utvecklarupplevelse.'),
(6,  'sv', 'Vue',        'Vue 3, Composition API och ekosystemet.'),
(7,  'sv', 'Vuex',       'State management (Vue 2/legacy).'),
(8,  'sv', 'Pinia',      'State management för Vue 3.'),
(9,  'sv', 'React',      'Erfarenhet av React-projekt.'),
(10, 'sv', 'Vite',       'Snabba dev- och byggverktyg.'),
(11, 'sv', 'Bootstrap',  'Snabb UI-prototypning och komponenter.');

-- Engelska descriptions (från cv-content.json contentV2)
INSERT INTO skill_translations (skill_id, language, text, description) VALUES
(1,  'en', 'HTML',       'Semantic HTML and accessibility.'),
(2,  'en', 'CSS',        'Responsive layouts with Flexbox and Grid.'),
(3,  'en', 'SASS',       'Modular and maintainable CSS.'),
(4,  'en', 'Javascript', 'Modern JS (ES6+) for interactivity.'),
(5,  'en', 'Typescript', 'Typing and improved DX.'),
(6,  'en', 'Vue',        'Vue 3, Composition API and ecosystem.'),
(7,  'en', 'Vuex',       'State management (legacy Vuex experience).'),
(8,  'en', 'Pinia',      'State management for Vue 3.'),
(9,  'en', 'React',      'Experience from React projects.'),
(10, 'en', 'Vite',       'Fast dev and build tooling.'),
(11, 'en', 'Bootstrap',  'Rapid UI prototyping and components.');

-- BACKEND skills (id 12–15)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(12, 2, '/svg/node.svg',    4, 1),
(13, 2, '/svg/graphql.svg', 4, 2),
(14, 2, '/svg/go.svg',      2, 3),
(15, 2, '/svg/express.svg', 4, 4);

INSERT INTO skill_translations (skill_id, language, text, description) VALUES
-- Svenska (från se-json)
(12, 'sv', 'Node',    'Server-sida och API:er med Node.js.'),
(13, 'sv', 'Graphql', 'Design och integration av GraphQL-API:er.'),
(14, 'sv', 'Go',      'Grundläggande erfarenhet av Go.'),
(15, 'sv', 'Express', 'Snabbt och minimalistiskt Node.js-ramverk för API:er.'),

-- Engelska (från en-json)
(12, 'en', 'Node',    'Server-side and APIs with Node.js.'),
(13, 'en', 'Graphql', 'Design and integration of GraphQL APIs.'),
(14, 'en', 'Go',      'Basic experience with Go.'),
(15, 'en', 'Express', 'Minimal and fast Node.js web framework for APIs.');

-- TOOLS & DEVOPS skills (id 16–23)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(16, 3, '/svg/docker.svg',  3, 1),
(17, 3, '/svg/npm.svg',     4, 2),
(18, 3, '/svg/github.svg',  4, 3),
(19, 3, '/svg/postman.svg', 4, 4),
(20, 3, '/svg/vercel.svg',  3, 5),
(21, 3, '/svg/webpack.svg', 3, 6),
(22, 3, '/svg/github.svg',  4, 7),
(23, 3, '/svg/aws.svg',     3, 8);

INSERT INTO skill_translations (skill_id, language, text, description) VALUES
-- Svenska
(16, 'sv', 'Docker',        'Containerisering och lokala miljöer.'),
(17, 'sv', 'Npm',           'Paket- och script-hantering.'),
(18, 'sv', 'Github',        'Versionshantering och PR-flöden.'),
(19, 'sv', 'Postman',       'API-testning och dokumentation.'),
(20, 'sv', 'Vercel',        'Plattform för distribution och hosting.'),
(21, 'sv', 'Webpack',       'Traditionell bundler och konfiguration.'),
(22, 'sv', 'GitHub Actions','CI/CD pipelines och automation.'),
(23, 'sv', 'AWS',           'Molntjänster och distribution (S3, Lambda etc).'),

-- Engelska (från en-json)
(16, 'en', 'Docker',        'Containerization and local environments.'),
(17, 'en', 'Npm',           'Package and script management.'),
(18, 'en', 'Github',        'Version control and PR workflows.'),
(19, 'en', 'Postman',       'API testing and documentation.'),
(20, 'en', 'Vercel',        'Deployment and hosting platform.'),
(21, 'en', 'Webpack',       'Traditional bundler and configuration.'),
(22, 'en', 'GitHub Actions','CI/CD pipelines and automation.'),
(23, 'en', 'AWS',           'Cloud services and deployments (S3, Lambda etc).');

-- DESIGN & UX (id 24)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(24, 4, '/svg/figma.svg', 3, 1);

INSERT INTO skill_translations (skill_id, language, text, description) VALUES
(24, 'sv', 'Figma', 'UI/UX-design och prototyper.'),
(24, 'en', 'Figma','UI/UX design and prototyping.');

-- DATABASES (id 25–27)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(25, 5, '/svg/mysql.svg',   3, 1),
(26, 5, '/svg/mongodb.svg', 3, 2),
(27, 5, '/svg/sqlite.svg',  3, 3);

INSERT INTO skill_translations (skill_id, language, text, description) VALUES
-- Svenska
(25, 'sv', 'MySQL',  'Databasschema och frågor.'),
(26, 'sv', 'MongoDB','NoSQL-databas för flexibla datamodeller.'),
(27, 'sv', 'SQLite', 'Lättviktsdatabas för lokal utveckling och prototyper.'),

-- Engelska (från en-json)
(25, 'en', 'MySQL',  'Database schema and queries.'),
(26, 'en', 'MongoDB','NoSQL database for flexible data models.'),
(27, 'en', 'SQLite', 'Lightweight DB for local development and prototypes.');

-- TESTING (id 28–29)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(28, 6, '/svg/jest.svg',   3, 1),
(29, 6, '/svg/vitest.svg', 3, 2);

INSERT INTO skill_translations (skill_id, language, text, description) VALUES
(28, 'sv', 'Jest',   'Enhetstester och snapshot-testing.'),
(29, 'sv', 'Vitest', 'Snabb testkörning för Vite-projekt.'),

(28, 'en', 'Jest',   'Unit testing and snapshot testing.'),
(29, 'en', 'Vitest', 'Fast test runner for Vite projects.');

-- SECURITY & AUTH (id 30–31)
INSERT INTO skills (id, category_id, image, grade, "order") VALUES
(30, 7, '/svg/oauth2.svg', 3, 1),
(31, 7, '/svg/jwt.svg',    3, 2);

INSERT INTO skill_translations (skill_id, language, text, description) VALUES
(30, 'sv', 'OAuth2', 'Autentisering och auktorisering av API:er.'),
(31, 'sv', 'JWT',    'Token-baserad autentisering och sessionshantering.'),

(30, 'en', 'OAuth2', 'Authentication and authorization for APIs.'),
(31, 'en', 'JWT',    'Token-based authentication and session handling.');