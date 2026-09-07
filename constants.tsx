import { PortfolioContent } from './types';

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

export const SOCIAL_LINKS = {
  email: 'sergimallenweb@gmail.com',
  linkedin: 'https://www.linkedin.com/in/sergi-mallen',
  github: 'https://github.com/MallenK',
  instagram: 'https://instagram.com/mallenk18',
  whatsapp: 'https://wa.me/34670248461'
};

const COMMON_SKILLS = [
  { category: 'Frontend', skills: ['HTML', 'CSS / SASS', 'JavaScript', 'TypeScript', 'React', 'Bootstrap'] },
  { category: 'Backend', skills: ['PHP', 'CodeIgniter', 'Symfony', 'Node.js', 'MySQL', 'API REST'] },
  { category: 'Tooling', skills: ['Git', 'Docker', 'Agile', 'WordPress'] },
  { category: 'Marketing & Data', skills: ['Google Analytics & GTM', 'CRO', 'SEO'] }
];

const projectBase = [
  {
    id: '01',
    title: 'Schneider Electric',
    year: '2024',
    url: 'https://www.se.com/es/es/',
    image: IMAGES.schneider,
    live: true,
    stack: ['PHP', 'CodeIgniter', 'MySQL', 'Git', 'Postman', 'Docker']
  },
  {
    id: '02',
    title: 'Myker Academy',
    year: '2025',
    url: 'https://mykeracademy.com/',
    image: IMAGES.myker,
    live: true,
    stack: ['Google AI Studio', 'React', 'TypeScript', 'Tailwind', 'npm', 'SEO']
  },
  {
    id: '03',
    title: 'Project Architecture Planner',
    year: '2024',
    url: 'https://chatgpt.com/g/g-699de200e9c481919b02f30b73bc79bb-project-architecture-planner',
    image: IMAGES.ai,
    live: true,
    stack: ['GPT', 'OpenAI', 'System Design']
  },
  {
    id: '04',
    title: 'Cro&Txet',
    year: '2025',
    url: 'https://www.croandtxet.cat/',
    image: IMAGES.crotxet,
    live: true,
    stack: ['React', 'TypeScript', 'Tailwind', 'Vercel', 'EmailJS', 'i18n', 'SEO']
  },
  {
    id: '05',
    title: 'JP Preparation',
    year: '2025',
    url: 'https://www.jppreparation.com/',
    image: IMAGES.jpprep,
    live: true,
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'PHP', 'CodeIgniter 4', 'Docker']
  }
];

const merge = (
  loc: { category: string; role: string; description: string }[]
) => projectBase.map((p, i) => ({ ...p, ...loc[i] }));

export const TRANSLATIONS: Record<'es' | 'en' | 'cat', PortfolioContent> = {
  /* ---------------------------------------------------------- ES */
  es: {
    meta: {
      name: 'Sergi Mallén',
      alias: 'MallenK',
      role: 'Full Stack Engineer · Integración de IA',
      tagline: 'Sistemas que aguantan en producción. Sin ruido.',
      location: 'Colònia Güell, Barcelona'
    },
    nav: {
      perfil: 'Perfil',
      proyectos: 'Proyectos',
      experiencia: 'Experiencia',
      servicios: 'Servicios',
      contacto: 'Contacto',
      cv: 'CV'
    },
    ui: {
      scroll: 'Baja para explorar',
      mapHint: 'Arrastra el mapa · clic en un nodo para navegar',
      open: 'Abrir',
      live: 'En producción',
      roleLabel: 'Rol',
      copy: 'Copiar',
      copied: 'Copiado',
      send: 'Enviar mensaje',
      sending: 'Enviando…',
      sent: 'Recibido. Respondo en menos de 24 h.',
      error: 'No se pudo enviar. Escríbeme a sergimallenweb@gmail.com.'
    },
    about: {
      tag: 'Perfil',
      lead: 'Cuatro años construyendo sitios corporativos y aplicaciones web para clientes y equipos de producto.',
      body: 'Trabajo el frontend y el backend con la misma exigencia: HTML, CSS, JavaScript, TypeScript, PHP y MySQL. Me implico de lleno en cada proyecto priorizando código limpio, una estructura lógica y la eficiencia. Pienso cada web como un producto, no como una entrega.',
      skillsTag: 'Stack',
      skills: COMMON_SKILLS
    },
    projects: {
      tag: 'Proyectos',
      title: 'Cinco encargos reales, en producción o entregados.',
      items: merge([
        {
          category: 'Enterprise · Industria',
          role: 'Full Stack Engineer',
          description:
            'Mantenimiento y evolución de una plataforma industrial en un entorno corporativo internacional. Desarrollo full-stack crítico en producción.'
        },
        {
          category: 'Corporativo · EdTech',
          role: 'Lead Developer',
          description:
            'Diseño y desarrollo de la web corporativa de una escuela de idiomas, enfocada en captación de leads y posicionamiento de marca.'
        },
        {
          category: 'Arquitectura IA · Herramienta',
          role: 'AI Product Engineer',
          description:
            'Asistente de arquitectura de software basado en IA que ayuda a diseñar la estructura técnica de proyectos digitales.'
        },
        {
          category: 'E-commerce · Handmade',
          role: 'Full Stack Developer',
          description:
            'Tienda online de bolsos hechos a mano. Experiencia de compra cuidada, catálogo visual, multi-idioma y enfoque en marca para convertir visitas en pedidos.'
        },
        {
          category: 'Deportivo · Tecnificación',
          role: 'Full Stack Developer',
          description:
            'Sitio web y plataforma de gestión de JP Preparation, escuela de tecnificación de fútbol. Totalmente responsivo, con un diseño limpio que refuerza la identidad de la escuela.'
        }
      ])
    },
    experience: {
      tag: 'Experiencia',
      title: 'Cinco etapas, de las prácticas al puesto actual.',
      items: [
        {
          id: 'exp1',
          company: 'Tempel Group',
          role: 'Full Stack Developer',
          period: '2026',
          achievements: [
            'Desarrollo y mantenimiento del ecosistema web internacional, garantizando escalabilidad, consistencia de marca y localización multilingüe',
            'Landing pages y sitios corporativos optimizados para la conversión de campañas, eventos y lanzamientos de producto',
            'Aplicaciones web a medida desde cero para procesos internos, con arquitectura limpia y backend eficiente',
            'WordPress, PHP, MySQL, JavaScript, Tailwind CSS, REST API, Git'
          ]
        },
        {
          id: 'exp2',
          company: 'Devinet',
          role: 'Full Stack Developer',
          period: '2024 – 2026',
          achievements: [
            'Aplicaciones web escalables con código limpio para facilitar la evolución del producto',
            'Colaboración proactiva en equipos multidisciplinares bajo metodologías ágiles',
            'Optimización de la interfaz mediante diseño responsivo y mejoras de UX',
            'CodeIgniter, MySQL, AWS, API REST, jQuery, desarrollo de IA'
          ]
        },
        {
          id: 'exp3',
          company: 'Tenea',
          role: 'Backend Developer',
          period: '2023 – 2024',
          achievements: [
            'Actualizaciones y mantenimiento del sistema para clientes corporativos',
            'Mejora de la fiabilidad y el rendimiento del backend',
            'React, Node.js, RxJS, Symfony, MySQL'
          ]
        },
        {
          id: 'exp4',
          company: 'Vilax',
          role: 'Prácticas de desarrollo web',
          period: '2023',
          achievements: [
            'Creación y mantenimiento de sitios web con tecnologías modernas',
            'Gestión de productos en varias plataformas de e-commerce',
            'Implementación de SEO para mejorar la visibilidad en buscadores',
            'WordPress, PHP, Tailwind CSS, SEO, Figma, Google Analytics'
          ]
        },
        {
          id: 'exp5',
          company: 'Farmacia y Salud Digital',
          role: 'Prácticas en operaciones digitales',
          period: '2022',
          achievements: [
            'Gestión de productos para múltiples tiendas de e-commerce',
            'Mejoras SEO para optimizar la presencia online',
            'SEO, WordPress, MySQL'
          ]
        }
      ]
    },
    services: {
      tag: 'Servicios',
      title: 'Lo que puedes contratar. Freelance o para tu equipo.',
      items: [
        { title: 'Web corporativa premium', desc: 'Webs profesionales orientadas a conversión y marca.', url: 'https://mykeracademy.com/' },
        { title: 'SaaS y apps a medida', desc: 'Plataformas escalables y productos digitales desde cero.', url: 'https://mallenk.github.io/Plantilla-Plataforma-Academia-Escolar/' },
        { title: 'Automatización de procesos', desc: 'Optimización de flujos internos y sistemas de empresa.' },
        { title: 'Integración de IA', desc: 'Chatbots, análisis de datos y asistentes inteligentes.', action: 'open-ai-chat' },
        { title: 'Consultoría y auditoría web', desc: 'Análisis técnico, rendimiento, arquitectura y UX, con un plan de mejora accionable.' },
        { title: 'Clases de programación / IA', desc: 'Sesiones prácticas personalizadas para aprender a programar e integrar IA.' }
      ]
    },
    contact: {
      tag: 'Contacto',
      title: 'Cuéntame qué quieres construir.',
      line: 'Disponible para proyectos freelance y para incorporarme a un equipo de producto.',
      directLabel: 'Directo',
      socialLabel: 'Redes',
      formName: 'Tu nombre',
      formEmail: 'Tu correo',
      formIdea: 'Proyecto o idea',
      footerLoc: 'Colònia Güell, Barcelona',
      footerRole: 'Full Stack Engineer'
    }
  },

  /* ---------------------------------------------------------- CAT */
  cat: {
    meta: {
      name: 'Sergi Mallén',
      alias: 'MallenK',
      role: 'Full Stack Engineer · Integració d’IA',
      tagline: 'Sistemes que aguanten en producció. Sense soroll.',
      location: 'Colònia Güell, Barcelona'
    },
    nav: {
      perfil: 'Perfil',
      proyectos: 'Projectes',
      experiencia: 'Experiència',
      servicios: 'Serveis',
      contacto: 'Contacte',
      cv: 'CV'
    },
    ui: {
      scroll: 'Baixa per explorar',
      mapHint: 'Arrossega el mapa · clic en un node per navegar',
      open: 'Obrir',
      live: 'En producció',
      roleLabel: 'Rol',
      copy: 'Copiar',
      copied: 'Copiat',
      send: 'Enviar missatge',
      sending: 'Enviant…',
      sent: 'Rebut. Responc en menys de 24 h.',
      error: 'No s’ha pogut enviar. Escriu-me a sergimallenweb@gmail.com.'
    },
    about: {
      tag: 'Perfil',
      lead: 'Quatre anys construint llocs corporatius i aplicacions web per a clients i equips de producte.',
      body: 'Treballo el frontend i el backend amb la mateixa exigència: HTML, CSS, JavaScript, TypeScript, PHP i MySQL. M’implico de ple en cada projecte prioritzant codi net, una estructura lògica i l’eficiència. Penso cada web com un producte, no com un lliurament.',
      skillsTag: 'Stack',
      skills: COMMON_SKILLS
    },
    projects: {
      tag: 'Projectes',
      title: 'Cinc encàrrecs reals, en producció o lliurats.',
      items: merge([
        {
          category: 'Enterprise · Indústria',
          role: 'Full Stack Engineer',
          description:
            'Manteniment i evolució d’una plataforma industrial en un entorn corporatiu internacional. Desenvolupament full-stack crític en producció.'
        },
        {
          category: 'Corporatiu · EdTech',
          role: 'Lead Developer',
          description:
            'Disseny i desenvolupament de la web corporativa d’una escola d’idiomes, enfocada en la captació de leads i el posicionament de marca.'
        },
        {
          category: 'Arquitectura IA · Eina',
          role: 'AI Product Engineer',
          description:
            'Assistent d’arquitectura de software basat en IA que ajuda a dissenyar l’estructura tècnica de projectes digitals.'
        },
        {
          category: 'E-commerce · Handmade',
          role: 'Full Stack Developer',
          description:
            'Botiga online de bosses fetes a mà. Experiència de compra cuidada, catàleg visual, multi-idioma i enfocament en marca per convertir visites en comandes.'
        },
        {
          category: 'Esportiu · Tecnificació',
          role: 'Full Stack Developer',
          description:
            'Lloc web i plataforma de gestió de JP Preparation, escola de tecnificació de futbol. Totalment responsiu, amb un disseny net que reforça la identitat de l’escola.'
        }
      ])
    },
    experience: {
      tag: 'Experiència',
      title: 'Cinc etapes, de les pràctiques al lloc actual.',
      items: [
        {
          id: 'exp1',
          company: 'Tempel Group',
          role: 'Full Stack Developer',
          period: '2026',
          achievements: [
            'Desenvolupament i manteniment de l’ecosistema web internacional, garantint escalabilitat, consistència de marca i localització multilingüe',
            'Landing pages i llocs corporatius optimitzats per a la conversió de campanyes, esdeveniments i llançaments de producte',
            'Aplicacions web a mida des de zero per a processos interns, amb arquitectura neta i backend eficient',
            'WordPress, PHP, MySQL, JavaScript, Tailwind CSS, REST API, Git'
          ]
        },
        {
          id: 'exp2',
          company: 'Devinet',
          role: 'Full Stack Developer',
          period: '2024 – 2026',
          achievements: [
            'Aplicacions web escalables amb codi net per facilitar l’evolució del producte',
            'Col·laboració proactiva en equips multidisciplinaris sota metodologies àgils',
            'Optimització de la interfície mitjançant disseny responsiu i millores d’UX',
            'CodeIgniter, MySQL, AWS, API REST, jQuery, desenvolupament d’IA'
          ]
        },
        {
          id: 'exp3',
          company: 'Tenea',
          role: 'Backend Developer',
          period: '2023 – 2024',
          achievements: [
            'Actualitzacions i manteniment del sistema per a clients corporatius',
            'Millora de la fiabilitat i el rendiment del backend',
            'React, Node.js, RxJS, Symfony, MySQL'
          ]
        },
        {
          id: 'exp4',
          company: 'Vilax',
          role: 'Pràctiques de desenvolupament web',
          period: '2023',
          achievements: [
            'Creació i manteniment de llocs web amb tecnologies modernes',
            'Gestió de productes en diverses plataformes d’e-commerce',
            'Implementació de SEO per millorar la visibilitat als cercadors',
            'WordPress, PHP, Tailwind CSS, SEO, Figma, Google Analytics'
          ]
        },
        {
          id: 'exp5',
          company: 'Farmacia y Salud Digital',
          role: 'Pràctiques en operacions digitals',
          period: '2022',
          achievements: [
            'Gestió de productes per a múltiples botigues d’e-commerce',
            'Millores SEO per optimitzar la presència online',
            'SEO, WordPress, MySQL'
          ]
        }
      ]
    },
    services: {
      tag: 'Serveis',
      title: 'El que pots contractar. Freelance o per al teu equip.',
      items: [
        { title: 'Web corporativa premium', desc: 'Webs professionals orientades a conversió i marca.', url: 'https://mykeracademy.com/' },
        { title: 'SaaS i apps a mida', desc: 'Plataformes escalables i productes digitals des de zero.', url: 'https://mallenk.github.io/Plantilla-Plataforma-Academia-Escolar/' },
        { title: 'Automatització de processos', desc: 'Optimització de fluxos interns i sistemes d’empresa.' },
        { title: 'Integració d’IA', desc: 'Chatbots, anàlisi de dades i assistents intel·ligents.', action: 'open-ai-chat' },
        { title: 'Consultoria i auditoria web', desc: 'Anàlisi tècnic, rendiment, arquitectura i UX, amb un pla de millora accionable.' },
        { title: 'Classes de programació / IA', desc: 'Sessions pràctiques personalitzades per aprendre a programar i integrar IA.' }
      ]
    },
    contact: {
      tag: 'Contacte',
      title: 'Explica’m què vols construir.',
      line: 'Disponible per a projectes freelance i per incorporar-me a un equip de producte.',
      directLabel: 'Directe',
      socialLabel: 'Xarxes',
      formName: 'El teu nom',
      formEmail: 'El teu correu',
      formIdea: 'Projecte o idea',
      footerLoc: 'Colònia Güell, Barcelona',
      footerRole: 'Full Stack Engineer'
    }
  },

  /* ---------------------------------------------------------- EN */
  en: {
    meta: {
      name: 'Sergi Mallén',
      alias: 'MallenK',
      role: 'Full Stack Engineer · AI Integration',
      tagline: 'Systems that hold up in production. No noise.',
      location: 'Colònia Güell, Barcelona'
    },
    nav: {
      perfil: 'Profile',
      proyectos: 'Work',
      experiencia: 'Experience',
      servicios: 'Services',
      contacto: 'Contact',
      cv: 'CV'
    },
    ui: {
      scroll: 'Scroll to explore',
      mapHint: 'Drag the map · click a node to navigate',
      open: 'Open',
      live: 'In production',
      roleLabel: 'Role',
      copy: 'Copy',
      copied: 'Copied',
      send: 'Send message',
      sending: 'Sending…',
      sent: 'Received. I reply within 24 h.',
      error: 'Could not send. Email me at sergimallenweb@gmail.com.'
    },
    about: {
      tag: 'Profile',
      lead: 'Four years building corporate sites and web applications for clients and product teams.',
      body: 'I work the frontend and the backend to the same standard: HTML, CSS, JavaScript, TypeScript, PHP and MySQL. I commit fully to every project, prioritising clean code, a logical structure and efficiency. I treat every website as a product, not a deliverable.',
      skillsTag: 'Stack',
      skills: COMMON_SKILLS
    },
    projects: {
      tag: 'Work',
      title: 'Five real briefs, live in production or delivered.',
      items: merge([
        {
          category: 'Enterprise · Industry',
          role: 'Full Stack Engineer',
          description:
            'Maintenance and evolution of an industrial platform inside an international corporate environment. Critical full-stack development in production.'
        },
        {
          category: 'Corporate · EdTech',
          role: 'Lead Developer',
          description:
            'Design and development of a corporate website for a language school, focused on lead generation and brand positioning.'
        },
        {
          category: 'AI Architecture · Tool',
          role: 'AI Product Engineer',
          description:
            'AI-powered software architecture assistant that helps structure the technical shape of digital projects.'
        },
        {
          category: 'E-commerce · Handmade',
          role: 'Full Stack Developer',
          description:
            'Handmade bags online store. Crafted shopping experience, visual catalogue, multi-language and brand-focused UX to turn visits into orders.'
        },
        {
          category: 'Sports · Player Development',
          role: 'Full Stack Developer',
          description:
            'Website and management platform for JP Preparation, a football player-development academy. Fully responsive, with a clean design that reinforces the school’s identity.'
        }
      ])
    },
    experience: {
      tag: 'Experience',
      title: 'Five stages, from the internship to the current role.',
      items: [
        {
          id: 'exp1',
          company: 'Tempel Group',
          role: 'Full Stack Developer',
          period: '2026',
          achievements: [
            'Development and maintenance of the international web ecosystem, ensuring scalability, brand consistency and multilingual localisation',
            'Landing pages and corporate sites optimised for conversion across campaigns, events and product launches',
            'Custom web applications from scratch for internal processes, with clean architecture and an efficient backend',
            'WordPress, PHP, MySQL, JavaScript, Tailwind CSS, REST API, Git'
          ]
        },
        {
          id: 'exp2',
          company: 'Devinet',
          role: 'Full Stack Developer',
          period: '2024 – 2026',
          achievements: [
            'Scalable web applications with clean code to ease product evolution',
            'Proactive collaboration in multidisciplinary teams under agile methodologies',
            'UI optimisation through responsive design and UX improvements',
            'CodeIgniter, MySQL, AWS, REST API, jQuery, AI development'
          ]
        },
        {
          id: 'exp3',
          company: 'Tenea',
          role: 'Backend Developer',
          period: '2023 – 2024',
          achievements: [
            'System updates and maintenance for corporate clients',
            'Improved backend reliability and performance',
            'React, Node.js, RxJS, Symfony, MySQL'
          ]
        },
        {
          id: 'exp4',
          company: 'Vilax',
          role: 'Web Development Internship',
          period: '2023',
          achievements: [
            'Creation and maintenance of websites using modern technologies',
            'Product management across multiple e-commerce platforms',
            'SEO implementation to improve search engine visibility',
            'WordPress, PHP, Tailwind CSS, SEO, Figma, Google Analytics'
          ]
        },
        {
          id: 'exp5',
          company: 'Farmacia y Salud Digital',
          role: 'Digital Operations Internship',
          period: '2022',
          achievements: [
            'Product management for multiple e-commerce stores',
            'SEO improvements to optimise online presence',
            'SEO, WordPress, MySQL'
          ]
        }
      ]
    },
    services: {
      tag: 'Services',
      title: 'What you can hire. Freelance or for your team.',
      items: [
        { title: 'Premium corporate web', desc: 'Professional websites focused on conversion and brand.', url: 'https://mykeracademy.com/' },
        { title: 'SaaS & custom apps', desc: 'Scalable platforms and digital products from scratch.', url: 'https://mallenk.github.io/Plantilla-Plataforma-Academia-Escolar/' },
        { title: 'Process automation', desc: 'Optimisation of internal workflows and business systems.' },
        { title: 'AI integration', desc: 'Chatbots, data analysis and intelligent assistants.', action: 'open-ai-chat' },
        { title: 'Web consulting & audit', desc: 'Technical analysis, performance, architecture and UX, with an actionable improvement plan.' },
        { title: 'Coding / AI mentoring', desc: 'Personalised hands-on sessions to learn coding and AI integration.' }
      ]
    },
    contact: {
      tag: 'Contact',
      title: 'Tell me what you want to build.',
      line: 'Available for freelance projects and to join a product team.',
      directLabel: 'Direct',
      socialLabel: 'Social',
      formName: 'Your name',
      formEmail: 'Your email',
      formIdea: 'Project or idea',
      footerLoc: 'Colònia Güell, Barcelona',
      footerRole: 'Full Stack Engineer'
    }
  }
};
