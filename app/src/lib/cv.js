import { SITE } from './site'

// Edit this file to update your CV. Keep it in sync with your real resume.
export const CV = {
  headline: 'AI-Native Backend Engineer | AI Systems | Full-Stack Web Development',
  location: 'Lagos, Nigeria',
  email: SITE.email,
  phone: '+234 904 722 6729',
  github: SITE.github,
  linkedin: SITE.linkedin,
  summary:
    'First Class Computer Science graduate (CGPA 4.88/5.00, Trinity University Yaba, Lagos) and Backend AI Engineering Intern at FlyRank AI. Experienced designing and shipping production REST APIs, authentication systems, scheduled background services, and cloud-deployed applications using Python, FastAPI, Django, PostgreSQL, and TypeScript. Has independently built and deployed multiple full-stack systems from scratch, including ADIPHAS (a multi-service disease intelligence platform) and CMart (a full-stack e-commerce marketplace with a Django REST Framework backend). Active open-source contributor with 267 GitHub contributions in the past year, including contributions to the SafeRoute community safety platform by PyData Lagos.',

  skills: [
    { group: 'Languages', items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'PHP', 'HTML', 'CSS'] },
    { group: 'Backend', items: ['FastAPI', 'Django REST Framework', 'Node.js', 'REST API design', 'JWT Auth', 'OAuth 2.0', 'bcrypt', 'background scheduling', 'API integration', 'Pydantic', 'middleware'] },
    { group: 'Frontend', items: ['React 18', 'Next.js 14', 'Vite', 'Tailwind CSS', 'PWA', 'dark mode', 'SPA routing', 'Motion (Framer Motion)'] },
    { group: 'Databases', items: ['PostgreSQL', 'MySQL', 'SQLite', 'Firebase Firestore', 'Neon PostgreSQL', 'schema design', 'security rules', 'query optimisation', 'migrations'] },
    { group: 'Cloud & Deploy', items: ['Render', 'Vercel', 'Railway', 'Streamlit Cloud', 'Google Cloud', 'AWS (foundational)', 'Firebase Hosting'] },
    { group: 'Auth & Security', items: ['JWT', 'OAuth 2.0', 'Google OAuth', 'Firebase Auth', 'bcrypt', 'CORS', 'HSTS', 'XSS protection', 'rate limiting'] },
    { group: 'AI & NLP', items: ['Gemini API', 'OpenRouter', 'spaCy', 'Dempster-Shafer evidence fusion', 'multi-model fallback chains', 'LLM orchestration'] },
    { group: 'Tools', items: ['Git', 'GitHub', 'Linux', 'Docker (foundational)', 'GitHub Actions', 'Agile/Scrum', 'drf-spectacular (OpenAPI)', 'Swagger UI'] },
  ],

  experience: [
    {
      role: 'Backend AI Engineering Intern',
      company: 'FlyRank AI',
      start: 'Jun 2026',
      end: 'Present',
      location: 'Remote',
      points: [
        'Build and maintain backend AI pipelines for organic-growth and AI-search automation workflows in a live production environment.',
        'Develop, test, and debug REST API endpoints; identify and resolve production issues across the service layer.',
        'Work with senior engineers on backend architecture decisions, service design, and cloud deployment processes.',
      ],
    },
    {
      role: 'Computer Systems & Networking Admin (SIWES)',
      company: 'Inspire Polytechnic Lagos',
      start: 'Feb 2025',
      end: 'Aug 2025',
      location: 'On-site, Lagos',
      points: [
        'Administered computer systems, network infrastructure, and lab resources across a multi-lab institutional environment.',
        'Provided technical support to staff and students; performed system maintenance and reduced recurring downtime across campus labs.',
        'Designed and documented a Star LAN topology using office-model simulation; delivered as a formal technical project.',
      ],
    },
    {
      role: 'Assistant Software Developer Intern',
      company: 'Citanuvola',
      start: 'Aug 2023',
      end: 'Aug 2023',
      location: 'Hybrid, Ikeja',
      points: [
        'Contributed to a Flutter mobile application integrating live company-asset APIs, working on backend wiring and data integration.',
        'Participated in code reviews and sprint cycles within an Agile cross-functional development team.',
      ],
    },
  ],

  education: [
    {
      school: 'Trinity University, Yaba, Lagos',
      program: 'B.Sc. Computer Science — First Class Honours',
      start: '2021',
      end: '2026',
      note: 'CGPA: 4.88 / 5.00. Final Year Project: Design and Development of an Autonomous Disease Intelligence and Public Health Advisory System (ADIPHAS).',
    },
  ],

  openSource: [
    '267 GitHub contributions in the past year across 12+ repositories.',
    'Active contributor to SafeRoute (PyData Lagos) — a community road safety reporting platform for Lagos commuters.',
    'Participated in ML/Deep Learning Masterclass Workshop 2026, completing regression, classification, and image recognition applied notebooks.',
  ],

  certifications: ['Cyber Security Threats — Great Learning'],

  interests: [
    'Backend system design and API architecture',
    'Fintech infrastructure and payment systems',
    'AI systems, LLM orchestration, and responsible AI',
    'Developer tooling and open-source software',
    'Urban technology and community safety platforms',
  ],

  highlights: [
    { label: 'Projects', value: 'ADIPHAS, CMart, TU Market Hub and more on the projects page.' },
    { label: 'Education', value: 'First Class B.Sc. Computer Science, CGPA 4.88/5.00.' },
    { label: 'Open source', value: '267 contributions in the past year, 12+ repositories.' },
  ],
}
