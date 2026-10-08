---
name: "이젠 아무래도 좋을 알고리즘"
description: "Algorithms, for what it’s worth — watch first, explore when curious."
colors:
  # Source-backed legacy light primitives; active surfaces use space-* tokens.
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
  # Approved global observatory: landing, loading, favicon, Big O and all 111 lessons.
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
    backgroundColor: "{colors.space-selected}"
    textColor: "{colors.space-ink}"
    typography: "{typography.action}"
    rounded: "{rounded.control}"
    padding: "14px 19px"
  button-primary-hover:
    backgroundColor: "{colors.space-action-hover}"
  lesson-canvas:
    backgroundColor: "{colors.space-ground}"
    textColor: "{colors.space-ink}"
    rounded: "{rounded.canvas}"
    padding: "22px 20px"
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

The user-approved observatory now covers landing, loading, favicon, Big O and all 111 runnable algorithm and data-structure lessons (2026-10-08). Numbered worn planets, sparse stars and diffuse green/mauve nebula make watching the invitation. Existing Korean/English product names, lighter type, precise evidence and reading order remain. The shared world extends the original Bubble direction (seed 7554e619); its surface expressions are recorded in `.impeccable/surfaces/bubble-space.md`, `.impeccable/surfaces/landing-space.md` and `.impeccable/surfaces/all-lessons-space.md`.

Every lesson shares the dark shell and quiet sage controls. Sorting and search use native numbered planets, connected structures use planar maps, dense records preserve their exact axes, and Hanoi transfers real disc rings between three stations. Playful bilingual introductions invite watching, while exact summaries, model formulas and step evidence support closer reading. Source code stays available below the execution canvas when curiosity calls.

**Key Characteristics:**
- Low-light observatory on landing, loading, favicon, Big O and all 111 lessons.
- Native array planets, planar topology, exact coordinate records and three-station Hanoi rings.
- Worn numbered planets, procedural atmosphere and equally sized model stars.
- Lighter headings and quiet bilingual copy.
- Visible execution with code closed until requested.
- Monospaced values and distinct execution states.

Source evidence includes `web/main.tsx`, `web/styles.css`, `web/idle.css`, `web/landing.css`, `web/Landing.tsx`, `web/SpaceSky.tsx`, `web/space-shader.ts`, `web/LoadingScreen.tsx`, `web/BubbleScene.tsx`, `web/bubble-motion.ts`, `web/ComplexityScene.tsx`, `web/bubble.css`, `web/cosmos.css`, `web/App.tsx`, `web/SpaceLesson.tsx`, `web/HanoiScene.tsx`, `web/PlanetMark.tsx`, `web/useBubblePlayback.ts` and `web/public/favicon.svg`. The optional legacy clay renderer remains implemented in BubbleScene; active landing, sorting and search scenes explicitly select space. The orbital SVG is the identity mark, with an ICO derivative for browser compatibility.

## Colors

The observatory uses near-black ground, cream ink and muted green-grey copy. Sage actions and focus, worn olive/ochre/mauve planet bases, warm comparison, lilac swap and green settled states retain quiet contrast. Native dark form controls, selection, scrollbars, borders and errors remain readable in this scope. Landing preview and lab surfaces are translucent over the sky; their opacity is part of the material rather than a universal card recipe.

Native sky shader colors are recorded as CSS RGB percentages matching its RGB inputs. Domain-warped green/mauve light and sparse muted stars are atmospheric, not categorical evidence. The static CSS fallback uses the two still-sky hues. Loading uses the sage planet, ochre ellipse/moon and its inset shadow; the favicon uses the same orbit geometry with its own shade.

All lessons use the observatory palette; comparison, swap, settled and matched remain distinct. Graph discovery keeps its blue-grey state, red-black trees keep semantic node colors, and image lessons preserve grayscale pixel values. Dark code surfaces retain their existing reading contrast and green active-line evidence. Source-backed light and clay tokens remain legacy options, including warm/cool renderer lights; they are not the active lesson default.

**The Shared World Rule.** Apply the observatory to every lesson; preserve each algorithm’s real values, topology, axes and semantic execution states.

## Typography

Pretendard and Noto Sans KR support Korean and English. Landing displays, section headings and lesson titles use the lighter hierarchy in the frontmatter. Brand text uses the brand weight; actions, catalog labels and evidence generally use (450–550). Detailed explanations and numerical labels retain their own emphasis where needed.

Lesson taglines use the tagline size, falling to (19px) below (650px). Exact lesson summaries use (15px, line-height 1.85) and a (65ch) measure. Landing intro copy uses (17px, line-height 1.8), falling to (15px) on mobile, with a (43ch) measure. Landing section copy uses the body token and a (65ch) measure. The mobile landing display uses (36px).

Values, Big O notation, mathematical expressions and code use native monospace stacks with tabular numbers where specified. Array values use (15px, weight 450); action evidence uses (15px, weight 500).

## Layout

The landing retains a (1320px) container and (48px) desktop horizontal padding. Its opening pairs copy and a sorting preview in (1.1fr / 1fr) columns with a (64px) gap. Divided use-case rows and a translucent observatory complexity lab keep the lower sections readable. The lab lays out four comparison columns on desktop and two below (650px), with scene heights of (210px) and (180px) respectively. At (900px), padding becomes (28px). At (650px), padding becomes (20px), the introduction and section copy stack, and the use-case description moves below its title.

Lessons use a (1560px) container and (180px) catalog beside a single reading column. The document scrolls naturally; the catalog has its own (70dvh) maximum height. The workspace gap is (48px), becoming (28px) at (1050px) and (20px) at (650px). On mobile, a native selector replaces the catalog. The execution canvas precedes the code disclosure at every width.

Lesson canvases use horizontal padding (20px), with (20px) vertical padding on mobile. Native array scenes use (350px) height, falling to (320px) on mobile; Hanoi uses (320px), falling to (280px). Long arrays and dense records retain scrolling. Expanded code has a bounded scroll area of (320–420px).

## Elevation & Depth

Primary UI surfaces remain flat: thin dividers and tonal layering provide separation without decorative shadows. Observatory panels reveal the atmospheric backdrop; all lesson surfaces use dark tonal layering. The detailed step-explanation popover retains its Mantine medium shadow as a transient overlay.

Sorting, search and the landing preview use native spheres, procedural 3D surface noise and matte material (roughness 0.97, metalness 0). Warm key and cool fill directional lights (intensities 3.8 and 1.1), with warm ambient light (0.55), reveal worn terrain. The space floor is hidden and spheres do not cast shadows. Native transparent rings render their front and back with depth testing; they are geometry rather than painted ellipses. The shallow orthographic 3D view has a front-facing 2D mode (z scale 0.01), where rings disappear. Independent local axial rotation turns the 3D sphere or the 2D shader terrain even before playback and while sorting is paused; rings, numeric labels and slot centres do not spin. The landing runs the real sorting trace. Space scenes render continuously while visible, returning to demand rendering offscreen or in a hidden document.

Big O uses additive shader Points with soft glow and small bright cores, not lit blocks or contact shadows. Stable local 3D coordinates grow outward with `cbrt(index) × 0.14`, golden-angle placement and bounded vertical dispersion. Each star has the same point-size rule across all models: at least (4 CSS pixels), otherwise camera zoom × (0.16), scaled for renderer DPR. All four scenes share orthographic (6.5) world units. Larger work counts add stars without enlarging existing ones or changing the camera scale.

The optional legacy clay renderer retains tapered matte columns and its transparent shadow-only floor. It is an implementation fallback option, not the current landing artwork or Big O model. Loading's inset sphere shade belongs only to its small geometric planet.

**The Shared Scale Rule.** Big O comparison scenes use the same star-size rule, stable local coordinates and camera units: more work means more stars, never normalized cluster size or larger individual stars.

## Shapes

Controls remain gently rounded. Lesson canvases and dark code panels use their respective radii; landing surfaces use the larger landing radius. Playback and disclosure wrappers are flat, divided by horizontal rules. Incumbent array bars retain smaller curved tops and subtly curved bottoms.

Sorting, search and the landing preview use spheres with radius `max(0.13, abs(value) / maximum × 0.53)`, where maximum is at least 1. Stable item IDs divisible by three receive rings (inner radius 1.3×, outer radius 1.7×). These sizes are illustrative; signed printed values are authoritative. Big O uses equal shader points rather than cubic blocks. Loading pairs a (76px) circular planet with a tilted native CSS ellipse and a (7px) moon; the SVG favicon carries corresponding circle/orbit geometry.

## Components

- Primary actions: selected dark sage, cream ink and the action hover token throughout lessons; landing uses its own dark sage action and hover tokens. Randomize uses cream ink in both resting and hover states, with a dark hover surface. Lesson playback says “그냥 구경하기” / “Just watch” before playback begins.
- Navigation: quiet text links, underlined hover, an outlined language switch and a sage selected catalog row. Observatory surfaces scope navigation to cream/muted ink, panel borders and dark hover surfaces. Mobile lessons use a native grouped selector.
- Complexity lab: native range input selects powers of two from (2–128). Monospaced outputs accompany four equal-size shader-star clusters for counts `1`, `ceil(log2(n))`, `n` and `n(n−1)/2`, up to (8128) stars. Stable local positions and the shared orthographic scale preserve model comparability. One star is one illustrative model operation; formulas, exact counters and the caption remain authoritative, with no measured-runtime claim. The rendered cluster turns at (0.18 radians per second), tilts around x by `sin(seconds × 0.22) × 0.18` and around z by `sin(seconds × 0.16) × 0.05`. Local coordinates and the cluster centre remain stable while projected star positions move. Seeded brightness pulses (`0.72 + 0.28 × sin(seconds × 0.9 + seed × 2π)`) keep the one-star case visibly alive; each star also retains its local bright-patch spin. Count changes fade stars over (1s) with cubic ease-out while visible; offscreen or reduced-motion updates resolve immediately to the exact count. Continuous rendering runs only while visible in a non-hidden document; idle turn, tilt and pulse do not rewrite the count-fade alpha buffer. The local motion clock caps each delta at (0.1s). Reduced motion shows the static final cluster.
- Execution canvas: observatory ground in every lesson, with factual step evidence and editable input beneath the visualization. Existing validation, playback, timeline, speed and keyboard controls remain available.
- Code disclosure: native `details` / `summary`, closed on entering a lesson and reset on lesson change. The summary reads “코드도 궁금하다면” / “If you’re curious about the code”, with a plus/minus indicator. Opening reveals the incumbent dark panel, line numbers and active-line highlight.
- Step explanation: “궁금하다면” / “Curious?” opens the precise explanation and relevant variables.

**The Model Evidence Rule.** Pair geometric work counts with their exact formulas and the model caption; never describe them as measured runtime.

Global reduced-motion handling suppresses animation and transitions; lesson motion respects the user's preference. Buttons, links, timeline and disclosure summary retain a (3px) focus outline with a (3px) offset. Observatory controls use sage focus against the dark ground; compact Bubble enlargement buttons retain their (2px) offset and the landing range uses (4px).

### Shared observatory execution

Sorting and search artwork reuse each algorithm’s exact trace and stable item identities. A native radio switch selects 3D (default) or 2D; switching keeps the same Canvas and playback clock without resetting or pausing the trace. Planets sit at a shared centre height (0.55). Values are native CanvasTexture SpriteMaterials above each moving sphere and fade with erosion. Depth testing permits foreground objects to occlude them; a minimum projected scale keeps dense and mobile labels legible. Accessible DOM values retain the exact signed numbers. Stationary projected DOM slot indices (`[index]`) and tiny ticks sit beneath the scene. Korean and English accessible labels identify both index and value. Its frame is (350px) high, or (320px) below (650px); long arrays scroll horizontally. The array canvas uses horizontal padding (20px), with mobile vertical padding (20px). Input editing sits below the artwork; transport, native timeline and speed controls follow the canvas, before exact step evidence and the closed code disclosure.

**The Printed Value Rule.** Planet geometry is illustrative; exact signed numbers and fixed numeric slots are the algorithm evidence. Rings and exchange arcs do not describe astronomical measurements or simulated physics.

Every lesson offers native Enlarge and Fullscreen buttons for a focused viewport. Fullscreen calls `requestFullscreen`, retaining the enlarged viewport when unavailable. The focused view uses an active focus trap and keeps transport beneath the art; Escape may return native fullscreen to the enlarged view; Escape in the enlarged view closes it and restores focus to Enlarge. The scene uses the available viewport height while explanatory and editing content is hidden.

The landing introduction explicitly selects the same BubbleScene space world and runs `bubble.run([3, 5, 2, 4, 1, 6])` in 3D. The shared playback hook enables autoplay for this preview while lesson playback defaults to stopped. Sorting starts on visible entry, then repeats the established hold/dust/reform cycle at (1×). A separate native bilingual pause/resume button sits outside the artwork’s lesson link; pausing sorting leaves axial rotation running. Comparison operators, before/after swap pairs and explanations follow the actual current trace step. IntersectionObserver and document visibility gate preview playback and continuous rendering; frame deltas are capped at (0.1s), preventing catch-up jumps. Reduced motion does not autoplay and omits the pause control. Its (235px) scene omits slot indices. Numeric sprite textures are generated at runtime with native canvas text, not externally produced bitmap assets.

At (1×), each trace step lasts (2.8s), with a planetary swap taking (1.4s). Explicit play starts the next pending action immediately after initial entry, seeking, any paused comparison or a completed swap’s idle tail; an animated paused swap within its first (1.4s) resumes at its exact progress. Replay from the final trace step starts the first pending action. Planet slots reserve the largest ring envelope plus (0.28) world units. Adjacent opposing semicircles swap planets at constant path speed, with a radius of half the slot spacing; distant array transfers lift clear of intermediate slots, travel at constant path speed, and settle. 3D uses depth, 2D uses vertical clearance. Retained clay swaps use the damped spring, opposing depth arcs (±0.85), a (0.035) lift and (±0.045-radian) tilt. Bubble alone defaults to the repeating epilogue; other lessons stop at their final trace state. The sorted Bubble array holds for (6s), erodes to restrained dust for (6s), and reforms the original input over (3s). The native “천천히 반복” / “Slow loop” checkbox opts out of this cycle. Pause freezes the trace clock, including swaps, nebula, twinkle and dust; seeking or editing restores an exact, fully formed trace state. Planet axial rotation remains independent of playback speed, pause and seek, and seeking or resetting the trace does not reset its local clock. Keep bilingual captions, numerical labels and keyboard controls alongside the scene.

Bubble's two views share a full-canvas procedural nebula and sparse stars behind the planets. Domain-warped noise blends the near-black ground with muted green and mauve light; stars twinkle gently and swaps add a faint local ripple at the projected pair. Planet rotation uses stable ID phases (`id × 0.8`) and size-based periods: small (8s), medium (10s), large (12s). The period is `8 + clamp((radius − 0.13) / 0.4, 0, 1) × 4` seconds, so larger rendered planets turn slightly slower. An independent local visible-time clock advances each space planet with delta capped at (0.1s); 3D rotates the actual sphere about y, while 2D rotates shader terrain on front-facing flattened geometry. Planet material colors ease toward the current neutral, compare, swap or settled palette with `1 − exp(−min(delta, 0.1) × 8)` per frame (about 375ms to reach 95%). Emissive and ring colors follow the interpolated material. Rings, numeric labels and fixed slot centres do not spin. Playback speed, pause and seek govern nebula, twinkle, dust and semicircle swaps, not axial rotation. Hidden documents and offscreen scenes stop local spin and continuous rendering; reduced motion uses the static fallback. No orbital or physics engine is introduced. The legacy optional clay world retains its grey-green wash; active landing selects space. These scene materials use shaders and native canvas value textures, with no external bitmap assets or additional dependencies.

Three.js/Fiber loads lazily through the bubble scene. Reduced motion, scene failure or WebGL context loss uses the existing static array renderer; exact trace controls remain available. The landing preview shares that fallback; Big O preserves its accessible counts and descriptions if WebGL fails. All lessons retain exact trace controls and readable evidence through their static or accessible fallback.

### Planar maps, coordinate records and Hanoi

Graphs, trees, linked lists and heaps use native SVG planets in a top view. Node centres, actual connections, arrow direction, weights and printed IDs stay readable; autonomous meridian rotation changes the surface markings, not the topology. Node spin periods are (8–12s), based on radius, and run only while visible in a non-hidden document. Reduced motion removes the spin and state transitions.

Dense dynamic-programming tables, string alignments, bit fields, numerical grids and chess boards keep their actual row/column axes, characters and values. Small orbital beacons mark coordinate records without replacing notation. Seam-carving pixels retain their true grayscale values. These records remain exact data views within the common dark shell.

Hanoi uses native 3D torus rings above three fixed labeled stations A, B and C. Disc number determines ring radius; pole arrays determine the real destination and stack level. A moving ring lifts, travels and settles over (1.4s), driven by the same pausable trace clock as playback. Independent torus surface rotation takes (8–12s), while labels and station centres remain fixed. Projected disc labels accompany exact top-to-bottom pole records. Reduced motion uses static ring geometry and exact station records; WebGL failure preserves the station records. All lesson traces advance at (2.8s) per step at (1×); only Bubble offers the repeating hold/dust/reform cycle.

**The Topology Rule.** Motion may turn node surfaces or move a traced item; it must not invent edges, misrepresent traced station membership, or move a coordinate axis.

### Native sky, loading and identity

Landing and the exported LoadingScreen share SpaceSky's native lightweight WebGL highp shader, independently of lazy Three.js/Fiber. Its domain-warped green/mauve nebula drifts slowly behind sparse twinkling stars. DPR is capped at (1.5); ResizeObserver updates its canvas, cleanup releases shader/program/buffer resources, and hidden tabs stop its RAF. Reduced motion renders a still sky. Shader compilation failure, unavailable WebGL or context loss replaces the canvas with the static CSS atmospheric gradient while text and controls remain readable.

LoadingScreen is the root Suspense fallback. The bilingual quiet status is a polite live region; the geometric orbit is decorative. Its planet's sage/ochre material patches rotate over (110s) beneath stationary inset shading; its moon keeps the (22s) orbit. Both animations pause offscreen or in a hidden document and stop for reduced motion. The patches reuse the loading shade at (50% opacity) and ochre at (40% opacity). It does not impose a fake delay. The product name uses inherited cream ink and the existing type family. The authored orbital SVG mark is paired with an ICO derivative; no new project dependency is required to generate the compatibility asset.

## Do's and Don'ts

- Do preserve the Korean and English product names and use the approved orbital SVG/ICO identity mark.
- Do keep Korean and English copy readable at narrow widths.
- Do place playful taglines alongside exact summaries and step explanations.
- Do lead with execution and keep code available through a closed native disclosure.
- Do pair execution colors with textual or numeric evidence.
- Do use the shared observatory across all 111 lessons while preserving real topology, coordinate axes and exact records.
- Do treat printed signed values, fixed indices and Hanoi pole records as authoritative over illustrative geometry.
- Don't present Bubble rings or swap arcs as astronomical measurements or physical simulation.
- Don't present the Big O growth model as measured runtime.
- Don't collapse comparison, swap, settled and matched lesson states into one accent.
- Don't turn precise input constraints or error messages into jokes.
