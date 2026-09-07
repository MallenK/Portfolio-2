# Design — MAPA 3D

<!-- impeccable:design v3 · brief-pinned · BVB palette · Montserrat · vgpu + three + React Bits -->

Recorded from the built world. Ground truth over intention.

## Concept

The portfolio is **one full-screen, orbit-and-zoom 3D map**. Every piece of information lives
on a node of a constellation floating in a WebGPU nebula; clicking a node opens its **pop-up**
with the full content. Three technologies, three jobs:

| layer | tech | job |
|---|---|---|
| featured background | **vgpu** (`vercel-labs/vgpu`, WebGPU) | full-viewport WGSL nebula in BVB black + yellow, reacts to pointer and to camera zoom |
| the map itself | **three.js / R3F** (`@react-three/fiber` 8, drei, postprocessing) | the 3D node graph — orbit, zoom, raycast, bloom, a scale-in "leap" on load |
| sub-screens & links | **React Bits** (`Galaxy`, `AnimatedContent`, `ClickSpark`, `ShinyText`) | pop-up content reveal, click sparks, shimmering accents; Galaxy is also the WebGL fallback background |

## Palette (Borussia Dortmund)

Theme-aware; dark default, light a muted variant. Tokens in `index.css`.

| role | dark | light |
|---|---|---|
| background | `#000000` | `#f4f3ee` |
| text (`--fg`) | `#f2f2f2` | `#0a0a0a` |
| dim / faint | `#9a9a9a` / `#5e5e5e` | `#565650` / `#8c8b83` |
| hairline | `#222222` | `#d6d4ca` |
| **accent** (fills / markers / nodes) | `#fde100` | `#fde100` |
| **accent-ink** (accent as text) | `#fde100` | `#8a6d00` |

Yellow is rationed to: the core node + its ring, hovered/active nodes and lit edges, live
project markers, focus, hover, the active language, and the click sparks. Everything else is
bone-on-black (or ink-on-paper) with hairline rules.

## Type

**Montserrat**, one family. 700 / 800 uppercase, wide tracking for the wordmark, HUD, node
labels and pop-up headers; 400 / 500 for body. Tabular numerals on counts and periods.

## The background (`components/bg/`)

- `Background.tsx` decides at mount: **WebGPU** → `VgpuBackground`; else **WebGL** → React
  Bits `Galaxy` (ogl, `hueShift ≈ 45`, saturated so the stars read yellow, `lightMode` on the
  light theme); else a painted CSS gradient. A vgpu init failure downgrades to Galaxy live.
- `VgpuBackground.tsx` — dynamically imports `vgpu`, opens a `surface` on a fixed canvas, runs
  one `effect` (fbm nebula WGSL, `hsv2rgb` tinted to BVB yellow, star grain, ink-on-paper
  branch for light) in a `frameLoop`. Uniforms (`time`, `aspect`, pointer, `zoom`, `hue`,
  `light`, `reduce`) update per frame from `atmos`.
- `atmos.ts` — a tiny out-of-React store the shader and the 3D scene share: pointer, camera
  `zoom` (written by the R3F rig), accent hue, light flag.

## The 3D map (`components/map/`)

- `Scene3D.tsx` — an R3F `<Canvas>`, lazy-loaded. `graph3d.ts` lifts the 2D constellation into
  3D: hand-placed x/y become the screen-plane spread, z is layered by node kind + a
  deterministic jitter so there is real depth to fly through.
- **Hierarchy**: `core` → 5 `primary` nodes → `satellite` children. **Contacto is a leaf**
  (no children); Perfil / Proyectos / Experiencia / Servicios each own a cluster. Every node
  is its own clickable element with its own destination — a satellite click opens the parent
  section's pop-up *scrolled to and highlighting that specific item* (the `anchor`), and
  project satellites also carry their real outbound URL. `graph3d.ts` builds this directly
  from `content` with per-item data on each node.
- **Nodes have a form derived from what they carry** (`nodes.tsx`) — nothing is a plain
  sphere:
  - **core** — **"Nudo de energía"**: a torus knot (`2,3`) running a custom GLSL shader —
    a flowing fbm energy band with bright sparks over dark valleys, plus a fresnel rim — a
    fresnel halo shell, an inner bare-gold seed and a wide soft glow. Tumbles on two axes,
    breathes. Bloom pushes the band to a glow.
  - **perfil** → an **icosahedron** (facets of a person); its skill children are little
    **cube stacks** whose height is that category's tech count.
  - **proyectos** → a **cube** (something built); its children are **billboard chips showing
    the year**, live ones wearing an orbiting yellow ring.
  - **experiencia** → a **stack of rings** (strata / years); its children are company
    plates, the current job larger with a gold cap.
  - **servicios** → a radiating **burst**; its children are **hexagon badges**.
  - **contacto** → **"Singularidad"**: an event horizon — a bright core, an orbiting
    accretion disc (GLSL, sheared by time), and a faint gravitational-lens shell. Additive
    gold on dark; on the light theme it flips to normal blending in darker gold so it still
    reads on paper. Labelled `→`.
- Hover any node → it lifts toward the camera, a `<Html>` name card appears (`+ abrir →`),
  its edge chain lights and the other clusters dim. Active section is dimmed the same way.
- **Camera** (`<CameraControls>` / `camera-controls`): free flight, like nicoborja.com —
  **left drag trucks the view in every direction**, right drag tumbles to reveal depth,
  wheel / pinch dollies (zoom to cursor); one-finger truck + two-finger dolly-rotate on
  touch. Damped glide (`smoothTime`), a soft `Box3` fence so you can roam wide but never fly
  off, and a slow idle drift that resumes ~2.6 s after you let go. Distance and polar clamps.
- **Minimap** (`Minimap.tsx`) — a top-left plan of the map (`x/z` projection) with a live
  view marker and clickable nodes; "Mapa · estás aquí".
- **Focus**: clicking a node flies the camera to frame it (`setLookAt`, transition) then
  opens the pop-up; closing returns the camera home. `focusId` flows App → MapScreen → Scene3D.
- **Leap**: `GraphGroup` scales + un-twists the whole graph in over ~1.3 s on mount.
- **Bloom**: `EffectComposer` + `Bloom` (subtle, threshold 0.62) so the yellow nodes glow;
  dropped under `prefers-reduced-motion`.
- `Rig` publishes camera distance → `atmos.zoom` so the background shader pushes in as you
  zoom.
- **Fallback**: no WebGL at all → the 2D `Constellation.tsx` (kept). Reduced motion → static
  layout, no auto-rotate, no bloom, no leap; still orbit + zoom.

## Pop-ups (`components/Popup.tsx` + `PopupContent.tsx`)

`role="dialog"`, `aria-modal`. Mobile bottom sheet / desktop centred panel, scrim + blur,
`Esc` / backdrop close, focus managed, `body.popup-open` locks scroll, z above the easter-egg
buttons. Header: index + name + `Cerrar ✕`. Content by node — core (manifesto + jump list),
perfil, proyectos, experiencia, servicios, contacto (EmailJS form).

**React Bits inside:** the content block rises in with `AnimatedContent` (gsap; patched to
play on mount when already on screen); "en producción" markers and the contact email use
`ShinyText` (a yellow shimmer); the whole map is wrapped in `ClickSpark` so every click —
node, button, link — throws a short yellow spark.

## Motion

The leap on load, the nebula drifting under the pointer, the background pushing in with zoom,
pop-ups springing from a visible rest state, click sparks. All gated by `prefers-reduced-motion`.

## Dependencies added (npm registry / official GitHub, MIT, no `postinstall`)

`vgpu@0.4.0` (vercel-labs), `ogl@1.0.11`, `three@0.171.0`, `@react-three/fiber@8.17.10`,
`@react-three/drei@9.117.3`, `@react-three/postprocessing@2.16.3`. React Bits components
copied into `components/reactbits/` from `DavidHDev/react-bits` (source reviewed — no eval,
fetch, or dynamic import). Chunks: `three` (177 KB gz), `r3f` (117), `vgpu` (61), `ogl` (13),
`motion` (86) — all lazy except `motion`; first paint is the shell + loader + painted bg.

## Preserved

Trilingual es / cat / en. EmailJS. GitHub Pages base path. The full easter-egg layer
(`mallenk` console, CheatSheet, Time Travel, Glitch, Messi, Navbar egg) — FABs rethemed.
`#portfolio-content` wrapper kept for their selectors.

## Known residual polish

- Node labels graze their satellite clusters at the default camera angle (orbiting separates
  them); could add a small billboard offset.
- `three` is pinned to 0.171 (not vgpu's optional peer 0.180) so `@react-three/postprocessing`
  2.x still builds; the peer mismatch is a harmless npm warning.
- CheatSheet / Chatbox panels still carry old zinc styling inside; only the FABs are rethemed.
- First interactive paint of the 3D scene waits on ~300 KB gz of GPU libs behind the loader.
