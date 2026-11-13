// YOUR PORTFOLIO CONTENT
// Work, education, and skills are based on the supplied résumés (November 2026).
// Project links and descriptions were also checked against public GitHub READMEs.
// Keep strings in quotes and commas between entries. Duplicate a whole object
// to add a role or project; the page renders these arrays in their listed order.
window.portfolio = {
  contact: {
    email: 'hariskhawja@gmail.com',
    github: 'https://github.com/hariskhawja',
    linkedin: 'https://linkedin.com/in/hariskhawja',
  },

  // Use a project id from the projects array for the hero's featured build.
  featuredProject: 'quectomm',
  // These are exact copies of the supplied PDFs, available from the hero and contact.
  resumes: {
    software: 'assets/haris-khawja-resume-swe.pdf',
    quant: 'assets/haris-khawja-resume-quant.pdf',
  },

  // The complete toolkit, grouped for easy scanning and editing.
  skillGroups: [
    {
      title: 'Languages',
      items: [
        'C',
        'C++',
        'Python',
        'SQL',
        'Java',
        'C#',
        'Scala',
        'TypeScript',
        'JavaScript',
      ],
    },
    {
      title: 'Web & backend',
      items: [
        'React',
        'Next.js',
        'React Native',
        'TanStack Query',
        'Spring Boot',
        'Django',
        '.NET',
        'Node.js',
        'Express',
        'Flask',
        'REST APIs',
      ],
    },
    {
      title: 'Data & infrastructure',
      items: [
        'PostgreSQL',
        'Redis',
        'RabbitMQ',
        'Django-RQ',
        'NumPy',
        'Pandas',
        'scikit-learn',
        'Matplotlib',
        'AWS',
        'GCP',
        'Vercel',
        'Supabase',
        'Docker',
        'Kubernetes',
      ],
    },
    {
      title: 'Engineering tools',
      items: [
        'Git',
        'GitHub',
        'GitLab',
        'Bazel',
        'CMake',
        'Playwright',
        'Jest',
        'Mockito',
        'Snyk',
        'Postman',
        'Figma',
        'Expo',
        'Jupyter Notebook',
      ],
    },
  ],

  // Each role contains the projects and contributions revealed when expanded.
  experience: [
    {
      company: 'BMO Capital Markets',
      logo: 'assets/bmo.svg',
      role: 'Software Engineer',
      dates: 'SEP 2026 — PRESENT',
      highlight: 'SQL query optimization: 18s → 300ms',
      category: 'Data Cognition · Toronto',
      description:
        'Building internal software for Global Markets and Investment & Corporate Banking, with a focus on reliable workflows, safe database writes, and faster access to data.',
      projects: [
        {
          title: 'Tech IB Dashboard',
          text: 'Requested by the COO, performing data analysis on expense vs. revenue data for all 10k+ BMO Capital Market clients to identify weak relationships. Data is sourced from Salesforce, Coupa procurement, and confidential deal statistics.',
          tags: ['SQL', 'Data'],
        },
        {
          title: 'Smart Expense | Global Markets',
          text: 'Rebuilt an internal expense procurement application used by more than 2,000 regular users across Global Markets. Improvements include major library upgrades, a modernized frontend app, modularization of server processes, pagination, and locking for safe concurrent database writes.',
          tags: ['C#', '.NET', 'SQL', 'React', 'TypeScript', 'Concurrency'],
        },
        {
          title: 'From 18 seconds to 300 milliseconds',
          text: 'Optimized SQL query plans to reduce API fetch time from 18 seconds to 300 milliseconds, making a frequently used compliance workflow more responsive.',
          tags: ['SQL', 'SSMS', 'Query optimization', 'API performance'],
        },
      ],
    },
    {
      company: 'Arctic Wolf Networks',
      logo: 'assets/arctic-wolf.png',
      role: 'Software Developer',
      dates: 'JAN — APR 2026',
      highlight: 'Architecture optimization: 2.7s → 730ms',
      category: 'Cybersecurity · Waterloo',
      description:
        'Worked across backend architecture, application security, and test infrastructure to make services faster and easier to validate.',
      projects: [
        {
          title: 'Centralizing function for faster queries',
          text: 'Refactored backend architecture to eliminate chatty microservice anti-patterns, reducing latency from 2.7 seconds to 730 milliseconds. Migrated hot endpoints to the primary microservice, and outboxed data from pod-specific dbs to a faster centralized db.',
          tags: ['Spring Boot', 'RabbitMQ', 'Outboxing', 'Architecture'],
        },
        {
          title: 'Security of code',
          text: 'Remediated more than 20 high-severity vulnerabilities identified by Snyk, including Billion Laughs, ReDoS, and remote-code-execution issues, ahead of recurring application security audits.',
          tags: ['Snyk', 'Application Security', 'Dependency Remediation'],
        },
        {
          title: 'Custom testing infrastructure',
          text: 'Built a custom test engine for in-memory PDF generation to resolve transpilation conflicts. Reworked the Bazel CI pipeline to enable c8/Istanbul coverage reporting, increasing test coverage from 16% to 80%.',
          tags: ['Bazel', 'Jest', 'Mockito', 'CI / Coverage'],
        },
      ],
    },
    {
      company: 'Cache',
      logo: 'assets/cache.png',
      role: 'Full-Stack & Machine Learning Engineer',
      dates: 'MAY — AUG 2025',
      highlight: 'Inventory processing: 15 min → 7 sec',
      category: 'Resale Technology · Toronto',
      description:
        'Built software for clothing resale: marketplace automation, inventory tools, secure endpoints, and AI-assisted product research.',
      projects: [
        {
          title: 'Automated resale workflows from 15 min → 7 sec',
          text: 'Automated crosslisting and marketplace CRUD operations with asynchronous Playwright scripts managed by Django-RQ, increasing resale handling speed by 96%. Built a Django/Bootstrap dashboard that reduced inventory processing from 15 minutes to 7 seconds per item.',
          tags: ['Python', 'Django', 'Playwright', 'Django-RQ'],
        },
        {
          title: 'From clothing photos to valuations',
          text: 'Built pipelines using Google Gemini OCR and an OpenAI tool-enabled model to extract clothing attributes and calculate resale valuations from live marketplace data. To optimize tokens, models cache similar clothing data into dbs and predict select marketplaces to scrape based on clothing features.',
          tags: ['Gemini OCR', 'OpenAI', 'GCP', 'Web scraping', 'AI'],
        },
        {
          title: 'Cache App',
          text: 'Freshly developed and maintained the frontend app in React-Native, making iterative improvements based on real beta-user feedback.',
          tags: ['React-Native', 'Redux', 'Expo', 'UI/UX'],
        },
        {
          title: 'Safer public-facing identifiers',
          text: 'Implemented SQIDs to prevent exposure of internal IDs and protect more than 1,000 confidential database records, securing endpoints and supporting TAC compliance.',
          tags: ['SQIDs', 'Django', 'API Security'],
        },
      ],
    },
  ],

  // Personal projects. id must be unique; category creates a filter automatically.
  // art selects a decorative preview, not a screenshot of the project.
  // description is the card summary; details is the full story in the dialog.
  // github and live accept full https:// links; leave unused values empty.
  projects: [
    {
      id: 'quectomm',
      title: 'QuectoMM',
      category: 'Systems',
      number: '01',
      art: 'market',
      label: 'MARKET MICROSTRUCTURE / IN PROGRESS',
      status: 'In progress',
      description: 'A C++20 engine for replaying markets, order by order.',
      tags: ['C++20', 'Python', 'Pandas', 'CMake', 'Market microstructure'],
      details:
        'A discrete-event market-making research engine that reconstructs a Level-3 order book from LOBSTER events.',
      sections: [
        {
          title: 'How it works',
          text: 'A Genesis-volume model accounts for liquidity whose individual orders are unobserved, while preserving FIFO priority for observed orders.',
        },
        {
          title: 'Validation',
          text: 'Replayed approximately 2.1 million events across five NASDAQ tickers from one sample trading day. Before each event’s snapshot reconciliation, best bid/ask agreement is at least 99.94% and depth error is at most 0.29%.',
        },
        {
          title: 'Next',
          text: 'Studying the marginal impact of microstructure signals on an Avellaneda–Stoikov strategy. This research is still in progress.',
        },
      ],
      github: 'https://github.com/hariskhawja/QuectoMM',
      live: '',
      real: true,
    },
    {
      id: 'letscook',
      title: 'LetsCook',
      category: 'Web',
      number: '02',
      art: 'cooking',
      label: 'RECIPES / CHALLENGES / COMMUNITY',
      description: 'Recipe challenges, shared creations, and a little competition.',
      tags: ['Next.js', 'React', 'TypeScript', 'Express', 'PostgreSQL', 'Supabase'],
      details:
        'A full-stack cooking community with recipe publishing, photo submissions, creator reviews, and a points-based leaderboard.',
      sections: [
        {
          title: 'The build',
          text: 'Next.js/React interface and Express REST APIs, with Supabase authentication, PostgreSQL, and row-level security. Deployed on Vercel and Google Cloud Run.',
        },
        {
          title: 'During the project',
          text: 'More than 30 active users and 200 weekly site visits. These are historical figures from the project period, not live activity.',
        },
      ],
      github: 'https://github.com/hariskhawja/LetsCook',
      live: 'https://letscook-silk.vercel.app/',
      real: true,
    },
    {
      id: 'emotionsense',
      title: 'EmotionSense.AI',
      category: 'AI & Data',
      number: '03',
      art: 'emotions',
      label: 'TEXT → EMOTIONAL PATTERNS',
      status: 'Most Creative · HackSwift 2024',
      description: 'Turning text into a picture of the emotions behind it.',
      tags: ['React', 'Chart.js', 'Python', 'Flask', 'NLTK'],
      details:
        'A HackSwift 2024 team project for analyzing emotions in uploaded text and visualizing emotional trends. Awarded Most Creative Project.',
      sections: [
        {
          title: 'The build',
          text: 'A React interface with Chart.js visualizations, backed by Python, Flask, and NLTK for text analysis.',
        },
        { title: 'Team', text: 'Built with Edison Ying and Roy Zhang.' },
      ],
      github: 'https://github.com/hariskhawja/EmotionSense.AI',
      live: 'https://emotion-sense-ai.vercel.app/',
      real: true,
    },
    {
      id: 'runevault',
      title: 'RuneVault',
      category: 'Coursework',
      number: '04',
      art: 'runes',
      label: 'CS247 / COURSE PROJECT',
      status: 'CS247',
      description: 'Five vault levels. Four Arcanist classes. A C++14 dungeon crawler.',
      tags: ['C++14', 'RAII', 'Design patterns', 'MVC', 'CS247'],
      details:
        'A terminal dungeon crawler built with the C++14 standard library for CS247. Choose a Sage, Hexblade, Warden, or Voidwalker, collect Rune Fragments, and recover each floor’s Cipher Gem to reveal the way down.',
      sections: [
        {
          title: 'Object-oriented design',
          text: 'Class abilities use Strategy, temporary scroll effects form a Decorator chain, and combat uses Visitor dispatch. Factories construct characters and enemies, guarded items use State, and a shared notification log records turn events.',
        },
        {
          title: 'Ownership and game structure',
          text: 'Game, Model, and View separate commands, rules, and terminal rendering. Levels own items and enemies with unique_ptr; shared character lifetimes support temporary decorator effects. Layout files and explicit random seeds make sessions reproducible.',
        },
        {
          title: 'Current validation',
          text: 'GitHub Actions builds the game and checks scripted startup, bonus mode, and demo-layout loading. The current checkout has no test sources, so make test is not a passing regression suite. Enemy damage modifiers and placement on cramped custom maps remain areas for further work.',
        },
      ],
      resources: [
        {
          label: 'Architecture overview',
          url: 'https://github.com/hariskhawja/RuneVault/blob/main/UML/UML_Thumbnail/RuneVault.png',
        },
      ],
      github: 'https://github.com/hariskhawja/RuneVault',
      live: '',
      real: true,
    },
    {
      id: 'not-a-smartboard',
      title: 'Not a Smartboard',
      category: 'Coursework',
      number: '05',
      art: 'whiteboard',
      label: 'CODE REVIEW / BEYOND THE SCREEN',
      status: 'SE101',
      description:
        'Code reviews on a whiteboard, with handwritten feedback captured digitally.',
      tags: ['Python', 'Flask', 'OpenCV', 'Raspberry Pi', 'Google Cloud Vision'],
      details:
        'An SE101 team project that projects source code onto a whiteboard and captures handwritten review comments, making group code review more interactive than screen sharing.',
      sections: [
        {
          title: 'From physical to digital',
          text: 'A Raspberry Pi, USB webcam, and monitor or projector connect a physical review space to a Python/Flask application, with OpenCV and Google Cloud Vision in the software stack.',
        },
        {
          title: 'Team',
          text: 'Built with Bryant Ruan, Ray Wang, Ronak Patel, and Roy Zhang.',
        },
      ],
      github: 'https://github.com/hariskhawja/Not-a-Smartboard',
      demo: 'https://drive.google.com/file/d/1h-a4Zw946FFNwTKIcn3T0HXxlNzyXM1y/view',
      live: '',
      real: true,
    },
    {
      id: 'personal-space',
      title: 'A space on the internet',
      category: 'Web',
      number: '06',
      art: 'web',
      label: 'YOU ARE HERE',
      description:
        'The portfolio you’re exploring. A home for work, experiments, and a little personality.',
      tags: ['HTML', 'CSS', 'JavaScript', 'UI / UX'],
      details:
        'An interactive personal website with expandable work experience, filterable projects, a living toolkit, and personal-interest widgets. Built with native browser features, responsive layouts, accessible dialogs, and reduced-motion support. Content and behavior are separated to keep the site easy to update.',
      github: 'https://github.com/hariskhawja/haris-khawja',
      live: '',
      real: true,
    },
  ],

  // The server fetches live data when CLASH_ROYALE_TOKEN and a player tag are set.
  // These values also work as a manual fallback. Never put an API token here.
  royale: { playerTag: '#RJCUR8L9U', trophies: null, deck: [] },
  zetamac: { highScore: 83, url: 'https://arithmetic.zetamac.com/' },
  // First club is the front card; the next two fan out behind it.
  football: {
    clubs: [
      {
        id: 'erin-mills',
        name: 'Erin Mills Soccer Club',
        cardLabel: 'Erin Mills',
        logo: 'assets/erin-mills.png',
        website: 'https://www.erinmillssoccer.com/',
      },
      {
        id: 'real-madrid',
        name: 'Real Madrid',
        cardLabel: 'Real Madrid',
        logo: 'assets/real-madrid-full-color.png',
        website: 'https://www.realmadrid.com/',
      },
      {
        id: 'manchester-united',
        name: 'Manchester United',
        cardLabel: 'Man United',
        logo: 'assets/manchester-united.svg',
        website: 'https://www.manutd.com/',
      },
    ],
  },
  leetcode: {
    username: 'stormguardian01',
    url: 'https://leetcode.com/u/stormguardian01/',
    logo: 'assets/leetcode.png',
    // Public profile snapshot; the dialog refreshes these stats when opened.
    stats: {
      total: 384,
      easy: 143,
      medium: 209,
      hard: 32,
      ranking: 355058,
      updatedAt: '2026-11-13',
    },
  },
  // Research groups the university recognition and AP qualification together.
  // Add the diploma and paper links when available; empty links stay hidden.
  research: {
    universityAward: {
      title: 'Outstanding High School Student - Science Award',
      institution: 'University of Toronto Scarborough',
      group: 'Andre Simpson Research Group',
      date: 'September 2023',
      year: '2023',
      logo: 'assets/uoft-scarborough.svg',
      crest: 'assets/uoft-crest.svg',
      source: 'https://ca.linkedin.com/in/hariskhawja',
    },
    capstone: {
      title: 'AP Capstone Diploma',
      paperTopic: 'Ethical AI',
      diplomaUrl: '',
      paperUrl: '',
    },
  },
  vex: {
    team: '2055A · Capybaras',
    season: '2023–2024',
    description:
      'VEX Robotics with the Capybaras. The codebase includes odometry, PID control, autonomous routines, and a coordinate-based route planning workflow.',
    github: 'https://github.com/hariskhawja/2055A',
    website: 'https://mi3lschool.org/history2055A',
    programmingSite: 'https://capybaras-2055.vercel.app/',
    // Published team awards from Haris's confirmed 2023–2024 participation years.
    awards: [
      {
        year: '2023',
        event: 'Brampton Over/Under Qualifier',
        award: 'Tournament Champions · Think Award',
      },
      {
        year: '2024',
        event: 'VEX AI World Championship',
        award: 'Robot Skills Champion · Innovate Award',
      },
      { year: '2024', event: 'VEX Robotics World Championship', award: 'Create Award' },
      {
        year: '2024',
        event: 'Battle of the Bots Signature Event',
        award: 'Robot Skills Champion · Think Award',
      },
      { year: '2024', event: 'Canadian Open Signature Event', award: 'Think Award' },
      {
        year: '2023',
        event: 'Hollywood Blockbuster Signature Event',
        award: 'Sportsmanship Award',
      },
      { year: '2023', event: 'Brampton Over/Under Qualifier', award: 'Excellence Award' },
    ],
  },
};
