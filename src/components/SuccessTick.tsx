import s from "./SuccessTick.module.css";

/* A brass ring and tick that draw themselves, for the moment a request is ready. Decorative: the words beside it say it. */
export function SuccessTick({ className = "" }: { className?: string }) {
  return (
    <svg className={`${s.tick} ${className}`} viewBox="0 0 56 56" width="56" height="56" fill="none" aria-hidden="true" focusable="false">
      <circle className={s.ring} cx="28" cy="28" r="26" pathLength="1" />
      <path className={s.check} d="M17 29.5 24.5 37 39 20.5" pathLength="1" />
    </svg>
  );
}
