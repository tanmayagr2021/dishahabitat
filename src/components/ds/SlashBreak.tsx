import { Fragment } from "react";

/* A registration number such as "PRM/KA/RERA/…" may wrap only after a slash, never inside a figure. */
export function SlashBreak({ code }: { code: string }) {
  return (
    <span style={{ overflowWrap: "normal", wordBreak: "normal" }}>
      {code.split("/").map((part, i, all) => (
        <Fragment key={i}>
          {part}
          {i < all.length - 1 && (
            <>
              /<wbr />
            </>
          )}
        </Fragment>
      ))}
    </span>
  );
}
