# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

One page, three audiences:
- **Recruiters / technical leads** evaluating a hire — want fast proof of experience, stack depth, clarity.
- **Freelance / enterprise clients** commissioning websites, SaaS, apps, automation, or AI integration — want services, outcomes, trust.
- **Developer peers / the Awwwards-style community** — judge on execution craft.

## Product Purpose

Personal portfolio of Sergi Mallén ("MallenK"), Full Stack Engineer with 4+ years (frontend + backend) and AI integration. Exists to win job offers and freelance projects and to leave a memorable impression on peers. Success = qualified contact + a strong craft impression. The site itself is the strongest work sample.

## Positioning

Full Stack engineer who ships scalable products in real corporate production (Schneider Electric, Tempel Group, international web ecosystems) AND builds brand-focused client sites and AI tools. The combination — enterprise backend discipline + conversion frontend + AI/automation — is the differentiator. Based in Colònia Güell, Barcelona.

## Operating Context

Single-page scrolling site. Sections: Perfil, Proyectos, Experiencia, Servicios, Contacto.
- Trilingual: es / cat (default) / en. Language persists to localStorage.
- Contact form via EmailJS.
- CV = downloadable PDF at `public/cv.pdf`.
- Deployed to GitHub Pages (`npm run deploy`; base path `/Portfolio/`). Vite + React 18 + TS + Tailwind v4.
- An AI chatbox is reachable from the page and from a Services item (`action: 'open-ai-chat'`).

## Capabilities and Constraints

- Stack fixed: React 18, TypeScript, Vite 6, Tailwind v4, GSAP + ScrollTrigger, Framer Motion, @emailjs/browser, gh-pages.
- All copy lives in `constants.tsx` (`TRANSLATIONS`, es/cat/en) typed by `types.ts` (`PortfolioContent`). All three locales ship together.
- Must build static under a GitHub Pages sub-path (`import.meta.env.BASE_URL`).
- Custom cursor is desktop / fine-pointer only.

## Brand Commitments

- **Alias "MallenK" is binding** alongside the real name "Sergi Mallén".
- **Easter-egg layer is binding:** hidden dev mode unlocked by typing `mallenk`, a floating "System Override" cheat sheet, Time Travel (retro/future), Glitch FX, Messi Mode, Navbar egg, a console signature. May be restyled; feature set stays.
- Palette / typography are NOT binding — open to full replacement.
- Voice: confident, technical, product-minded. Bilingual professional, Barcelona.

## Evidence on Hand

- Real employment: Tempel Group, Devinet, Tenea, Vilax, Farmacia y Salud Digital (`constants.tsx` → experience).
- Real projects with live URLs: Schneider Electric, Myker Academy (mykeracademy.com), Project Architecture Planner (GPT), Cro&Txet (croandtxet.cat), JP Preparation (jppreparation.com).
- Project images are generic Unsplash stock — no real screenshots on hand; do not present stock as real client work without noting it.
- Contact: sergimallenweb@gmail.com, GitHub (MallenK), LinkedIn, Instagram (mallenk18), WhatsApp (+34 670 248 461). CV at `public/cv.pdf`.
- No testimonials / metrics / press — do not fabricate.

## Product Principles

1. Prove capability, don't just decorate — the site is the work sample.
2. One page must satisfy a recruiter, a client, and a developer without diluting any.
3. Real facts only. No invented social proof.
4. Trilingual parity is non-negotiable.
5. Delight is earned through hidden depth (easter eggs), never noise in the main flow.

## Accessibility & Inclusion

No formal standard. Baseline: keyboard-navigable, respects `prefers-reduced-motion`, sufficient contrast, custom cursor never blocks interaction, light + dark themes both legible.
