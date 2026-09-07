# Design — UN MAPA

<!-- impeccable:design v1 · canon path · reference: nicoborja.com · code-led -->

Recorded from the built world. Ground truth over intention.

## Concept

The portfolio opens as **one living constellation** — Sergi's work as a navigable map of
connected nodes on a starfield. The centre node is MallenK; five primary nodes (Perfil,
Proyectos, Experiencia, Servicios, Contacto) orbit it, with real project and company names as
satellites on desktop. Click a node → the page scrolls to that section. Below the map, each
section is a quiet, scannable block in the same technical language. *"Net results. No noise."*

Reference the user pinned: nicoborja.com (Awwwards nominee). Executed as its canon, played
straight — not a copy of that site, an original build carrying Sergi's real content.

Refuses: the accent-colour icon-grid portfolio; the kinetic-type dark hero.

## Palette

Theme-aware. Dark is default; light is first-class (toggle top-right, persisted).

| role | dark | light |
|---|---|---|
| background | `#0a0a0c` | `#f4f2ec` |
| raised (`--bg-2`) | `#101015` | `#eae7df` |
| text (`--fg`) | `#edeae3` | `#17161a` |
| dim text (`--fg-dim`) | `#9a978f` | `#57554e` |
| faint (`--fg-faint`) | `#63615c` | `#8b887f` |
| hairline (`--hair`) | `#23232b` | `#d3cfc4` |
| **accent** (`--accent`) | `#e0619e` | `#c03f7c` |

Color strategy: **near-monochrome + one rationed accent.** Magenta appears only on: active /
hovered map nodes and their lit edges, the "en producción" project marker, form focus, link
hover, and the active language. Never as a fill, never decoration. Everything structural is
bone-on-ink (or ink-on-paper) with hairline rules.

Tokens live in `index.css`: static values in `@theme`, theme-swappable values as `--bg`,
`--fg`, `--accent`, … on `:root` / `:root[data-theme="light"]`, aliased back into Tailwind as
`bg-bg`, `text-fg`, `border-hair`, `text-accent`, etc. so utilities follow the theme.

## Type

- **Spline Sans Mono** — the interface / notation voice. Wide-tracked uppercase: the wordmark,
  nav, section tags (`.tag`, 0.24em), map labels, stack lists, buttons, the `SERGI MALLÉN`
  hero lockup. `.tag-n` (0.1em, tabular) for numeric indices so `01 / 02` don't split.
- **Spline Sans** — body copy only. Leads at `clamp(1.4–2.1rem)`, body at 14–15px, measure
  ≤ 58ch.
- Numerals: `tnum` wherever compared.

## The map (`components/map/`)

- `Constellation.tsx` — one 2D `<canvas>` filling the hero (`100svh`). Draws a parallax
  starfield + a spring-settled node graph. No three.js; crisp at any DPR, cheap on GH Pages.
- `graph.ts` — builds nodes/edges from content. Primaries are hand-placed (all clear of the
  central wordmark band). Satellites fan outward from each primary, **desktop only**; on
  `< 640px` the map is primaries-only with labels centred below each node.
- Physics: spring-to-home + local repulsion + pointer push, heavy damping — alive but calm.
  `prefers-reduced-motion` → static layout, no rAF, hover/click still work.
- Interaction: drag the canvas to pan (springs back); hover a node → magenta label + lit
  chain; click a node → `scrollToId(target)`. Palette is re-read from CSS vars on resize, so
  the theme toggle repaints the canvas.

## Sections (`components/ui.tsx` → `Section`)

Every section: `border-t border-hair`, `py-20 md:py-28`, `max-w-6xl`, a `tag-n` index + `.tag`
name, optional lead `h2`, then content. `Reveal` (IntersectionObserver → `.in`, CSS
transition, disabled under reduced motion) staggers entries.

- **Perfil** — big lead + body; STACK as a 4-row hairline list (category · skill list).
- **Proyectos** — 5 numbered rows, each a link: title (→ accent on hover), `en producción`
  marker, category · year, description, mono stack tags, `ROL` + `OPEN ↗`. No images — the
  stock photos are omitted rather than shown as if they were real screenshots.
- **Experiencia** — 5-row timeline; `período` in the left column, role · company, achievements
  as `—`-led lines.
- **Servicios** — 6 rows; number · title (+ inline `→` when it links) · description. The AI
  row opens the chatbox.
- **Contacto** — line, direct email + copy button, social links, EmailJS form (name / email /
  idea, hairline fields, real sending / sent / error states), 3-up footer.

## Motion

One idea: the map breathing under the pointer. Sections get a single quiet `Reveal` rise.
Lenis smooth scroll (off under reduced motion). Nav hides on scroll-down, shows on scroll-up.

## Preserved

Trilingual es / cat / en (`constants.tsx` → `TRANSLATIONS`, typed by `PortfolioContent`).
EmailJS. GitHub Pages base path. The full easter-egg layer — dev console (`mallenk`),
`CheatSheet`, Time Travel, Glitch, Messi, Navbar egg — intact; only the FABs were rethemed to
the ink/accent palette. `#portfolio-content` wrapper kept for their selectors.

## Known residual polish

- Hero: the `core`→`contacto` edge and the role/tagline lines cross; the wordmark's soft
  shadow carries legibility but a nudge could separate them.
- CheatSheet / Chatbox panels still carry old zinc styling inside; only the FABs are rethemed.
- Bundle is one 453 KB chunk (framer-motion + gsap + react); could code-split.
- Mobile hero has generous empty space below the fold (title-screen intent).
