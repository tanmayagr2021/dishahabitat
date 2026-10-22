/* A drawn arrow, the only icon V2 uses. */
export function Arrow({ className }: { className?: string }) {
  return (
    <svg className={className} width="18" height="10" viewBox="0 0 18 10" fill="none" aria-hidden focusable="false">
      <path d="M0 5h16.5M12.5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  );
}
