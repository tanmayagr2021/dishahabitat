"use client";

import type { ReactNode } from "react";
import { openComposer, type Channel } from "@/lib/messaging";

/* A button that opens the site-wide message form, for use anywhere (including server components). */
export function ComposeButton({ channel, topic, className = "", children }: { channel?: Channel; topic?: string; className?: string; children: ReactNode }) {
  return (
    <button type="button" onClick={() => openComposer({ channel, topic })} className={className}>
      {children}
    </button>
  );
}
