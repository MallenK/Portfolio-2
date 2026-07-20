
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
  link?: string;
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
  title: string
  desc: string
  icon: string
  url?: string
  action?: string
}

export interface PortfolioContent {
  nav: {
    projects: string;
    about: string;
    contact: string;
    cv: string;
  };
  hero: {
    subtitle: string;
    cta: string;
    scroll: string;
  };
  about: {
    label: string;
    title: string;
    p1: string;
    p2: string;
    highlight: string;
  };
  services: {
    label: string;
    title: string;
    items: Service[];
  };
  projects: {
    label: string;
    title: string;
    items: Project[];
  };
  skills: {
    label: string;
    intro: string;
    introHighlight1: string;
    introConnector: string;
    introHighlight2: string;
    items: SkillGroup[];
  };
  experience: {
    label: string;
    items: Experience[];
  };
  contact: {
    label: string;
    freelanceLabel: string;
    socialLabel: string;
    formName: string;
    formEmail: string;
    formIdea: string;
    btn: string;
    footerText: string;
    footerLoc: string;
    footerRole: string;
  };
}
