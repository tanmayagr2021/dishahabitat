"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, Send, X } from "lucide-react";
import { RoofMark } from "@/components/ui";
import { elements } from "@/lib/elements";
import { buildMessage, whatsappUrl } from "@/lib/messaging";
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
const timelines = ["Within 3 months", "3 to 6 months", "Later this year", "Just researching"];

export function Diniee() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    { from: "bot", body: "Hi, I’m Diniee from Disha Habitat. I can tell you about our homes, share the RERA details or arrange a site visit." },
    { from: "bot", body: "What would you like to do?" },
  ]);
  const [step, setStep] = useState<Step>("start");
  const [lead, setLead] = useState({ type: "", when: "", name: "", phone: "" });
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("disha:diniee", onOpen);
    return () => window.removeEventListener("disha:diniee", onOpen);
  }, []);


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
      say(`Happy to arrange that at ${elements.shortName}, ${elements.locality}. What’s your name and mobile number? I’ll write the message for you to send us on WhatsApp, and our team will call to confirm a time.`);
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
        `${elements.shortName} has 40+ amenities and a clubhouse of 1,35,000+ sq ft, with ${elements.clubhouse.slice(0, 4).join(", ").toLowerCase()} and more. Outdoors there are ${elements.outdoor.slice(0, 5).join(", ").toLowerCase()}.`,
      );
    },
    price: (said = "What are the prices?") => {
      me(said);
      say("Prices depend on the home and the floor, so our sales team shares the current ones directly. Shall I arrange a call?");
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
          : `${elements.shortName} in Gunjur has ${villa ? "4 and 5 BHK villas" : "2, 3 and 4 BHK apartments"} on a 20-acre community with 40+ amenities. ${elements.offer} are available now.`}
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

  const digits = lead.phone.replace(/\D/g, "").replace(/^91(?=\d{10}$)/, "");
  const detailsOk = lead.name.trim().length >= 2 && /^[6-9]\d{9}$/.test(digits);
  const message = buildMessage(
    "I chatted with Diniee on your website and would like a call back.",
    [
      ["Looking for", lead.type],
      ["Planning to buy", lead.when],
      ["Name", lead.name],
      ["Mobile", digits ? `+91 ${digits}` : undefined],
    ],
  );

  /* A few typed questions, matched by keyword; anything else goes to a person. */
  const ask = () => {
    const q = text.trim();
    if (!q) return;
    setText("");
    const l = q.toLowerCase();
    const match =
      /price|cost|rate|budget|lakh|crore/.test(l) ? "price"
      : /rera|registr|approv/.test(l) ? "rera"
      : /where|location|address|gunjur|map/.test(l) ? "where"
      : /amenit|club|pool|gym|park/.test(l) ? "amenities"
      : /visit|see|tour|meet/.test(l) ? "visit"
      : /emi|loan|finance/.test(l) ? "emi"
      : /bhk|villa|apartment|flat|home|house/.test(l) ? "home"
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
          role="dialog"
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
                <span className="inline-flex gap-1 rounded-2xl rounded-bl-md bg-white px-3.5 py-3 shadow-sm" aria-label="Diniee is typing">
                  {[0, 1, 2].map((k) => (
                    <span key={k} className="size-1.5 animate-bounce rounded-full bg-mute" style={{ animationDelay: `${k * 120}ms` }} />
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
                    me(`${lead.name.trim()}, +91 ${digits}`);
                    setStep("done");
                    say("Thank you! Press Send and your request goes to our sales team on WhatsApp, with these details filled in.");
                  }
                }}
              >
                <label className="sr-only" htmlFor={`${uid}-n`}>
                  Your name
                </label>
                <input id={`${uid}-n`} placeholder="Your name" value={lead.name} onChange={(e) => setLead((l) => ({ ...l, name: e.target.value }))} autoComplete="name" className="h-11 w-full rounded-lg border border-ink/15 px-3 outline-none focus:border-ink" />
                <label className="sr-only" htmlFor={`${uid}-p`}>
                  Mobile number
                </label>
                <input
                  id={`${uid}-p`}
                  placeholder="Mobile number"
                  value={lead.phone}
                  onChange={(e) => setLead((l) => ({ ...l, phone: e.target.value.replace(/[^\d\s+]/g, "").slice(0, 15) }))}
                  inputMode="tel"
                  autoComplete="tel"
                  className="h-11 w-full rounded-lg border border-ink/15 px-3 outline-none focus:border-ink"
                />
                <button type="submit" disabled={!detailsOk} className="h-11 w-full rounded-lg bg-forest font-semibold text-paper disabled:opacity-40">
                  Continue
                </button>
              </form>
            )}
            {!typing && step === "done" && (
              <div className="space-y-2">
                <p className="whitespace-pre-wrap rounded-2xl bg-[#e7f6e9] p-3 text-sm">{message}</p>
                <a href={whatsappUrl(message)} target="_blank" rel="noopener noreferrer" className="flex h-11 items-center justify-center gap-2 rounded-lg bg-[#1f8f4e] font-semibold text-white hover:bg-[#187a41]">
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
            <input id={`${uid}-q`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Ask about homes, RERA, location…" className="h-11 flex-1 rounded-lg border border-ink/15 bg-white px-3 text-[0.95rem] outline-none focus:border-ink" />
            <button type="submit" aria-label="Send question" className="inline-flex size-11 items-center justify-center rounded-lg bg-forest text-paper">
              <Send aria-hidden className="size-4" />
            </button>
          </form>
          <p className="bg-paper px-3 pb-2 text-center text-[0.68rem] text-mute">Diniee answers from published Disha Habitat information. Nothing you type is stored.</p>
        </div>
      )}
    </>
  );
}

export const openDiniee = () => window.dispatchEvent(new Event("disha:diniee"));
