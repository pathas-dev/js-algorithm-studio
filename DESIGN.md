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
  # Bubble-sort only: approved 3D daydream extension.
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
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.landing-surface}"
    padding: "28px 32px 20px"
  code-panel:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-text}"
    rounded: "{rounded.code}"
  bubble-canvas:
    backgroundColor: "{colors.bubble-canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.canvas}"
    padding: "22px 28px"
  bubble-loop:
    textColor: "{colors.bubble-loop-ink}"
    typography: "{typography.label}"
---

# Design System: 이젠 아무래도 좋을 알고리즘

## Overview

The approved concept uses green accents, light paper, muted sage surfaces and lighter headings across the landing and lessons. Playful Korean/English introductions invite watching; exact algorithm summaries and step evidence support closer reading. The execution canvas leads, with source code available below when curiosity calls.

**Key Characteristics:**
- Light paper, sage actions and restrained borders.
- Lighter headings and quiet bilingual copy.
- Visible execution with code closed until requested.
- Monospaced values and distinct execution states.

This document records `web/main.tsx`, `web/styles.css`, `web/idle.css` and `web/landing.css`. The incumbent favicon remains the identity asset.

The approved bubble-sort extension below records `web/bubble.css`, `web/BubbleScene.tsx`, `web/bubble-playback.ts`, `web/useBubblePlayback.ts` and their integration in `web/App.tsx`. Every `bubble-*` token and scene rule applies only to bubble sort; the shared design and other lessons retain their existing treatment.

## Colors

Green remains the underlying accent; pale sage now carries primary actions. Paper, white and the light canvas separate content without heavy contrast. Selected text, explanation links and muted copy use related green neutrals.

Array and landing-preview bars use the quieter bar palette. Comparison, swap and settled retain distinct hues; matched bars remain blue. Incumbent comparison, swap, settled and matched tokens continue in legends, graph, matrix and other lesson states. Keep these contextual palettes rather than flattening every state to sage.

Dark code surfaces retain their existing reading contrast and green active-line evidence.

Bubble sort alone uses warm paper and a warmer canvas, grey-green stone, muted amber comparison, lilac swap and deeper green settled states. Dust and warm/cool illumination belong to the scene materials; light tokens are shader inputs rather than flat UI swatches. Subtle seeded lightness variation and grain keep the clay tactile. Values, indices and exact step evidence accompany the material colors.

## Typography

Pretendard and Noto Sans KR support Korean and English. Landing displays, section headings and lesson titles use the lighter hierarchy in the frontmatter. Brand text uses the brand weight; actions, catalog labels and evidence generally use (450–550). Detailed explanations and numerical labels retain their own emphasis where needed.

Lesson taglines use the tagline size, falling to (19px) below (650px). Exact lesson summaries use (15px, line-height 1.85) and a (65ch) measure. Landing intro copy uses (17px, line-height 1.8), falling to (15px) on mobile, with a (43ch) measure. Landing section copy uses the body token and a (65ch) measure. The mobile landing display uses (36px).

Values, Big O notation, mathematical expressions and code use native monospace stacks with tabular numbers where specified. Array values use (15px, weight 450); action evidence uses (15px, weight 500).

## Layout

The landing retains a (1320px) container and (48px) desktop horizontal padding. Its opening pairs copy and a sorting preview in (1.1fr / 1fr) columns with a (64px) gap. Divided use-case rows and a white complexity lab keep the lower sections readable. At (900px), padding becomes (28px). At (650px), padding becomes (20px), the introduction and section copy stack, and the use-case description moves below its title.

Lessons use a (1560px) container and (180px) catalog beside a single reading column. The document scrolls naturally; the catalog has its own (70dvh) maximum height. The workspace gap is (48px), becoming (28px) at (1050px) and (20px) at (650px). On mobile, a native selector replaces the catalog. The execution canvas precedes the code disclosure at every width.

Canvas padding becomes (20px 16px) on mobile. Array charts use a (225px) height, falling to (196px) on mobile. Expanded code has a bounded scroll area of (320–420px).

## Elevation & Depth

Primary surfaces are flat: thin dividers and tonal layering provide separation without shadows. White distinguishes the Big O lab; sage holds execution and the closing invitation. The detailed step-explanation popover retains its Mantine medium shadow as a transient overlay.

Bubble sort alone adds real shallow 3D depth: a fixed orthographic view of tapered, softly rounded clay columns, matte material (roughness 0.93, metalness 0), warm key light and soft floor shadows. The floor receives shadows; columns do not. Columns stop casting once erosion reaches (0.3), avoiding solid ghost shadows during dissolution. Keep this depth inside the execution artwork.

## Shapes

Controls remain gently rounded. Lesson canvases and dark code panels use their respective radii; landing surfaces use the larger landing radius. Playback and disclosure wrappers are flat, divided by horizontal rules. Array bars use smaller curved tops and subtly curved bottoms; landing-preview bars use (5px 5px 0 0). Complexity meters use (3px) corners.

## Components

- Primary actions: pale sage fill, quiet green text and a darker sage hover. Lesson playback says “그냥 구경하기” / “Just watch” before playback begins.
- Navigation: quiet text links, underlined hover, an outlined language switch and a sage selected catalog row. Mobile lessons use a native grouped selector.
- Complexity lab: native range input, monospaced operation counts and meters on a shared scale. The caption identifies the simple growth model rather than measured runtime.
- Execution canvas: light sage surface, factual step evidence and editable input beneath the visualization. Existing validation, playback, timeline, speed and keyboard controls remain available.
- Code disclosure: native `details` / `summary`, closed on entering a lesson and reset on lesson change. The summary reads “코드도 궁금하다면” / “If you’re curious about the code”, with a plus/minus indicator. Opening reveals the incumbent dark panel, line numbers and active-line highlight.
- Step explanation: “궁금하다면” / “Curious?” opens the precise explanation and relevant variables.

Meter transitions use (0.3s) with `cubic-bezier(.16,1,.3,1)`. Global reduced-motion handling suppresses animation and transitions; lesson motion respects the user's preference. Buttons, links, timeline and disclosure summary retain a (3px) focus outline with a (3px) offset.

### Bubble sort only: 3D daydream

The artwork reuses the exact bubble-sort trace and stable item identities. Signed values retain their direction and readable DOM value/index labels. Its frame is (350px) high, or (320px) below (650px); long arrays scroll horizontally. The warmer canvas uses its scoped padding, becoming (20px 14px) on mobile. Input editing sits below the artwork; transport, native timeline and speed controls follow the canvas, before exact step evidence and the closed code disclosure.

At (1×), each trace step lasts (2.8s), with a swap interpolating over (1.4s). The sorted array holds for (6s), erodes to restrained dust for (6s), and reforms the original input over (3s). The native “천천히 반복” / “Slow loop” checkbox opts out of this cycle. Pause freezes the shared clock; seeking or editing restores an exact, fully formed trace state. Keep bilingual captions, numerical labels and keyboard controls alongside the scene.

Three.js/Fiber loads lazily through the bubble scene. Reduced motion, scene failure or WebGL context loss uses the existing static array renderer; exact trace controls remain available. These scene primitives extend bubble sort only and do not establish a new palette, depth or motion rule for other lessons.

## Do's and Don'ts

- Do use the Korean and English product names and preserve the incumbent favicon.
- Do keep Korean and English copy readable at narrow widths.
- Do place playful taglines alongside exact summaries and step explanations.
- Do lead with execution and keep code available through a closed native disclosure.
- Do pair execution colors with textual or numeric evidence.
- Don't present the Big O growth model as measured runtime.
- Don't collapse comparison, swap, settled and matched lesson states into one accent.
- Don't turn precise input constraints or error messages into jokes.
