import s from "./Quote.module.css";

/* A homeowner's own words, large and in the serif, with who said it underneath. */
export function Quote({ quote, name, detail }: { quote: string; name: string; detail?: string }) {
  return (
    <figure className={`reveal ${s.figure}`}>
      <blockquote className={`display ${s.quote}`}>
        <p>“{quote.replace(/^“|”$/g, "")}”</p>
      </blockquote>
      <figcaption className={s.caption}>
        <span className={s.name}>{name}</span>
        {detail && <span>{detail}</span>}
      </figcaption>
    </figure>
  );
}
