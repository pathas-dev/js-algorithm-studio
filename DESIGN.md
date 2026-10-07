---
name: "이젠 아무래도 좋을 알고리즘"
description: "Algorithms, for what it’s worth — watch first, explore when curious."
colors:
  primary: "#196d53"
  ink: "#1a3028"
  paper: "#f5f7f2"
  surface: "#fff"
  sage-surface: "#e8eee5"
  canvas: "#eef2eb"
  quiet-action: "#e2eae0"
  quiet-action-hover: "#d3dfd0"
  quiet-ink: "#344e3e"
  selected-ink: "#365745"
  muted-text: "#4d6255"
  lesson-muted: "#586b5e"
  disclosure-text: "#4c6755"
  divider: "#d5dfd6"
  timeline: "#5f7e65"
  bar: "#b4c5b1"
  bar-comparison: "#c59455"
  bar-swap: "#9b87ac"
  bar-settled: "#64876b"
  comparison: "#d8964a"
  swap: "#8e79b4"
  settled: "#42886c"
  matched: "#2c7198"
  code-bg: "#17241f"
  code-text: "#e6eee8"
  focus: "#087f5b"
  # Legacy optional clay renderer; no active landing or Big O surface.
  bubble-paper: "#f6f4ed"
  bubble-canvas: "#f0efe7"
  bubble-ink: "#41503e"
  bubble-caption: "#666c5e"
  bubble-loop-ink: "#526151"
  bubble-action: "#e2e7d9"
  bubble-action-hover: "#d4ddcb"
  bubble-stone: "#91a28b"
  bubble-comparison: "#ba9469"
  bubble-swap: "#a79aab"
  bubble-settled: "#74886d"
  bubble-dust: "#a5987c"
  bubble-ambient-light: "#f5efe3"
  bubble-key-light: "#fff6e6"
  bubble-fill-light: "#b9c9b5"
  # Approved observatory: landing, loading, favicon, Big O and Bubble sort.
  space-ground: "#0b1012"
  space-surface: "#141b1d"
  space-ink: "#e2e7d9"
  space-muted: "#a3b0a7"
  space-line: "#2c3936"
  space-accent: "#9bb7a5"
  space-selected: "#26362e"
  space-hover: "#1d2a25"
  space-action-hover: "#34483b"
  space-olive: "#82968c"
  space-ochre: "#b7a07e"
  space-mauve: "#8c8196"
  space-comparison: "#d6b476"
  space-swap: "#afa0be"
  space-settled: "#8faf9d"
  space-landing-action: "#263b30"
  space-landing-hover: "#354c43"
  space-control-line: "#3e5149"
  space-preview: "rgba(11, 16, 18, .65)"
  space-lab: "rgba(11, 16, 18, .7)"
  sky-base: "rgb(4.3% 6.3% 7.1%)"
  sky-green: "rgb(20% 29% 25%)"
  sky-mauve: "rgb(25% 20% 25%)"
  sky-star: "rgb(64% 70% 62%)"
  sky-still-green: "#202e28"
  sky-still-mauve: "#29222b"
  loading-planet-shadow: "#31463b"
  favicon-planet-shadow: "#607f70"
  star-constant: "#a9c4b5"
typography:
  display:
    fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif'
    fontSize: "clamp(36px, 4.4vw, 58px)"
    fontWeight: 450
    lineHeight: 1.2
    letterSpacing: "-.035em"
  headline:
    fontSize: "clamp(25px, 2.5vw, 34px)"
    fontWeight: 450
    lineHeight: 1.4
    letterSpacing: "-.03em"
  title:
    fontSize: "clamp(32px, 3.4vw, 46px)"
    fontWeight: 450
    lineHeight: 1.25
    letterSpacing: "-.03em"
  tagline:
    fontSize: "21px"
    lineHeight: 1.6
  body:
    fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif'
    fontSize: "15px"
    lineHeight: 1.9
  label:
    fontSize: "13px"
  action:
    fontSize: "14px"
    fontWeight: 500
  brand:
    fontWeight: 550
    letterSpacing: "-.025em"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.9
rounded:
  control: "9px"
  canvas: "12px"
  code: "12px"
  landing-surface: "16px"
  array-bar: "4px 4px 2px 2px"
spacing:
  compact: "8px"
  control: "16px"
  group: "24px"
  panel: "32px"
  workspace-gap: "48px"
  section-gap: "64px"
components:
  button-primary:
    backgroundColor: "{colors.quiet-action}"
    textColor: "{colors.quiet-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "14px 19px"
  button-primary-hover:
    backgroundColor: "{colors.quiet-action-hover}"
  lesson-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.canvas}"
    padding: "24px 28px"
  landing-lab:
    backgroundColor: "{colors.space-lab}"
    textColor: "{colors.space-ink}"
    rounded: "{rounded.landing-surface}"
    padding: "28px 32px 20px"
  landing-primary:
    backgroundColor: "{colors.space-landing-action}"
    textColor: "{colors.space-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "14px 19px"
  landing-primary-hover:
    backgroundColor: "{colors.space-landing-hover}"
  landing-preview:
    backgroundColor: "{colors.space-preview}"
    textColor: "{colors.space-ink}"
    rounded: "{rounded.landing-surface}"
    padding: "26px 30px 0"
  code-panel:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-text}"
    rounded: "{rounded.code}"
  bubble-canvas:
    backgroundColor: "{colors.space-ground}"
    textColor: "{colors.space-ink}"
    rounded: "{rounded.canvas}"
    padding: "22px 20px"
  bubble-loop:
    textColor: "{colors.space-muted}"
    typography: "{typography.label}"
  bubble-play:
    backgroundColor: "{colors.space-selected}"
    textColor: "{colors.space-ink}"
    rounded: "{rounded.control}"
  bubble-play-hover:
    backgroundColor: "{colors.space-action-hover}"
---

# Design System: 이젠 아무래도 좋을 알고리즘

## Overview

**Creative North Star: "Low-light observatory"**

The user-approved observatory now covers landing, loading, favicon, Big O and Bubble sort (2026-10-08). Numbered worn planets, sparse stars and diffuse green/mauve nebula make watching the invitation. Existing Korean/English product names, lighter type, precise evidence and reading order remain. The shared world extends the original Bubble direction (seed 7554e619); its surface expressions are recorded in `.impeccable/surfaces/bubble-space.md` and `.impeccable/surfaces/landing-space.md`.

Other algorithm lessons retain their light paper, muted sage surfaces, established layouts and execution colors. The observatory approval is scoped to the named surfaces; it does not invert every lesson. Playful bilingual introductions invite watching, while exact summaries, model formulas and step evidence support closer reading. Source code stays available below the execution canvas when curiosity calls.

**Key Characteristics:**
- Low-light observatory on landing, loading, favicon, Big O and Bubble sort.
- Light paper and sage actions on other algorithm lessons.
- Worn numbered planets, procedural atmosphere and equally sized model stars.
- Lighter headings and quiet bilingual copy.
- Visible execution with code closed until requested.
- Monospaced values and distinct execution states.

Source evidence includes `web/main.tsx`, `web/styles.css`, `web/idle.css`, `web/landing.css`, `web/Landing.tsx`, `web/SpaceSky.tsx`, `web/space-shader.ts`, `web/LoadingScreen.tsx`, `web/BubbleScene.tsx`, `web/bubble-motion.ts`, `web/ComplexityScene.tsx`, `web/bubble.css` and `web/public/favicon.svg`. The optional legacy clay renderer remains implemented in BubbleScene; active landing and Bubble scenes explicitly select space. The orbital SVG is the identity mark, with an ICO derivative for browser compatibility.

## Colors

The observatory uses near-black ground, cream ink and muted green-grey copy. Sage actions and focus, worn olive/ochre/mauve planet bases, warm comparison, lilac swap and green settled states retain quiet contrast. Native dark form controls, selection, scrollbars, borders and errors remain readable in this scope. Landing preview and lab surfaces are translucent over the sky; their opacity is part of the material rather than a universal card recipe.

Native sky shader colors are recorded as CSS RGB percentages matching its RGB inputs. Domain-warped green/mauve light and sparse muted stars are atmospheric, not categorical evidence. The static CSS fallback uses the two still-sky hues. Loading uses the sage planet, ochre ellipse/moon and its inset shadow; the favicon uses the same orbit geometry with its own shade.

Other lessons retain green accents, paper, white and light sage canvases. Incumbent array bars use their quieter bar palette; comparison, swap, settled and matched remain distinct. Dark code surfaces retain their existing reading contrast and green active-line evidence. Keep these contextual palettes rather than flattening every state to sage. The legacy clay tokens remain source-backed optional renderer inputs, including warm/cool lights; they are not active landing or Big O materials.

**The Scoped World Rule.** Apply the observatory to landing, loading, favicon, Big O and Bubble sort; other algorithm lessons keep their incumbent light palette and layout.

## Typography

Pretendard and Noto Sans KR support Korean and English. Landing displays, section headings and lesson titles use the lighter hierarchy in the frontmatter. Brand text uses the brand weight; actions, catalog labels and evidence generally use (450–550). Detailed explanations and numerical labels retain their own emphasis where needed.

Lesson taglines use the tagline size, falling to (19px) below (650px). Exact lesson summaries use (15px, line-height 1.85) and a (65ch) measure. Landing intro copy uses (17px, line-height 1.8), falling to (15px) on mobile, with a (43ch) measure. Landing section copy uses the body token and a (65ch) measure. The mobile landing display uses (36px).

Values, Big O notation, mathematical expressions and code use native monospace stacks with tabular numbers where specified. Array values use (15px, weight 450); action evidence uses (15px, weight 500).

## Layout

The landing retains a (1320px) container and (48px) desktop horizontal padding. Its opening pairs copy and a sorting preview in (1.1fr / 1fr) columns with a (64px) gap. Divided use-case rows and a translucent observatory complexity lab keep the lower sections readable. The lab lays out four comparison columns on desktop and two below (650px), with scene heights of (210px) and (180px) respectively. At (900px), padding becomes (28px). At (650px), padding becomes (20px), the introduction and section copy stack, and the use-case description moves below its title.

Lessons use a (1560px) container and (180px) catalog beside a single reading column. The document scrolls naturally; the catalog has its own (70dvh) maximum height. The workspace gap is (48px), becoming (28px) at (1050px) and (20px) at (650px). On mobile, a native selector replaces the catalog. The execution canvas precedes the code disclosure at every width.

Canvas padding becomes (20px 16px) on mobile. Array charts use a (225px) height, falling to (196px) on mobile. Expanded code has a bounded scroll area of (320–420px).

## Elevation & Depth

Primary UI surfaces remain flat: thin dividers and tonal layering provide separation without decorative shadows. Observatory panels reveal the atmospheric backdrop; light lesson surfaces retain sage layering. The detailed step-explanation popover retains its Mantine medium shadow as a transient overlay.

Bubble and the landing preview use native spheres, procedural 3D surface noise and matte material (roughness 0.97, metalness 0). Warm key and cool fill directional lights (intensities 3.8 and 1.1), with warm ambient light (0.55), reveal worn terrain. The space floor is hidden and spheres do not cast shadows. Native transparent rings render their front and back with depth testing; they are geometry rather than painted ellipses. The shallow orthographic 3D view has a front-facing 2D mode (z scale 0.01), where rings disappear. Local axial rotation turns the 3D sphere or the 2D shader terrain; rings, numeric labels and centres keep their independent transforms. Landing keeps its trace fixed while visible planets rotate, returning to demand rendering offscreen or in a hidden document.

Big O uses additive shader Points with soft glow and small bright cores, not lit blocks or contact shadows. Stable 3D coordinates grow outward with `cbrt(index) × 0.14`, golden-angle placement and bounded vertical dispersion. Each star has the same point-size rule across all models: at least (4 CSS pixels), otherwise camera zoom × (0.16), scaled for renderer DPR. All four scenes share orthographic (6.5) world units. Larger work counts add stars without enlarging existing ones or changing the camera scale.

The optional legacy clay renderer retains tapered matte columns and its transparent shadow-only floor. It is an implementation fallback option, not the current landing artwork or Big O model. Loading's inset sphere shade belongs only to its small geometric planet.

**The Shared Scale Rule.** Big O comparison scenes use the same star-size rule, stable coordinates and camera units: more work means more stars, never normalized cluster size or larger individual stars.

## Shapes

Controls remain gently rounded. Lesson canvases and dark code panels use their respective radii; landing surfaces use the larger landing radius. Playback and disclosure wrappers are flat, divided by horizontal rules. Incumbent array bars retain smaller curved tops and subtly curved bottoms.

Bubble and the landing preview use spheres with radius `max(0.13, abs(value) / maximum × 0.53)`, where maximum is at least 1. Stable item IDs divisible by three receive rings (inner radius 1.3×, outer radius 1.7×). These sizes are illustrative; signed printed values are authoritative. Big O uses equal shader points rather than cubic blocks. Loading pairs a (76px) circular planet with a tilted native CSS ellipse and a (7px) moon; the SVG favicon carries corresponding circle/orbit geometry.

## Components

- Primary actions: pale sage fill, quiet green text and a darker sage hover; Bubble overrides these with selected dark sage, cream ink and its action hover; landing uses its own dark sage action and hover tokens. Lesson playback says “그냥 구경하기” / “Just watch” before playback begins.
- Navigation: quiet text links, underlined hover, an outlined language switch and a sage selected catalog row. Observatory surfaces scope navigation to cream/muted ink, panel borders and dark hover surfaces. Mobile lessons use a native grouped selector.
- Complexity lab: native range input selects powers of two from (2–128). Monospaced outputs accompany four equal-size shader-star clusters for counts `1`, `ceil(log2(n))`, `n` and `n(n−1)/2`, up to (8128) stars. Stable positions and the shared orthographic scale preserve model comparability. One star is one illustrative model operation; formulas, exact counters and the caption remain authoritative, with no measured-runtime claim. Each visible star's bright surface patch rotates locally at a seeded rate; centres and cluster geometry remain fixed. Count changes fade stars over (1s) with cubic ease-out while visible; offscreen or reduced-motion updates resolve immediately to the exact count. Continuous rendering runs only while visible in a non-hidden document; idle rotation does not rewrite the alpha buffer. Reduced motion shows the static final cluster.
- Execution canvas: light sage surface outside Bubble; observatory ground in Bubble sort, with factual step evidence and editable input beneath the visualization. Existing validation, playback, timeline, speed and keyboard controls remain available.
- Code disclosure: native `details` / `summary`, closed on entering a lesson and reset on lesson change. The summary reads “코드도 궁금하다면” / “If you’re curious about the code”, with a plus/minus indicator. Opening reveals the incumbent dark panel, line numbers and active-line highlight.
- Step explanation: “궁금하다면” / “Curious?” opens the precise explanation and relevant variables.

**The Model Evidence Rule.** Pair geometric work counts with their exact formulas and the model caption; never describe them as measured runtime.

Global reduced-motion handling suppresses animation and transitions; lesson motion respects the user's preference. Buttons, links, timeline and disclosure summary retain a (3px) focus outline with a (3px) offset. Observatory controls use sage focus against the dark ground; compact Bubble enlargement buttons retain their (2px) offset and the landing range uses (4px).

### Shared observatory and Bubble execution

The Bubble artwork reuses the exact bubble-sort trace and stable item identities. A native radio switch selects 3D (default) or 2D; switching keeps the same Canvas and playback clock without resetting or pausing the trace. Planets sit at a shared centre height (0.55). Values are native CanvasTexture SpriteMaterials above each moving sphere and fade with erosion. Depth testing permits foreground objects to occlude them; a minimum projected scale keeps dense and mobile labels legible. Accessible DOM values retain the exact signed numbers. Stationary projected DOM slot indices (`[index]`) and tiny ticks sit beneath the scene. Korean and English accessible labels identify both index and value. Its frame is (350px) high, or (320px) below (650px); long arrays scroll horizontally. The Bubble canvas uses horizontal padding (20px), with mobile vertical padding (20px). Input editing sits below the artwork; transport, native timeline and speed controls follow the canvas, before exact step evidence and the closed code disclosure.

**The Printed Value Rule.** Bubble planet geometry is illustrative; exact signed numbers and fixed numeric slots are the algorithm evidence. Rings and exchange arcs do not describe astronomical measurements or simulated physics.

Native Enlarge and Fullscreen buttons offer a focused viewport. Fullscreen calls `requestFullscreen`, retaining the enlarged viewport when unavailable. The focused view uses an active focus trap and keeps transport beneath the art; Escape may return native fullscreen to the enlarged view; Escape in the enlarged view closes it and restores focus to Enlarge. The scene uses the available viewport height while explanatory and editing content is hidden.

The landing introduction explicitly selects the same BubbleScene space world: numbered planets in 3D with a fixed displayed array and slow autonomous axial rotation, with the original `[3, 5, 2, 4, 1, 6]` example and `[5, 2]` comparison. IntersectionObserver and document visibility gate the local clock and continuous rendering; each resumed frame is capped at (0.1s), preventing catch-up jumps. Its copy and exact comparison remain beside the artwork; its (235px) scene omits slot indices. Numeric sprite textures are generated at runtime with native canvas text, not externally produced bitmap assets.

At (1×), each trace step lasts (2.8s), with a planetary swap taking (1.4s). Planet slots reserve the largest ring envelope plus (0.28) world units. Opposing semicircles swap planets at constant path speed, with a radius of half the slot spacing; 3D uses depth, 2D uses vertical clearance. Retained clay swaps use the damped spring, opposing depth arcs (±0.85), a (0.035) lift and (±0.045-radian) tilt. The sorted array holds for (6s), erodes to restrained dust for (6s), and reforms the original input over (3s). The native “천천히 반복” / “Slow loop” checkbox opts out of this cycle. Pause freezes the shared clock; seeking or editing restores an exact, fully formed trace state. Keep bilingual captions, numerical labels and keyboard controls alongside the scene.

Bubble's two views share a full-canvas procedural nebula and sparse stars behind the planets. Domain-warped noise blends the near-black ground with muted green and mauve light; stars twinkle gently and swaps add a faint local ripple at the projected pair. Planet rotation uses stable ID phases (`id × 0.8`) and individual rates (`0.045 × (0.85 + id % 5 × 0.08)` radians per second). Rotation, nebula, stars, dust and semicircle swaps all follow the established cumulative playback clock and speed. Pause and hidden tabs freeze authored motion; seek, input edit or reset restores a deterministic state. No orbital or physics engine is introduced. The legacy optional clay world retains its grey-green wash; active landing selects space. These scene materials use shaders and native canvas value textures, with no external bitmap assets or additional dependencies.

Three.js/Fiber loads lazily through the bubble scene. Reduced motion, scene failure or WebGL context loss uses the existing static array renderer; exact trace controls remain available. The landing preview shares that fallback; Big O preserves its accessible counts and descriptions if WebGL fails. Other algorithm lessons retain their incumbent light palette, layout, depth and motion.

### Native sky, loading and identity

Landing and the exported LoadingScreen share SpaceSky's native lightweight WebGL highp shader, independently of lazy Three.js/Fiber. Its domain-warped green/mauve nebula drifts slowly behind sparse twinkling stars. DPR is capped at (1.5); ResizeObserver updates its canvas, cleanup releases shader/program/buffer resources, and hidden tabs stop its RAF. Reduced motion renders a still sky. Shader compilation failure, unavailable WebGL or context loss replaces the canvas with the static CSS atmospheric gradient while text and controls remain readable.

LoadingScreen is the root Suspense fallback. The bilingual quiet status is a polite live region; the geometric orbit is decorative. Its planet's sage/ochre material patches rotate over (110s) beneath stationary inset shading; its moon keeps the (22s) orbit. Both animations pause offscreen or in a hidden document and stop for reduced motion. The patches reuse the loading shade at (50% opacity) and ochre at (40% opacity). It does not impose a fake delay. The product name uses inherited cream ink and the existing type family. The authored orbital SVG mark is paired with an ICO derivative; no new project dependency is required to generate the compatibility asset.

## Do's and Don'ts

- Do preserve the Korean and English product names and use the approved orbital SVG/ICO identity mark.
- Do keep Korean and English copy readable at narrow widths.
- Do place playful taglines alongside exact summaries and step explanations.
- Do lead with execution and keep code available through a closed native disclosure.
- Do pair execution colors with textual or numeric evidence.
- Do scope the observatory to landing, loading, favicon, Big O and Bubble sort while retaining other lessons’ light palette and layout.
- Do treat printed signed Bubble values and fixed indices as authoritative over illustrative geometry.
- Don't present Bubble rings or swap arcs as astronomical measurements or physical simulation.
- Don't present the Big O growth model as measured runtime.
- Don't collapse comparison, swap, settled and matched lesson states into one accent.
- Don't turn precise input constraints or error messages into jokes.
