// Layout measurement. Run in the page via the browser's evaluate call.
// Usage: window.__layoutScale = [4, 8, 12, 16, 20, 24, 32, 48, 64]; (optional) then run this file's function on a root selector.
// Returns candidates. Each one still needs a 2x crop to confirm.
(rootSelector => {
  const SCALE = window.__layoutScale || [0, 4, 8, 12, 16, 20, 24, 32, 48, 64];
  const root = document.querySelector(rootSelector || "body");
  const out = [];
  const R = e => e.getBoundingClientRect();
  const round = n => Math.round(n * 2) / 2; // half pixels are visible at 2x
  const visible = e => {
    const r = R(e), s = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && s.position !== "absolute" && s.position !== "fixed";
  };
  const name = e => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (e.classList[0] ? "." + e.classList[0] : "");

  // 1. Gaps between siblings, along the main axis.
  root.querySelectorAll("*").forEach(p => {
    const kids = [...p.children].filter(visible);
    if (kids.length < 2) return;
    const s = getComputedStyle(p);
    const row = s.display.includes("flex") ? s.flexDirection.startsWith("row") : s.display.includes("grid") ? s.gridAutoFlow.startsWith("column") : false;
    if (s.display.includes("grid") && s.gridTemplateColumns.split(" ").length > 1) return; // multi-column grid: skip, measure by rows
    if (/^space|^center|^end|^flex-end/.test(s.justifyContent)) return; // free space, not a gap
    const gaps = [];
    for (let i = 1; i < kids.length; i++) {
      const a = R(kids[i - 1]), b = R(kids[i]);
      gaps.push(round(row ? b.left - a.right : b.top - a.bottom));
    }
    const off = gaps.filter(g => g > 0 && !SCALE.includes(g));
    if (off.length) out.push({ rule: "off-scale-gap", el: name(p), gaps });
    const uniq = [...new Set(gaps)];
    if (uniq.length > 1 && Math.max(...gaps) - Math.min(...gaps) <= 4 && uniq.some(g => g > 0))
      out.push({ rule: "uneven-gaps", el: name(p), gaps });
  });

  // 2. Near-miss leading edges: two edges 0.5 to 4px apart that are not equal.
  const edges = [];
  root.querySelectorAll("h1,h2,h3,h4,p,label,button,a,input,select,textarea,svg,img,li,td,th").forEach(e => {
    if (!visible(e)) return;
    const r = R(e);
    edges.push({ x: round(r.left), y: round(r.top), el: name(e), w: r.width, h: r.height });
  });
  const byX = [...edges].sort((a, b) => a.x - b.x);
  for (let i = 1; i < byX.length; i++) {
    const d = byX[i].x - byX[i - 1].x;
    if (d >= 0.5 && d <= 4 && Math.abs(byX[i].y - byX[i - 1].y) > byX[i - 1].h) // different rows only
      out.push({ rule: "near-miss-edge", a: byX[i - 1].el, b: byX[i].el, x: [byX[i - 1].x, byX[i].x], delta: d });
  }

  // 3. Centres: icon or text inside a control, off the control's centre line by 1px or more.
  root.querySelectorAll("button, a, [role=button]").forEach(c => {
    if (!visible(c)) return;
    const cr = R(c);
    [...c.children].filter(visible).forEach(k => {
      const kr = R(k), dy = round((kr.top + kr.bottom) / 2 - (cr.top + cr.bottom) / 2);
      if (Math.abs(dy) >= 1 && Math.abs(dy) <= 4) out.push({ rule: "off-centre", el: name(c) + " > " + name(k), dy });
    });
  });

  // 4. Targets under the 24px floor (pseudo-element expansion is not measurable here: check by hand).
  root.querySelectorAll("button, a[href], input, select, [role=button], [role=menuitem]").forEach(e => {
    if (!visible(e)) return;
    const r = R(e);
    if (Math.min(r.width, r.height) < 24) out.push({ rule: "small-target", el: name(e), size: [round(r.width), round(r.height)] });
  });

  // 5. Sideways overflow and clipped text.
  if (document.documentElement.scrollWidth > innerWidth) out.push({ rule: "page-scrolls-sideways", by: document.documentElement.scrollWidth - innerWidth });
  root.querySelectorAll("*").forEach(e => {
    const s = getComputedStyle(e);
    if (e.scrollWidth > e.clientWidth + 1 && s.overflow === "hidden" && s.textOverflow !== "ellipsis" && e.children.length === 0 && e.textContent.trim())
      out.push({ rule: "clipped-text", el: name(e), by: e.scrollWidth - e.clientWidth });
  });

  return out;
})
