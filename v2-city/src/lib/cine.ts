/* When the moving atlas runs: large screens that allow motion. Shared by the layout's preloads, its
   first-paint script and the atlas itself, so they always agree. */
export const CINE = "(min-width: 1024px) and (prefers-reduced-motion: no-preference)";

/* Its opposite: where the still maps show instead. */
export const STILL = "(max-width: 1023px), (prefers-reduced-motion: reduce)";
