/*
 * Turning "the thing under the pointer" into something a person can act on later: the part of the
 * page it belongs to, what it is, its words, a selector to find it again and where it sat.
 */

/* Elements worth commenting on; anything else climbs to the nearest of these. */
const MEANINGFUL =
  "[data-feedback], a, button, img, picture, video, canvas, svg[role='img'], input, select, textarea, label, h1, h2, h3, h4, h5, h6, p, li, dt, dd, blockquote, figure, table, tr, article, form, fieldset, section, header, footer, nav, aside, [role='img'], [role='dialog'], [role='region'], [role='group'], details";

/* The big parts of a page a note can belong to. */
const REGION = "section, header, footer, nav, aside, form, [role='region'], [role='dialog'], main > *";

const text = (el: Element | null | undefined, max = 120) =>
  (el?.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, max);

const labelledBy = (el: Element) => {
  const ids = el.getAttribute("aria-labelledby");
  if (!ids) return "";
  return ids
    .split(/\s+/)
    .map((id) => text(document.getElementById(id), 80))
    .filter(Boolean)
    .join(" ");
};

/* The name a person would use for an element: its label, its heading, or its first words. */
export function nameOf(el: Element, max = 80): string {
  const own = el.getAttribute("data-feedback") || el.getAttribute("aria-label") || labelledBy(el);
  if (own) return own.slice(0, max);
  if (el instanceof HTMLImageElement) return (el.alt || "picture").slice(0, max);
  const heading = el.matches("h1, h2, h3, h4, h5, h6") ? el : el.querySelector("h1, h2, h3, h4");
  if (heading) return text(heading, max);
  return text(el, max);
}

export function kindOf(el: Element): string {
  if (el.closest("header") === el && el.closest("body > header, [class*='SiteHeader']")) return "header";
  if (el.matches("h1, h2, h3, h4, h5, h6")) return "heading";
  if (el.matches("p, blockquote, dd, dt")) return "text";
  if (el.matches("img, picture, figure, [role='img'], svg[role='img']")) return "picture";
  if (el.matches("video")) return "film";
  if (el.matches("canvas") || el.closest("[data-ready] canvas")) return "map";
  if (el.matches("button, .btn")) return "button";
  if (el.matches("a")) return "link";
  if (el.matches("input, select, textarea, label, fieldset")) return "form field";
  if (el.matches("li")) return "list item";
  if (el.matches("table, tr")) return "table";
  if (el.matches("article, [role='group']")) return "card";
  if (el.matches("form")) return "form";
  if (el.matches("nav")) return "menu";
  if (el.matches("footer")) return "footer";
  if (el.matches("header")) return "header";
  return "section";
}

const KIND_WORD: Record<string, string> = {
  heading: "Heading",
  text: "Text",
  picture: "Picture",
  film: "Film",
  map: "Map",
  button: "Button",
  link: "Link",
  "form field": "Field",
  "list item": "Item",
  table: "Table",
  card: "Card",
  form: "Form",
  menu: "Menu",
  footer: "Footer",
  header: "Header",
  section: "Section",
};

/* From whatever the pointer touched, the element a note should be about. */
export function pick(raw: Element | null): Element | null {
  if (!raw || raw.closest("[data-feedback-ui]")) return null;
  let el: Element | null = raw.closest(MEANINGFUL) ?? raw;
  // A word inside a link or a button means the link or the button.
  const control = el.closest("a, button");
  if (control) el = control;
  // Too small to point at precisely: take the part around it.
  while (el && el !== document.body) {
    const r = el.getBoundingClientRect();
    if (r.width >= 24 && r.height >= 16) break;
    el = el.parentElement?.closest(MEANINGFUL) ?? el.parentElement;
  }
  if (!el || el === document.body || el === document.documentElement) return null;
  return el;
}

/* The part of the page an element belongs to, by the name a visitor sees. */
export function regionOf(el: Element): { el: Element; name: string } | null {
  let r: Element | null = el.closest(REGION);
  while (r) {
    if (r.matches("body > header, header[class]") && r.parentElement === document.body) return { el: r, name: "Site header" };
    if (r.matches("footer") && r.parentElement === document.body) return { el: r, name: "Site footer" };
    const name = nameOf(r, 80);
    if (name) return { el: r, name };
    r = r.parentElement?.closest(REGION) ?? null;
  }
  return null;
}

/*
 * A selector that finds the element again on a later visit: ids where they exist, otherwise tag and
 * position from the nearest ancestor with an id. CSS Module class names change between builds, so
 * they are never used.
 */
export function selectorFor(el: Element): string {
  const parts: string[] = [];
  let node: Element | null = el;
  while (node && node !== document.body && parts.length < 12) {
    if (node.id && /^[A-Za-z][\w-]*$/.test(node.id)) {
      parts.unshift(`#${node.id}`);
      return parts.join(" > ");
    }
    const tag = node.tagName.toLowerCase();
    const parent: Element | null = node.parentElement;
    if (!parent) break;
    const same = Array.from(parent.children).filter((c) => c.tagName === node!.tagName);
    parts.unshift(same.length > 1 ? `${tag}:nth-of-type(${same.indexOf(node) + 1})` : tag);
    node = parent;
  }
  return `body > ${parts.join(" > ")}`;
}

export type Described = {
  section?: string;
  target_label: string;
  target_kind: string;
  target_text?: string;
  selector: string;
  rect: { x: number; y: number; width: number; height: number };
};

export function describe(el: Element): Described {
  const kind = kindOf(el);
  const region = regionOf(el);
  const name = nameOf(el);
  const r = el.getBoundingClientRect();
  const word = KIND_WORD[kind] ?? "Part";
  // When the part carries the section's own name (its heading, or the section itself), the kind says enough.
  const echoes = !name || region?.el === el || name.toLowerCase() === region?.name.toLowerCase();
  return {
    section: region?.name,
    target_label: echoes ? (region?.el === el ? "The whole section" : word) : `${word}: ${name}`,
    target_kind: kind,
    target_text: text(el, 600) || undefined,
    selector: selectorFor(el),
    rect: { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), width: Math.round(r.width), height: Math.round(r.height) },
  };
}

/* The parts of the page a keyboard user can step through while pointing. */
export function keyboardTargets(): Element[] {
  return Array.from(document.querySelectorAll("main section, main > header, main [role='region'], body > header, body > footer, main h1, main h2, main article"))
    .filter((el) => !el.closest("[data-feedback-ui]") && el.getBoundingClientRect().height > 0);
}

export function deviceKind(): "phone" | "tablet" | "computer" {
  const w = window.innerWidth;
  if (w < 640) return "phone";
  if (w < 1024 || matchMedia("(pointer: coarse)").matches) return "tablet";
  return "computer";
}
