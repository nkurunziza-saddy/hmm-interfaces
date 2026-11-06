# Glossary

## Contents
- Shorthand → edit
- Hierarchy and layout
- Spacing and alignment
- Type
- Colour
- Surfaces and depth
- States and feedback
- Interaction
- Motion
- Writing
- Feel words

## Shorthand → edit

| They say | It means | Edit |
| --- | --- | --- |
| "Let it breathe" | Groups are crowded against each other | Add one spacing step *between* groups; leave the space inside groups alone |
| "Tighten it up" | Related things are too far apart, or there is slack everywhere | Remove one spacing step *inside* groups; check line-height on interface text (1.3–1.4) |
| "It feels cramped" | Not enough space between groups, or the measure is too wide | More space between groups first; then cap the measure |
| "It's too busy" | Too many containers, borders, colours or weights competing | Remove borders, containers and icons before anything else; drop to one accent |
| "Fix the hierarchy" | Nothing reads first, or the wrong thing does | Name the one primary element; de-emphasise competitors (lighter ink, smaller size) rather than enlarging the primary |
| "Make it pop" (product UI) | The primary action doesn't stand out | Make it the only filled accent element and quiet everything else; no glows or gradients |
| "It feels heavy" | Too much ink: dark fills, thick borders, bold weights, big shadows | Lighter borders or shadows instead of borders, one weight step down, fewer filled elements |
| "It feels cheap" | Inconsistencies: mismatched radii, misalignment, default focus rings, layout shift | Find the mismatch (siblings, radii, alignment, states) instead of adding decoration |
| "Bump the leading" | Line-height too tight | Raise line-height one step (1.3 → 1.4 for interface text, 1.5 → 1.6 for reading) |
| "Set it tighter" / "looser" | Tracking | Adjust letter-spacing in small steps (±0.005–0.01em); headings tighter, small caps labels looser |
| "Knock it back" / "push it back" | Too prominent | Lower contrast (secondary text colour) or size; don't remove it |
| "Bring it forward" | Not prominent enough | Primary text colour or one weight step up; avoid adding colour |
| "It's floating" | No visual anchor: an element sits between groups | Align it to an edge, or move it into the group it belongs to |
| "Sharpen it" | Soft edges, blurry shadows, mushy alignment | A crisp 1px ring plus a tight shadow; align to the pixel grid |
| "Snappier" | Motion too slow or using the wrong curve | Shorten the duration first (to ≤200ms), then use the strong ease-out |
| "Too much going on" (motion) | Several things animating at once or on frequent actions | Remove motion from frequent actions; one thing leads, the rest follow or stay still |
| "Feels laggy" | Hover or selection transitions on frequent interactions | Make them instant |
| "Feels off" | Usually timing, origin or a mismatched curve | Check the transform-origin, `ease-in`, and duration over 200ms on small elements |

## Hierarchy and layout

- **Hierarchy**: the order in which things are noticed. It is set by size, weight, contrast and position, in that order of strength.
- **Primary action**: the single most likely next step on a surface, and the only filled accent button.
- **Secondary / tertiary action**: subordinate actions, shown as outline or ghost buttons and as text links.
- **De-emphasise**: make competitors quieter so the important thing stands out, instead of making it louder.
- **Visual weight**: how much attention an element pulls, through ink, size, contrast and saturation.
- **Focal point**: the one element the eye lands on first.
- **Grouping / proximity**: nearness reads as relationship.
- **Chunking**: breaking content into small groups so it can be scanned.
- **Progressive disclosure**: the common things first, the rest one step deeper (a disclosure, menu or detail view).
- **Density**: how much information fits in a given space. Compact suits tools used all day; comfortable suits occasional use.
- **Measure**: line length in characters. Reading text runs 60–75.
- **Grid / columns / gutter**: the underlying structure; the space between columns.
- **Wayfinding**: each screen answers where am I, what's here, where can I go, and how do I get out.
- **Empty state**: what a view shows with no data. It explains what belongs there and offers one action.
- **Overflow**: what happens when content exceeds its box (truncation, wrapping, scrolling).

## Spacing and alignment

- **Spacing scale**: a fixed set of spacing values (on a 4px base) used everywhere instead of one-off numbers.
- **Inset / padding**: space inside a container.
- **Gap**: space between siblings.
- **Rhythm**: consistent repeating spacing that makes a layout feel ordered.
- **Optical alignment**: nudging by eye where geometric alignment looks wrong (icon buttons, play triangles, round shapes).
- **Optical size compensation**: round and pointed shapes need about 10% more size to look equal to squares.
- **Baseline alignment**: text in neighbouring elements shares a baseline.
- **Cap-height centring**: centring text in a control on its capital height rather than its line box.
- **Concentric radius**: nested corners where outer = inner + padding, so the curves run parallel.
- **Hit area / target**: the clickable region, which can be larger than the visible glyph.
- **Dead zone**: a gap between clickable items where clicks do nothing.
- **Hug / fill / fixed**: sizing to content, to the container, or to a set value.

## Type

- **Type scale**: the fixed set of sizes; the ratio between steps (1.125 for app UI).
- **Leading / line-height**: vertical space per line.
- **Tracking / letter-spacing**: uniform spacing across a run of text.
- **Kerning**: spacing between specific letter pairs. It's built into the font and rarely touched.
- **Weight**: stroke thickness (400 regular, 500 medium, 600 semibold).
- **Tabular figures (tnum)**: digits of equal width, so numbers don't jitter and columns line up.
- **Proportional figures**: digits of natural width, for prose.
- **Case-sensitive forms (case)**: punctuation raised to sit with capitals and numerals.
- **Slashed zero / disambiguation**: glyph variants that separate 0 from O and 1 from l, for codes and IDs.
- **Optical size (opsz)**: a font axis that adjusts letterforms for small text vs. display.
- **Text vs display cut**: a design for small sizes (looser, taller x-height) vs. large sizes (finer, tighter).
- **Widow / orphan**: a lone word on the last line, or a stranded line. Fix with `text-wrap: pretty` or `balance`.
- **Balance**: evening out line lengths in headings.
- **Truncation / line clamp**: cutting text with an ellipsis after one or more lines.
- **Smart punctuation**: curly quotes, en dash for ranges, em dash for asides, the ellipsis character.
- **Sentence case / title case**: capitalising only the first word vs. every major word.
- **Overline / eyebrow**: a small label above a heading. Often decoration; remove unless it carries information.

## Colour

- **Neutral / grey ramp**: the steps of grey that carry structure.
- **Accent**: the one brand or action colour.
- **Semantic token**: a colour named by its job (`--color-text-secondary`), not its value.
- **Primitive**: a raw value (`--blue-500`). Components never use these directly.
- **Status colours**: success, warning, danger and info.
- **Contrast ratio**: luminance difference between foreground and background (4.5:1 text, 3:1 large text and UI edges).
- **Tint / shade**: a colour mixed toward white or toward black.
- **Saturation / chroma**: colour intensity.
- **OKLCH**: a perceptual colour space where equal steps look equal. Good for building ramps.
- **Elevation in dark mode**: higher surfaces get lighter, not shadowed.
- **Colour scheme**: the light or dark appearance (`color-scheme` on `<html>`).

## Surfaces and depth

- **Surface**: any filled container (page, card, panel, popover).
- **Elevation**: perceived height above the page, shown with shadow (light) or lightness (dark).
- **Ring**: a 1px translucent outline drawn with `box-shadow`.
- **Layered shadow**: several small shadows stacked (ring + tight drop + soft ambient) for a crisp edge.
- **Divider / separator**: a line that structures content. A border is right here.
- **Inset outline (images)**: a 1px 10% black or white line inside an image's edge.
- **Material / translucency**: a blurred, tinted background behind floating chrome.
- **Scrim / backdrop / overlay**: the dimmed layer behind a modal.
- **Scroll edge**: a soft fade where scrolling content meets fixed chrome.

## States and feedback

- **Rest / hover / pressed (active) / focus-visible / selected / disabled**: the interaction states every control needs.
- **Loading / empty / error / partial / long-data**: the data states every view needs.
- **Optimistic update**: showing the result before the server confirms it, with a rollback on failure.
- **Inline feedback**: confirmation shown at the trigger (a check mark on the copy button).
- **Toast**: a transient message for a result that needs no action.
- **Skeleton**: a placeholder in the shape of the content while loading.
- **Undo window**: a short period to reverse a destructive action instead of confirming it first.
- **Affordance**: a visual cue suggesting what can be done (a raised button, a grab handle).
- **Signifier**: the specific mark that communicates the affordance.

## Interaction

- **Direct manipulation**: acting on the object itself, with content tracking the pointer 1:1.
- **Command menu / palette (⌘K)**: a searchable list of every action.
- **Popover**: a non-modal panel anchored to its trigger.
- **Dialog / modal**: blocks the page until dismissed.
- **Sheet / drawer**: a panel that slides in from an edge.
- **Combobox**: a text input with a filtered list.
- **Segmented control**: a small set of mutually exclusive options in one row.
- **Disclosure / accordion**: a section that expands or collapses.
- **Inspector**: a side panel showing properties of the current selection.
- **Prediction cone / safe triangle**: a forgiving zone that keeps a submenu open while the pointer moves diagonally toward it.
- **Hysteresis**: a small movement threshold before a gesture commits, so jitter isn't misread.
- **Momentum / projection**: a released drag continues with its velocity to a predicted resting point.
- **Rubber-banding / damping**: dragging past a limit moves less and less, then springs back.
- **Pointer capture**: a drag keeps tracking even when the pointer leaves the element.
- **Roving focus**: arrow keys move focus within a group; Tab moves between groups.
- **Focus trap**: focus stays inside a modal until it closes.
- **Spatial consistency**: things leave the way they came and return along the same path.

## Motion

- **Easing / curve**: how speed changes over a transition (ease-out, ease-in-out, linear).
- **Ease-out**: starts fast, settles slowly. Use it for entering and exiting.
- **Ease-in-out**: speeds up then slows down. Use it for movement on screen.
- **Spring**: physics-based motion defined by duration and bounce. It keeps velocity when interrupted.
- **Bounce / overshoot**: a spring passing its target before settling.
- **Duration**: how long a transition takes.
- **Origin-aware scale**: a popover grows from its trigger instead of its centre.
- **Scale in / fade in**: entering from a slightly smaller scale with opacity.
- **Crossfade**: one element fades out while another fades in, in the same place.
- **Morph**: one shape turns into another.
- **Layout animation**: elements animate to new positions when the layout changes.
- **Shared element transition**: one element travels between two views.
- **Stagger**: siblings animate one after another with a small delay.
- **Choreography / orchestration**: ordering several animations so they read as one motion.
- **Interruptible**: a motion that can reverse mid-flight from its current position (transitions and springs; not keyframes).
- **Enter / exit**: the animation when an element is added or removed.
- **Reduced motion**: the user setting that asks for fewer, gentler animations.
- **Jank**: dropped frames; motion that stutters.
- **Clip-path reveal**: uncovering content by animating a clipping shape.

## Writing

- **Microcopy**: the short words in an interface (labels, buttons, hints, errors).
- **Voice / tone**: consistent personality / its adjustment to the moment.
- **Verb + object label**: a button naming its action ("Save draft").
- **Front-loading**: putting the important word first.
- **Placeholder**: hint text inside an empty field. Never a replacement for a label.
- **Helper text**: guidance shown under a field.

## Feel words

| Word | What it usually means in the interface |
| --- | --- |
| Crisp | Sharp edges, tight shadows, fast ease-out motion, aligned to pixels |
| Calm / quiet | Mostly neutral, one accent, little motion, generous space between groups |
| Dense | Compact spacing and interface line-height, many rows visible, small type |
| Airy | Generous space between groups, wide margins, fewer elements |
| Snappy | Short durations, strong ease-out, instant hover |
| Heavy | Dark fills, thick borders, bold weights, big shadows |
| Polished | Consistent details: matched siblings, every state designed, no layout shift |
| Native-feeling | Platform conventions: native controls, keyboard support, no invented affordances |
| Alive | Responds to input: press feedback, interruptible motion, momentum |
| Cheap | Inconsistency: mismatched radii, misalignment, default focus, flicker |
