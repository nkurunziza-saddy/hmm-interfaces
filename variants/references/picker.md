# Picker

A small bar fixed to the bottom of the page. It is chrome: copy it, swap its colours for the project's own tokens, and delete it with the harness. *Why: the bar then follows the page's light and dark theme.*

## Contents
- Spec
- Vanilla JS
- React

## Spec

- Pill in the page's surface, text, border and selected-fill tokens (the snippets use `--surface`, `--text` and `--border`, the last for both the edge and the selected fill; rename to the project's), system font, 13px, fixed at the bottom centre, 8px from the edge, `z-index: 2147483647`. It follows the page's light and dark theme; never hard-code a colour.
- One button per variant, labelled with its number and name. Active: `aria-pressed="true"`.
- The pick lives in the URL as `?v=<n>` (1-based), written with `history.replaceState`. Read it at load; fall back to 1. *Why: every variant is a link, and a reload keeps the pick.*
- Keys: Left and Right arrows, and `1`–`5`, switch variant. `H` hides the bar. Ignore keys with a modifier, from inputs, textareas, selects and contenteditable, and when `defaultPrevented`.
- Switching is instant: no transition. *Why: flipping happens 100+ times a session.*
- Show only the active variant (`hidden` on the others) so state in one doesn't leak into another.

## Vanilla JS

Variants are siblings marked `data-variant="1"`, `data-variant="2"`. Names go in `data-name`.

```html
<div data-variant="1" data-name="Grouped">…</div>
<div data-variant="2" data-name="Presets" hidden>…</div>

<script>
(() => {
  const vs = [...document.querySelectorAll('[data-variant]')];
  const bar = document.createElement('div');
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Variants');
  bar.style.cssText = 'position:fixed;left:50%;bottom:8px;transform:translateX(-50%);display:flex;gap:2px;padding:3px;background:var(--surface);border:1px solid var(--border);border-radius:10px;font:13px/1.3 system-ui,sans-serif;z-index:2147483647';
  const btns = vs.map((v, i) => {
    const b = document.createElement('button');
    b.textContent = (i + 1) + ' ' + (v.dataset.name || '');
    b.style.cssText = 'all:unset;cursor:pointer;padding:6px 10px;border-radius:7px;color:var(--text);white-space:nowrap';
    b.onclick = () => pick(i + 1);
    bar.append(b);
    return b;
  });
  function pick(n, write = true) {
    n = Math.min(Math.max(n, 1), vs.length);
    vs.forEach((v, i) => (v.hidden = i + 1 !== n));
    btns.forEach((b, i) => {
      b.setAttribute('aria-pressed', i + 1 === n);
      b.style.background = i + 1 === n ? 'var(--border)' : 'transparent';
    });
    if (write) {
      const q = new URLSearchParams(location.search);
      q.set('v', n);
      history.replaceState(null, '', '?' + q);
    }
    pick.n = n;
  }
  addEventListener('keydown', (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    if (e.target.closest('input,textarea,select,[contenteditable]')) return;
    if (e.key === 'ArrowRight') pick(pick.n + 1);
    else if (e.key === 'ArrowLeft') pick(pick.n - 1);
    else if (/^[1-9]$/.test(e.key)) pick(+e.key);
    else if (e.key.toLowerCase() === 'h') bar.hidden = !bar.hidden;
  });
  document.body.append(bar);
  pick(+new URLSearchParams(location.search).get('v') || 1, false);
})();
</script>
```

## React

Works in any React 18+ app. Wrap the variants; the harness route renders it. Delete the file at cleanup.

```tsx
import { useEffect, useState, type ReactNode } from 'react';

type Variant = { name: string; node: ReactNode };

export function VariantPicker({ variants }: { variants: Variant[] }) {
  const read = () =>
    Math.min(Math.max(Number(new URLSearchParams(location.search).get('v')) || 1, 1), variants.length);
  const [n, setN] = useState(read);
  const [shown, setShown] = useState(true);

  const pick = (next: number) => {
    next = Math.min(Math.max(next, 1), variants.length);
    setN(next);
    const q = new URLSearchParams(location.search);
    q.set('v', String(next));
    history.replaceState(null, '', '?' + q);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
      if ((e.target as HTMLElement).closest('input,textarea,select,[contenteditable]')) return;
      if (e.key === 'ArrowRight') pick(n + 1);
      else if (e.key === 'ArrowLeft') pick(n - 1);
      else if (/^[1-9]$/.test(e.key)) pick(Number(e.key));
      else if (e.key.toLowerCase() === 'h') setShown((s) => !s);
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  });

  return (
    <>
      {variants[n - 1].node}
      {shown && (
        <div
          role="group"
          aria-label="Variants"
          style={{
            position: 'fixed', left: '50%', bottom: 8, transform: 'translateX(-50%)',
            display: 'flex', gap: 2, padding: 3, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 10,
            font: '13px/1.3 system-ui, sans-serif', zIndex: 2147483647,
          }}
        >
          {variants.map((v, i) => (
            <button
              key={v.name}
              aria-pressed={i + 1 === n}
              onClick={() => pick(i + 1)}
              style={{
                all: 'unset', cursor: 'pointer', padding: '6px 10px', borderRadius: 7, whiteSpace: 'nowrap',
                color: 'var(--text)', background: i + 1 === n ? 'var(--border)' : 'transparent',
              }}
            >
              {i + 1} {v.name}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
```

In a framework with its own router, read and write `v` through the router's search params instead of `history`, so navigation stays consistent.
