# Design — MAPA

<!-- impeccable:design v2 · brief-pinned · palette: Borussia Dortmund · type: Montserrat · code-led -->

Recorded from the built world. Ground truth over intention.

## Concept

The portfolio is **one full-screen map** — no scroll, no stacked sections. Every piece of
information lives on a node of a constellation floating in a bright starfield; clicking a node
opens its **pop-up** with the full content. The interface *is* the map.

Structure carried from the earlier "option B" direction (technical, one accent, hairlines,
progressive detail). Palette and typeface replaced per the user's brief: **Borussia Dortmund**
colours and **Montserrat**.

## Palette

Theme-aware; dark is the committed default, light is a muted variant.

| role | dark | light |
|---|---|---|
| background (`--bg`) | `#000000` | `#f4f3ee` |
| raised (`--bg-2`) | `#0c0c0c` | `#eae8e0` |
| text (`--fg`) | `#f2f2f2` | `#0a0a0a` |
| dim (`--fg-dim`) | `#9a9a9a` | `#565650` |
| faint (`--fg-faint`) | `#5e5e5e` | `#8c8b83` |
| hairline (`--hair`) | `#222222` | `#d6d4ca` |
| **accent** (`--accent`) — fills / markers | `#fde100` (BVB yellow) | `#fde100` |
| **accent-ink** (`--accent-ink`) — accent *text* | `#fde100` | `#8a6d00` (readable gold) |

The yellow is rationed: the active/hovered node and its lit edges, the "en producción"
markers on live project satellites, the core node's ring, form focus, link hover, the active
language. Never a background fill except the contact form's submit-hover. Everything else is
bone-on-black (or ink-on-paper) with hairline rules.

## Type

**Montserrat**, one family, two registers:
- 700 / 800, uppercase, wide tracking (0.12–0.24em) — the wordmark, HUD, node labels, pop-up
  headers, section indices (`.tag`, `.tag-n`).
- 400 / 500 — body copy inside pop-ups.
- Tabular numerals (`.tnum`) on compared figures (periods, indices, counts).

## The map (`components/map/`)

- `Constellation.tsx` — one full-viewport 2D `<canvas>`. A **dense, bright, gently twinkling
  starfield** (≈ one star per 620 px², a few yellow sparks) is the visible atmosphere. Over it,
  a spring-settled node graph: **core** (largest, permanent yellow ring), **5 primaries**
  (Perfil, Proyectos, Experiencia, Servicios, Contacto — each label carries a `· N` count),
  and **satellites** fanned outward (skill groups, project titles, company names, service
  names). Project satellites that are live in production show a small yellow marker.
- `graph.ts` — hand-placed primaries (clear of the wordmark band); satellites capped and
  scaled down on `< 640 px` so the mobile map stays legible.
- Physics: spring-to-home + local repulsion + pointer push, heavy damping. Drag the canvas to
  pan (springs back). Hover → yellow label + lit chain. Click a node → opens its pop-up.
  `prefers-reduced-motion` → static layout, no rAF, no twinkle; interaction still works.
- Palette is re-read from CSS vars on resize, so the theme toggle repaints the canvas.

## Screen (`components/MapScreen.tsx`)

`100svh`, `overflow: hidden` on the body — the whole site is one screen. HUD over the canvas:
- top-left: `MALLENK` wordmark (opens the "Manifiesto" pop-up).
- top-right: CV · language (es / cat / en) · theme toggle.
- bottom: `SERGI MALLÉN` in Montserrat 800 caps + one tagline line + a single `Toca un nodo`
  hint. Anchored low, clear of the constellation and the floating buttons.

## Pop-ups (`components/Popup.tsx` + `PopupContent.tsx`)

`role="dialog"`, `aria-modal`. Mobile: a bottom sheet, `max-h 92svh`, springs up. Desktop:
a centred panel, `max-w 2xl`, `max-h 85vh`, bordered, body scrolls inside. Backdrop scrim
(`--scrim`) + blur; click or `Esc` closes; focus moves into the panel and returns to the
trigger on close; `body.popup-open` locks scroll; `z-index` sits above the easter-egg buttons.

Header: `NN` index + section name + `Cerrar ✕`. Bodies by node:
- **core** — the manifesto statement + a list of the five sections (jump between pop-ups).
- **perfil** — lead + body + the stack as a hairline list.
- **proyectos** — 5 project entries (title → gold on hover, `en producción` marker, category ·
  year · role, description, mono-tracked stack). Each links out. No images — the stock photos
  are omitted rather than shown as if they were real screenshots.
- **experiencia** — 5-entry timeline (period, role · company, `—`-led achievements).
- **servicios** — 6 rows (number · title + inline `→` when it links · description). The AI row
  closes the pop-up and opens the chatbox.
- **contacto** — line, direct email + copy, socials, EmailJS form (real sending / sent / error
  states), 3-up footer.

## Motion

One idea: the starfield and nodes breathing under the pointer. Pop-ups spring in from a
visible resting state. No scroll animation (there is no scroll). Everything honours
`prefers-reduced-motion`.

## Preserved

Trilingual es / cat / en (`constants.tsx` → `TRANSLATIONS`, typed by `PortfolioContent`).
EmailJS. GitHub Pages base path (`viewport-fit=cover` + `100svh` for mobile safe areas).
The full easter-egg layer — dev console (`mallenk`), `CheatSheet`, Time Travel, Glitch,
Messi, Navbar egg — intact; FABs rethemed to the black/yellow palette. `#portfolio-content`
wrapper kept for their selectors.

## Known residual polish

- On the dense desktop map, a couple of satellite dots still graze their primary's label.
- CheatSheet / Chatbox panels still carry old zinc styling inside; only the FABs are rethemed.
- Bundle is one 395 KB chunk (framer-motion + gsap + react + emailjs); could code-split.
- No CV shown inside the map on the smallest phones except the top-right HUD link.
