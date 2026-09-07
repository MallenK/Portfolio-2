export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  stack: string[];
  role: string;
  url: string;
  year: string;
  image: string;
  /** live in production — earns the accent "en producción" marker */
  live?: boolean;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  achievements: string[];
}

export interface SkillGroup {
  category: string;
  skills: string[];
}

export interface Service {
  title: string;
  desc: string;
  url?: string;
  action?: string;
}

export interface PortfolioContent {
  meta: {
    name: string;
    alias: string;
    role: string;
    tagline: string;
    location: string;
  };
  nav: {
    perfil: string;
    proyectos: string;
    experiencia: string;
    servicios: string;
    contacto: string;
    cv: string;
  };
  ui: {
    scroll: string;
    mapHint: string;
    open: string;
    live: string;
    roleLabel: string;
    copy: string;
    copied: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
  };
  about: {
    tag: string;
    lead: string;
    body: string;
    skillsTag: string;
    skills: SkillGroup[];
  };
  projects: {
    tag: string;
    title: string;
    items: Project[];
  };
  experience: {
    tag: string;
    title: string;
    items: Experience[];
  };
  services: {
    tag: string;
    title: string;
    items: Service[];
  };
  contact: {
    tag: string;
    title: string;
    line: string;
    directLabel: string;
    socialLabel: string;
    formName: string;
    formEmail: string;
    formIdea: string;
    footerLoc: string;
    footerRole: string;
  };
}
