import Link from "next/link";
import { PageIntro } from "@/components/ds";
import s from "./not-found.module.css";

export default function NotFound() {
  return (
    <>
      <PageIntro title="This page isn’t here." line="It may have moved, or the address may have a typo. These may help.">
        <div className={s.links}>
          <Link href="/" className="btn btn-dark">
            Back to home
          </Link>
          <Link href="/homes" className="btn btn-soft">
            Explore our homes
          </Link>
          <Link href="/contact" className="btn btn-soft">
            Contact us
          </Link>
        </div>
      </PageIntro>
    </>
  );
}
