# Data catalogue

Pick the rows that apply to the piece. Mix them across rows of the fixture, because real data is mixed. Each row gives the value, the break it causes and the fix.

## Contents
- Text
- Identifiers
- Numbers and money
- Collections
- Time
- Media
- Language and length
- Loading

## Text

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Long name | `Aleksandra Wiśniewska-Kowalczyk` (31). Hyphenated double surnames reach 40+ | Wraps to 3 lines, or pushes siblings off the row | `min-width: 0`, wrap at 2 lines, or truncate with a way back |
| One-letter name | `J`, or `Jo` | Initials avatar shows one letter, "J J" or nothing; a centred name looks orphaned | Fallback for 1-letter initials; min-width on the chip |
| Missing field | no role, no phone, no avatar | `undefined`, an empty badge, a stray separator ("· ·") | Render a dash or remove the separator with the field |
| Long label | `Request access to the finance workspace` on a button or tab | Fixed-width control clips; tab bar scrolls | `min-width`, width from content, allow a 2-line wrap |
| Emoji | `🎉 Release party 🧑‍🚀🏳️‍🌈` | ZWJ sequences split at truncation; line-height clips | Truncate by grapheme with `Intl.Segmenter`; looser line-height |
| Markup characters | `<b>Q3</b> & "Q4"` | Printed raw or double-escaped | Escape once at render; never `dangerouslySetInnerHTML` on user data |
| Whitespace | leading spaces, `\n` inside a title | Collapsed or a stray line | Trim on input; `white-space: normal` for titles |

## Identifiers

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Unbreakable email | `bartholomew.fitzgerald@northwind-industries-holdings.example.com` (63) | Overflows the card; pushes the action menu out | `overflow-wrap: anywhere`; middle-truncate in tables |
| Long URL | `https://app.example.com/workspaces/finance-and-operations/projects/q3-planning/files/2026-11-06-board-pack-final-v12.pdf` | Overflow; no break opportunity | `overflow-wrap: anywhere`; show the host and path end |
| Long file name | `Q3-board-pack-final-v12-reviewed-by-legal-FINAL.pdf` | End-truncation makes two files look the same | Middle-truncate: `Q3-board-pack…FINAL.pdf` |
| UUID, hash | `3f2b8c1e-9a4d-4e7b-8c55-0d1f6a2b9e44` | Same as above, in monospace | `overflow-wrap: anywhere`, copy button |
| Handle | `@a`, `@a_very_long_handle_that_the_system_allows` | Both ends of the range | Test both |

## Numbers and money

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Huge count | `12847`, `1284000`, `10000000000` | No grouping; a badge grows past its circle | `Intl.NumberFormat`; compact notation in badges |
| Zero and one | `0 items`, `1 members` | "1 members", "0 comments" shown as nothing | `Intl.PluralRules`; an explicit zero string |
| Negative, tiny | `-0.001`, `-1,204.50` | Minus sign wraps; rounds to `-0` | Format with `signDisplay`; no wrapping in numbers |
| Currency | `¥1,284,000,000`, `€9.99`, `BD 12.345`, `₹1,23,45,678` | Symbol position, 0 or 3 decimals, lakh grouping | `Intl.NumberFormat` with `currency`; never concatenate |
| Not a number | `NaN`, `null`, `undefined` | Printed literally | Guard before format; show a dash |
| Percent over 100 | `142%` | A progress bar overflows | Clamp the bar; show the true number |
| Jitter | `1`, `11`, `1111` updating | Digits shift widths | `font-variant-numeric: tabular-nums` |

## Collections

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Zero | `[]` | Blank panel, headers only | Empty state: what belongs here, one action |
| One | `[x]` | Separators, "and" lists, plural | Test every count of exactly 1 |
| Few | 2–3 | Layouts built for 12 look sparse | Check alignment and minimum height |
| Huge | 1,000+ unpaginated | Slow scroll, long layout | Virtualise or paginate; say which |
| Very long list inside a menu | 200 options | Menu runs off screen | `max-height` with scroll; `overscroll-behavior: contain` |
| Duplicates | two "Alex Kim" | Rows indistinguishable | Show a second identifier |

## Time

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Just now, future | `in 3 seconds`, negative diff | "-3 seconds ago" | Clamp; `Intl.RelativeTimeFormat` |
| Very old | `1970-01-01`, `0001-01-01` | "56 years ago", wrong zone | Show absolute dates past a threshold |
| Time zones | midnight UTC viewed in UTC-11 | Previous day | Format in the viewer's zone, state it |
| Long date strings | `Wednesday, 30 September 2026, 23:59:59 GMT+10` | Overflows a column | Use short forms in tables |

## Media

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Avatar missing or 404 | broken URL | Broken-image icon, collapsed box | `onError` fallback to initials; fixed size |
| Odd aspect | 1:6 banner, 6:1 panorama | Stretched or cropped | `object-fit: cover`, `aspect-ratio` |
| Squished avatar | long text beside it | Avatar becomes a pill | `flex-shrink: 0` |
| Huge image | 8000×6000 | Layout jump, slow | Reserve size; `loading="lazy"` |

## Language and length

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| German (+30%) | `Einladungen verwalten` for "Manage invites"; `Berechtigungsverwaltung` | Fixed-width buttons clip; tabs overflow | Width from content; allow wrapping |
| Finnish, Russian | long compounds, long words | Same | Same; `hyphens: auto` with `lang` set |
| RTL | `محمد عبد الرحمن الفاسي`, Hebrew | Icons and chevrons on the wrong side; mixed-direction punctuation | Logical properties (`margin-inline-start`); `dir="auto"` on user text; mirror directional icons |
| CJK | `田中太郎`, `김민준`, `王小明` | No spaces, so no wrap points; tall glyphs clip | `overflow-wrap: anywhere`; looser line-height; set `lang` |
| Tall scripts | Thai `สวัสดีครับ`, Vietnamese `Nguyễn Thị Thanh Trúc` | Marks clipped by `overflow: hidden` | Line-height at least 1.3; no clipping on text boxes |
| Mixed direction | `Sam محمد` | Order scrambles | `dir="auto"` or `<bdi>` |
| Pseudo-locale | `[Ŵéíŕđ ţéxţ ññ]` padded 30% | Finds hard-coded strings | Run once if the project has i18n |

## Loading

| Case | Value | Breaks | Fix |
| --- | --- | --- | --- |
| Slow | 3s response | Spinner flashes at 120ms; layout shifts on arrival | Delay 150–300ms, hold at least 300ms; skeleton with the final dimensions |
| Failed | 500, offline | Blank or a raw error | Inline error, what happened, one retry |
| Partial | half the fields or rows arrive | Counts disagree with rows | Show what loaded, mark what didn't |
| Out of order | old response lands last | Stale data wins | Ignore responses from earlier requests |
| Slow image or font | 5s | Flash of unstyled text, layout jump | `font-display: swap`, reserved sizes |
