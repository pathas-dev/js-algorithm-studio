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
  space-graph-discovered: "#8dacc0"
  space-connection: "#526b60"
  space-active-ink: "#eed1a3"
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
  bubble-numeral:
    fontFamily: '"Manrope", sans-serif'
    fontWeight: 500
  bubble-index:
    fontSize: "12px"
    letterSpacing: ".04em"
    fontFeature: '"tnum"'
  graph-label:
    fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif'
    fontSize: "16px"
    fontWeight: 500
    fontFeature: '"tnum"'
  sequence-character:
    fontSize: "18px"
    fontWeight: 500
  sequence-index:
    fontSize: "10px"
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
  sequence-index: "4px"
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

Every lesson shares the dark shell and quiet sage controls. Sorting and array search use rotatable native numbered planets with a 2D view; graph lessons add rotatable 3D planetary connections with a 2D top view. Arrays and graphs share worn terrain and restrained atmosphere while preserving exact values and relationships. Stack and queue use exploration capsules and mechanical cargo canisters; naive search, KMP and Rabin–Karp use a fixed signal ribbon and moving pattern scan head. Singly and doubly linked-list structure lessons use communication modules and directed pointer cables. Min-heap, max-heap and priority-queue structure lessons use control units in real tree slots; hash-table uses addressed cargo docks and actual collision chains. Binary-search-tree and AVL structure lessons use branching station joints with actual left/right arms. Deque, forward/reverse traversal, other trees, heap sort and other structure lessons keep their existing views. Dense records preserve their exact axes, and Hanoi transfers real disc rings between three stations. Playful bilingual introductions invite watching, while exact summaries, model formulas and step evidence support closer reading. Source code stays available below the execution canvas when curiosity calls.

**Key Characteristics:**
- Low-light observatory on landing, loading, favicon, Big O and all 111 lessons.
- Native array and graph planets, sequence cargo and scanning equipment, linked-list communication modules, heap control slots, hash address docks and BST/AVL branching joints, readable topology, exact coordinate records and three-station Hanoi rings.
- Worn numbered planets, procedural atmosphere and equally sized model stars.
- Lighter headings and quiet bilingual copy.
- Visible execution with code closed until requested.
- Exact numeric values and distinct execution states.

Source evidence includes `web/main.tsx`, `web/styles.css`, `web/idle.css`, `web/landing.css`, `web/Landing.tsx`, `web/SpaceSky.tsx`, `web/space-shader.ts`, `web/LoadingScreen.tsx`, `web/BubbleScene.tsx`, `web/SceneOrbit.tsx`, `web/bubble-motion.ts`, `web/ComplexityScene.tsx`, `web/bubble.css`, `web/cosmos.css`, `web/App.tsx`, `web/SpaceLesson.tsx`, `web/GraphScene.tsx`, `web/GraphView.tsx`, `web/graph-scene.ts`, `web/graph-geometry.ts`, `web/SequenceScene.tsx`, `web/sequence-scene.ts`, `web/LinkedScene.tsx`, `web/LinkedView.tsx`, `web/LinkedListView.tsx`, `web/linked-scene.ts`, `web/StorageScene.tsx`, `web/StorageView.tsx`, `web/storage-scene.ts`, `web/HeapView.tsx`, `web/HashView.tsx`, `web/TreeScene.tsx`, `web/TreeSpaceView.tsx`, `web/tree-scene.ts`, `web/TreeView.tsx`, `web/planet-material.ts`, `web/HanoiScene.tsx`, `web/PlanetMark.tsx`, `web/useBubblePlayback.ts` and `web/public/favicon.svg`. The optional legacy clay renderer remains implemented in BubbleScene; active landing, sorting and array-search scenes explicitly select space. The orbital SVG is the identity mark, with an ICO derivative for browser compatibility.

## Colors

The observatory uses near-black ground, cream ink and muted green-grey copy. Sage actions and focus, worn olive/ochre/mauve planet bases, warm comparison, lilac swap and green settled states retain quiet contrast. Native dark form controls, selection, scrollbars, borders and errors remain readable in this scope. Landing preview and lab surfaces are translucent over the sky; their opacity is part of the material rather than a universal card recipe.

Native sky shader colors are recorded as CSS RGB percentages matching its RGB inputs. Domain-warped green/mauve light and sparse muted stars are atmospheric, not categorical evidence. The static CSS fallback uses the two still-sky hues. Loading uses the sage planet, ochre ellipse/moon and its inset shadow; the favicon uses the same orbit geometry with its own shade.

All lessons use the observatory palette; comparison, swap, settled and matched remain distinct. Graph discovery keeps its blue-grey state; muted green connections, warm active ink, comparison-gold current nodes and settled-green processed nodes carry the same meaning in both views. Linked-list next cables use settled sage and previous cables use swap mauve in separated channels, with directional arrows and exact textual records. Red-black trees keep semantic node colors, and image lessons preserve grayscale pixel values. Dark code surfaces retain their existing reading contrast and green active-line evidence. Source-backed light and clay tokens remain legacy options, including warm/cool renderer lights; they are not the active lesson default.

**The Shared World Rule.** Apply the observatory to every lesson; preserve each algorithm’s real values, topology, axes and semantic execution states.

## Typography

Pretendard and Noto Sans KR support Korean and English. Landing displays, section headings and lesson titles use the lighter hierarchy in the frontmatter. Brand text uses the brand weight; actions, catalog labels and evidence generally use (450–550). Detailed explanations and numerical labels retain their own emphasis where needed.

Lesson taglines use the tagline size, falling to (19px) below (650px). Exact lesson summaries use (15px, line-height 1.85) and a (65ch) measure. Landing intro copy uses (17px, line-height 1.8), falling to (15px) on mobile, with a (43ch) measure. Landing section copy uses the body token and a (65ch) measure. The mobile landing display uses (36px).

Big O notation, mathematical expressions, code and numerical evidence outside Bubble artwork use native monospace stacks with tabular numbers where specified. Array values use (15px, weight 450); action evidence uses (15px, weight 500).

Bubble’s in-canvas values and fixed index rail use the bubble-numeral family and weight. The self-hosted Manrope numeric subset is (2.8KB WOFF2), with its OFL license in `web/public/fonts`. Runtime value sprites use measured-width, (256px)-high textures, rebuilt after the font loads. Index metadata uses the bubble-index size, tabular feature and tracking. This is an explicit Bubble-only opt-in; other array lessons and the landing preview retain their native monospace values, (52px) canvas text, (80px)-high textures and (11px) index metadata where shown.

3D graph IDs inherit the body family with the graph-label size, weight and tabular feature; below (650px) they use (14px). Projected labels remain upright as the camera turns. Edge weights retain native monospace at (11px) over a dark backing. Manrope remains local to Bubble.

## Layout

The landing retains a (1320px) container and (48px) desktop horizontal padding. Its opening pairs copy and a sorting preview in (1.1fr / 1fr) columns with a (64px) gap. Divided use-case rows and a translucent observatory complexity lab keep the lower sections readable. The lab lays out four comparison columns on desktop and two below (650px), with scene heights of (210px) and (180px) respectively. At (900px), padding becomes (28px). At (650px), padding becomes (20px), the introduction and section copy stack, and the use-case description moves below its title.

Lessons use a (1560px) container and (180px) catalog beside a single reading column. The document scrolls naturally; the catalog has its own (70dvh) maximum height. The workspace gap is (48px), becoming (28px) at (1050px) and (20px) at (650px). On mobile, a native selector replaces the catalog. The execution canvas precedes the code disclosure at every width.

Lesson canvases use horizontal padding (20px), with (20px) vertical padding on mobile. Native array scenes use (350px) height, falling to (320px) on mobile; Hanoi uses (320px), falling to (280px). Long arrays and dense records retain scrolling. Expanded code has a bounded scroll area of (320–420px).

Graph scenes use height `clamp(310px, 34vw, 420px)`, or (320px) below (650px). Expanded graph scenes use `clamp(300px, calc(100dvh - 330px), 720px)`. At mobile widths, the shared graph and array control-row caption occupies its own row and controls use the full width. Graph evidence retains its own records below the scene.

Sequence cargo equipment reserves the maximum node capacity across the trace, keeping the hatch and ports fixed as items arrive or leave. Its bounded native scroll region supports horizontal and vertical swipe. Short queues of up to four items show both ports within a (350px) mobile viewport. Long stacks follow the camera-projected TOP only when the committed step changes; an empty stack focuses its hatch, and manual scrolling persists while the same step remains selected.

## Elevation & Depth

Primary UI surfaces remain flat: thin dividers and tonal layering provide separation without decorative shadows. Observatory panels reveal the atmospheric backdrop; all lesson surfaces use dark tonal layering. The detailed step-explanation popover retains its Mantine medium shadow as a transient overlay.

Sorting, array search and the landing preview share the graph planets’ worn procedural terrain and matte material (roughness 0.92, metalness 0), with faint sage emission (0.12) in 3D. Warm key and cool fill directional lights (intensities 3.2 and 1.4), with cool ambient light (0.65), reveal worn terrain. Shared terrain preserves array erosion and 2D surface-spin uniforms. The space floor is hidden and spheres do not cast shadows. Native transparent rings render their front and back with depth testing; they are geometry rather than painted ellipses. The default shallow orthographic 3D view has a front-facing 2D mode (z scale 0.01), where rings disappear. Independent local axial rotation turns the 3D sphere or the 2D shader terrain even before playback and while sorting is paused; rings, numeric labels and slot centres do not spin. The landing runs the real sorting trace. Space scenes render continuously while visible, returning to demand rendering offscreen or in a hidden document.

Graph spheres use procedural worn terrain with matte roughness (0.92) and faint sage emission (0.12). The shared additive Fresnel atmosphere uses a cubic rim falloff without writing depth: it outlines graph planets and 3D array/preview spheres in their current material color. Array rims fade with erosion. SVG PlanetMark nodes retain a stationary warm highlight and dark limb shade beneath their printed labels while meridians rotate. These treatments add material depth without changing topology or numeric evidence.

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

Global reduced-motion handling suppresses animation and transitions; lesson motion respects the user's preference. Buttons, links, timeline and disclosure summary retain a (3px) focus outline with a (3px) offset. Observatory controls use sage focus against the dark ground; compact view-size buttons retain their (2px) offset and the landing range uses (4px).

### Shared observatory execution

Sorting, array search, ungrouped set traces (shuffle, longest increasing subsequence and maximum subarray) and jump-mode artwork reuse each algorithm’s exact trace and stable item identities. A native radio switch selects 3D (default) or 2D; switching keeps the same Canvas and playback clock without resetting or pausing the trace. Planets sit at a shared centre height (0.55). Values are native CanvasTexture SpriteMaterials above each moving sphere and fade with erosion. Depth testing permits foreground objects to occlude them; upright sprites balance projected legibility with a width cap of (85%) of projected slot spacing as the camera turns. Accessible DOM values retain the exact signed numbers. DOM slot indices (`[index]`) use a fixed screen-space baseline beneath the scene; horizontal camera projection keeps them aligned with their slots without vertical artwork scrolling. Korean and English accessible labels identify both index and value. Its frame is (350px) high, or (320px) below (650px); long arrays scroll horizontally. The array canvas uses horizontal padding (20px), with mobile vertical padding (20px). Input editing sits below the artwork; transport, native timeline and speed controls follow the canvas, before exact step evidence and the closed code disclosure.

**The Printed Value Rule.** Planet geometry is illustrative; exact signed numbers and fixed numeric slots are the algorithm evidence. Rings and exchange arcs do not describe astronomical measurements or simulated physics.

Array view controls use native 2D/3D radios and compact zoom buttons: (50–200%) in (25%) steps, with the displayed percentage resetting to (100%). View and zoom changes preserve playback; magnified arrays scroll horizontally. These controls are disabled while editing, and zoom is omitted for the static reduced-motion view. All ten sorting lessons use one fullscreen action; other categories retain separate Enlarge and Fullscreen actions. Sorting and search scenes flex into the height remaining after headings and controls. The same 2D/3D and zoom controls also cover ungrouped set traces and jump mode without changing input semantics.

Interactive 3D arrays use the same native orbit controls as graphs: drag the canvas or focus it and use arrow keys; Home and Reset view restore orientation while preserving zoom and playback. Focused orbit keys do not seek the trace. Array yaw is limited to (±60°), and the polar angle to (0.55–1.35 radians), preserving readable slot order. A compact help/reset footer retains space in mobile and fullscreen flex layouts. 2D, reduced-motion and failure views omit orbit; the landing preview remains passive. Array DPR is capped at (1.5), and visibility gates and cleanup remain active.

All ten sorting lessons share Bubble’s single fullscreen entry/exit action and scene-only immersive layout. Native `requestFullscreen` is preferred, with a browser-viewport fallback. The immersive view contains the mounted live scene, view/zoom/loop controls, orbit help/reset and transport; title, narrative, stage heading, legend and input/editor are hidden. The scene fills the height remaining above transport at desktop and mobile widths. Focus stays trapped, body scrolling is locked, and leaving returns focus to the sorting lesson’s fullscreen action. Heap and bucket auxiliary records remain below the floating controls with (76px) top clearance, a (30dvh) maximum height and their own scrolling, leaving the remaining height for planets.

The sorting scene arrives over (320ms), scaling (.985→1) and fading (.6→1) with exponential ease-out (`cubic-bezier(.16, 1, .3, 1)`). Explicit exit and fallback Escape depart over (180ms), scaling to (.99) and fading to (.5) with ease-in. Native browser Escape exits immediately. Reduced motion uses opacity only (.9→1 on entry and →.9 on exit), under the global (0.01ms) animation/transition override. Entry and exit preserve the mounted scene and playback.

The landing introduction explicitly selects the same BubbleScene space world and runs `bubble.run([3, 5, 2, 4, 1, 6])` in 3D, with interactive orbit disabled. The shared playback hook enables autoplay for this preview while lesson playback defaults to stopped. Sorting starts on visible entry, then repeats the established hold/dust/reform cycle at (1×). A separate native bilingual pause/resume button sits outside the artwork’s lesson link; pausing sorting leaves axial rotation running. Comparison operators, before/after swap pairs and explanations follow the actual current trace step. IntersectionObserver and document visibility gate preview playback and continuous rendering; frame deltas are capped at (0.1s), preventing catch-up jumps. Reduced motion does not autoplay and omits the pause control. Its (235px) scene omits slot indices. Numeric sprite textures are generated at runtime with native canvas text, not externally produced bitmap assets.

Scene motion uses only the clock matching the committed trace step, retaining the last complete frame while the next trace commits. Moving mesh positions remain under the frame clock’s control across React renders.

At (1×), each trace step lasts (2.8s), with a planetary swap taking (1.4s). Explicit play starts the next pending action immediately after initial entry, seeking, any paused comparison or a completed swap’s idle tail; an animated paused swap within its first (1.4s) resumes at its exact progress. Replay from the final trace step starts the first pending action. Planet slots reserve the largest ring envelope plus (0.28) world units. Adjacent opposing semicircles swap planets at constant path speed, with a radius of half the slot spacing; distant array transfers lift clear of intermediate slots, travel at constant path speed, and settle. 3D uses depth, 2D uses vertical clearance. Retained clay swaps use the damped spring, opposing depth arcs (±0.85), a (0.035) lift and (±0.045-radian) tilt. Bubble alone defaults to the repeating epilogue; other lessons stop at their final trace state. The sorted Bubble array holds for (6s), erodes to restrained dust for (6s), and reforms the original input over (3s). The native “천천히 반복” / “Slow loop” checkbox opts out of this cycle. Pause freezes the trace clock, including swaps, nebula, twinkle and dust; seeking or editing restores an exact, fully formed trace state. Planet axial rotation remains independent of playback speed, pause and seek, and seeking or resetting the trace does not reset its local clock. Keep bilingual captions, numerical labels and keyboard controls alongside the scene.

Bubble's two views share a full-canvas procedural nebula and sparse stars behind the planets. Domain-warped noise blends the near-black ground with muted green and mauve light; stars twinkle gently and swaps add a faint local ripple at the projected pair. Planet rotation uses stable ID phases (`id × 0.8`) and size-based periods: small (8s), medium (10s), large (12s). The period is `8 + clamp((radius − 0.13) / 0.4, 0, 1) × 4` seconds, so larger rendered planets turn slightly slower. An independent local visible-time clock advances each space planet with delta capped at (0.1s); 3D rotates the actual sphere about y, while 2D rotates shader terrain on front-facing flattened geometry. Planet material colors ease toward the current neutral, compare, swap or settled palette with `1 − exp(−min(delta, 0.1) × 8)` per frame (about 375ms to reach 95%). Emissive and ring colors follow the interpolated material. Rings, numeric labels and fixed slot centres do not spin. Playback speed, pause and seek govern nebula, twinkle, dust and semicircle swaps, not axial rotation. Hidden documents and offscreen scenes stop local spin and continuous rendering; reduced motion uses the static fallback. No orbital or physics engine is introduced. The legacy optional clay world retains its grey-green wash; active landing selects space. These scene materials use shaders and native canvas value textures, with no external bitmap assets or additional dependencies.

Three.js/Fiber loads lazily through the bubble scene. Cold loading reserves the canvas height with the lesson shader sky, a subdued preview of the actual planetary array, and a bilingual status before the native planets appear. Reduced motion, scene failure or WebGL context loss uses the existing static array renderer; exact trace controls remain available. The landing preview shares that fallback; Big O preserves its accessible counts and descriptions if WebGL fails. All lessons retain exact trace controls and readable evidence through their static or accessible fallback.

## Observatory interaction refinements (2026-10-08)

Verification in the dated refinement records describes those earlier passes. Current sequence and linked-list extension verification and their remaining limitations are recorded in `.impeccable/surfaces/all-lessons-space.md` (2026-10-09).

Fullscreen graphs use the space above transport for the scene; frontier, discovery and result records settle below it, including the SVG top view. Dense records retain scrolling within the scene. Wheel and trackpad vertical scrolling over array or graph artwork changes the same (50–200%) zoom used by the buttons, in regular and fullscreen views; line/page wheel units are normalized. Scrolling outside artwork remains ordinary page scrolling. Reduced motion retains the static view without wheel zoom. The 2D graph keeps its actual topology under a centered SVG scale.

Ambient landing/loading skies retain broad sage and mauve clouds. Graph and other lesson skies use a separate shader with concentrated, faint ochre/mauve orbital currents and sparse stars; arrays retain their separate trace-driven backdrop. WebGL fallback skies also distinguish the two surfaces. HTML first paint, global CSS and Mantine use the same dark ground (#0b1012), including refresh before scripts load.

Verified at 1440×1080 and 390×844 in the browser: fullscreen graph records stay above transport, 2D/3D graph and array wheel zoom updates the shared controls, and no horizontal page overflow occurs on the mobile graph. Type checking, 111 lesson entries, 1452 bilingual trace renders, 484 graph traces, and the loading/zoom/playback checks pass. Browser viewport fullscreen fallback was exercised; native fullscreen and physical mobile GPU performance remain unmeasured. No production rebuild was run.

## Interactive skies and lesson-page atmosphere (2026-10-08)

Shared WebGL backgrounds and native array skies now respond to mouse movement with a damped local nebula curl, star parallax and soft sage light. Their canvases remain pointer-transparent where applicable; existing orbit, wheel zoom and controls keep receiving input. Touch, pen, orbit drags, reduced motion and hidden tabs suppress the response. Listeners are removed on unmount. Pointer motion is independent of algorithm playback. Coordinate, boundary, zero-size, visibility and cleanup checks pass; landing/native array shaders render without browser errors. No new dependency or raster is used.

Every lesson page adds a fixed, viewport-sized observatory sky: a distant diagonal dust river in cool teal and mauve, sparse stars, and faint ochre filaments. This differs from the landing's broad sage clouds and the playback window's orbital currents while retaining the dark ground and ink. Page-sky animation stops behind fullscreen scenes, DPR stays capped at 1.5, and WebGL failure has a corresponding static CSS sky. The first-paint ground remains #0b1012. The shader stays behind navigation and text; playback windows retain their darker frame.

Finish verdict: approved within the existing observatory direction. Browser checks at 1440×1080 and 390×844 confirm legible text, distinct page/playback atmospheres, pointer response, fullscreen entry/exit, no horizontal overflow, and no shader/console errors. Type checking, 111 bilingual lesson entries, 1452 trace renders and pointer/playback checks pass. A production rebuild, native fullscreen and physical mobile GPU performance remain unmeasured.

## Graph wormhole transitions (2026-10-08)

Active 3D connections open an ochre entrance, carry a light through a briefly illuminated spiral tube along the actual curve, and open a mauve arrival. The aperture planes face the observer at the trimmed endpoints so they remain legible while orbiting. Each (1.4s at 1×) transfer uses the existing trace clock; pausing freezes light, spiral and portal expansion, resuming retains progress, and seeking shows the exact static state. Reciprocal lanes, arrows, weights and selected-edge colors remain authoritative. Only active connections allocate the extra tube, two rims and light; no bloom pass, dependency or raster ships, and their geometry/material resources are disposed.

DFS entry/collection uses the recorded stack parent; Euler edge-taking uses its recorded previous vertex. This gives SCC, Hamiltonian and travelling-salesman path entry and Euler steps the same actual-edge transition as explicit current/next traces, while new roots create no connection. All 15 graph algorithm examples have active transitions in the 484-trace geometry check. 2D, reduced-motion and WebGL fallback views retain their static edge emphasis and exact records. Browser verification at 1440×1080 and 390×844 confirmed portal rendering, pause/resume within the same step, readable records, and no console errors or mobile page overflow. Physical mobile GPU performance and the production build remain unmeasured.

### Graph observatory, planar maps, coordinate records and Hanoi

The catalog's 15 graph algorithms plus graph-structure and disjoint-set use lazy native 3D by default, with the existing SVG top view selected through the shared 2D/3D radios. Nodes retain a fixed circular layout with small stable height offsets; equal-radius spheres (0.36) carry printed vertex IDs, subdued rings and a slightly larger atmosphere (0.385). Actual connections use curved tubes and directed cones; reciprocal directed edges occupy separate lanes. Active-edge light travels with the pausable, seekable trace clock. Current, discovered, processed, intermediate and selected-edge states retain their existing semantics. Frontier, distances, predecessor, matrix, discovery/low and disjoint-set records remain exact beneath the scene. Supported input validation still rejects self-loops; defensive loop geometry does not extend that contract.

Drag the graph canvas or focus it and use arrow keys to orbit; Home and Reset view return to the home orientation while preserving zoom. The native orbit implementation is shared with arrays; graph polar bounds remain (0.3–1.35 radians) with unrestricted yaw. Shared (50–200%) zoom controls retain their existing increments and preserve playback. Camera rotation changes projection, not node layout, edge identity or records. Planet surfaces rotate independently over (10s) while visible; rings and labels stay stable. DPR is capped at (1.5), offscreen/hidden scenes use demand rendering, and custom materials, tube geometries and controls are disposed on cleanup. Reduced motion keeps the SVG top view with an explanatory status. Scene failure or WebGL context loss restores that view and preserves records.

Other trees, heap sort, deque and forward/reverse linked-list traversal continue to use native SVG planets in a top view; graph and the two linked-list structure lessons use the same treatment in 2D. Node centres, actual connections, arrow direction, weights and printed IDs stay readable. Autonomous meridian rotation changes the surface markings beneath stationary light/shadow shading, not the topology. Node spin periods are (8–12s), based on radius, and run only while visible in a non-hidden document. Reduced motion removes the spin and state transitions.

Dense dynamic-programming tables, string alignments, bit fields, numerical grids and chess boards keep their actual row/column axes, characters and values. Small orbital beacons mark coordinate records without replacing notation. Seam-carving pixels retain their true grayscale values. These records remain exact data views within the common dark shell. Rain bar values and mathematical point labels use cream space ink against the dark ground; Liu’s `r = 1` label uses dark ground ink inside its sage polygon.

Hanoi uses native 3D torus rings above three fixed labeled stations A, B and C. Disc number determines ring radius; pole arrays determine the real destination and stack level. A moving ring lifts, travels and settles over (1.4s), driven by the same pausable trace clock as playback. The shared committed-step guard holds the last complete frame until the matching trace arrives; the frame loop owns mesh position and rotation across React renders. Independent torus surface rotation takes (8–12s), while labels and station centres remain fixed. Projected disc labels accompany exact top-to-bottom pole records. Enlarged and fullscreen Hanoi uses flex layout: the rings take the height remaining after headings, controls, station records and transport; exact station evidence stays visible. Reduced motion uses static ring geometry and exact station records; WebGL failure preserves the station records. All lesson traces advance at (2.8s) per step at (1×); only Bubble offers the repeating hold/dust/reform cycle.

**The Topology Rule.** Motion may turn node surfaces or move a traced item; it must not invent edges, misrepresent traced station membership, or move a coordinate axis.

Stack, queue, naive string search, KMP and Rabin–Karp additionally provide a lazy native 3D sequence view and their original 2D records. Stack exploration capsules sit inside a cutaway station cargo bay with fixed capacity and one upper PUSH/POP hatch; peek sweeps a scan over TOP. Queue mechanical canisters ride two rails from the right REAR entry to the left FRONT exit in FIFO order. Printed signed values and actual node identities remain authoritative. The three string searches keep a fixed text signal ribbon above a moving pattern scan head, preserving exact UTF-16 units, whitespace, surrogate labels and pattern alignment. Gold identifies the inspected window; a thin beam joins the actual character comparison. KMP prefix construction scans the pattern without implying a text read, and an empty pattern has no head. Prefix/hash tables remain exact DOM evidence. The committed trace clock owns transfers and framing: pause freezes them, resume retains progress, and seek shows the selected snapshot directly. A native disclosure holds the original exact values/indices. Restrained mouse/keyboard orbit, label-scaled zoom and bounded native scroll/swipe keep long input inspectable. Reduced motion and WebGL failure retain the 2D view; visibility gates rendering, DPR is capped at (1.5), and native scene resources are disposed. This approved equipment expression (2026-10-08) reuses the observatory palette and type without new dependencies or raster assets. Z, Hamming, palindrome, deque and forward/reverse linked-list traversal keep their current views.

### Linked-list communication modules

Only the singly and doubly linked-list structure lessons default to lazy native 3D communication equipment, with the original SVG top view available through the shared 2D/3D controls. Octagonal bodies, solar wings, an antenna and pointer ports carry stable node IDs and exact signed values. Next and previous cables occupy separate height/depth channels with arrows; terminal stubs show null. HEAD/TAIL tags and current/previous/next records come from the selected snapshot. Deletion reconnects recorded neighbours, and partial reverse follows the actual pointer arrays rather than inferring adjacency from the displayed row.

Module insertion/departure and cable rewiring follow the shared committed trace clock over (1.4s at 1×): the old cable detaches before its replacement grows, while retained pointers stay connected. Pause freezes progress, resume continues it and seek resolves directly to the selected snapshot. Constrained mouse/keyboard orbit, shared zoom and Home/Reset view preserve playback and zoom. The (350px) scene uses bounded native scroll/swipe; on a changed step it focuses the active node or HEAD only after canvas size, camera and committed clock agree. Manual scrolling persists at the same step. A native disclosure includes the original SVG and exact node/next/previous records; a separate screen-reader record preserves the same data. Reduced motion provides the 2D view with a status, and scene failure or context loss retains that fallback. DPR is capped at (1.5), visibility gates rendering and native resources are disposed. This approved extension (2026-10-09) inherits the palette and type; it adds no dependencies or raster assets. Its verification and finish disposition are recorded in `.impeccable/surfaces/all-lessons-space.md`.

### Heap control slots and hash address docks

Only min-heap, max-heap, priority-queue and hash-table structure lessons default to lazy native 3D storage equipment, with their original SVG heap or DOM bucket-chain view available through the shared 2D/3D controls. This approved local expression (2026-10-09) inherits the observatory palette, body type and quiet controls. Box-shaped control units and cargo panels extend the equipment vocabulary; they do not establish a new global shape or token system. No dependency or raster asset is added, and algorithms and trace semantics remain authoritative.

Heap units carry stable item IDs, exact signed values and priority p where applicable. Fixed platforms and connections use actual heap-array slots, with parent `floor((child−1)/2)`. Indices and ROOT stay attached to slots as units exchange positions; values and p move with their units. The surrounding evidence states parent ≤ child for min-heap, parent ≥ child for max-heap, and smaller p first for priority queues, including temporary adjustment states. A heap's array is not presented as fully sorted. Hash-table uses eight fixed address docks with cargo panels arranged in the actual bucket-chain order. Key/value labels, addressed-dock emphasis and candidate emphasis follow the snapshot; overwriting a key retains its unit identity, while deletion removes its entry.

Transfers and update pulses follow the committed shared trace clock over (1.4s at 1×). Pause freezes motion, resume preserves progress and seek resolves directly to the selected state. Constrained mouse/keyboard orbit, Home/Reset view and shared (50–200%) zoom preserve playback. A bounded native scroll region supports both axes, with maximum heights of (420px) on desktop and (350px) on mobile; its stage grows with the model and zoom. Changed steps focus the active unit or addressed dock after camera, canvas and committed step agree, while same-step manual scrolling persists. An “Inspect exact storage state” native disclosure contains the original 2D evidence, with separate exact screen-reader records. Lazy loading, reduced motion, scene failure and WebGL context loss retain the original view. Visibility gates rendering, DPR is capped at (1.5), and native resources are cleaned up. Heap sort and trees/structures outside these storage and BST/AVL extensions keep their incumbent views. Verification and review disposition are recorded in `.impeccable/surfaces/all-lessons-space.md`.

### BST and AVL branching stations

Only binary-search-tree and AVL structure lessons default to lazy native 3D branching joints, with the original SVG view available through the shared 2D/3D controls. Octagonal metal joints carry stable node IDs and exact signed or fractional values. Sage left arms and mauve right arms connect actual recorded children; inorder horizontal placement and depth preserve branching meaning. Projected cream labels remain upright, using inherited body type at (14px), tabular numbers and a dark backing. Ochre marks active or temporarily unbalanced nodes. This local equipment expression (2026-10-09) inherits the observatory without new global tokens, dependencies or raster assets.

Changed arms detach during trace progress (0–0.22), nodes move during (0.22–0.78), and recorded replacements attach during (0.78–1); retained arms remain connected. The shared committed playback clock freezes transfers on pause, continues on resume and resolves seeks to the selected snapshot. During transfer, existing ROOT/value and AVL b/h labels explicitly represent the prior snapshot, including “PREVIOUS ROOT”; new nodes enter with current values. Completion updates labels and the accompanying status to the current snapshot. A ROOT tag belongs to the labeled node and snapshot. The exact-state disclosure and separate screen-reader record retain current IDs, values and L/R children; returned results remain outside the scene.

Constrained mouse/keyboard orbit, Home/Reset view and shared (50–200%) zoom preserve playback. The bounded two-axis scroll region uses the existing sequence limits of (420px) desktop and (350px) mobile; its stage grows with tree depth, capacity and zoom. Changed steps focus the active node or root after camera, canvas and committed clock agree; same-step manual scrolling persists. Lazy loading, reduced motion, scene errors and WebGL context loss retain the original 2D view. Visibility gates rendering and DPR is capped at (1.5). Existing duplicate handling, empty-tree behavior and the 12-distinct-node limit remain authoritative; other trees, tree traversals, red-black trees and tries retain their incumbent views. Verification and the resolved review finding are recorded in `.impeccable/surfaces/all-lessons-space.md`.

### Native sky, loading and identity

Landing, loading and non-array lesson backgrounds share SpaceSky's native lightweight WebGL highp shader, independently of lazy Three.js/Fiber. Its domain-warped green/mauve nebula drifts slowly behind sparse variable-size twinkling stars, rare subtle halos and faint dust filaments. SpaceSky and the Bubble backdrop use a stable polynomial noise hash; palette and playback ownership remain unchanged. DPR is capped at (1.5); ResizeObserver updates its canvas, cleanup releases shader/program/buffer resources, and hidden tabs stop its RAF. Lesson visibility gates the shared sky. Reduced motion renders a still sky. Shader compilation failure, unavailable WebGL or context loss replaces the canvas with the static CSS atmospheric gradient while text and controls remain readable.

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
