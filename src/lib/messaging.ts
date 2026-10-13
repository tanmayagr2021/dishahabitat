/*
 * Every message the site helps a visitor send is built here, so what they preview is exactly
 * what opens in WhatsApp or their email app. Nothing is sent from the website itself.
 * Destinations are Disha's published sales WhatsApp line and office email.
 */
import { elements } from "@/lib/elements";
import { company } from "@/lib/site";

export type Channel = "whatsapp" | "email";

export function buildMessage(opening: string, fields: [string, string | undefined][], note?: string) {
  const lines = [`Hello Disha Habitat,`, "", opening];
  if (note?.trim()) lines.push("", note.trim());
  const rows = fields.filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v!.trim()}`);
  if (rows.length) lines.push("", ...rows);
  return lines.join("\n");
}

export const whatsappUrl = (text: string) => `${elements.whatsapp}&text=${encodeURIComponent(text)}`;
export const mailtoUrl = (subject: string, body: string, to: string = company.email) =>
  `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

export const destinations = {
  whatsapp: { label: "WhatsApp", to: elements.phone.display },
  email: { label: "Email", to: company.email },
};

/* Open the site-wide message form from anywhere. */
export function openComposer(detail: { channel?: Channel; topic?: string } = {}) {
  window.dispatchEvent(new CustomEvent("disha:compose", { detail }));
}
