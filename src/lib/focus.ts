import type { CSSProperties } from "react";
import type { Img } from "./content";

/* Where a photograph is anchored when cropped: one point for wide frames, one for portrait phones. */
export const focusPoint = (img: Img) =>
  ({
    "--pos": img.position ?? "50% 50%",
    "--pos-m": img.mobilePosition ?? img.position ?? "50% 50%",
  }) as CSSProperties;
