---
name: surfaces
description: What product UI is made of on the web. It sets elevation levels with exact shadow recipes for light and dark mode, when to use a shadow and when a border, the transparent border for forced-colours mode, a small radius scale with concentric nesting, image outlines, every interactive state as a surface change (hover, pressed, selected, disabled, focus-visible), icons (one set, currentColor, outline and fill, stroke that tracks text weight, sizes and grid), blur-behind materials and their cost, dividers, scroll edges and overscroll containment. Use it whenever you style a card, menu, popover, dialog, input, button, row, image or icon, add a shadow, border or radius, make a focus ring, build dark mode, or hear "flat", "heavy", "muddy", "cheap", "the border looks off" or "dark mode has no depth".
---

# Surfaces

This skill decides what each thing is made of: its fill, edge, shadow, radius, states and icons. It picks from a short list of recipes, so two screens never carry two different cards.

Before any decision, apply `product-ui` §1 (the taste journal and precedence) and §5 (which skill owns what).

## Decide in this order

1. **Is a surface needed?** Remove before adding. A heading with space around it needs no card. Never nest a card in a card. *Why: every container adds an edge the eye must read.*
2. **Which level?** Page, raised, floating or overlay. One level per element, picked by what it does, not how much you want it to stand out. [elevation.md](references/elevation.md).
3. **What draws the edge?** Elevation gets a shadow ring. Structure gets a border. Never both on one edge. [elevation.md](references/elevation.md#shadow-or-border).
4. **Which radius?** Take the token for the element's role, then make nested radii concentric. [elevation.md](references/elevation.md#radius).
5. **Which states?** Design hover, pressed, selected, disabled and focus-visible as changes to the surface, before polishing the default. [states-and-icons.md](references/states-and-icons.md#states).
6. **Which icon treatment?** One set, `currentColor`, stroke matched to the text. [states-and-icons.md](references/states-and-icons.md#icons).
7. **Is a material allowed?** Only floating chrome over scrolling content. [materials-and-edges.md](references/materials-and-edges.md#materials).
8. **Edges of the scroll.** Dividers, fades, overscroll. [materials-and-edges.md](references/materials-and-edges.md#dividers).

## The four levels

| Level | For | Light | Dark |
| --- | --- | --- | --- |
| Page | The ground | Ground fill, no shadow | Darkest fill, no shadow |
| Raised | Cards, controls, the chosen option | White, ring + 1px drop + 3px tight drop | One step lighter, white ring, tight black drop |
| Floating | Menus, popovers, tooltips, toasts | White, ring + 1px drop + 4px tight drop | Two steps lighter, white ring, tight black drop |
| Overlay | Dialogs, sheets, command palette (with a scrim) | White, ring + 1px drop + 6px tight drop | Three steps lighter, white ring, tight black drop |

Exact tokens are in [elevation.md](references/elevation.md#tokens). The rules behind them:

- **A ring plus a tight drop.** Blur ≤ 8px, offset ≤ 6px, drops with a negative spread. *Why: big soft blurs read as glow, muddy the page and look generated.*
- **Dark mode rises by getting lighter.** Shadows barely show on dark, so lightness carries height and a white ring at low alpha carries the edge.
- **Shadows are translucent and one colour.** Opaque greys leave a halo. Dark drops stay black.
- **Siblings share a level.** Cards in a row have one shadow, one radius, one padding.
- **Hover changes the fill, not the shadow.**

## Rules that need no reference

- **Borders show structure, shadows show elevation.** Dividers, inputs, table cells and selected states keep borders. A card whose border exists only to lift it gets a ring instead.
- **Keep `border: 1px solid transparent` under a shadow ring.** *Why: forced-colours mode removes shadows, and the border still draws an edge.*
- **Images get a 1px inset outline**: `outline: 1px solid` black at 10% (white at 10% in dark), `outline-offset: -1px`. Never a tinted colour, which shows as a fringe. Skip logos and transparent artwork.
- **Concentric radius.** Outer = inner + padding (+ border), up to 24px of padding. Past it, they are separate surfaces.
- **Focus is a ring, never nothing.** `:focus-visible` shows a 2px accent outline at 2px offset. `outline: none` without a replacement is a bug. The ring takes no layout space.
- **Disabled controls take no hover, press or scale.**
- **Icons**: one set per surface, `currentColor`, outline by default and filled when active. Stroke tracks the neighbouring text weight, 1.5px at 400 up to 2px at 600.
- **Blur-behind only on floating chrome.** Never on content, cards or tables.
- **Scrollable overlays** (dialogs, drawers, menus) get `overscroll-behavior: contain`.

## Pairs

| Broken | Fixed | Why |
| --- | --- | --- |
| `border: 1px solid #e5e5e5` on a card | `box-shadow: var(--elev-raised); border: 1px solid transparent` | A depth-only border becomes a ring; forced colours still draws an edge |
| `box-shadow: 0 10px 40px rgba(0,0,0,.2)` | `0 0 0 1px a.08, 0 1px 2px a.12, 0 4px 8px -4px a.16` | Tight and crisp beats big and soft |
| Dark card with `0 8px 24px #000` | Lighter fill plus `0 0 0 1px oklch(1 0 0 / .08)` | Shadows vanish on dark; lightness shows height |
| Card radius 8, inner image radius 8, padding 8 | Inner 8, outer 16 | Concentric corners keep an even gap |
| `<img>` melting into a white card | `outline: 1px solid oklch(0 0 0 / .1); outline-offset: -1px` | The edge reads without a border |
| `button:focus { outline: none }` | `button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }` | Keyboard users keep their place |
| 1.5px icon stroke beside a 600-weight label | 2px stroke | Stroke weight matches stem weight |
| Filled icons in every toolbar slot | Outline by default, filled for the active one | Fill is the state signal |
| `backdrop-filter: blur(20px)` on a card | An opaque surface | Blur belongs to chrome floating over scrolling content |

## Before you finish

| Pattern | Fix |
| --- | --- |
| `box-shadow` with blur > 8px or alpha > .2 on light UI | Use a level token |
| `border` plus `box-shadow` doing the same job | Ring plus transparent border only |
| Shadow ring without `border: 1px solid transparent` | Add it |
| Same `border-radius` on a parent and its padded child | `inner + padding` for the parent |
| `outline: none` or `outline: 0` without `:focus-visible` replacement | Add the ring |
| `:focus` (not `:focus-visible`) styling a ring | Switch to `:focus-visible` |
| `border-width` changing in a state | Colour, fill, or a transparent border of equal width |
| Hardcoded `fill="#…"` or `stroke="#…"` in an icon | `currentColor` |
| Two icon libraries imported on one screen | One |
| `backdrop-filter` outside a sticky bar, sidebar or floating menu | Remove it |
| Overlay list without `overscroll-behavior: contain` | Add it |
| Hard cut at a scroller's edge, or a shadow clipped by `overflow: hidden` | Fade the edge; pad the scroller |

Verify by rendering light and dark at 2× and cropping an edge of each level. Hover, press, Tab to focus, select and disable each control and compare the box size before and after. Toggle forced colours (Chrome devtools, rendering emulation) and confirm every card still has an edge.
