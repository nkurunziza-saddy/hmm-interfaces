# Materials, dividers, scroll edges and overscroll

Load this for steps 7 and 8: any blur-behind or translucent surface, any line between regions, any scroll container's edge.

## Contents
- Materials
- Dividers
- Scroll edges
- Overscroll

## Materials

Translucency answers one question: does the user need to see that the content is still there, scrolling behind this? If not, the surface is opaque.

| Allowed | Not allowed |
| --- | --- |
| A sticky toolbar or header over scrolling content | Cards, tables, any element in the content layer |
| A sidebar that content scrolls under | A surface over a flat colour (the blur shows nothing) |
| A floating menu or popover over varied content | Full-screen layers, or layers that move or resize |
| | Overlay scrims (dim, don't blur) |
| | Tools where text sits on the material and small text must hold 4.5:1 |

```css
.toolbar {
  position: sticky; top: 0;
  background: color-mix(in oklab, var(--surface-page) 80%, transparent);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}
@media (prefers-color-scheme: dark) { .toolbar { background: color-mix(in oklab, var(--surface-page) 60%, transparent); } }
@supports not (backdrop-filter: blur(1px)) { .toolbar { background: var(--surface-page); } }
@media (prefers-reduced-transparency: reduce), (forced-colors: active) {
  .toolbar { background: var(--surface-page); backdrop-filter: none; }
}
```

- **Values:** blur 20px; fill 80% opaque in light, 60% in dark. Dark takes more transparency because dark fills hide less. Raise the opacity before the blur if text contrast fails.
- **Check contrast against the worst backdrop**: white text over a white image. Thicker (more opaque) material for small text; thinner only for large or decorative content.
- **The edge stays.** Chrome over content still gets its 1px line, shown once content scrolls under it.
- **Every material has an opaque fallback** for no `backdrop-filter`, reduced transparency and forced colours.

The cost, and the limits it sets:

- `backdrop-filter` makes the browser rasterise what's behind the element, and redo it whenever that changes, which is every frame of a scroll. Cost grows with area and blur radius.
- At most two blurred elements visible at once. Keep each to a bar or a menu, never a screen.
- Never animate, resize or transform the element that holds the filter at large sizes. Fade a static copy or the blur's container instead.
- Never nest one `backdrop-filter` inside another. The inner one only sees the outer's output.
- A scrim is `oklch(0 0 0 / .3)` in light and `.6` in dark, with no blur. Blurring the page behind a dialog is the generated-UI tell.
- Product UI never uses glass as decoration: no glass cards, no glow, no gradients behind blur.

## Dividers

Space first, a fill second, a line last. Where a line stays:

- 1px solid, in the border token. Alpha borders only where the background varies; solid grey elsewhere. *Why: overlapping alpha borders show darker crossings.*
- A divider spans the thing it divides: full width of its card, menu or drawer. In menus and drawers it runs edge to edge, with the space above and below equal to the side padding.
- Table rules run between rows. Add column rules only to dense grids where columns need tracing.
- Never draw a border twice. Where two bordered boxes touch, one owns the shared line.
- A sticky bar's bottom line is invisible at rest and appears once content scrolls under it:

```css
.toolbar { border-bottom: 1px solid transparent; transition: border-color 150ms; }
.toolbar[data-scrolled] { border-bottom-color: var(--border); }
```
Set `data-scrolled` from an `IntersectionObserver` on a 1px sentinel at the top of the scroller, never from a scroll handler. Where `animation-timeline: scroll()` is supported, drive the line's opacity from it.

- Section breaks of 32px or more need no line.

## Scroll edges

A hard cut at a scroller's edge hides that more content exists, or implies there is none. A fade says "more" better than a scrollbar. It appears only at an edge that has content beyond it.

| Where | Fade length |
| --- | --- |
| Under a sticky top, or a vertical list | 24px |
| A sidebar or rail | 36px |
| A sideways row | 20px |

```css
@property --fade-top    { syntax: "<length>"; inherits: false; initial-value: 0px; }
@property --fade-bottom { syntax: "<length>"; inherits: false; initial-value: 24px; }
.scroller {
  overflow-y: auto;
  mask-image: linear-gradient(to bottom, transparent 0, #000 var(--fade-top), #000 calc(100% - var(--fade-bottom)), transparent 100%);
}
@supports (animation-timeline: scroll()) {
  .scroller {
    animation: fade-top linear both, fade-bottom linear both;
    animation-timeline: scroll(self), scroll(self);
    animation-range: 0 24px, calc(100% - 24px) 100%;
  }
}
@keyframes fade-top    { from { --fade-top: 0px }  to { --fade-top: 24px } }
@keyframes fade-bottom { from { --fade-bottom: 24px } to { --fade-bottom: 0px } }
```

- At rest the top has no fade, so the first line is never dimmed. The bottom fades until the last line is reached.
- Where scroll-driven animation isn't supported, use no mask: do not ship a static fade that dims the first or last line.
- A fade in the background colour (the mask technique above works on any background). Never a bar-with-border over floating controls where a fade will do.
- Give a scroller padding for the shadows and focus rings of its children (≥ 8px for shadows, ≥ 4px for rings), or use `overflow: clip` with `overflow-clip-margin`.
- Content that scrolls sideways (code, tables) scrolls, never wraps, and shows the edge fade.

## Overscroll

- `overscroll-behavior: contain` on every scrollable overlay: dialogs, drawers, menus, popover lists, command palette lists. *Why: without it the end of the list scrolls the page behind the dialog.*
- The same on app-shell regions that scroll on their own.
- `overscroll-behavior: none` only where rubber-banding would break the layout (a full-screen canvas or map).
- A modal also stops the page behind from scrolling. A native `<dialog>` opened with `showModal()` plus `contain` does this; otherwise lock the body's scroll and keep `scrollbar-gutter: stable` so the lock doesn't shift the page.
