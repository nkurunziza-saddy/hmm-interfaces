# States and the switcher

## Contents
- Find the states in the code
- How to force each state
- The switcher spec
- Structure and snippet

## Find the states in the code

Read the component, its hooks and its stories. List every state it can reach, grouped under the headings below, in the order you found them. Drop a group the piece cannot reach, and say which you dropped.

| Group | States | Look for |
| --- | --- | --- |
| Interaction | hover, focus (keyboard), pressed, selected, disabled | CSS pseudo-classes, `aria-*`, `disabled` props |
| Data | loading, empty, error, partial, stale | Query status, `isLoading`, `error`, `data?.length` |
| Access | permission-denied, read-only, signed-out | Role checks, feature flags |
| Content | Demo data, Worst case, zero, one, huge | The data switch |

Add states the code defines that are not in the list (offline, expired, over quota). Never invent a state the code can't reach.

## How to force each state

Reach every state through the same boundary the real one uses, so the piece is tested and not your override.

| State | Force it by |
| --- | --- |
| Hover, focus, pressed | A `data-force="hover"` attribute that the harness sets, with the CSS selector extended to `:hover, [data-force="hover"]`. In the harness only; remove with the page. Or use the devtools protocol |
| Disabled | The prop the real code takes |
| Loading | A mock that never resolves, or one that resolves after 3s |
| Empty | A fixture with `[]` |
| Error | A mock that rejects with the real error shape |
| Partial | A fixture with half the rows or fields missing |
| Permission-denied | The role or flag the code reads, set to the lowest role |

## The switcher spec

The switcher is chrome. It sits beside the piece and follows the page's theme.

- **Follows the page's theme.** Surface, text, border and selected fill come from the project's own tokens, so it switches with light and dark. Never hard-code a colour such as `#161616` or `#3a3a3a`. *Why: a fixed dark bar looks wrong on a light page and ignores the theme being tested.*
- **Two controls.** A segmented control **Demo data / Worst case** (plus Zero, One, Huge if used) and a state list. Both write to the URL: `?data=worst&state=error`. *Why: every combination is then a link the user can open and share.*
- **A grouped list, not tabs.** States sit in a vertical list under the group headings above. Tabs run off screen past about 7 states, and a list stays scannable at 30.
- **Keys.** Up and Down arrows step through states in list order across groups. `H` hides and shows the switcher for screenshots. Ignore keys with a modifier, events already `defaultPrevented`, and events from `input`, `textarea`, `select` and `contenteditable`.
- **Accessibility.** The active button has `aria-pressed="true"` and scrolls into view. The list has an `aria-label`; each group is `role="group"` labelled by its heading.
- **Switching is instant** and keeps the scroll position.
- **Narrow screens.** Below 640px, collapse the list to a `<select>`. Render both and show one with a container query, so the active state survives a resize.

## Structure and snippet

```html
<aside class="brk" aria-label="Break controls">
  <div class="brk-seg" role="group" aria-label="Data">
    <button aria-pressed="true" data-data="demo">Demo data</button>
    <button aria-pressed="false" data-data="worst">Worst case</button>
  </div>
  <nav aria-label="States">
    <div role="group" aria-labelledby="g-interaction">
      <h2 id="g-interaction">Interaction</h2>
      <button data-state="hover" aria-pressed="false">Hover</button>
    </div>
  </nav>
</aside>
```

```js
const q = new URLSearchParams(location.search);
function set(key, val) {
  q.set(key, val);
  history.replaceState(null, '', '?' + q);
  render(q.get('data') ?? 'demo', q.get('state') ?? 'default');
}
```

Name the CSS class prefix something the project doesn't use (`brk-`), and delete the whole block at cleanup.
