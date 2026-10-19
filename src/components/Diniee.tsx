"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Send, X } from "lucide-react";
import { RoofMark } from "@/components/ui";
import { elements } from "@/lib/elements";
import { buildMessage, cleanPhoneInput, parsePhone, whatsappUrl } from "@/lib/messaging";
import { projectsNewestFirst } from "@/lib/projects";

/*
 * Diniee, Disha Habitat's guide (the persona named in the client's revamp proposal). A guided
 * conversation, not an AI: every answer is written from verified facts in lib/, and anything it
 * cannot answer (prices, availability of a specific unit) goes to the sales team. It qualifies the
 * enquiry (home type, timeline, name, mobile) and hands it over on WhatsApp. Nothing is stored.
 */
type Msg = { from: "bot" | "me"; body: ReactNode };
type Step = "start" | "type" | "when" | "details" | "done";

const homeTypes = ["2 BHK apartment", "3 BHK apartment", "4 BHK apartment", "4 or 5 BHK villa", "Just exploring"];
const timelines = ["Within 3 months", "3 to 6 months", "6 to 12 months", "Just researching"];

/* "A, B, C and D", in sentence case, keeping proper names such as "Five Elements Sculpture Park". */
const list = (items: string[]) => {
  const words = items.map((t) => (/^[A-Z][a-z]* [A-Z]/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1)));
  return words.length > 1 ? `${words.slice(0, -1).join(", ")} and ${words[words.length - 1]}` : words.join("");
};

export function Diniee() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", body: "Hi, I’m Diniee, Disha Habitat’s automated guide. I can tell you about our homes, share the RERA details or help you arrange a site visit." },
    { from: "bot", body: "What would you like to do?" },
  ]);
  const [step, setStep] = useState<Step>("start");
  const [lead, setLead] = useState({ type: "", when: "", name: "", phone: "" });
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const panel = useRef<HTMLDivElement>(null);
  const returnTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      returnTo.current = document.activeElement as HTMLElement | null;
      setOpen(true);
    };
    window.addEventListener("disha:diniee", onOpen);
    return () => window.removeEventListener("disha:diniee", onOpen);
  }, []);

  // Open: focus moves into the chat. Escape closes it, and focus goes back where it came from.
  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => panel.current?.querySelector<HTMLElement>("input, button")?.focus(), 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      // Tab stays inside the chat while it is open.
      if (e.key === "Tab" && panel.current) {
        const all = Array.from(panel.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input, textarea, select")).filter(
          (el) => el.offsetParent !== null,
        );
        if (!all.length) return;
        const first = all[0];
        const last = all[all.length - 1];
        if (e.shiftKey && (document.activeElement === first || !panel.current.contains(document.activeElement))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (document.activeElement === last || !panel.current.contains(document.activeElement))) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      returnTo.current?.focus?.();
    };
  }, [open]);


  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, step]);

  const say = (...bodies: ReactNode[]) => {
    setTyping(true);
    window.setTimeout(() => {
      setTyping(false);
      setMsgs((m) => [...m, ...bodies.map((body) => ({ from: "bot" as const, body }))]);
    }, 550);
  };
  const me = (body: string) => setMsgs((m) => [...m, { from: "me", body }]);

  const answers: Record<string, (said?: string) => void> = {
    home: (said = "I’m looking for a home") => {
      me(said);
      setStep("type");
      say("Lovely. What kind of home are you looking for?");
    },
    visit: (said = "I’d like to book a site visit") => {
      me(said);
      setStep("details");
      say(`Happy to arrange that at ${elements.shortName}, ${elements.locality}. What’s your name and mobile number? I’ll write the message for you to send us on WhatsApp; once it reaches us, our team will confirm a time with you.`);
    },
    where: (said = "Where are your projects?") => {
      me(said);
      say(
        <>
          All our communities are in East Bengaluru:
          <ul className="mt-2 space-y-1">
            <li>
              <strong>{elements.shortName}</strong>, {elements.locality} (now selling)
            </li>
            {projectsNewestFirst.map((p) => (
              <li key={p.slug}>
                {p.shortName}, {p.locality.replace(", Bengaluru", "")} (delivered {p.handoverYear})
              </li>
            ))}
          </ul>
        </>,
      );
    },
    rera: (said = "Is it RERA registered?") => {
      me(said);
      say(
        <>
          Yes. {elements.name} is RERA registered in two phases:
          <ul className="mt-2 space-y-1 break-all text-[0.85rem]">
            {elements.rera.map((r) => (
              <li key={r.no}>
                {r.phase}: {r.no}
              </li>
            ))}
          </ul>
        </>,
      );
    },
    amenities: (said = "What amenities are there?") => {
      me(said);
      say(
        `${elements.shortName} has 40+ amenities and a clubhouse of 1,35,000+ sq ft, with ${list(elements.clubhouse.slice(0, 4))} and more. Outdoors there are ${list(elements.outdoor.slice(0, 5))}, among others.`,
      );
    },
    price: (said = "What are the prices?") => {
      me(said);
      say("Prices depend on the home and the floor, so our sales team shares the current ones directly. Shall I help you ask them?");
      setStep("details");
    },
  };

  const chooseType = (t: string) => {
    me(t);
    setLead((l) => ({ ...l, type: t }));
    setStep("when");
    const villa = t.includes("villa");
    say(
      <>
        {t === "Just exploring"
          ? `Our current project is ${elements.shortName} in Gunjur: 2, 3 and 4 BHK apartments and 4 and 5 BHK villas on 20 acres, with 40+ amenities.`
          : `${elements.shortName} in Gunjur has ${villa ? "4 and 5 BHK villas" : "2, 3 and 4 BHK apartments"} in a 20-acre community with 40+ amenities. ${elements.offer} are available now.`}
        <Link href={elements.href} className="mt-3 flex items-center gap-3 rounded-xl bg-white p-2 text-ink">
          <span className="relative block size-12 shrink-0 overflow-hidden rounded-lg">
            <Image src={elements.cover.src} alt="" fill sizes="48px" className="object-cover" />
          </span>
          <span className="min-w-0 flex-1 text-sm font-semibold">See {elements.shortName}</span>
          <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      </>,
      "When are you planning to buy?",
    );
  };

  const chooseWhen = (w: string) => {
    me(w);
    setLead((l) => ({ ...l, when: w }));
    setStep("details");
    say("Thank you. Share your name and mobile number and I’ll write a message for you to send us; once it reaches us, our sales team can call and arrange a visit.");
  };

  const parsedPhone = parsePhone(lead.phone);
  const detailsOk = lead.name.trim().length >= 2 && parsedPhone.ok;
  const message = buildMessage(
    "I chatted with Diniee on your website and would like a call back.",
    [
      ["Looking for", lead.type],
      ["Planning to buy", lead.when],
      ["Name", lead.name],
      ["Mobile", parsedPhone.ok ? parsedPhone.display : undefined],
    ],
  );

  /* "What is…" questions about the words buyers meet, with a link to the full explanation. */
  const terms: [RegExp, string, string?][] = [
    [/\bbhk\b/, "BHK means bedroom, hall, kitchen. A 3 BHK home has three bedrooms, a living room and a kitchen."],
    [/\b(oc|occupancy)\b/, "An OC (occupancy certificate) is issued by the local authority when a building is complete and fit to live in.", "/checklist/occupancy-certificate"],
    [/\be?-?khata\b/, "A khata is a property’s entry in the city’s tax register. It is not proof of ownership on its own; that comes from the sale deed and title documents.", "/checklist/khata-certificate"],
    [/\bsuper\s?built|\bbuilt-?\s?up\b/, "Super built-up area is the carpet area plus the walls, balconies and a share of the common areas such as lobbies and the clubhouse.", "/checklist/carpet-area"],
    [/\bcarpet\b/, "Carpet area is the usable floor area inside a home’s walls. Under RERA, a developer must state each home’s carpet area.", "/checklist/carpet-area"],
    [/\brera\b/, `RERA is the Real Estate (Regulation and Development) Act, 2016. A project must be registered with the state’s RERA authority before it is sold. ${elements.shortName} is registered with Karnataka RERA.`],
    [/\bemis?\b/, "An EMI (equated monthly instalment) is the fixed monthly payment on a home loan. You can estimate yours with our EMI calculator.", "/plan"],
    [/\b(stps?|sewage)\b/, "An STP (sewage treatment plant) treats a community’s waste water on site so the water can be reused.", "/checklist/sewage-treatment-plants"],
  ];
  const define = (l: string) => {
    if (!/\b(what(’s|'s| is| are| does)|meaning|means?|define|explain|stand for)\b/.test(l)) return null;
    return terms.find(([re]) => re.test(l)) ?? null;
  };

  /* A few typed questions, matched by keyword; anything else goes to a person. */
  const ask = () => {
    const q = text.trim();
    if (!q) return;
    setText("");
    const l = q.toLowerCase();
    const term = define(l);
    if (term) {
      me(q);
      say(
        <>
          {term[1]}
          {term[2] && (
            <>
              {" "}
              <Link href={term[2]} className="underline">
                {term[2] === "/plan" ? "Open the EMI calculator" : "Read more"}
              </Link>
              .
            </>
          )}
        </>,
      );
      return;
    }
    // Whole words only (so "premium" isn't "emi" and "separate" isn't "rate"), and loans before
    // prices, because "EMI on a 1 crore loan" is a loan question that happens to mention crore.
    const match =
      /\b(emis?|loans?|finance|financing|mortgage|interest)\b/.test(l) ? "emi"
      : /\b(prices?|pricing|costs?|budget|lakhs?|crores?|rates?|expensive|cheap)\b/.test(l) ? "price"
      : /\b(rera|registered|registration|approvals?|approved)\b/.test(l) ? "rera"
      : /\b(where|location|located|address|gunjur|maps?|directions?)\b/.test(l) ? "where"
      : /\b(amenity|amenities|clubhouse|club|pool|gym|parks?|playground)\b/.test(l) ? "amenities"
      : /\b(visits?|see|tour|meet|meeting)\b/.test(l) ? "visit"
      : /\b(bhk|villas?|apartments?|flats?|homes?|house|towers?|units?)\b|\d\s?bhk/.test(l) ? "home"
      : null;
    if (match === "emi") {
      me(q);
      say(
        <>
          You can estimate your monthly EMI with our{" "}
          <Link href="/plan" className="underline">
            EMI calculator
          </Link>
          . It runs in your browser; nothing you enter is sent anywhere.
        </>,
      );
      return;
    }
    if (match) {
      answers[match](q);
      return;
    }
    me(q);
    say("That’s a good question for our team. Share your name and mobile and I’ll write a message for you to send them on WhatsApp.");
    setStep("details");
  };

  const chips = (items: string[], onPick: (s: string) => void) => (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <button key={t} type="button" onClick={() => onPick(t)} className="rounded-full border border-forest/25 bg-white px-3.5 py-2 text-sm font-medium text-forest transition-colors hover:bg-forest hover:text-paper">
          {t}
        </button>
      ))}
    </div>
  );

  return (
    <>
      {open && (
        <div
          ref={panel}
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${uid}-title`}
          className="fixed inset-x-2 bottom-2 z-[60] flex max-h-[min(40rem,calc(100svh-1rem))] flex-col overflow-hidden rounded-2xl bg-paper text-ink shadow-[0_30px_90px_-20px_rgb(0_0_0/0.55)] sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-[24rem]"
        >
          <div className="flex items-center gap-3 bg-forest px-4 py-3 text-paper">
            <span className="relative inline-flex size-10 items-center justify-center rounded-full bg-paper text-cyan">
              <RoofMark className="h-4 w-auto" />
              <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-forest bg-[#5ad17a]" />
            </span>
            <div className="min-w-0 flex-1">
              <p id={`${uid}-title`} className="font-semibold">
                Diniee
              </p>
              <p className="text-xs text-paper/65">Disha Habitat guide · answers common questions</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="inline-flex size-9 items-center justify-center rounded-full hover:bg-paper/10">
              <X aria-hidden className="size-5" />
            </button>
          </div>

          <div ref={scroller} className="flex-1 space-y-3 overflow-y-auto bg-[#f6f2e9] p-4" aria-live="polite">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`swap-in max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[0.95rem] leading-relaxed ${
                    m.from === "me" ? "rounded-br-md bg-forest text-paper" : "rounded-bl-md bg-white shadow-sm"
                  }`}
                >
                  {m.body}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex">
                <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-sm">
                  <span className="sr-only">Diniee is typing</span>
                  {[0, 1, 2].map((k) => (
                    <span key={k} aria-hidden className="size-1.5 animate-bounce rounded-full bg-mute" style={{ animationDelay: `${k * 120}ms` }} />
                  ))}
                </span>
              </div>
            )}

            {!typing && step === "start" && msgs.length >= 2 &&
              chips(["I’m looking for a home", "Book a site visit", "Where are your projects?", "RERA details", "Amenities", "Prices"], (t) =>
                ({
                  "I’m looking for a home": answers.home,
                  "Book a site visit": answers.visit,
                  "Where are your projects?": answers.where,
                  "RERA details": answers.rera,
                  Amenities: answers.amenities,
                  Prices: answers.price,
                })[t]!(),
              )}
            {!typing && step === "type" && chips(homeTypes, chooseType)}
            {!typing && step === "when" && chips(timelines, chooseWhen)}
            {!typing && step === "details" && (
              <form
                className="space-y-2 rounded-2xl bg-white p-3 shadow-sm"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (detailsOk) {
                    me(`${lead.name.trim()}, ${parsedPhone.display}`);
                    setStep("done");
                    say("Thank you! Press Send and your request goes to our sales team on WhatsApp, with these details filled in.");
                  }
                }}
              >
                <label className="sr-only" htmlFor={`${uid}-n`}>
                  Your name
                </label>
                <input id={`${uid}-n`} placeholder="Your name" value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} autoComplete="name" className="h-11 w-full rounded-lg border border-ink/45 px-3 outline-none focus:border-ink" />
                <label className="sr-only" htmlFor={`${uid}-p`}>
                  Mobile number
                </label>
                <input
                  id={`${uid}-p`}
                  placeholder="Mobile number"
                  value={lead.phone}
                  onChange={(e) => setLead((l) => ({ ...l, phone: cleanPhoneInput(e.target.value) }))}
                  inputMode="tel"
                  autoComplete="tel"
                  className="h-11 w-full rounded-lg border border-ink/45 px-3 outline-none focus:border-ink"
                />
                <button type="submit" disabled={!detailsOk} className="h-11 w-full rounded-lg bg-forest font-semibold text-paper disabled:opacity-40">
                  Continue
                </button>
              </form>
            )}
            {!typing && step === "done" && (
              <div className="space-y-2">
                <p className="whitespace-pre-wrap rounded-2xl bg-[#e7f6e9] p-3 text-sm">{message}</p>
                <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#187a41] font-semibold text-white hover:bg-[#187a41]">
                  <Send aria-hidden className="size-4" /> Send on WhatsApp
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
                <Link href="/contact#book" onClick={() => setOpen(false)} className="flex h-11 items-center justify-center rounded-lg border border-ink/15 bg-white font-medium">
                  Or pick a visit date yourself
                </Link>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask();
            }}
            className="flex items-center gap-2 border-t border-ink/10 bg-paper p-2"
          >
            <label htmlFor={`${uid}-q`} className="sr-only">
              Type a question
            </label>
            <input id={`${uid}-q`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about homes, RERA, location…" className="h-11 min-w-0 flex-1 rounded-lg border border-ink/45 bg-white px-3 text-[0.95rem] outline-none focus:border-ink" />
            <button type="submit" aria-label="Send question" className="inline-flex size-11 items-center justify-center rounded-lg bg-forest text-paper">
              <Send aria-hidden className="size-4" />
            </button>
          </form>
          <p className="bg-paper px-3 pb-2 text-center text-xs text-mute">Diniee answers from published Disha Habitat information. Nothing you type is stored.</p>
        </div>
      )}
    </>
  );
}

export const openDiniee = () => window.dispatchEvent(new Event("disha:diniee"));
