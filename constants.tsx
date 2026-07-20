import { PortfolioContent } from './types';

// Datos comunes (imágenes, stacks técnicos que no requieren traducción)

const IMAGES = {
  schneider:
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200',
  myker:
    'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200',
  ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200',
  jpprep:
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1200',
  crotxet:
    'https://images.unsplash.com/photo-1537832816519-689ad163238b?auto=format&fit=crop&q=80&w=1200'
};

const COMMON_SKILLS = [
  {
    category: 'Frontend',
    skills: ['HTML', 'CSS/SASS', 'JavaScript', 'TypeScript', 'React', 'Bootstrap']
  },
  {
    category: 'Backend',
    skills: ['PHP', 'CodeIgniter', 'Symfony', 'Node.js', 'MySQL', 'API REST']
  },
  {
    category: 'Tools & Workflow',
    skills: ['Git & Agile', 'WordPress']
  },
  {
    category: 'Marketing & Analytics',
    skills: ['Google Analytics & GTM', 'CRO']
  }
];

export const SOCIAL_LINKS = {
  email: 'sergimallenweb@gmail.com',
  linkedin: 'https://www.linkedin.com/feed/?trk=guest_homepage-basic_google-one-tap-submit',
  github: 'https://github.com/MallenK',
  instagram: 'https://instagram.com/mallenk18',
  whatsapp: 'https://wa.me/34670248461'
};

export const TRANSLATIONS: Record<'es' | 'en' | 'cat', PortfolioContent> = {
  es: {
    nav: { projects: 'Proyectos', about: 'Perfil', contact: 'Contacto', cv: 'CV' },
    hero: {
      subtitle: 'Full Stack Developer • MallenK • AI Integration',
      cta: 'Ver Proyectos',
      scroll: 'Scroll to Explore'
    },
    about: {
      label: 'Profile / 01',
      title: 'Desarrollador Full Stack con más de 4 años construyendo',
      highlight: 'PRODUCTOS ESCALABLES',
      p1: 'sitios corporativos y aplicaciones web funcionales para clientes y equipos de producto.',
      p2: 'Experto en HTML, CSS, JavaScript, PHP y MySQL, con un sólido conocimiento tanto del desarrollo frontend como backend. Me involucro plenamente en cada proyecto, priorizando un código limpio, una estructura lógica y la eficiencia.'
    },
    services: {
      label: 'Core / 02',
      title: 'Servicios',
      items: [
        {
          title: 'Web Corporativa Premium',
          desc: 'Desarrollo de webs profesionales orientadas a conversión y marca.',
          icon: '💎',
          url: 'https://mykeracademy.com/'
        },
        {
          title: 'SaaS & Apps a Medida',
          desc: 'Construcción de plataformas escalables y productos digitales.',
          icon: '🚀',
          url: 'https://mallenk.github.io/Plantilla-Plataforma-Academia-Escolar/'
        },
        { title: 'Automatización Procesos', desc: 'Optimización de flujos internos y sistemas empresariales.', icon: '⚙️' },
        {
          title: 'Integración IA',
          desc: 'Chatbots, análisis de datos y asistentes inteligentes.',
          icon: '🧠',
          action: 'open-ai-chat'
        },
        {
          title: 'Consultoría y Auditoría Web',
          desc: 'Análisis técnico, evaluación de rendimiento y arquitectura, auditoría de experiencia de usuario y definición de planes de mejora con recomendaciones accionables para productos digitales.',
          icon: '🔍'
        },
        { title: 'Clases Programación/IA', desc: 'Sesiones prácticas personalizadas para aprender programación e inteligencia artificial.', icon: '🎓' }
      ]
    },
    projects: {
      label: 'Portfolio / 03',
      title: 'Proyectos',
      items: [
        {
          id: '01',
          title: 'Schneider Electric',
          category: 'Enterprise / Industria',
          year: '2024',
          role: 'Full Stack Engineer',
          image: IMAGES.schneider,
          url: 'https://www.se.com/es/es/',
          stack: ['PHP', 'CodeIgniter', 'MySQL', 'Git', 'Postman', 'Docker'],
          description:
            'Mantenimiento y evolución de plataforma industrial en entorno corporativo internacional. Desarrollo full-stack crítico en producción.'
        },
        {
          id: '02',
          title: 'Myker Academy',
          category: 'Corporativo / EdTech',
          year: '2025',
          role: 'Lead Developer',
          image: IMAGES.myker,
          url: 'https://mykeracademy.com/',
          stack: ['Google AI Studio', 'React', 'TypeScript', 'Tailwind', 'npm', 'SEO'],
          description:
            'Diseño y desarrollo de web corporativa para escuela de idiomas con enfoque en captación de leads y posicionamiento de marca.'
        },
        {
          id: '03',
          title: 'Project Architecture Planner',
          category: 'AI Architecture / Dev Tool',
          year: '2024',
          role: 'AI Product Engineer',
          image: IMAGES.ai,
          url: 'https://chatgpt.com/g/g-699de200e9c481919b02f30b73bc79bb-project-architecture-planner',
          stack: ['GPT', 'OpenAI', 'System Design'],
          description:
            'Asistente de arquitectura de software basado en IA que ayuda a diseñar la estructura técnica de proyectos digitales.'
        },
        {
          id: '04',
          title: 'Cro&Txet',
          category: 'E-commerce / Handmade',
          year: '2025',
          role: 'Full Stack Developer',
          image: IMAGES.crotxet,
          url: 'https://www.croandtxet.cat/',
          stack: ['React', 'TypeScript', 'Tailwind', 'Vercel', 'EmailJS', 'i18n', 'SEO'],
          description:
            'Tienda online de bolsos hechos a mano. Experiencia de compra cuidada, catálogo visual, multi-idioma y enfoque en marca para convertir visitas en pedidos.'
        },
        {
          id: '05',
          title: 'JP Preparation',
          category: 'Deportivo / Tecnificación',
          year: '2025',
          role: 'Full Stack Developer',
          image: IMAGES.jpprep,
          url: 'https://www.jppreparation.com/',
          stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'PHP', 'CodeIgniter 4', 'Docker'],
          description:
            'Diseño y desarrollo del sitio web y la plataforma de gestión de JP Preparation, escuela de tecnificación de fútbol. Un proyecto totalmente responsivo, con un diseño limpio y cuidado que refuerza la identidad de la escuela.'
        },
      ]
    },
    skills: {
      label: 'Stack / 04',
      intro: 'Arquitectura',
      introHighlight1: 'Full Stack',
      introConnector: 'sólida y soluciones de',
      introHighlight2: 'Automatización e IA',
      items: COMMON_SKILLS
    },
    experience: {
      label: 'History / 05',
      items: [
        {
          id: 'exp1',
          company: 'Tempel Group',
          role: 'Full Stack Developer',
          period: '03/2026 – 06/2026',
          achievements: [
            'Desarrollo y mantenimiento del ecosistema web internacional, garantizando escalabilidad, consistencia de marca y correcta localización multilingüe',
            'Diseño e implementación de landing pages y sitios corporativos optimizados para la conversión de campañas de marketing, eventos y lanzamientos de producto',
            'Creación desde cero de aplicaciones web a medida para optimizar procesos internos, priorizando una arquitectura limpia y un backend eficiente',
            'Stack: WordPress, PHP, MySQL, JavaScript, Tailwind CSS, REST API, Git'
          ]
        },
        {
          id: 'exp2',
          company: 'Devinet',
          role: 'Full Stack Developer',
          period: '02/2024 – 01/2026',
          achievements: [
            'Desarrollo y mantenimiento de aplicaciones web escalables con código limpio para facilitar la evolución del producto',
            'Colaboración proactiva en equipos multidisciplinarios bajo metodologías ágiles',
            'Optimización de la interfaz de usuario mediante diseño responsivo y mejoras de UX',
            'Stack: CodeIgniter, MySQL, AWS, API REST, jQuery, Desarrollo de IA'
          ]
        },
        {
          id: 'exp3',
          company: 'Tenea',
          role: 'Backend Developer',
          period: '10/2023 – 01/2024',
          achievements: [
            'Actualizaciones y mantenimiento del sistema para clientes corporativos',
            'Mejora de la fiabilidad y el rendimiento del backend',
            'Stack: React, Node.js, RxJS, Symfony, MySQL'
          ]
        },
        {
          id: 'exp4',
          company: 'Vilax',
          role: 'Prácticas de desarrollo web',
          period: '01/2023 – 09/2023',
          achievements: [
            'Creación y mantenimiento de sitios web utilizando tecnologías modernas',
            'Gestión de productos en diversas plataformas de comercio electrónico',
            'Implementación de SEO para mejorar la visibilidad en buscadores',
            'Stack: WordPress, PHP, Tailwind CSS, SEO, Figma, Google Analytics'
          ]
        },
        {
          id: 'exp5',
          company: 'Farmacia y Salud Digital',
          role: 'Prácticas en Operaciones Digitales',
          period: '01/2022 – 06/2022',
          achievements: [
            'Gestión de productos para múltiples tiendas de comercio electrónico',
            'Implementación de mejoras SEO para optimizar la presencia online',
            'Stack: SEO, WordPress, MySQL'
          ]
        }
      ]
    },
    contact: {
      label: 'Collaborate / 06',
      freelanceLabel: 'Servicios Freelance y Empresa',
      socialLabel: 'Social',
      formName: 'Tu Nombre',
      formEmail: 'Tu correo electrónico',
      formIdea: 'Proyecto / Idea',
      btn: 'Enviar Solicitud',
      footerText: 'Sergi Mallén © 2026',
      footerLoc: 'Basado en Colònia Güell, Barcelona',
      footerRole: 'Full Stack Logic'
    }
  },

  cat: {
    nav: { projects: 'Projectes', about: 'Perfil', contact: 'Contacte', cv: 'CV' },
    hero: {
      subtitle: 'Full Stack Developer • MallenK • AI Integration',
      cta: 'Veure Projectes',
      scroll: 'Scroll to Explore'
    },
    about: {
      label: 'Perfil / 01',
      title: 'Desenvolupador Full Stack amb més de 4 anys construint',
      highlight: 'PRODUCTES ESCALABLES',
      p1: 'llocs corporatius i aplicacions web funcionals per a clients i equips de producte.',
      p2: "Expert en HTML, CSS, JavaScript, PHP i MySQL, amb un sòlid coneixement tant del desenvolupament frontend com backend. M'implico plenament en cada projecte, prioritzant un codi net, una estructura lògica i l'eficiència."
    },
    services: {
      label: 'Core / 02',
      title: 'Serveis',
      items: [
        {
          title: 'Web Corporativa Premium',
          desc: 'Desenvolupament de webs professionals orientades a conversió i marca.',
          icon: '💎',
          url: 'https://mykeracademy.com/'
        },
        {
          title: 'SaaS & Apps a Mida',
          desc: 'Construcció de plataformes escalables i productes digitals.',
          icon: '🚀',
          url: 'https://mallenk.github.io/Plantilla-Plataforma-Academia-Escolar/'
        },
        {
          title: 'Automatització Processos',
          desc: 'Optimització de fluxos interns i sistemes empresarials.',
          icon: '⚙️'
        },
        {
          title: 'Integració IA',
          desc: 'Chatbots, anàlisi de dades i assistents intel·ligents.',
          icon: '🧠',
          action: 'open-ai-chat'
        },
        {
          title: 'Consultoria i Auditoria Web',
          desc: "Anàlisi tècnic, avaluació de rendiment i arquitectura, auditoria d'experiència d'usuari i definició de plans de millora amb recomanacions accionables per a productes digitals.",
          icon: '🔍'
        },
        {
          title: 'Classes Programació/IA',
          desc: 'Sessions pràctiques personalitzades per aprendre programació i intel·ligència artificial.',
          icon: '🎓'
        }
      ]
    },
    projects: {
      label: 'Portfolio / 03',
      title: 'Projectes',
      items: [
        {
          id: '01',
          title: 'Schneider Electric',
          category: 'Enterprise / Indústria',
          year: '2024',
          role: 'Full Stack Engineer',
          image: IMAGES.schneider,
          url: 'https://www.se.com/es/es/',
          stack: ['PHP', 'CodeIgniter', 'MySQL', 'Git', 'Postman', 'Docker'],
          description:
            'Manteniment i evolució d’una plataforma industrial en un entorn corporatiu internacional. Desenvolupament full-stack crític en producció.'
        },
        {
          id: '02',
          title: 'Myker Academy',
          category: 'Corporatiu / EdTech',
          year: '2025',
          role: 'Lead Developer',
          image: IMAGES.myker,
          url: 'https://mykeracademy.com/',
          stack: ['Google AI Studio', 'React', 'TypeScript', 'Tailwind', 'npm', 'SEO'],
          description:
            'Disseny i desenvolupament de web corporativa per a una escola d’idiomes, amb enfocament en la captació de leads, el posicionament de marca i l’escalabilitat digital.'
        },
        {
          id: '03',
          title: 'Project Architecture Planner',
          category: 'Arquitectura IA / Eina Dev',
          year: '2024',
          role: 'AI Product Engineer',
          image: IMAGES.ai,
          url: 'https://chatgpt.com/g/g-699de200e9c481919b02f30b73bc79bb-project-architecture-planner',
          stack: ['GPT', 'OpenAI', 'System Design'],
          description:
            'Assistent d’arquitectura de software basat en IA que ajuda a dissenyar l’estructura tècnica de projectes digitals.'
        },
        {
          id: '04',
          title: 'Cro&Txet',
          category: 'E-commerce / Handmade',
          year: '2025',
          role: 'Full Stack Developer',
          image: IMAGES.crotxet,
          url: 'https://www.croandtxet.cat/',
          stack: ['React', 'TypeScript', 'Tailwind', 'Vercel', 'EmailJS', 'i18n', 'SEO'],
          description:
            'Botiga online de bolsos fets a mà. Experiència de compra cuidada, catàleg visual, multi-idioma i enfocament en marca per convertir visites en comandes.'
        },
        {
          id: '05',
          title: 'JP Preparation',
          category: 'Esportiu / Tecnificació',
          year: '2025',
          role: 'Full Stack Developer',
          image: IMAGES.jpprep,
          url: 'https://www.jppreparation.com/',
          stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'PHP', 'CodeIgniter 4', 'Docker'],
          description:
            "Disseny i desenvolupament del lloc web i la plataforma de gestió de JP Preparation, escola de tecnificació de futbol. Un projecte totalment responsiu, amb un disseny net i acurat que reforça la identitat de l'escola."
        },
      ]
    },
    skills: {
      label: 'Stack / 04',
      intro: 'Arquitectura',
      introHighlight1: 'Full Stack',
      introConnector: 'sòlida i solucions de',
      introHighlight2: 'Automatització i IA',
      items: COMMON_SKILLS
    },
    experience: {
      label: 'History / 05',
      items: [
        {
          id: 'exp1',
          company: 'Tempel Group',
          role: 'Full Stack Developer',
          period: '03/2026 – 06/2026',
          achievements: [
            "Desenvolupament i manteniment de l'ecosistema web internacional, garantint l'escalabilitat, la consistència de marca i la correcta localització multilingüe",
            'Disseny i implementació de landing pages i llocs corporatius optimitzats per a la conversió de campanyes de màrqueting, esdeveniments i llançaments de producte',
            "Creació des de zero d'aplicacions web a mida per optimitzar processos interns, prioritzant una arquitectura neta i un backend eficient",
            'Stack: WordPress, PHP, MySQL, JavaScript, Tailwind CSS, REST API, Git'
          ]
        },
        {
          id: 'exp2',
          company: 'Devinet',
          role: 'Full Stack Developer',
          period: '02/2024 – 01/2026',
          achievements: [
            "Desenvolupament i manteniment d'aplicacions web escalables amb codi net per facilitar l'evolució del producte",
            "Col·laboració proactiva en equips multidisciplinaris sota metodologies àgils",
            "Optimització de la interfície d'usuari mitjançant disseny responsiu i millores d'UX",
            "Stack: CodeIgniter, MySQL, AWS, API REST, jQuery, Desenvolupament d'IA"
          ]
        },
        {
          id: 'exp3',
          company: 'Tenea',
          role: 'Backend Developer',
          period: '10/2023 – 01/2024',
          achievements: [
            'Actualitzacions i manteniment del sistema per a clients corporatius',
            'Millora de la fiabilitat i el rendiment del backend',
            'Stack: React, Node.js, RxJS, Symfony, MySQL'
          ]
        },
        {
          id: 'exp4',
          company: 'Vilax',
          role: 'Pràctiques de desenvolupament web',
          period: '01/2023 – 09/2023',
          achievements: [
            'Creació i manteniment de llocs web utilitzant tecnologies modernes',
            'Gestió de productes en diverses plataformes de comerç electrònic',
            'Implementació de SEO per millorar la visibilitat en cercadors',
            'Stack: WordPress, PHP, Tailwind CSS, SEO, Figma, Google Analytics'
          ]
        },
        {
          id: 'exp5',
          company: 'Farmacia y Salud Digital',
          role: 'Pràctiques en Operacions Digitals',
          period: '01/2022 – 06/2022',
          achievements: [
            'Gestió de productes per a múltiples botigues de comerç electrònic',
            'Implementació de millores SEO per optimitzar la presència online',
            'Stack: SEO, WordPress, MySQL'
          ]
        }
      ]
    },
    contact: {
      label: 'Collaborate / 06',
      freelanceLabel: 'Freelance i entorn corporatiu',
      socialLabel: 'Social',
      formName: 'El teu Nom',
      formEmail: 'El teu correu electrònic',
      formIdea: 'Projecte / Idea',
      btn: 'Enviar Sol·licitud',
      footerText: 'Sergi Mallén © 2026',
      footerLoc: 'Basat a Colònia Güell, Barcelona',
      footerRole: 'Full Stack Logic'
    }
  },

  en: {
    nav: { projects: 'Projects', about: 'Profile', contact: 'Contact', cv: 'CV' },
    hero: {
      subtitle: 'Full Stack Developer • MallenK • AI Integration',
      cta: 'View Projects',
      scroll: 'Scroll to Explore'
    },
    about: {
      label: 'Profile / 01',
      title: 'Full Stack Developer with 4+ years building',
      highlight: 'SCALABLE PRODUCTS',
      p1: 'corporate sites and functional web applications for clients and product teams.',
      p2: 'Skilled in HTML, CSS, JavaScript, PHP, and MySQL, with solid knowledge of both frontend and backend development. I fully commit to every project, prioritizing clean code, a logical structure, and efficiency.'
    },
    services: {
      label: 'Core / 02',
      title: 'Services',
      items: [
        {
          title: 'Premium Corporate Web',
          desc: 'Development of professional websites focused on conversion and branding.',
          icon: '💎',
          url: 'https://mykeracademy.com/'
        },
        {
          title: 'SaaS & Custom Apps',
          desc: 'Construction of scalable platforms and digital products.',
          icon: '🚀',
          url: 'https://mallenk.github.io/Plantilla-Plataforma-Academia-Escolar/'
        },
        {
          title: 'Process Automation',
          desc: 'Optimization of internal workflows and business systems.',
          icon: '⚙️'
        },
        {
          title: 'AI Integration',
          desc: 'Chatbots, data analysis, and intelligent assistants.',
          icon: '🧠',
          action: 'open-ai-chat'
        },
        {
          title: 'Web Consulting & Audit',
          desc: 'Technical analysis, performance and architecture evaluation, UX audit, and definition of improvement plans with actionable recommendations for digital products.',
          icon: '🔍'
        },
        {
          title: 'Coding/AI Mentoring',
          desc: 'Personalized practical sessions to learn programming and artificial intelligence.',
          icon: '🎓'
        }
      ]
    },
    projects: {
      label: 'Portfolio / 03',
      title: 'Projects',
      items: [
        {
          id: '01',
          title: 'Schneider Electric',
          category: 'Enterprise / Industry',
          year: '2024',
          role: 'Full Stack Engineer',
          image: IMAGES.schneider,
          url: 'https://www.se.com/es/es/',
          stack: ['PHP', 'CodeIgniter', 'MySQL', 'Git', 'Postman', 'Docker'],
          description:
            'Maintenance and evolution of an industrial platform within an international corporate environment. Critical full-stack development in production.'
        },
        {
          id: '02',
          title: 'Myker Academy',
          category: 'Corporate / EdTech',
          year: '2025',
          role: 'Lead Developer',
          image: IMAGES.myker,
          url: 'https://mykeracademy.com/',
          stack: ['Google AI Studio', 'React', 'TypeScript', 'Tailwind', 'npm', 'SEO'],
          description:
            'Design and development of a corporate website for a language school, focused on lead generation, brand positioning, and scalable digital presence.'
        },
        {
          id: '03',
          title: 'Project Architecture Planner',
          category: 'AI Architecture / Dev Tool',
          year: '2024',
          role: 'AI Product Engineer',
          image: IMAGES.ai,
          url: 'https://chatgpt.com/g/g-699de200e9c481919b02f30b73bc79bb-project-architecture-planner',
          stack: ['GPT', 'OpenAI', 'System Design'],
          description:
            'AI-powered software architecture assistant designed to help structure digital projects.'
        },
        {
          id: '04',
          title: 'Cro&Txet',
          category: 'E-commerce / Handmade',
          year: '2025',
          role: 'Full Stack Developer',
          image: IMAGES.crotxet,
          url: 'https://www.croandtxet.cat/',
          stack: ['React', 'TypeScript', 'Tailwind', 'Vercel', 'EmailJS', 'i18n', 'SEO'],
          description:
            'Handmade bags online store. Crafted shopping experience, visual catalog, multi-language support, and brand-focused UX to convert visits into orders.'
        },
        {
          id: '05',
          title: 'JP Preparation',
          category: 'Sports / Player Development',
          year: '2025',
          role: 'Full Stack Developer',
          image: IMAGES.jpprep,
          url: 'https://www.jppreparation.com/',
          stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'PHP', 'CodeIgniter 4', 'Docker'],
          description:
            "Design and development of the website and management platform for JP Preparation, a football player-development academy. A fully responsive project with a clean, polished design crafted to reinforce the school's identity."
        },
      ]
    },
    skills: {
      label: 'Stack / 04',
      intro: 'Solid',
      introHighlight1: 'Full Stack Architecture',
      introConnector: 'built for',
      introHighlight2: 'Automation & AI',
      items: COMMON_SKILLS
    },
    experience: {
      label: 'History / 05',
      items: [
        {
          id: 'exp1',
          company: 'Tempel Group',
          role: 'Full Stack Developer',
          period: '03/2026 – 06/2026',
          achievements: [
            'Development and maintenance of the international web ecosystem, ensuring scalability, brand consistency, and proper multilingual localization',
            'Design and implementation of landing pages and corporate sites optimized for conversion across marketing campaigns, events, and product launches',
            'Built custom web applications from scratch to streamline internal processes, prioritizing clean architecture and an efficient backend',
            'Stack: WordPress, PHP, MySQL, JavaScript, Tailwind CSS, REST API, Git'
          ]
        },
        {
          id: 'exp2',
          company: 'Devinet',
          role: 'Full Stack Developer',
          period: '02/2024 – 01/2026',
          achievements: [
            'Development and maintenance of scalable web applications with clean code to ease product evolution',
            'Proactive collaboration in multidisciplinary teams under agile methodologies',
            'UI optimization through responsive design and UX improvements',
            'Stack: CodeIgniter, MySQL, AWS, REST API, jQuery, AI Development'
          ]
        },
        {
          id: 'exp3',
          company: 'Tenea',
          role: 'Backend Developer',
          period: '10/2023 – 01/2024',
          achievements: [
            'System updates and maintenance for corporate clients',
            'Improved backend reliability and performance',
            'Stack: React, Node.js, RxJS, Symfony, MySQL'
          ]
        },
        {
          id: 'exp4',
          company: 'Vilax',
          role: 'Web Development Internship',
          period: '01/2023 – 09/2023',
          achievements: [
            'Creation and maintenance of websites using modern web technologies',
            'Product management across multiple e-commerce platforms',
            'SEO implementation to improve search engine visibility',
            'Stack: WordPress, PHP, Tailwind CSS, SEO, Figma, Google Analytics'
          ]
        },
        {
          id: 'exp5',
          company: 'Farmacia y Salud Digital',
          role: 'Digital Operations Internship',
          period: '01/2022 – 06/2022',
          achievements: [
            'Product management for multiple e-commerce stores',
            'Implementation of SEO improvements to optimize online presence',
            'Stack: SEO, WordPress, MySQL'
          ]
        }
      ]
    },
    contact: {
      label: 'Collaborate / 06',
      freelanceLabel: 'Freelance & Enterprise',
      socialLabel: 'Social',
      formName: 'Your Name',
      formEmail: 'Your email',
      formIdea: 'Project / Idea',
      btn: 'Send Request',
      footerText: 'Sergi Mallén © 2026',
      footerLoc: 'Based in Colònia Güell, Barcelona',
      footerRole: 'Full Stack Logic'
    }
  }
};
