import Image from "next/image";
import type { ReactNode } from "react";
import type { Img } from "@/lib/content";
import { focusPoint } from "@/lib/focus";
import s from "./Feature.module.css";

type Props = {
  image: Img;
  /* Small print over the picture, such as "Artist's impression". */
  tag?: string;
  /* Picture on the right instead of the left. */
  reverse?: boolean;
  /* "wide" gives the picture two thirds of the row. */
  ratio?: "half" | "wide";
  children: ReactNode;
};

/* A picture and its words side by side, as tesla.com introduces each feature; stacked on a phone. */
export function Feature({ image, tag, reverse, ratio = "half", children }: Props) {
  return (
    <div className={`reveal ${s.feature}`} data-reverse={reverse || undefined} data-ratio={ratio}>
      <div className={s.media}>
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 900px) 50vw, 100vw"
          quality={78}
          className={s.img}
          style={focusPoint(image)}
        />
        {tag && <span className={s.tag}>{tag}</span>}
      </div>
      <div className={s.body}>{children}</div>
    </div>
  );
}
