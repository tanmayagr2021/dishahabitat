/*
 * Pages that open on a full-bleed photograph (the homepage, each community and the story): the
 * header sits over the picture in white. Every other page opens on white and the header is ink.
 */
export function opensOnPhoto(pathname: string) {
  return pathname === "/" || pathname === "/story" || /^\/homes\/[^/]+\/?$/.test(pathname);
}

/* True when a link points at the page being shown, or (for section links) at one of its children. */
export function isCurrent(pathname: string, href: string) {
  const path = href.split("#")[0];
  if (!path || path === "/") return pathname === "/";
  return pathname === path || pathname.startsWith(`${path}/`);
}
