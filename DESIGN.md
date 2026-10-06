---
name: Algorithm Studio
description: Step-by-step algorithm learning with visual execution and JavaScript.
colors:
  primary: "#196d53"
  primary-hover: "#12533f"
  ink: "#1a3028"
  paper: "#f5f7f2"
  surface: "#fff"
  sage-surface: "#e8eee5"
  muted-text: "#4d6255"
  divider: "#d5dfd6"
  landing-bar: "#9bb497"
  landing-comparison: "#c58c47"
  comparison: "#d8964a"
  swap: "#8e79b4"
  settled: "#42886c"
  matched: "#2c7198"
  code-bg: "#17241f"
  code-text: "#e6eee8"
  focus: "#087f5b"
typography:
  display:
    fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif'
    fontSize: "clamp(38px, 4.7vw, 62px)"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-.035em"
  headline:
    fontSize: "clamp(25px, 2.5vw, 34px)"
    fontWeight: 750
    lineHeight: 1.4
    letterSpacing: "-.03em"
  body:
    fontFamily: '"Pretendard", "Noto Sans KR", system-ui, sans-serif'
    fontSize: "15px"
    lineHeight: 1.9
  label:
    fontSize: "13px"
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "13px"
    lineHeight: 1.9
rounded:
  control: "9px"
  code: "12px"
  landing-surface: "16px"
spacing:
  compact: "8px"
  control: "16px"
  group: "24px"
  panel: "32px"
  section-gap: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "14px 19px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  landing-lab:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.landing-surface}"
    padding: "28px 32px 20px"
  code-panel:
    backgroundColor: "{colors.code-bg}"
    textColor: "{colors.code-text}"
    rounded: "{rounded.code}"
---

# Design System: Algorithm Studio

## Overview

The implemented system uses green accents, warm off-white backgrounds, restrained borders, and readable Korean/English typography. The landing carries these incumbent visualizer choices into a more spacious introduction; the lesson workspace keeps execution and code close together.

**Key Characteristics:**
- Green actions and sage surfaces.
- Monospaced values and source code.
- Clear text explanations beside visual evidence.

This document records the current implementation in `web/main.tsx`, `web/styles.css`, and `web/landing.css`; it does not establish a new identity.

## Colors

Primary green identifies actions, highlighted headline text, and input accents. Ink supplies the principal text; paper, white, and sage separate content without heavy contrast. Muted text and dividers support the reading hierarchy.

Landing comparisons use the warmer landing-comparison accent. Lesson states retain their distinct comparison, swap, settled, and matched colors. The dark code panel provides a separate reading surface.

## Typography

The shared font stack supports Korean and English. Display and headline tokens describe landing headings; lesson titles use (30px, weight 750), falling to (27px) on mobile. Intro body text uses (17px, line-height 1.8) and a (43ch) measure; section copy uses the body token with a (65ch) measure. Values, Big O notation, and source code use monospaced faces and tabular numbers where specified.

## Layout

The landing container has a maximum width of (1320px) and desktop horizontal padding of (48px). The opening pairs copy and a sorting preview in (1.1fr / 1fr) columns with a (64px) gap. Divided use-case rows and the white complexity lab keep the lower sections quiet and readable.

At (900px), landing padding becomes (28px) and column gaps contract. At (650px), padding becomes (20px), opening and section introductions stack, and use-case descriptions move beneath their titles. The mobile landing heading uses (42px).

The visualizer uses a (1560px) container with a (180px) catalog and execution/code panels. Above (1050px), it allocates the viewport height and lets panes own their overflow. At (1050px), execution and code stack; at (650px), the catalog becomes a mobile selector and the workspace uses one column.

## Elevation & Depth

The custom landing styles use flat color surfaces and thin borders rather than shadows. Sage groups the preview and closing action; white distinguishes the complexity lab. The visualizer similarly separates execution, controls, and code through surface color and borders.

## Shapes

Controls use gently rounded corners; larger landing surfaces use the landing-surface radius. Code panels use the code radius. Array bars use modest curved tops, while meters remain compact horizontal tracks.

## Components

- Primary links: green fill, white text, a darker hover state, and the shared visible focus outline.
- Header navigation: text links with underlined hover states, plus an outlined language control.
- Complexity lab: native range input, monospaced operation counts, and horizontally scaled meters. Its caption distinguishes the growth model from measured runtime.
- Use-case links: bordered editorial rows with a light sage hover surface.
- Lesson controls: playback, a native timeline, editable inputs, and consistently colored execution states.
- Code panel: dark source surface, line numbers, and a green active-line highlight.

Meter transitions use (0.3s) with `cubic-bezier(.16,1,.3,1)`. Global reduced-motion handling suppresses animation and transitions. Buttons and links use a (3px) focus outline with a (3px) offset.

## Do's and Don'ts

- Do preserve the Algorithm Studio name and existing favicon.
- Do keep Korean and English copy readable at narrow widths.
- Do pair execution colors with textual or numeric evidence.
- Don't present the Big O growth model as measured runtime.
- Don't collapse comparison, swap, settled, and matched lesson states into one accent.
