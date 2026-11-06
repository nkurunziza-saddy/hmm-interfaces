# Tells and diagnoses

## AI-generated product UI tells

Each of these is a default an agent reaches for without deciding. Flag it unless the journal or the project clearly chose it.

- **The SaaS card kit**: content chopped into identical rounded cards, one radius on everything regardless of hierarchy, the same soft grey shadow (`rgba(0,0,0,.1)`) under each card, gradient washes as decoration.
- **Icon + heading + text cards** used as the page structure instead of real content.
- **The hero metric**: a big number, a small label, supporting stats and an accent, used where a plain table would serve.
- **Eyebrows** (small uppercase labels above headings) that carry no information.
- **A coloured `border-left`** wider than 1px on cards, callouts or list items.
- **Fade-and-slide-up** on every section, and hover transitions on every card.
- **Gradient text**, glows, blurred blobs or glass panels in a tool.
- **Several accent colours**, or the accent on headings and icons instead of actions.
- **Emoji or icons** in front of every heading or list item.
- **Generic copy**: "Submit", "Learn more", "Get started" with no object, "Oops! Something went wrong."
- **Invented stats or placeholder metrics** presented as real.
- **Centred everything**: centred text blocks in an app where content should align to a left edge.
- **Every control the same weight**: no primary, so nothing reads first.

## Diagnosis: symptom → cause → fix

Work down the table in order. The top entries account for most of the damage.

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Busy, boxed-in, over-compartmentalised | Too many borders and containers | Remove borders; separate with space, a subtle background step, or one shadow |
| Nothing stands out | Everything has the same weight, or there are several primaries | One primary; de-emphasise the rest (secondary ink, lighter weight) |
| Cramped | Equal space inside and between groups | Space between groups ≥2× the in-group gap |
| Floaty, unanchored | Elements not aligned to shared edges | Align to one left edge and a consistent inset |
| Cheap | Mismatched radii, misalignment, default focus, layout shift, flicker | Match siblings; concentric radii; a `:focus-visible` ring; reserve space; delay spinners |
| Heavy | Dark fills, thick borders, bold everywhere, big soft shadows | A ring plus a tight shadow; one weight step down; fewer filled elements |
| Harsh or invisible 1px border | Trying to solve weight with colour | Keep the soft colour, or switch to a shadow ring; check every field has a fill or a 3:1 edge |
| Grey text looks dirty | Grey on a coloured surface | Tint secondary text from the surface's hue |
| Laggy | Transitions on hover or selection in frequent lists; durations over 200ms | Instant hover; shorten the duration before changing the curve |
| Jumpy | Weight change on hover, missing `tabular-nums`, content loading without reserved space | Colour instead of weight; tabular numbers; skeletons or fixed heights |
| Generic | The tells above | Remove the tell; replace it with the real content or a plain structure |
