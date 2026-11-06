---
name: design-vocabulary
description: Two-way glossary for product UI design. It turns a vague description into the exact term and the concrete change ("it feels cramped" → tighten nothing, add space between groups; "the thing where the menu grows out of the button" → origin-aware scale). It also turns designer shorthand ("let it breathe", "bump the leading", "fix the hierarchy", "it feels heavy") into specific edits with values. Use it when the user describes a look, feel or effect without naming it, asks "what's it called when…", uses design shorthand, or when you need the right word to brief another agent or designer.
---

# Design vocabulary

People describe what they see and feel, not the technical name. This skill maps that sensation to the term, and the term to a concrete change. The right word gets better results from agents and designers alike.

## How to answer

1. **Read for intent, not keywords.** "Springy", "slides off", "feels heavy" and "too busy" are sensations. Find the term behind the sensation in [references/glossary.md](references/glossary.md).
2. **Lead with the term, then the change.** Use this format:

   **Origin-aware scale**: the popover grows from the button that opened it instead of from its own centre. → `transform-origin: var(--transform-origin)`, scale from `0.95`.

3. **Shorthand becomes an edit.** When the user says "let it breathe", don't echo it back. Translate it into the specific change, using values from the `product-ui` skill: "add one spacing step between groups (16 → 24px); leave the space inside groups alone".
4. **Disambiguate close terms.** When two terms compete (crossfade vs. morph, popover vs. dialog, tracking vs. kerning), give the best match first, then one line on how the other differs.
5. **If nothing matches,** give the closest term, say it's an approximation, or describe the effect in glossary words ("a stagger of scale-in entrances").
6. **Stay inside the glossary.** If a term isn't there, say so rather than inventing one. You can still explain the concept with glossary words.
7. **Keep it tight.** A naming question wants a name, not an essay. Expand only if asked.

## When briefing other agents

When you write a prompt for another agent, use glossary terms instead of feel words. "Stagger the rows 40ms, ease-out, from 8px below" gets a predictable result. "Make the list feel lively" doesn't.
